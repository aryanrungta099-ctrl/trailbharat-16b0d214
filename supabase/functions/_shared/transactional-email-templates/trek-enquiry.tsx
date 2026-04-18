/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Section, Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'Himalayan Trails'

interface TrekEnquiryProps {
  name?: string
  trekName?: string
  budget?: string
}

const TrekEnquiryEmail = ({ name, trekName, budget }: TrekEnquiryProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>We received your trek enquiry — {SITE_NAME}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>
          {name ? `Thanks, ${name}!` : 'Thanks for your enquiry!'}
        </Heading>
        <Text style={text}>
          We've received your enquiry{trekName ? ` for the ${trekName} trek` : ''}
          {budget ? ` with a budget of ${budget}` : ''}. Our team will get back
          to you within 24 hours with detailed itinerary, pricing, and next steps.
        </Text>
        <Section style={card}>
          <Text style={cardTitle}>What happens next?</Text>
          <Text style={cardText}>
            • A trek expert will review your request{'\n'}
            • You'll receive a personalised itinerary by email{'\n'}
            • We'll help you plan dates, gear, and logistics
          </Text>
        </Section>
        <Text style={footer}>
          Until then — keep dreaming of the mountains.{'\n'}
          The {SITE_NAME} Team 🏔️
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: TrekEnquiryEmail,
  subject: 'We received your trek enquiry',
  displayName: 'Trek enquiry confirmation',
  previewData: { name: 'Aryan', trekName: 'Everest Base Camp', budget: '₹80,000' },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Georgia, serif' }
const container = { padding: '32px 28px', maxWidth: '560px' }
const h1 = { fontSize: '24px', fontWeight: 'bold', color: '#0c1f13', margin: '0 0 18px' }
const text = { fontSize: '15px', color: '#3d4a40', lineHeight: '1.6', margin: '0 0 24px' }
const card = { backgroundColor: '#f5f1ea', borderRadius: '12px', padding: '20px 22px', margin: '0 0 24px' }
const cardTitle = { fontSize: '14px', fontWeight: 'bold', color: '#0c1f13', margin: '0 0 8px', textTransform: 'uppercase' as const, letterSpacing: '0.05em' }
const cardText = { fontSize: '14px', color: '#3d4a40', lineHeight: '1.7', margin: '0', whiteSpace: 'pre-line' as const }
const footer = { fontSize: '13px', color: '#6b7568', margin: '24px 0 0', whiteSpace: 'pre-line' as const }
