// pages/posts/[slug].tsx
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { getPostBySlug, getAllPostSlugs, WPPost } from '@/lib/api';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import styles from '@/components/Main/Main.module.scss';

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
        {post._embedded?.['wp:featuredmedia']?.[0]?.source_url && (
          <>
            <meta property="og:image" content={post._embedded['wp:featuredmedia'][0].source_url} />
            <meta name="twitter:image" content={post._embedded['wp:featuredmedia'][0].source_url} />
          </>
        )}
        <meta property="og:title" content={post.title.rendered} />
        <meta property="og:description" content={post.excerpt?.rendered || ''} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      
      <div className="container">
        <Breadcrumbs customBreadcrumbs={customBreadcrumbs} />
        
        <article className={styles.post}>
          <header className={styles.post__header}>
            <h1 
              className={styles.post__title}
              dangerouslySetInnerHTML={{ __html: post.title.rendered }}
            />
            
            <div className={styles.post__meta}>
              <time dateTime={post.date} className={styles.post__date}>
                {new Date(post.date).toLocaleDateString('ru-RU', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
              {post.author_name && (
                <span className={styles.post__author}>
                  Автор: {post.author_name}
                </span>
              )}
            </div>

            {post._embedded?.['wp:featuredmedia']?.[0]?.source_url && (
              <div className={styles.post__featuredImage}>
                <img 
                  src={post._embedded['wp:featuredmedia'][0].source_url} 
                  alt={post.title.rendered}
                  className={styles.post__image}
                />
              </div>
            )}
          </header>

          <div 
            className={styles.post__content}
            dangerouslySetInnerHTML={{ __html: post.content.rendered }} 
          />

          <footer className={styles.post__footer}>
            <div className={styles.post__tags}>
              {post.tags_names?.map((tag, index) => (
                <span key={index} className={styles.post__tag}>
                  {tag}
                </span>
              ))}
            </div>
            
<div className={styles.post__navigation}>
  <Link href="/posts" className={styles.post__backLink}>
    ← Вернуться ко всем подопечным
  </Link>
  <div className={styles.post__social}>
    <h3>Поделиться:</h3>
    <div className={styles.social__links}>
      <a 
        href={`https://t.me/share/url?url=${typeof window !== 'undefined' ? window.location.href : ''}&text=${encodeURIComponent(post.title.rendered)}`}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.social__link}
        title="Поделиться в Telegram"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="#0088cc">
          <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.14.141-.259.259-.374.261l.213-3.053 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.136-.954l11.566-4.458c.538-.196 1.006.128.832.941z"/>
        </svg>
      </a>
      
      <a 
        href={`https://api.whatsapp.com/send?text=${encodeURIComponent(post.title.rendered + ' ' + (typeof window !== 'undefined' ? window.location.href : ''))}`}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.social__link}
        title="Поделиться в WhatsApp"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="#25D366">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.297-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.892 6.966c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
      
      <a 
        href={`https://vk.com/share.php?url=${typeof window !== 'undefined' ? window.location.href : ''}&title=${encodeURIComponent(post.title.rendered)}&noparse=true`}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.social__link}
        title="Поделиться в ВКонтакте"
      >
      <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0 0 48 48">
      <path fill="#1976d2" d="M24 4A20 20 0 1 0 24 44A20 20 0 1 0 24 4Z"></path><path fill="#fff" d="M35.937,18.041c0.046-0.151,0.068-0.291,0.062-0.416C35.984,17.263,35.735,17,35.149,17h-2.618 c-0.661,0-0.966,0.4-1.144,0.801c0,0-1.632,3.359-3.513,5.574c-0.61,0.641-0.92,0.625-1.25,0.625C26.447,24,26,23.786,26,23.199 v-5.185C26,17.32,25.827,17,25.268,17h-4.649C20.212,17,20,17.32,20,17.641c0,0.667,0.898,0.827,1,2.696v3.623 C21,24.84,20.847,25,20.517,25c-0.89,0-2.642-3-3.815-6.932C16.448,17.294,16.194,17,15.533,17h-2.643 C12.127,17,12,17.374,12,17.774c0,0.721,0.6,4.619,3.875,9.101C18.25,30.125,21.379,32,24.149,32c1.678,0,1.85-0.427,1.85-1.094 v-2.972C26,27.133,26.183,27,26.717,27c0.381,0,1.158,0.25,2.658,2c1.73,2.018,2.044,3,3.036,3h2.618 c0.608,0,0.957-0.255,0.971-0.75c0.003-0.126-0.015-0.267-0.056-0.424c-0.194-0.576-1.084-1.984-2.194-3.326 c-0.615-0.743-1.222-1.479-1.501-1.879C32.062,25.36,31.991,25.176,32,25c0.009-0.185,0.105-0.361,0.249-0.607 C32.223,24.393,35.607,19.642,35.937,18.041z"></path>
      </svg>
      </a>
      
      <a 
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title.rendered)}&url=${typeof window !== 'undefined' ? window.location.href : ''}`}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.social__link}
        title="Поделиться в X (Twitter)"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="#000000">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      </a>
    </div>
        </div>     
            </div>
          </footer>
        </article>
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  try {
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
  } catch (error: any) {
    return { props: { post: null, error: error.message } };
  }
};