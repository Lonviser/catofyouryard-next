// pages/index.tsx
import Main from '@/components/Main/Main';
import { getPosts, WPPost, getPets, WPPet } from '@/lib/api';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

interface HomeProps {
  posts: WPPost[];
  pets: WPPet[];
  error?: string;
  page: number;
}

export default function Home({ posts, pets, error, page }: HomeProps) {
  const router = useRouter();
  const currentPage = parseInt((router.query.page as string) || '1', 10);

  useEffect(() => {
    if (page !== currentPage) {
      router.push(`/?page=${page}`, undefined, { shallow: true });
    }
  }, [page, currentPage, router]);

  return <Main posts={posts} pets={pets} error={error} />;
}

export const getStaticProps = async (context: { query?: { page?: string } }) => {
  const page = parseInt(context.query?.page || '1', 10);
  try {
    const posts = await getPosts(6, page);
    const pets = await getPets(3, 1);
    return {
      props: { posts, pets, page },
    };
  } catch (error) {
    return {
      props: {
        posts: [],
        pets: [],
        error: error instanceof Error ? error.message : 'Неизвестная ошибка',
        page,
      },
    };
  }
};