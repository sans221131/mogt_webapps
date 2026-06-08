import { INDUSTRIES, type Industry, type Solution } from '../../../public/megaMenuData';

export type SolutionEntry = {
  solution: Solution;
  industry: Industry;
  index: number; // position within its industry (0-based)
  slug: string;
};

/** The slug is whatever follows `/services/` in a solution's href. */
export function slugFromHref(href: string): string {
  return href.replace(/^\/+/, '').replace(/^services\//, '');
}

let cache: SolutionEntry[] | null = null;

export function getAllSolutionEntries(): SolutionEntry[] {
  if (cache) return cache;
  const entries: SolutionEntry[] = [];
  INDUSTRIES.forEach((industry) => {
    industry.solutions.forEach((solution, index) => {
      entries.push({ solution, industry, index, slug: slugFromHref(solution.href) });
    });
  });
  cache = entries;
  return entries;
}

export function getSolutionBySlug(slug: string): SolutionEntry | null {
  return getAllSolutionEntries().find((e) => e.slug === slug) ?? null;
}

/** Sibling solutions from the same industry, excluding the current one. */
export function getRelatedSolutions(entry: SolutionEntry, count = 4): SolutionEntry[] {
  return getAllSolutionEntries()
    .filter((e) => e.industry.id === entry.industry.id && e.slug !== entry.slug)
    .slice(0, count);
}
