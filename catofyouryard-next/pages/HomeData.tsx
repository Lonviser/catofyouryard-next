import { getPosts, WPPost } from '@/lib/api';

interface HomeDataProps {
  children: (props: { posts: WPPost[]; error?: string }) => React.ReactNode;
}

export default async function HomeData({ children }: HomeDataProps) {
  let posts: WPPost[] = [];
  let error = '';

  try {
    posts = await getPosts();
  } catch (err) {
    error = err instanceof Error ? err.message : 'Неизвестная ошибка';
  }

  return <>{children({ posts, error })}</>;
}