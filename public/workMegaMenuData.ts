import { projects, type Project } from './portfolio';

export type WorkProject = {
  title: string;
  description: string;
  slug: string;
  type: string;
  id: number;
};

export type WorkCategory = {
  id: string;
  name: string;
  description: string;
  projects: WorkProject[];
};

// Slug → portfolio project id
const SLUG_MAP: Record<string, number> = {
  'resmedx-ehr': 1,
  'taxikeke': 2,
  'streax': 3,
  'jagofm': 4,
  'fundamental-music': 5,
  'fundamental-lessons': 6,
  'fastrack': 7,
  'nama-meditation': 8,
  'medical-melon': 9,
  'plan-the-knot': 10,
  'buyers-place': 11,
  'picker': 12,
  'proschool': 13,
  'dating-diary': 14,
  'instajamaica': 15,
  'westend-calling': 16,
  'celebrated-life': 17,
  'task-buddy': 19,
  'dream-rocket': 20,
  'stockholm-blue': 21,
  'tinbox': 22,
  'dupli': 23,
  'findnaija': 24,
  'wander': 25,
  'ichota': 26,
  'invoicehippo': 27,
  'scan-me': 28,
  'gameset': 29,
  'lee-county-ems': 30,
  'aikona': 31,
  'ogbet': 32,
  'fit-pro': 33,
  'breview': 34,
  'pazz': 35,
  'zvilo-admin': 36,
  'aqare': 37,
  'esim': 38,
  'tennis-app': 39,
  'denis-kebap': 41,
  'fastrak-deer': 42,
  'emboost': 43,
  'athena': 44,
  'rane-global': 45,
  'geo-sci': 46,
  'myassets': 47,
  'ivo': 48,
  'flotilla': 49,
  'tesnet': 50,
  'rad-run': 51,
  'talzent': 52,
  'culturequest': 53,
  'barbera': 54,
  'zvilo': 55,
  'rad-run-events': 56,
  'movie-ticket-app': 57,
};

export function getProjectBySlug(slug: string): Project | undefined {
  const id = SLUG_MAP[slug];
  return id !== undefined ? projects.find(p => p.id === id) : undefined;
}

export function getSlugById(id: number): string | undefined {
  return Object.keys(SLUG_MAP).find(slug => SLUG_MAP[slug] === id);
}

export function getAllWorkSlugs(): string[] {
  return Object.keys(SLUG_MAP);
}

function wp(slug: string): WorkProject {
  const id = SLUG_MAP[slug]!;
  const project = projects.find(p => p.id === id)!;
  return {
    title: project.name.replace(/:.*/,'').replace(/,\s*\w+$/, '').trim(),
    description: project.tagline,
    slug,
    type: project.type,
    id,
  };
}

export const WORK_CATEGORIES: WorkCategory[] = [
  {
    id: 'healthcare',
    name: 'Healthcare & Wellness',
    description: 'Medical platforms, EHR systems, wellness apps, and mental health tools built for real clinical environments.',
    projects: [
      wp('resmedx-ehr'),
      wp('medical-melon'),
      wp('nama-meditation'),
      wp('lee-county-ems'),
      wp('emboost'),
      wp('fit-pro'),
    ],
  },
  {
    id: 'transport',
    name: 'Transport & Mobility',
    description: 'Ride-hailing platforms, GPS recovery apps, fleet booking, and real-time dispatch systems.',
    projects: [
      wp('taxikeke'),
      wp('fastrack'),
      wp('flotilla'),
      wp('fastrak-deer'),
    ],
  },
  {
    id: 'social',
    name: 'Social & Community',
    description: 'Social networks, dating apps, community discovery platforms, and live event voting systems.',
    projects: [
      wp('streax'),
      wp('findnaija'),
      wp('celebrated-life'),
      wp('westend-calling'),
      wp('dating-diary'),
      wp('pazz'),
    ],
  },
  {
    id: 'edtech',
    name: 'EdTech & Learning',
    description: 'School management systems, video-based learning, language apps, and international teacher hiring platforms.',
    projects: [
      wp('fundamental-lessons'),
      wp('proschool'),
      wp('dupli'),
      wp('talzent'),
    ],
  },
  {
    id: 'commerce',
    name: 'Commerce & Marketplace',
    description: 'E-commerce storefronts, buy-and-sell marketplaces, on-demand services, and direct ordering apps.',
    projects: [
      wp('stockholm-blue'),
      wp('ichota'),
      wp('breview'),
      wp('instajamaica'),
      wp('plan-the-knot'),
      wp('denis-kebap'),
    ],
  },
  {
    id: 'fintech',
    name: 'FinTech & Finance',
    description: 'Investment platforms, unified asset management, brand-sponsored giving, and secure financial admin dashboards.',
    projects: [
      wp('zvilo'),
      wp('myassets'),
      wp('tinbox'),
      wp('zvilo-admin'),
    ],
  },
  {
    id: 'realestate',
    name: 'Real Estate & PropTech',
    description: 'Buyer-to-seller property platforms, smart-home management, and digital property management portals.',
    projects: [
      wp('buyers-place'),
      wp('ivo'),
      wp('aqare'),
    ],
  },
  {
    id: 'entertainment',
    name: 'Media & Entertainment',
    description: 'Youth radio streaming, music licensing, sports networking, iGaming, and artist rights management.',
    projects: [
      wp('jagofm'),
      wp('fundamental-music'),
      wp('gameset'),
      wp('ogbet'),
      wp('athena'),
    ],
  },
  {
    id: 'business',
    name: 'Business Tools',
    description: 'Admin dashboards, on-demand order management, salon booking, document scanning, and culture analytics.',
    projects: [
      wp('picker'),
      wp('task-buddy'),
      wp('scan-me'),
      wp('barbera'),
      wp('culturequest'),
    ],
  },
  {
    id: 'tech',
    name: 'Tech & AI',
    description: 'AI image generation, blockchain developer tools, geoscience platforms, IoT logistics, and dev deployment tools.',
    projects: [
      wp('aikona'),
      wp('tesnet'),
      wp('geo-sci'),
      wp('rad-run'),
      wp('rane-global'),
    ],
  },
];
