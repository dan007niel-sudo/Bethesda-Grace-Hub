import { useTranslation } from 'react-i18next';
import { Car, Footprints, TrainFront, MapPin } from 'lucide-react';
import { CHURCH_ADDRESS, CHURCH_COORDS } from '../data/events';

const dest = `${CHURCH_COORDS.lat},${CHURCH_COORDS.lng}`;
const destLabel = encodeURIComponent(`Bethesda Evangelical Church, ${CHURCH_ADDRESS}`);

function gmaps(mode: 'driving' | 'walking' | 'transit', origin?: string) {
  const params = new URLSearchParams({
    api: '1',
    destination: dest,
    travelmode: mode,
  });
  if (origin) params.set('origin', origin);
  return `https://www.google.com/maps/dir/?${params.toString()}&destination_place_id=&query_place_id=&query=${destLabel}`;
}

const isApple =
  typeof navigator !== 'undefined' &&
  /iPad|iPhone|iPod|Macintosh/.test(navigator.userAgent) &&
  !/Android/.test(navigator.userAgent);

function appleMapsLink(mode: 'd' | 'w' | 'r') {
  // Apple Maps URL Scheme: https://developer.apple.com/library/archive/featuredarticles/iPhoneURLScheme_Reference/MapLinks/MapLinks.html
  return `https://maps.apple.com/?daddr=${dest}&dirflg=${mode}`;
}

type DirButtonProps = {
  href: string;
  icon: React.ReactNode;
  label: string;
};

function DirButton({ href, icon, label }: DirButtonProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-soft-border bg-white text-sm font-medium text-charcoal hover:border-burgundy/40 hover:text-burgundy transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy/40"
    >
      {icon}
      {label}
    </a>
  );
}

export function Directions() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-wrap gap-2">
      <DirButton
        href={isApple ? appleMapsLink('d') : gmaps('driving')}
        icon={<Car size={16} aria-hidden="true" />}
        label={t('home.findUs.driving')}
      />
      <DirButton
        href={isApple ? appleMapsLink('w') : gmaps('walking')}
        icon={<Footprints size={16} aria-hidden="true" />}
        label={t('home.findUs.walking')}
      />
      <DirButton
        href={
          isApple
            ? `https://maps.apple.com/?saddr=${encodeURIComponent('Osnabrück Hauptbahnhof')}&daddr=${dest}&dirflg=r`
            : gmaps('transit', encodeURIComponent('Osnabrück Hauptbahnhof'))
        }
        icon={<TrainFront size={16} aria-hidden="true" />}
        label={t('home.findUs.fromHbf')}
      />
      <DirButton
        href={isApple ? appleMapsLink('r') : gmaps('transit')}
        icon={<MapPin size={16} aria-hidden="true" />}
        label={t('home.findUs.transit')}
      />
    </div>
  );
}
