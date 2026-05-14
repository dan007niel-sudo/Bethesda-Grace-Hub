import { supabase } from './supabase';

export type JournalEntry = {
  id: string;
  user_id: string;
  body: string;
  answered_at: string | null;
  created_at: string;
  updated_at: string;
};

const TABLE = 'prayer_journal';

export async function listEntries(): Promise<JournalEntry[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as JournalEntry[];
}

export async function addEntry(body: string): Promise<JournalEntry> {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;
  const userId = userData.user?.id;
  if (!userId) throw new Error('Not signed in');
  const { data, error } = await supabase
    .from(TABLE)
    .insert({ user_id: userId, body })
    .select('*')
    .single();
  if (error) throw error;
  return data as JournalEntry;
}

export async function setAnswered(id: string, answered: boolean): Promise<JournalEntry> {
  const { data, error } = await supabase
    .from(TABLE)
    .update({ answered_at: answered ? new Date().toISOString() : null })
    .eq('id', id)
    .select('*')
    .single();
  if (error) throw error;
  return data as JournalEntry;
}

export async function deleteEntry(id: string): Promise<void> {
  const { error } = await supabase.from(TABLE).delete().eq('id', id);
  if (error) throw error;
}
