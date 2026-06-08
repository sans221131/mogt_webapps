import type { Metadata } from 'next';
import WorkClient from './WorkClient';
import { WORK_CATEGORIES } from '../../../public/workMegaMenuData';

const TOTAL_PROJECTS = WORK_CATEGORIES.reduce((sum, c) => sum + c.projects.length, 0);

export const metadata: Metadata = {
  title: 'Work Archive — MOGT',
  description: `Browse ${TOTAL_PROJECTS} real projects shipped by MOGT across ${WORK_CATEGORIES.length} industries — healthcare, fintech, commerce, edtech, transport, and more.`,
  openGraph: {
    title: 'Work Archive — MOGT',
    description: `${TOTAL_PROJECTS} shipped projects across ${WORK_CATEGORIES.length} categories.`,
  },
};

export default function WorkPage() {
  return <WorkClient />;
}
