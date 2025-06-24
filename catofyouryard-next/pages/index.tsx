import { GetStaticProps } from 'next';
import { getPosts, WPPost } from '../lib/api';

interface HomeProps {
  posts: WPPost[];
  error?: string;
}

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  try {
    const posts = await getPosts();
    return { props: { posts } };
  } catch (error) {
    return { props: { posts: [], error: error.message } };
  }
};

export default function Home({ posts, error }: HomeProps) {
  if (error) {
    return <div>Ошибка: {error}</div>;
  }

  return (
    <div>
      <h1>Записи из WordPress</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <a href={`/posts/${post.slug}`}>{post.title.rendered}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}