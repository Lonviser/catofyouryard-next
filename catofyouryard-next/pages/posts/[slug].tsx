// pages/posts/[slug].tsx
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { getPostBySlug, getAllPostSlugs, WPPost } from '@/lib/api';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';

interface PostPageProps {
  post: WPPost | null;
  error?: string;
}

export default function PostPage({ post, error }: PostPageProps) {
  if (error || !post) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-red-500 text-center py-8">
          Ошибка: {error || 'Пост не найден'}
        </div>
      </div>
    );
  }

  // Создаем кастомные крошки для поста
  const customBreadcrumbs = [
    { label: 'Главная', path: '/' },
    { label: 'Новости', path: '/posts' },
    { label: post.title.rendered, path: `/posts/${post.slug}` }
  ];

  return (
    <>
      <Head>
        <title>{post.title.rendered}</title>
        <meta name="description" content={post.excerpt?.rendered || 'Читайте нашу статью'} />
      </Head>
      <div className="container mx-auto p-4">
        {/* Хлебные крошки */}
        <Breadcrumbs customBreadcrumbs={customBreadcrumbs} />
        
        <article className="max-w-3xl mx-auto">
          <header className="mb-8">
            <h1 
              className="text-3xl md:text-4xl font-bold mb-4 text-gray-900"
              dangerouslySetInnerHTML={{ __html: post.title.rendered }}
            />
            
            <div className="flex items-center text-gray-600">
              <time dateTime={post.date}>
                {new Date(post.date).toLocaleDateString('ru-RU', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
            </div>
          </header>
          
          {post._embedded?.['wp:featuredmedia']?.[0]?.source_url && (
            <div className="mb-8">
              <img 
                src={post._embedded['wp:featuredmedia'][0].source_url} 
                alt={post.title.rendered}
                className="w-full h-auto rounded-lg"
              />
            </div>
          )}
          
          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content.rendered }} 
          />
        </article>
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    // Получаем все slug'и постов
    const slugs = await getAllPostSlugs();
    const paths = slugs.map((slug) => ({ params: { slug } }));
    return {
      paths,
      fallback: 'blocking',
    };
  } catch (error) {
    console.error('Ошибка при получении slug\'ов постов:', error);
    return {
      paths: [],
      fallback: 'blocking',
    };
  }
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  try {
    const slug = params?.slug as string;
    const post = await getPostBySlug(slug);
    if (!post) {
      return { notFound: true };
    }
    return { props: { post }, revalidate: 60 };
  } catch (error) {
    return { props: { post: null, error: error.message } };
  }
};