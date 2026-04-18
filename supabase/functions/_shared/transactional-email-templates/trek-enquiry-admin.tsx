/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Section, Text, Hr,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface TrekEnquiryAdminProps {
  name?: string
  email?: string
  trekName?: string
  budget?: string
  message?: string
}

const TrekEnquiryAdminEmail = ({ name, email, trekName, budget, message }: TrekEnquiryAdminProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>New trek enquiry from {name || 'a visitor'}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>🏔️ New Trek Enquiry</Heading>
        <Section style={card}>
          <Row label="Name" value={name || '—'} />
          <Row label="Email" value={email || '—'} />
          <Row label="Trek" value={trekName || '—'} />
          <Row label="Budget" value={budget || '—'} />
          {message && (
            <>
              <Hr style={hr} />
              <Text style={msgLabel}>Message</Text>
              <Text style={msgText}>{message}</Text>
            </>
          )}
        </Section>
        <Text style={footer}>Reply directly to {email || 'the customer'} to follow up.</Text>
      </Container>
    </Body>
  </Html>
)

const Row = ({ label, value }: { label: string; value: string }) => (
  <Text style={rowStyle}>
    <span style={rowLabel}>{label}: </span>
    <span style={rowValue}>{value}</span>
  </Text>
)

export const template = {
  component: TrekEnquiryAdminEmail,
  subject: (data: Record<string, any>) =>
    `New trek enquiry: ${data?.trekName || 'Unknown trek'} — ${data?.name || 'Visitor'}`,
  displayName: 'Trek enquiry (admin notification)',
  to: 'aryan099@gmail.com',
  previewData: {
    name: 'Aryan Rungta',
    email: 'visitor@example.com',
    trekName: 'Everest Base Camp',
    budget: '₹80,000',
    message: 'Hello, I am interested in this trek for next April.',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Georgia, serif' }
const container = { padding: '32px 28px', maxWidth: '560px' }
const h1 = { fontSize: '22px', fontWeight: 'bold', color: '#0c1f13', margin: '0 0 20px' }
const card = { backgroundColor: '#f5f1ea', borderRadius: '12px', padding: '20px 22px', margin: '0 0 20px' }
const rowStyle = { fontSize: '14px', color: '#3d4a40', margin: '0 0 8px', lineHeight: '1.5' }
const rowLabel = { fontWeight: 'bold' as const, color: '#0c1f13' }
const rowValue = { color: '#3d4a40' }
const hr = { borderColor: '#d9d2c3', margin: '14px 0' }
const msgLabel = { fontSize: '13px', fontWeight: 'bold', color: '#0c1f13', margin: '0 0 6px', textTransform: 'uppercase' as const, letterSpacing: '0.05em' }
const msgText = { fontSize: '14px', color: '#3d4a40', lineHeight: '1.6', margin: '0', whiteSpace: 'pre-line' as const }
const footer = { fontSize: '12px', color: '#6b7568', margin: '0' }
