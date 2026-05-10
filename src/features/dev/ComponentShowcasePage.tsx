// Dev-only showcase. Strings here are intentionally hard-coded — this route
// is not part of the member-facing app and is excluded from i18n.
import { useState } from 'react';
import { Calendar, Heart, Mail } from 'lucide-react';
import { Button } from '../../components/Button';
import { IconButton } from '../../components/IconButton';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { SectionHeader } from '../../components/SectionHeader';
import { EmptyState } from '../../components/EmptyState';
import { PreviewNotice } from '../../components/PreviewNotice';
import { PastoralNote } from '../../components/PastoralNote';
import { FormField, FormGroup } from '../../components/FormField';
import { Modal } from '../../components/Modal';

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="py-6 border-b border-soft-border last:border-0">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-charcoal/70 mb-4">
        {title}
      </h3>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

export default function ComponentShowcasePage() {
  const [open, setOpen] = useState(false);
  return (
    <div className="py-10">
      <SectionHeader
        level={1}
        title="Component Showcase"
        description="Dev-only visual review of shared components."
      />

      <Block title="Buttons">
        <div className="flex flex-wrap gap-3 items-center">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="primary" disabled>
            Disabled
          </Button>
        </div>
        <div className="flex flex-wrap gap-3 items-center">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </div>
        <div className="flex gap-2">
          <IconButton label="Favorite">
            <Heart size={18} />
          </IconButton>
          <IconButton label="Email" variant="solid">
            <Mail size={18} />
          </IconButton>
        </div>
      </Block>

      <Block title="Cards & Badges">
        <Card>
          <div className="flex items-center gap-2 mb-2">
            <Badge tone="burgundy">New</Badge>
            <Badge tone="gold">Featured</Badge>
            <Badge>Neutral</Badge>
          </div>
          <p className="font-medium">A simple card</p>
          <p className="text-sm text-charcoal/70 mt-1">
            Cards use cream-on-white surfaces with a soft border and elegant shadow.
          </p>
        </Card>
      </Block>

      <Block title="Section Header">
        <SectionHeader
          title="Upcoming events"
          description="Three events in the next two weeks"
          action={<Button variant="ghost" size="sm">View all</Button>}
        />
      </Block>

      <Block title="Empty State">
        <EmptyState
          icon={<Calendar size={22} />}
          title="No events yet"
          description="Upcoming gatherings will appear here once they are announced."
        />
      </Block>

      <Block title="Notices">
        <PreviewNotice>
          The Grace Assistant is a preview. In a future version, it will answer using official
          church information.
        </PreviewNotice>
        <PastoralNote>
          The assistant is here to guide and encourage. It does not replace pastoral care, church
          leadership, or professional support in urgent situations.
        </PastoralNote>
      </Block>

      <Block title="Form Fields">
        <FormGroup>
          <FormField label="Name" placeholder="Your name" required />
          <FormField label="Email" type="email" placeholder="you@example.com" hint="We never share your email." />
          <FormField as="textarea" label="Prayer request" placeholder="Share what is on your heart…" />
          <FormField label="Phone" placeholder="(123) 456-7890" error="Please enter a valid phone number." />
        </FormGroup>
      </Block>

      <Block title="Modal">
        <Button onClick={() => setOpen(true)}>Open modal</Button>
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          title="Sermon media"
          footer={
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Close
            </Button>
          }
        >
          Sermon media will be available once the church media library is connected.
        </Modal>
      </Block>
    </div>
  );
}
