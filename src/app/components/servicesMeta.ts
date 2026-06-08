import type { Industry, Solution } from '../../../public/megaMenuData';

export type Complexity = 'Low' | 'Medium' | 'High' | 'Critical';

export type SolutionPreview = {
  bestFor: string;
  modules: string[];
  complexity: Complexity;
  timeline: string;
};

/**
 * Generates display-only preview metadata for a solution without hand-authoring
 * all 200 entries. Keyword matching on the title comes first, then a per-industry
 * fallback, then a generic default. Keep this maintainable — extend the keyword
 * list rather than special-casing individual solutions.
 */
export function getSolutionPreview(solution: Solution, industry: Industry): SolutionPreview {
  const title = solution.title.toLowerCase();
  const id = industry.id;

  let modules: string[];
  if (title.includes('kyc') || title.includes('identity') || title.includes('verif')) {
    modules = ['Identity', 'Compliance', 'Verification', 'Risk'];
  } else if (title.includes('fraud') || title.includes('risk')) {
    modules = ['ML Models', 'Rules Engine', 'Alerts', 'Reporting'];
  } else if (title.includes('video') || title.includes('stream')) {
    modules = ['CDN', 'Encoding', 'Analytics', 'Subscriptions'];
  } else if (title.includes('marketplace') || title.includes('market')) {
    modules = ['Vendors', 'Payments', 'Catalog', 'Orders'];
  } else if (title.includes('ehr') || title.includes('health record')) {
    modules = ['Patients', 'Records', 'Compliance', 'Access Control'];
  } else if (title.includes('payment') || title.includes('billing') || title.includes('invoic')) {
    modules = ['Gateway', 'Reconciliation', 'Ledger', 'Webhooks'];
  } else if (title.includes('analytic') || title.includes('dashboard') || title.includes('insight')) {
    modules = ['Ingestion', 'Aggregation', 'Visualization', 'Export'];
  } else if (title.includes('crm') || title.includes('customer')) {
    modules = ['Contacts', 'Pipeline', 'Activity', 'Reporting'];
  } else if (title.includes('ai') || title.includes('ml') || title.includes('diagnos') || title.includes('discovery')) {
    modules = ['Training', 'Inference', 'Data Pipeline', 'Monitoring'];
  } else if (title.includes('booking') || title.includes('schedul') || title.includes('calendar')) {
    modules = ['Calendar', 'Notifications', 'Availability', 'Payments'];
  } else if (title.includes('api') || title.includes('gateway') || title.includes('integrat')) {
    modules = ['REST/GraphQL', 'Auth', 'Rate Limiting', 'Docs'];
  } else if (title.includes('lms') || title.includes('learning') || title.includes('course')) {
    modules = ['Courses', 'Progress', 'Assessments', 'Certificates'];
  } else if (title.includes('fleet') || title.includes('route') || title.includes('track')) {
    modules = ['GPS', 'Routing', 'Dispatch', 'Alerts'];
  } else if (title.includes('subscription') || title.includes('loyalty') || title.includes('reward')) {
    modules = ['Plans', 'Billing', 'Rewards', 'Retention'];
  } else if (id === 'fintech') {
    modules = ['Core Banking', 'Ledger', 'Compliance', 'Reporting'];
  } else if (id === 'healthcare') {
    modules = ['HL7 FHIR', 'HIPAA', 'Workflows', 'EHR'];
  } else if (id === 'ecommerce') {
    modules = ['Catalog', 'Cart', 'Payments', 'Fulfillment'];
  } else if (id === 'logistics') {
    modules = ['Routing', 'Tracking', 'Dispatch', 'Docs'];
  } else if (id === 'media') {
    modules = ['CDN', 'CMS', 'Analytics', 'DRM'];
  } else if (id === 'saas') {
    modules = ['Auth', 'Billing', 'Dashboard', 'API'];
  } else {
    modules = ['Core Logic', 'API Layer', 'Dashboard', 'Notifications'];
  }

  let complexity: Complexity = 'Medium';
  if (
    title.includes('ai') || title.includes('ml') || title.includes('quantitative') ||
    title.includes('genomic') || title.includes('synthetic') || title.includes('drug discovery') ||
    title.includes('federated') || title.includes('differential')
  ) {
    complexity = 'Critical';
  } else if (
    title.includes('core') || title.includes('orchestration') || title.includes('platform') ||
    title.includes('engine') || title.includes('neobank') || title.includes('embedded')
  ) {
    complexity = 'High';
  } else if (
    title.includes('portal') || title.includes('tracker') || title.includes('label') ||
    title.includes('booking') || title.includes('form') || title.includes('survey')
  ) {
    complexity = 'Low';
  }

  const timeline =
    complexity === 'Critical' ? '16–24 weeks' :
    complexity === 'High'     ? '10–16 weeks' :
    complexity === 'Low'      ? '4–8 weeks'   :
                                '8–12 weeks';

  const bestForMap: Record<string, string> = {
    fintech:    'Banks, fintechs & regulated entities',
    healthcare: 'Hospitals, clinics & health startups',
    ecommerce:  'Retailers, DTC brands & marketplaces',
    edtech:     'Universities, bootcamps & L&D teams',
    logistics:  '3PLs, carriers & fleet operators',
    realestate: 'Brokers, developers & prop managers',
    automotive: 'OEMs, dealers & mobility startups',
    travel:     'Agencies, hotels & OTA platforms',
    media:      'Studios, publishers & creator platforms',
    saas:       'Startups, scaleups & enterprise teams',
  };

  return {
    bestFor: bestForMap[id] ?? 'Teams building mission-critical software',
    modules: modules.slice(0, 4),
    complexity,
    timeline,
  };
}
