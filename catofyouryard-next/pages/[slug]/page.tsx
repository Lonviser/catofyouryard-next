import { getPostBySlug, WPPost } from '@/lib/api';
import Image from 'next/image';

interface PostPageProps {
  params: { slug: string };
}

export default async function PostPage({ params }: PostPageProps) {
  let post: WPPost | null = null;
  let error = '';

  try {
    post = await getPostBySlug(params.slug);
  } catch (err) {
    error = err instanceof Error ? err.message : 'Неизвестная ошибка';
  }

  if (error || !post) {
    return <div className="container mx-auto p-4">Ошибка: {error || 'Пост не найден'}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{post.title.rendered}</h1>
      {post._embedded?.['wp:featuredmedia']?.[0]?.source_url && (
        <Image
          src={post._embedded['wp:featuredmedia'][0].source_url}
          alt={post.title.rendered}
          width={800}
          height={400}
          className="w-full h-auto mb-4"
        />
      )}
      <div dangerouslySetInnerHTML={{ __html: post.content.rendered }} />
    </div>
  );
}