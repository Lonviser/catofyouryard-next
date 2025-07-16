import Main from '@/components/Main/Main';
import HomeData from './HomeData';
import { Suspense } from 'react';
import Loading from './api/(posts)/loading';

export default function Home({ searchParams }: { searchParams: { page?: string } }) {
  return (
    <Suspense fallback={<Loading />}>
      <HomeData searchParams={searchParams}>
        {({ posts, error, page }) => <Main posts={posts} error={error} page={page} />}
      </HomeData>
    </Suspense>
  );
}