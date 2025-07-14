import { getPosts, WPPost } from '@/lib/api';

interface HomeProps {
  posts: WPPost[];
  error?: string;
}

export default async function Home() {
  let posts: WPPost[] = [];
  let error = '';

  try {
    posts = await getPosts();
  } catch (err) {
    error = err instanceof Error ? err.message : 'Неизвестная ошибка';
  }

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