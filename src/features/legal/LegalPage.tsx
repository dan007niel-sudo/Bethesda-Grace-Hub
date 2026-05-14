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
          Bethesda Grace Hub ist das digitale Zuhause der Gemeinde — ein Begleiter im Alltag mit
          Tages-Andacht, Wochenplan und Adresse/Anfahrt (Home), dem Grace Assistant (Ask), dem
          Gebetsformular an die pastorale Adresse (Pray), dem privaten Prayer Journal nach
          optionaler Anmeldung sowie einer Übersicht über kommende Funktionen (Connect).
          Personenbezogene Daten werden ausschließlich im Rahmen der nachfolgend beschriebenen
          Funktionen verarbeitet (insbesondere optionale Anmeldung mit Prayer Journal sowie
          KI-gestützte Funktionen Grace Assistant und Tages-Andacht).
        </p>
      </Section>
      <Section heading="4. Verarbeitete Daten">
        <p>
          Außerhalb des optionalen Prayer Journal (siehe Abschnitt 5a) verarbeitet der Anbieter
          keine personenbezogenen Daten dauerhaft. Konkret:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <strong>Gebetsanliegen (Prayer):</strong> Das Formular öffnet das E-Mail-Programm des
            Nutzers und sendet die Anfrage direkt an die pastorale Adresse der Gemeinde. Es findet
            keine Zwischenspeicherung beim Anbieter statt.
          </li>
          <li>
            <strong>Grace Assistant und Tages-Andacht:</strong> Freitext-Eingaben an den Grace
            Assistant sowie die für die tägliche Andacht erzeugten Anfragen werden über eine
            Supabase Edge Function an Google Gemini (Modell <code>gemini-2.5-flash</code>)
            übermittelt und dort verarbeitet. Die Verarbeitung findet auf Infrastruktur von
            Google LLC in den USA statt; die Übermittlung erfolgt auf Grundlage der
            EU-Standardvertragsklauseln (SCC) gemäß Art. 46 Abs. 2 lit. c DSGVO. Eine dauerhafte
            Speicherung der Eingaben durch den Anbieter (Bethesda Grace Hub) findet nicht statt;
            es gelten ergänzend die Speicher- und Verarbeitungs-Policies von Google (Google AI
            Studio / Vertex AI Terms). Für sensible seelsorgerliche Anliegen wird empfohlen, das
            persönliche Gespräch mit Pastor Stephen Essah zu suchen, statt diese in den
            Assistenten einzugeben.
          </li>
          <li>
            <strong>Technische Daten:</strong> Bei Aufruf der App werden von den eingesetzten
            Hosting-Anbietern (Render, Supabase, Google) übliche Server-Logdaten verarbeitet
            (IP-Adresse, User-Agent, Zeitpunkt) zur Bereitstellung und Absicherung des Dienstes.
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
          Bethesda Grace Hub setzt für zwei Funktionen KI-gestützte Generierung über Google Gemini
          (Modell <code>gemini-2.5-flash</code>) ein:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <strong>Grace Assistant:</strong> Beantwortung von Freitext-Fragen der Mitglieder zu
            Gemeindeleben, Predigtinhalten und Glaubensfragen.
          </li>
          <li>
            <strong>Tages-Andacht:</strong> täglich automatisch erzeugte Kurz-Andacht auf der
            Startseite.
          </li>
        </ul>
        <p>
          Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung; die KI-Antwort ist
          integraler Bestandteil der App-Funktion). Details zu Datenfluss, Speicherort und
          Drittlandübermittlung finden sich in Abschnitt 4 (Grace Assistant und Tages-Andacht)
          sowie Abschnitt 6 (Hosting und Dienstleister).
        </p>
      </Section>
      <Section heading="5a. Prayer Journal (persönliches Gebets-Tagebuch)">
        <p>
          Eingeloggte Mitglieder können im Prayer Journal persönliche Gebets-Einträge anlegen,
          als beantwortet markieren und löschen. Für diese Funktion verarbeiten wir die folgenden
          Daten in unserem Backend (Supabase):
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <strong>Anmeldung:</strong> E-Mail-Adresse zur Zustellung des einmaligen Magic-Link
            (passwortlose Anmeldung).
          </li>
          <li>
            <strong>Tagebuch-Einträge:</strong> die vom Nutzer eingegebenen Texte, der Zeitpunkt
            der Erstellung sowie optional der Zeitpunkt, an dem ein Eintrag als beantwortet
            markiert wurde.
          </li>
        </ul>
        <p>
          <strong>Speicherort:</strong> Die Daten werden bei Supabase in einem EU-Rechenzentrum
          gespeichert. Die Verbindung zwischen App und Backend ist durchgehend per TLS
          verschlüsselt.
        </p>
        <p>
          <strong>Zugriffsschutz:</strong> Die Datenbank ist durch Row-Level Security abgesichert.
          Technisch und organisatorisch kann jeder Nutzer ausschließlich seine eigenen Einträge
          lesen, ändern oder löschen — auch der Anbieter sieht im normalen Betrieb keine
          Inhalte fremder Tagebücher.
        </p>
        <p>
          <strong>Löschung:</strong> Einzelne Einträge können jederzeit über die App-UI gelöscht
          werden. Die vollständige Löschung des Accounts inklusive aller Einträge kann per
          E-Mail an die Gemeinde-Adresse{' '}
          <a className="text-burgundy underline" href="mailto:besthesdahouseofgrace1010@gmail.com">
            besthesdahouseofgrace1010@gmail.com
          </a>{' '}
          angefordert werden. Beim Löschen des Accounts werden alle zugehörigen Tagebuch-Einträge
          per Fremdschlüssel-Kaskade (<code>on delete cascade</code>) automatisch mitgelöscht.
        </p>
        <p>
          <strong>Speicherdauer:</strong> Daten werden gespeichert, solange das Mitglied das
          Tagebuch nutzt bzw. der Account besteht. Mit Löschung des Accounts werden auch die
          Einträge entfernt.
        </p>
      </Section>
      <Section heading="6. Hosting und Dienstleister">
        <p>
          Für den Betrieb der App werden die folgenden Dienstleister als Auftragsverarbeiter im
          Sinne von Art. 28 DSGVO eingesetzt:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <strong>Supabase Inc.</strong> — Hosting der Authentifizierung sowie der Datenbank
            (u. a. Prayer Journal, siehe Abschnitt 5a). Die Daten werden in einem
            EU-Rechenzentrum verarbeitet.
          </li>
          <li>
            <strong>Render Inc.</strong> — Hosting des Frontends als Static Site; Auslieferung der
            App-Dateien (HTML/JS/CSS/Bilder) und Verarbeitung üblicher Server-Logdaten.
          </li>
          <li>
            <strong>Google LLC</strong> — Bereitstellung des Modells Gemini
            (<code>gemini-2.5-flash</code>) für die Antworten des Grace Assistant sowie die
            tägliche Tages-Andacht. Übermittelt wird ausschließlich die jeweils erforderliche
            Anfrage (Nutzer-Prompt bzw. Andachts-Trigger); Mitglieder-Stammdaten oder Inhalte
            des Prayer Journal werden nicht an Google übergeben.
          </li>
        </ul>
        <p>
          Mit Supabase Inc. und Render Inc. bestehen Verträge zur Auftragsverarbeitung nach
          Art. 28 DSGVO. Die Übermittlung an Google LLC (USA) erfolgt auf Grundlage der
          EU-Standardvertragsklauseln (Standard Contractual Clauses, SCC) gemäß Art. 46
          Abs. 2 lit. c DSGVO. Schriftarten werden zusätzlich über Google Fonts geladen.
        </p>
      </Section>
      <Section heading="6a. Karte und Routenplanung">
        <p>
          Die Standortkarte auf der Startseite wird mit der Open-Source-Bibliothek Leaflet
          dargestellt. Die Kartenkacheln werden direkt von den Servern der OpenStreetMap Foundation
          (openstreetmap.org) geladen; dabei wird die IP-Adresse des Endgeräts übermittelt. Die
          Schaltflächen für die Routenplanung öffnen Google Maps bzw. Apple Maps in einem neuen
          Fenster — ab dem Moment des Aufrufs gelten die jeweiligen Datenschutzbestimmungen dieser
          Anbieter. Es werden von uns keine Standortdaten erfasst oder an Dritte weitergegeben.
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
        <p>Personenbezogene Daten werden nach folgenden Kategorien aufbewahrt:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <strong>Authentifizierungsdaten (E-Mail-Adresse):</strong> gespeichert, solange das
            Mitglied das Konto aktiv nutzt. Die vollständige Löschung des Kontos kann formlos
            per E-Mail an die Gemeinde-Adresse{' '}
            <a className="text-burgundy underline" href="mailto:besthesdahouseofgrace1010@gmail.com">
              besthesdahouseofgrace1010@gmail.com
            </a>{' '}
            angefordert werden.
          </li>
          <li>
            <strong>Prayer-Journal-Einträge:</strong> gespeichert, solange das Mitglied das Konto
            nutzt. Einzelne Einträge können jederzeit über die App-UI gelöscht werden; bei
            Löschung des Kontos werden alle zugehörigen Einträge per Fremdschlüssel-Kaskade
            (<code>on delete cascade</code>) automatisch mitgelöscht.
          </li>
          <li>
            <strong>Technische Logs (Supabase, Render, Google):</strong> werden gemäß den
            jeweiligen Standard-Aufbewahrungsfristen der eingesetzten Dienstleister verarbeitet
            und automatisch rotiert.
          </li>
        </ul>
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
          Die Verarbeitung umfasst die Bereitstellung der App und ihrer Funktionen (Home mit
          Tages-Andacht, Wochenplan und Adresse/Anfahrt, Grace Assistant, Gebetsformular, privates
          Prayer Journal nach optionaler Anmeldung sowie Connect-Übersicht). Im Einzelnen werden
          folgende personenbezogene Daten verarbeitet:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <strong>Authentifizierungsdaten:</strong> E-Mail-Adressen der Mitglieder zur
            passwortlosen Anmeldung über Magic-Link (verwaltet in <code>auth.users</code> bei
            Supabase).
          </li>
          <li>
            <strong>Prayer-Journal-Einträge:</strong> private Texte der Mitglieder, ausschließlich
            für den jeweiligen Verfasser einsehbar (durch Row-Level Security technisch abgesichert).
          </li>
          <li>
            <strong>KI-Eingaben (Grace Assistant und Tages-Andacht):</strong> Freitext-Prompts der
            Nutzer sowie automatisch erzeugte Andachts-Anfragen, die zur Generierung über eine
            Supabase Edge Function an Google Gemini (<code>gemini-2.5-flash</code>) übermittelt
            werden. Eine dauerhafte Speicherung durch den Anbieter findet nicht statt.
          </li>
          <li>
            <strong>Technische Logs:</strong> durch Supabase, Render und Google erzeugte
            Server-Logdaten (u. a. IP-Adresse, Zeitpunkt, User-Agent) zur Bereitstellung und
            Absicherung des Dienstes.
          </li>
        </ul>
        <p>
          Zweck der Verarbeitung ist die Bereitstellung der App-Funktionen für die Gemeinde.
          Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung) für Authentifizierung,
          Prayer Journal sowie KI-gestützte Funktionen (Grace Assistant, Tages-Andacht) und
          Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an einem stabilen und sicheren
          Betrieb) für die technischen Logs.
        </p>
      </Section>
      <Section heading="4. Datenkategorien und betroffene Personen">
        <p>
          Betroffene Personen sind in erster Linie Gemeindemitglieder, die die App nutzen.
          Aktuell verarbeitete Datenkategorien sind: E-Mail-Adressen (Authentifizierung),
          Inhalte des Prayer Journal, Freitext-Eingaben an den Grace Assistant sowie technische
          Verbindungs- und Logdaten. Weitere Kategorien (z. B. Namen, Dienstzuordnungen,
          Anwesenheit, Push-Tokens) kommen erst mit Anbindung künftiger Funktionen hinzu und
          werden bei Bedarf ergänzt.
        </p>
      </Section>
      <Section heading="5. Unterauftragsverarbeiter">
        <p>
          Der Anbieter setzt die folgenden Unterauftragsverarbeiter ein. Die Gemeinde stimmt deren
          Einsatz mit Abschluss dieser AVV zu:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <strong>Supabase Inc.</strong> (USA; Datenhaltung in der gewählten EU-Region) —
            Authentifizierung und Datenbank (insbesondere Prayer Journal).
          </li>
          <li>
            <strong>Render Inc.</strong> (USA) — Hosting des Frontends als Static Site.
          </li>
          <li>
            <strong>Google LLC</strong> (USA) — KI-Generierung über das Modell Gemini
            (<code>gemini-2.5-flash</code>) für Grace Assistant und Tages-Andacht; zusätzlich
            Auslieferung von Google Fonts.
          </li>
        </ul>
        <p>
          Mit Supabase Inc. und Render Inc. bestehen Verträge zur Auftragsverarbeitung nach
          Art. 28 DSGVO. Die Übermittlung an Google LLC erfolgt auf Grundlage der
          EU-Standardvertragsklauseln (SCC) gemäß Art. 46 Abs. 2 lit. c DSGVO. Änderungen oder
          Ergänzungen dieser Liste werden der Gemeinde rechtzeitig mitgeteilt.
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
