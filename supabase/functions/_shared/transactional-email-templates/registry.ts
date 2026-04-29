/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'

export interface TemplateEntry {
  component: React.ComponentType<any>
  subject: string | ((data: Record<string, any>) => string)
  to?: string
  displayName?: string
  previewData?: Record<string, any>
}

import { template as trekEnquiry } from './trek-enquiry.tsx'
import { template as trekEnquiryAdmin } from './trek-enquiry-admin.tsx'

export const TEMPLATES: Record<string, TemplateEntry> = {
  'trek-enquiry': trekEnquiry,
  'trek-enquiry-admin': trekEnquiryAdmin,
}
