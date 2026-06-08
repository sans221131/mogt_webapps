import type { Metadata } from 'next';
import ServicesClient from './ServicesClient';
import { INDUSTRIES } from '../../../public/megaMenuData';

const TOTAL_SOLUTIONS = INDUSTRIES.reduce((sum, i) => sum + i.solutions.length, 0);

export const metadata: Metadata = {
  title: 'Solutions Archive',
  description: `Browse every solution MOGT engineers — ${TOTAL_SOLUTIONS} production-grade builds across ${INDUSTRIES.length} industries, from fintech and healthcare to logistics, media, and enterprise SaaS.`,
  openGraph: {
    title: 'Solutions Archive — MOGT',
    description: `${TOTAL_SOLUTIONS} production-grade solutions across ${INDUSTRIES.length} industries.`,
  },
};

export default function ServicesPage() {
  return <ServicesClient />;
}
