// pages/posts/index.tsx
import { GetStaticProps } from 'next';
import { useState } from 'react';
import Image from 'next/image';
import styles from '@/components/Main/Main.module.scss';
import Head from 'next/head';
import Link from 'next/link';
import { getPosts, WPPost } from '@/lib/api';
import Pagination from '@/components/Pagination/Pagination';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import sanitizeHtml from 'sanitize-html';

interface PostsPageProps {
  posts: WPPost[];
  error?: string;
}

const POSTS_PER_PAGE = 9;

export default function PostsPage({ posts, error }: PostsPageProps) {
  const customBreadcrumbs = [
    { label: 'Главная', path: '/' },
    { label: 'Новости', path: '/posts' },
  ];

  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const currentPosts = posts.slice(startIndex, startIndex + POSTS_PER_PAGE);
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);

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

      <div className="container">
        <Breadcrumbs customBreadcrumbs={customBreadcrumbs} />

        <div className="posts__title">
          <h1 className={styles.page__title}>Новости</h1>
        </div>

        <p className={styles.page__info}>
          На этой странице мы публикуем небольшие отчеты о проделанной работе, а также другие новости
        </p>

        {currentPosts.length === 0 ? (
          <div className="text-center py-8">
            <p>Новости пока не опубликованы</p>
          </div>
        ) : (
          <>
            <div className={styles.posts}>
              {currentPosts.map((post) => (
                <article key={post.id} className={styles.posts__item}>
                  <Link href={`/posts/${post.slug}`} className={styles.posts__link}>
                    {post._embedded?.['wp:featuredmedia']?.[0]?.source_url && (
                      <div className={styles.posts__imageWrapper}>
                        <Image
                          src={post._embedded['wp:featuredmedia'][0].source_url}
                          alt={post.title.rendered}
                          width={400}
                          height={300}
                          className={styles.posts__img}
                          loading="lazy"
                        />
                      </div>
                    )}
                    <div className={styles.posts__content}>
                      <h2 className={styles.posts__title}>{post.title.rendered}</h2>
                      <div className={styles.posts__date}>
                        <time dateTime={post.date}>
                          {new Date(post.date).toLocaleDateString('ru-RU', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </time>
                      </div>
                      <div
                        className={styles.posts__excerpt}
                        dangerouslySetInnerHTML={{
                          __html: sanitizeHtml(post.excerpt?.rendered || 'Нет описания', {
                            allowedTags: ['p', 'strong', 'em'],
                            allowedAttributes: {},
                          }),
                        }}
                      />
                    </div>
                  </Link>
                </article>
              ))}
            </div>

            {totalPages > 1 && (
              <div className={styles.paginationWrapper}>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    const posts = await getPosts(100);
    return {
      props: { posts },
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Неизвестная ошибка';
    console.error('Ошибка при получении постов:', message);
    return { props: { posts: [], error: message } };
  }
};