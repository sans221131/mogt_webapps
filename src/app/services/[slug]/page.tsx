import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllSolutionEntries, getSolutionBySlug, getRelatedSolutions } from '../solutions';
import { getSolutionPreview } from '../../components/servicesMeta';
import SolutionDetail, { type DetailProps } from './SolutionDetail';

export function generateStaticParams() {
  return getAllSolutionEntries().map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const entry = getSolutionBySlug(slug);
  if (!entry) return { title: 'Solution not found' };
  return {
    title: `${entry.solution.title} — ${entry.industry.name}`,
    description: `${entry.solution.title}: ${entry.solution.description}. A production-grade ${entry.industry.name} solution engineered by MOGT.`,
    openGraph: {
      title: `${entry.solution.title} — MOGT`,
      description: entry.solution.description,
    },
  };
}

export default async function SolutionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = getSolutionBySlug(slug);
  if (!entry) notFound();

  const meta = getSolutionPreview(entry.solution, entry.industry);
  const related = getRelatedSolutions(entry, 4).map((r) => ({
    slug: r.slug,
    title: r.solution.title,
    description: r.solution.description,
  }));

  const props: DetailProps = {
    title: entry.solution.title,
    description: entry.solution.description,
    slug: entry.slug,
    industryName: entry.industry.name,
    industryId: entry.industry.id,
    industryDescription: entry.industry.description,
    industrySolutionCount: entry.industry.solutions.length,
    indexInIndustry: entry.index,
    meta,
    related,
  };

  return <SolutionDetail {...props} />;
}
