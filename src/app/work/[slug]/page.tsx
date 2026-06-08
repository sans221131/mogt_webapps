import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProjectBySlug, getAllWorkSlugs, getSlugById, WORK_CATEGORIES } from '../../../../public/workMegaMenuData';
import WorkDetail from './WorkDetail';

export function generateStaticParams() {
  return getAllWorkSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return { title: 'Project not found' };
  return {
    title: `${project.name} — MOGT`,
    description: project.tagline,
    openGraph: {
      title: `${project.name} — MOGT`,
      description: project.tagline,
    },
  };
}

export default async function WorkProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  // Find which category this project belongs to
  const category = WORK_CATEGORIES.find(c => c.projects.some(p => p.slug === slug));

  // Related: other projects in the same category, excluding current
  const related = category
    ? category.projects
        .filter(p => p.slug !== slug)
        .slice(0, 4)
        .map(p => ({ slug: p.slug, title: p.title, description: p.description, type: p.type }))
    : [];

  return (
    <WorkDetail
      project={project}
      slug={slug}
      categoryName={category?.name ?? project.industry}
      categoryId={category?.id ?? ''}
      related={related}
    />
  );
}
