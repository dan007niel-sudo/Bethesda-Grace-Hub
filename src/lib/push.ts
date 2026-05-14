// Web-push subscription helpers. Subscriptions are stored per-user in
// Supabase (`push_subscriptions`, RLS: own rows). Fan-out happens server
// side via the `send-push` Edge Function; this file only handles the
// browser-side enroll/unenroll dance.
//
// When `VITE_VAPID_PUBLIC_KEY` is not set, `isPushSupported()` returns
// false and the UI shows the "push not configured" branch — no crash.
import { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from './supabase';

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY as string | undefined;

export type SubscriptionStatus =
  | 'loading'
  | 'unsupported'
  | 'denied'
  | 'unsubscribed'
  | 'subscribed';

export function isPushSupported(): boolean {
  if (typeof window === 'undefined') return false;
  if (!('serviceWorker' in navigator)) return false;
  if (!('PushManager' in window)) return false;
  if (!('Notification' in window)) return false;
  if (!VAPID_PUBLIC_KEY) return false;
  if (!isSupabaseConfigured) return false;
  return true;
}

export function isIOSStandaloneRequired(): boolean {
  if (typeof window === 'undefined') return false;
  const isIOS =
    /iPad|iPhone|iPod/.test(navigator.userAgent) && !('MSStream' in window);
  if (!isIOS) return false;
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
  return !isStandalone;
}

export function getPermissionState(): NotificationPermission {
  if (typeof Notification === 'undefined') return 'denied';
  return Notification.permission;
}

function urlBase64ToUint8Array(base64: string): Uint8Array<ArrayBuffer> {
  const padding = '='.repeat((4 - (base64.length % 4)) % 4);
  const normalized = (base64 + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(normalized);
  const buffer = new ArrayBuffer(raw.length);
  const arr = new Uint8Array(buffer);
  for (let i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i);
  return arr;
}

function bufferToBase64(buffer: ArrayBuffer | null | undefined): string {
  if (!buffer) return '';
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

async function getRegistration(): Promise<ServiceWorkerRegistration> {
  return navigator.serviceWorker.ready;
}

export async function getExistingSubscription(): Promise<PushSubscription | null> {
  if (!isPushSupported()) return null;
  try {
    const reg = await getRegistration();
    return await reg.pushManager.getSubscription();
  } catch {
    return null;
  }
}

export async function subscribeToPush(): Promise<void> {
  if (!isPushSupported()) throw new Error('Push not supported');
  if (!VAPID_PUBLIC_KEY) throw new Error('Missing VAPID public key');

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') throw new Error('Permission denied');

  const reg = await getRegistration();
  let sub = await reg.pushManager.getSubscription();
  if (!sub) {
    sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
    });
  }

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;
  const userId = userData.user?.id;
  if (!userId) throw new Error('Not signed in');

  const json = sub.toJSON();
  const p256dh = json.keys?.p256dh ?? bufferToBase64(sub.getKey('p256dh'));
  const auth = json.keys?.auth ?? bufferToBase64(sub.getKey('auth'));

  const { error } = await supabase.from('push_subscriptions').upsert(
    {
      user_id: userId,
      endpoint: sub.endpoint,
      p256dh,
      auth_secret: auth,
      user_agent:
        typeof navigator !== 'undefined' ? navigator.userAgent.slice(0, 500) : null,
    },
    { onConflict: 'user_id,endpoint' },
  );
  if (error) throw error;
}

export async function unsubscribeFromPush(): Promise<void> {
  if (!isPushSupported()) return;
  const reg = await getRegistration();
  const sub = await reg.pushManager.getSubscription();
  if (!sub) return;

  // Delete the row first so a successful unsubscribe leaves a clean DB.
  try {
    await supabase.from('push_subscriptions').delete().eq('endpoint', sub.endpoint);
  } catch (err) {
    console.warn('[push] failed to delete subscription row', err);
  }
  await sub.unsubscribe();
}

export function useSubscriptionStatus(): {
  status: SubscriptionStatus;
  refresh: () => void;
} {
  const [status, setStatus] = useState<SubscriptionStatus>('loading');
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let active = true;
    async function check() {
      if (!isPushSupported()) {
        if (active) setStatus('unsupported');
        return;
      }
      const perm = getPermissionState();
      if (perm === 'denied') {
        if (active) setStatus('denied');
        return;
      }
      try {
        const sub = await getExistingSubscription();
        if (!active) return;
        setStatus(sub ? 'subscribed' : 'unsubscribed');
      } catch {
        if (active) setStatus('unsubscribed');
      }
    }
    check();
    return () => {
      active = false;
    };
  }, [tick]);

  return { status, refresh: () => setTick((t) => t + 1) };
}
