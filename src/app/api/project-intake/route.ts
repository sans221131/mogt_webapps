export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

const PROJECT_TYPES = new Set([
  'web_app',
  'mobile_app',
  'saas_platform',
  'dashboard',
  'marketplace',
  'erp_internal_tool',
  'automation_system',
  'not_sure',
]);

const SERVICES_NEEDED = new Set([
  'ui_ux_design',
  'frontend',
  'backend',
  'admin_dashboard',
  'payment_integration',
  'authentication',
  'booking_system',
  'chat_messaging',
  'ai_features',
  'analytics',
  'maintenance',
]);

const TIMELINES = new Set(['asap', '2_4_weeks', '1_2_months', '2_3_months', 'flexible']);
const CONTACT_METHODS = new Set(['email', 'whatsapp', 'call', 'google_meet']);
const INTAKE_INTENTS = new Set(['start_project', 'project_brief', 'estimate']);

type IntakePayload = {
  intent?: unknown;
  project_type?: unknown;
  services_needed?: unknown;
  timeline?: unknown;
  reference_links?: unknown;
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  company_name?: unknown;
  preferred_contact_method?: unknown;
  source_page?: unknown;
  source_button?: unknown;
  website?: unknown;
};

function stringValue(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function nullableString(value: unknown) {
  const text = stringValue(value);
  return text || null;
}

function normalizeArray(value: unknown) {
  if (Array.isArray(value)) {
    return value.map(stringValue).filter(Boolean);
  }
  if (typeof value === 'string') {
    return value
      .split(/[\n,]+/)
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

function filterAllowed(values: string[], allowed: Set<string>) {
  return values.filter((value) => allowed.has(value));
}

function errorResponse(error: string, status = 400) {
  return NextResponse.json({ success: false, error }, { status });
}

export async function POST(request: NextRequest) {
  let payload: IntakePayload;

  try {
    payload = (await request.json()) as IntakePayload;
  } catch {
    return errorResponse('Invalid request body.');
  }

  if (stringValue(payload.website)) {
    return NextResponse.json({ success: true });
  }

  const intent = stringValue(payload.intent) || 'start_project';
  const projectType = stringValue(payload.project_type);
  const name = stringValue(payload.name);
  const email = stringValue(payload.email).toLowerCase();
  const phone = stringValue(payload.phone);

  if (!INTAKE_INTENTS.has(intent)) return errorResponse('Invalid intake intent.');
  if (!PROJECT_TYPES.has(projectType)) return errorResponse('Project type is required.');
  if (!name) return errorResponse('Name is required.');
  if (!email && !phone) return errorResponse('Email or phone is required.');

  const servicesNeeded = filterAllowed(normalizeArray(payload.services_needed), SERVICES_NEEDED);
  const referenceLinks = normalizeArray(payload.reference_links).slice(0, 12);
  const timelineValue = stringValue(payload.timeline);
  const preferredContactValue = stringValue(payload.preferred_contact_method) || 'email';

  const timeline = TIMELINES.has(timelineValue) ? timelineValue : null;
  const preferredContactMethod = CONTACT_METHODS.has(preferredContactValue) ? preferredContactValue : 'email';

  try {
    await query(
      `
        INSERT INTO project_intake_submissions (
          intent,
          project_type,
          services_needed,
          timeline,
          reference_links,
          name,
          email,
          phone,
          company_name,
          preferred_contact_method,
          source_page,
          source_button,
          user_agent
        )
        VALUES (
          $1,
          $2,
          $3::text[],
          $4,
          $5::text[],
          $6,
          $7,
          $8,
          $9,
          $10,
          $11,
          $12,
          $13
        )
      `,
      [
        intent,
        projectType,
        servicesNeeded,
        timeline,
        referenceLinks,
        name,
        email || null,
        phone || null,
        nullableString(payload.company_name),
        preferredContactMethod,
        nullableString(payload.source_page),
        nullableString(payload.source_button),
        request.headers.get('user-agent'),
      ],
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Project intake submission failed:', error);
    return errorResponse('Could not save the intake details. Please try again.', 500);
  }
}
