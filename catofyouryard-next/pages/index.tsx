// pages/index.tsx
import Main from '@/components/Main/Main';
import { getPosts, WPPost } from '@/lib/api';

interface HomeProps {
  posts: WPPost[];
  error?: string;
  page: number;
}

export default function Home({ posts, error, page }: HomeProps) {
  return <Main posts={posts} error={error} page={page} />;
}

export const getStaticProps = async (context: { query: { page?: string } }) => {
  const page = parseInt(context.query?.page || '1', 10);
  try {
    const posts = await getPosts(6, page); // Передаём page и perPage
    return {
      props: { posts, page },
      revalidate: 60, // ISR: обновление каждые 60 секунд
    };
  } catch (error) {
    return {
      props: {
        posts: [],
        error: error instanceof Error ? error.message : 'Неизвестная ошибка',
        page,
      },
      revalidate: 60,
    };
  }
};