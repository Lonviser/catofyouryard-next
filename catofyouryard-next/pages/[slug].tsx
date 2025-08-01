// pages/[slug].tsx
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { getPageBySlug, getAllPageSlugs, WPPage } from '@/lib/api';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import sanitizeHtml from 'sanitize-html';

interface PageProps {
  page: WPPage | null;
  error?: string;
}

export default function Page({ page, error }: PageProps) {
  if (error) {
    return <div className="text-red-500 text-center">Ошибка: {error}</div>;
  }

  if (!page) {
    // При fallback: false это маловероятно, но лучше обработать
    return <div className="text-center">Страница не найдена 😢</div>;
  }

  return (
    <>
      <Head>
        <title>{sanitizeHtml(page.title.rendered, { allowedTags: [] })}</title>
        <meta name="description" content="Описание страницы" />
      </Head>
      <div className="container mx-auto p-4">
        <Breadcrumbs currentPageTitle={sanitizeHtml(page.title.rendered, { allowedTags: [] })} />
        <h1 className="text-3xl mb-6">{sanitizeHtml(page.title.rendered, { allowedTags: [] })}</h1>
        <div
          className="prose"
          dangerouslySetInnerHTML={{
            __html: sanitizeHtml(page.content.rendered, {
              allowedTags: ['p', 'strong', 'em', 'a', 'img', 'h1', 'h2', 'h3', 'ul', 'ol', 'li'],
              allowedAttributes: { a: ['href', 'target', 'rel'], img: ['src', 'alt'] },
            }),
          }}
        />
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    // Получаем ВСЕ slug'и страниц при сборке
    const slugs = await getAllPageSlugs();
    const reservedSlugs = ['about', 'posts', 'pets', 'contacts'];
    const paths = slugs
      .filter((slug) => !reservedSlugs.includes(slug))
      .map((slug) => ({ params: { slug } }));

    return {
      paths,
      // fallback: 'blocking', // <-- СТАРОЕ ЗНАЧЕНИЕ (удалено)
      fallback: false, // <-- НОВОЕ ЗНАЧЕНИЕ (совместимо с output: 'export')
    };
  } catch (err) {
    console.error("Ошибка при получении slug'ов для статической генерации:", err);
    // Если ошибка получения slug'ов, возвращаем пустой массив путей
    return {
      paths: [],
      fallback: false,
    };
  }
};

export const getStaticProps: GetStaticProps<PageProps> = async ({ params }) => { // Добавлен явный тип для возвращаемого значения
  try {
    const slug = params?.slug as string;
    if (!slug) {
      return { notFound: true };
    }
    const page = await getPageBySlug(slug);
    if (!page) {
      return { notFound: true };
    }
    return { props: { page } };
  } catch (error) {
    console.error("Ошибка при получении данных страницы:", error);
    // В режиме статической генерации лучше не передавать сообщения об ошибках напрямую,
    // или убедиться, что они безопасны.
    // return { props: { page: null, error: error instanceof Error ? error.message : 'Неизвестная ошибка' } };
    // Для простоты можно просто вернуть 404 при ошибке
    return { notFound: true };
    // Или, если хочешь показать ошибку на странице:
    // return { props: { page: null, error: 'Не удалось загрузить страницу' } };
  }
};