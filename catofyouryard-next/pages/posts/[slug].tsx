// pages/posts/[slug].tsx
import { GetStaticPaths, GetStaticProps } from 'next';
import { getPostBySlug, WPPost } from '@/lib/api';

interface PostPageProps {
  post: WPPost | null;
  error?: string;
}

export default function PostPage({ post, error }: PostPageProps) {
  if (error || !post) {
    return <div>Ошибка: {error || 'Пост не найден'}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl mb-4">{post.title.rendered}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content.rendered }} />
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  // Здесь нужно получить список всех слагов постов
  // Для простоты предполагаем, что они известны или можно получить через API
  const slugs = ['example-slug1', 'example-slug2']; // Замените на реальный вызов API
  return {
    paths: slugs.map((slug) => ({ params: { slug } })),
    fallback: 'blocking', // или 'true' для частичной генерации
  };
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