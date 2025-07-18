// pages/[slug].tsx
import { GetStaticPaths, GetStaticProps } from 'next';
import Image from 'next/image';
import { getPageBySlug, getAllPageSlugs } from '../lib/api';

interface PageProps {
  page: {
    title: { rendered: string };
    content: { rendered: string };
    slug: string;
  } | null;
  error?: string;
}

export default function Page({ page, error }: PageProps) {
  if (error) {
    return <div className="text-red-500 text-center">Ошибка: {error}</div>;
  }

  if (!page) {
    return <div className="text-center">Страница не найдена 😢</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl mb-6">{page.title.rendered}</h1>
      <div
        className="prose"
        dangerouslySetInnerHTML={{ __html: page.content.rendered }}
      />
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = await getAllPageSlugs();
  const paths = slugs.map((slug) => ({ params: { slug } }));
  return { paths, fallback: 'blocking' };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  try {
    const slug = params?.slug as string;
    const page = await getPageBySlug(slug);
    if (!page) {
      return { notFound: true };
    }
    return { props: { page }, revalidate: 60 };
  } catch (error) {
    return { props: { page: null, error: error.message }, revalidate: 60 };
  }
};