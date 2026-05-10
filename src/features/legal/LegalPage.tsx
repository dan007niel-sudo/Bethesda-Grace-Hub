// Legal pages are intentionally in German: Impressum is a German legal
// requirement (§5 TMG) for an operator residing in Germany, and Datenschutz/AVV
// follow GDPR terminology. The UI chrome around them is still i18n-routed.
import { Link, Navigate, NavLink, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import { SectionHeader } from '../../components/SectionHeader';

type DocId = 'impressum' | 'datenschutz' | 'avv';

const TABS: { id: DocId; label: string }[] = [
  { id: 'impressum', label: 'Impressum' },
  { id: 'datenschutz', label: 'Datenschutz' },
  { id: 'avv', label: 'AVV' },
];

export default function LegalPage() {
  const { t } = useTranslation();
  const { doc } = useParams<{ doc?: string }>();

  if (!doc) return <Navigate to="/legal/impressum" replace />;
  if (!TABS.some((tab) => tab.id === doc)) return <Navigate to="/legal/impressum" replace />;
  const active = doc as DocId;

  return (
    <div className="py-8 lg:py-10 max-w-3xl">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm text-charcoal/70 hover:text-burgundy"
      >
        <ArrowLeft size={14} aria-hidden="true" />
        {t('legal.backHome')}
      </Link>

      <SectionHeader level={1} title={t('legal.title')} description={t('legal.subtitle')} />

      <nav
        aria-label={t('legal.title')}
        className="flex gap-1 border-b border-soft-border mb-6 -mt-2"
      >
        {TABS.map((tab) => (
          <NavLink
            key={tab.id}
            to={`/legal/${tab.id}`}
            className={({ isActive }) =>
              [
                'px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors',
                isActive
                  ? 'border-burgundy text-burgundy'
                  : 'border-transparent text-charcoal/70 hover:text-charcoal',
              ].join(' ')
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </nav>

      <article className="prose-legal text-charcoal/85 leading-relaxed space-y-6">
        {active === 'impressum' && <Impressum />}
        {active === 'datenschutz' && <Datenschutz />}
        {active === 'avv' && <AVV />}
      </article>
    </div>
  );
}

function Section({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-charcoal mt-2 mb-2">{heading}</h2>
      <div className="space-y-3 text-[15px]">{children}</div>
    </section>
  );
}

function Impressum() {
  return (
    <>
      <Section heading="Angaben gemäß § 5 TMG">
        <p>
          <strong>Bethesda Grace Hub</strong>
          <br />
          Daniel Lordson Arnan, Einzelunternehmen
          <br />
          Weselerstr. 120
          <br />
          45478 Mülheim an der Ruhr
          <br />
          Deutschland
        </p>
      </Section>
      <Section heading="Kontakt">
        <p>
          E-Mail:{' '}
          <a className="text-burgundy underline" href="mailto:daniel.lordson@icloud.com">
            daniel.lordson@icloud.com
          </a>
        </p>
      </Section>
      <Section heading="Verantwortlich für den Inhalt">
        <p>
          Daniel Lordson Arnan
          <br />
          Weselerstr. 120
          <br />
          45478 Mülheim an der Ruhr
        </p>
      </Section>
      <Section heading="Hinweis">
        <p>
          Dieses Impressum dient als Anbieterkennzeichnung für die App Bethesda Grace Hub.
          Umsatzsteuer-ID und weitere Pflichtangaben sind zu ergänzen, sofern sie bestehen oder
          gesetzlich erforderlich werden.
        </p>
      </Section>
    </>
  );
}

function Datenschutz() {
  return (
    <>
      <Section heading="1. Verantwortlicher">
        <p>
          Verantwortlich für die Datenverarbeitung ist Daniel Lordson Arnan, Einzelunternehmen,
          Weselerstr. 120, 45478 Mülheim an der Ruhr, Deutschland. Die App wird unter dem Namen{' '}
          <strong>Bethesda Grace Hub</strong> für die Gemeinde Bethesda Evangelical Church · House
          of Grace bereitgestellt.
        </p>
        <p>
          Kontakt:{' '}
          <a className="text-burgundy underline" href="mailto:daniel.lordson@icloud.com">
            daniel.lordson@icloud.com
          </a>
          <br />
          Datenschutzkontakt:{' '}
          <a className="text-burgundy underline" href="mailto:Arnanaimedia@arnanaimedia.com">
            Arnanaimedia@arnanaimedia.com
          </a>
        </p>
      </Section>
      <Section heading="2. Datenschutzbeauftragter">
        <p>Ein Datenschutzbeauftragter ist nach aktueller Angabe nicht bestellt.</p>
      </Section>
      <Section heading="3. Zweck der App">
        <p>
          Bethesda Grace Hub ist das digitale Zuhause der Gemeinde — ein Ort für Predigten,
          Dienste/Ministries, Gebet, geistlichen Wachstumspfad und Gemeindeinformationen. In der
          aktuellen Vorschau-Version werden noch keine personenbezogenen Daten in einer Datenbank
          des Anbieters gespeichert.
        </p>
      </Section>
      <Section heading="4. Verarbeitete Daten">
        <p>
          Im aktuellen MVP verarbeitet der Anbieter selbst keine personenbezogenen Daten dauerhaft.
          Konkret:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <strong>Gebetsanliegen (Prayer):</strong> Das Formular öffnet das E-Mail-Programm des
            Nutzers und sendet die Anfrage direkt an die pastorale Adresse der Gemeinde. Es findet
            keine Zwischenspeicherung beim Anbieter statt.
          </li>
          <li>
            <strong>Grace Assistant:</strong> Die Vorschau verwendet ausschließlich vordefinierte
            Antworten. Es werden keine Eingaben an Drittanbieter übermittelt.
          </li>
          <li>
            <strong>Technische Daten:</strong> Bei Aufruf der App werden vom Hosting-Anbieter
            (Render / Cloudflare) übliche Server-Logdaten verarbeitet (IP-Adresse, User-Agent,
            Zeitpunkt) zur Bereitstellung und Sicherung des Dienstes.
          </li>
          <li>
            <strong>PWA / Service Worker:</strong> Beim Installieren der App werden ausschließlich
            statische App-Dateien (HTML/JS/CSS/Bilder) im Browser-Cache gehalten. Es werden keine
            Nutzerinhalte zwischengespeichert.
          </li>
        </ul>
      </Section>
      <Section heading="5. KI-Verarbeitung">
        <p>
          Im MVP wird keine KI-Verarbeitung durchgeführt. In einer zukünftigen Version kann der
          Grace Assistant ein KI-Modell (z. B. Google Gemini oder Anthropic Claude) einsetzen.
          Sobald dies aktiviert wird, ergänzt der Anbieter diese Erklärung um Modellanbieter,
          Datenfluss und Speicherdauer und holt die erforderlichen Einwilligungen ein.
        </p>
      </Section>
      <Section heading="6. Hosting und Dienstleister">
        <p>
          Die App wird als Static Site über Render Inc. ausgeliefert; Inhalte werden über das
          globale CDN von Cloudflare verteilt. Schriftarten werden über Google Fonts geladen. Es
          findet derzeit keine Anbindung an eine Datenbank, einen Authentifizierungsdienst oder
          eine externe API statt.
        </p>
      </Section>
      <Section heading="7. Cookies, LocalStorage und Tracking">
        <p>
          Bethesda Grace Hub verwendet keine Cookies und kein Tracking/Analytics. Es findet keine
          Nutzeranalyse, kein Profiling und keine Werbenutzung statt.
        </p>
      </Section>
      <Section heading="8. Rechte der betroffenen Personen">
        <p>
          Betroffene Personen haben im Rahmen der gesetzlichen Voraussetzungen Rechte auf Auskunft,
          Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit, Widerspruch
          und Beschwerde bei einer Datenschutzaufsichtsbehörde.
        </p>
      </Section>
      <Section heading="9. Speicherdauer">
        <p>
          Im aktuellen MVP werden vom Anbieter keine personenbezogenen Daten dauerhaft gespeichert.
          Server-Logs werden gemäß den üblichen Aufbewahrungsfristen der Hosting-Dienstleister
          verarbeitet.
        </p>
      </Section>
      <Section heading="10. Hinweis zur Prüfung">
        <p>
          Diese Datenschutzerklärung ist eine vorbereitete Vorlage und ersetzt keine individuelle
          rechtliche Prüfung. Vor produktivem Betrieb mit echten Gemeindedaten sollte sie
          anwaltlich finalisiert werden.
        </p>
      </Section>
    </>
  );
}

function AVV() {
  return (
    <>
      <Section heading="1. Parteien">
        <p>
          Dieser AVV wird zwischen der <strong>Bethesda Evangelical Church · House of Grace</strong>,
          Langestr. 19A, 49080 Osnabrück, als Auftraggeber und Daniel Lordson Arnan,
          Einzelunternehmen, Weselerstr. 120, 45478 Mülheim an der Ruhr, als Anbieter von Bethesda
          Grace Hub und Auftragsverarbeiter geschlossen.
        </p>
      </Section>
      <Section heading="2. Gegenstand und Dauer">
        <p>
          Gegenstand ist der Betrieb der App Bethesda Grace Hub als digitales Zuhause der Gemeinde.
          Die Dauer richtet sich nach dem jeweiligen Nutzungs- oder SaaS-Vertrag mit der Gemeinde.
        </p>
      </Section>
      <Section heading="3. Art und Zweck der Verarbeitung">
        <p>
          Die Verarbeitung umfasst die Bereitstellung der App und ihrer Inhalte (Predigten, Events,
          Ministries, Journey, Prayer, Assistant). In der aktuellen MVP-Fassung findet keine
          eigenständige Verarbeitung personenbezogener Daten durch den Anbieter statt. Sobald
          Datenbank, Authentifizierung, gespeicherte Gebetsanliegen oder ein KI-Backend angebunden
          werden, wird dieser Vertrag entsprechend ergänzt.
        </p>
      </Section>
      <Section heading="4. Datenkategorien und betroffene Personen">
        <p>
          Mit Anbindung produktiver Funktionen sind betroffene Personen insbesondere
          Gemeindemitglieder, Mitarbeitende und Pastoren. Datenkategorien können dann sein: Namen,
          Kontaktangaben, Gebetsanliegen, Dienstzuordnungen, Anwesenheit, technische
          Push-/Auth-Daten sowie Inhalte des Assistenten.
        </p>
      </Section>
      <Section heading="5. Unterauftragsverarbeiter">
        <p>
          Aktuell eingesetzt werden Render Inc. für das Hosting der Static Site und Cloudflare als
          CDN. Schriftarten werden über Google Fonts ausgeliefert. Mit Anbindung weiterer
          Dienste (z. B. Supabase für Datenbank/Storage in der EU-Region Frankfurt, Google Gemini
          oder Anthropic Claude für KI-Funktionen) werden diese hier ergänzt und der Gemeinde
          mitgeteilt.
        </p>
      </Section>
      <Section heading="6. Pflichten des Auftragsverarbeiters">
        <p>
          Der Anbieter verarbeitet personenbezogene Daten nur im Rahmen der dokumentierten
          Weisungen der Gemeinde, trifft angemessene technische und organisatorische Maßnahmen und
          unterstützt die Gemeinde bei Betroffenenrechten, Löschung, Auskunft und
          Datenschutzvorfällen im gesetzlich vorgesehenen Rahmen.
        </p>
      </Section>
      <Section heading="7. Löschung und Rückgabe">
        <p>
          Nach Vertragsende werden Daten nach Wahl der Gemeinde exportiert oder gelöscht, soweit
          keine gesetzlichen Aufbewahrungspflichten entgegenstehen.
        </p>
      </Section>
      <Section heading="8. Hinweis zur Vertragsfassung">
        <p>
          Diese AVV-Fassung ist eine app-integrierte Vorlage für Pilot- und Prüfzwecke. Vor
          produktivem Abschluss mit der Gemeinde sollte sie anwaltlich finalisiert werden.
        </p>
      </Section>
    </>
  );
}
