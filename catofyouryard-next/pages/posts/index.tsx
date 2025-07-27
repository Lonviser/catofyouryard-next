// pages/posts/index.tsx
import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { getPosts } from '@/lib/api';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';

interface PostsPageProps {
  posts: any[];
  error?: string;
}

export default function PostsPage({ posts, error }: PostsPageProps) {
  // Кастомные крошки для страницы блога
  const customBreadcrumbs = [
    { label: 'Главная', path: '/' },
    { label: 'Новости', path: '/posts' }
  ];

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <Breadcrumbs customBreadcrumbs={customBreadcrumbs} />
        <div className="text-red-500 text-center py-8">Ошибка: {error}</div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Новости - Все статьи</title>
        <meta name="description" content="Читайте наши последние новости и статьи" />
      </Head>
      <div className="container mx-auto p-4">
        {/* Хлебные крошки */}
        <Breadcrumbs customBreadcrumbs={customBreadcrumbs} />
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Новости</h1>
          <p className="text-gray-600">Последние новости и статьи</p>
        </div>
        
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Новости пока не опубликованы</p>
          </div>
        ) : (
          <div className="grid gap-8 md:gap-12">
            {posts.map((post) => (
              <article 
                key={post.id} 
                className="border-b border-gray-200 pb-8 last:border-b-0"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  {post._embedded?.['wp:featuredmedia']?.[0]?.source_url && (
                    <div className="md:w-1/3">
                      <Link href={`/posts/${post.slug}`}>
                        <img 
                          src={post._embedded['wp:featuredmedia'][0].source_url} 
                          alt={post.title.rendered}
                          className="w-full h-48 object-cover rounded-lg transition-opacity hover:opacity-90"
                        />
                      </Link>
                    </div>
                  )}
                  
                  <div className={post._embedded?.['wp:featuredmedia']?.[0]?.source_url ? "md:w-2/3" : "w-full"}>
                    <Link href={`/posts/${post.slug}`} className="hover:text-blue-600">
                      <h2 className="text-2xl font-bold mb-3 text-gray-900 hover:text-blue-600 transition-colors">
                        {post.title.rendered}
                      </h2>
                    </Link>
                    
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <time dateTime={post.date}>
                        {new Date(post.date).toLocaleDateString('ru-RU', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </time>
                    </div>
                    
                    <div 
                      className="text-gray-700 mb-4 prose prose-gray max-w-none"
                      dangerouslySetInnerHTML={{ 
                        __html: post.excerpt?.rendered || 'Нет описания' 
                      }} 
                    />
                    

                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    const posts = await getPosts(12); // Получаем 12 последних постов
    return { 
      props: { posts }, 
      revalidate: 60 
    };
  } catch (error) {
    console.error('Ошибка при получении постов:', error);
    return { props: { posts: [], error: error.message } };
  }
};