// lib/api.ts
export interface WPPage {
  id: number;
  title: { rendered: string };
  content: { rendered: string };
  slug: string;
}

export interface WPPost {
  id: number;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  slug: string;
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string;
    }>;
  };
}

export interface WPPet {
  id: number;
  title: { rendered: string };
  slug: string;
  pet_info?: {
    photo: string;
    age: string;
  };
}

export async function getAllPageSlugs(): Promise<string[]> {
  try {
    const res = await fetch('http://catsoftoyouryard.local/wp-json/wp/v2/pages', {
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error(`Ошибка: ${res.status}`);
    const pages = await res.json();
    return pages.map((page: WPPage) => page.slug);
  } catch (error) {
    console.error('Ошибка при получении slug’ов страниц:', error);
    return [];
  }
}

export async function getPageBySlug(slug: string): Promise<WPPage | null> {
  try {
    const res = await fetch(
      `http://catsoftoyouryard.local/wp-json/wp/v2/pages?slug=${slug}&_embed`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) throw new Error(`Ошибка: ${res.status}`);
    const pages = await res.json();
    return pages.length > 0 ? pages[0] : null;
  } catch (error) {
    console.error(`Ошибка при получении страницы ${slug}:`, error);
    return null;
  }
}

export async function getAllPostSlugs(): Promise<string[]> {
  try {
    const res = await fetch('http://catsoftoyouryard.local/wp-json/wp/v2/posts', {
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error(`Ошибка: ${res.status}`);
    const posts = await res.json();
    return posts.map((post: WPPost) => post.slug);
  } catch (error) {
    console.error('Ошибка при получении slug’ов постов:', error);
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<WPPost | null> {
  try {
    const res = await fetch(
      `http://catsoftoyouryard.local/wp-json/wp/v2/posts?slug=${slug}&_embed`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) throw new Error(`Ошибка: ${res.status}`);
    const posts = await res.json();
    return posts.length > 0 ? posts[0] : null;
  } catch (error) {
    console.error(`Ошибка при получении поста ${slug}:`, error);
    return null;
  }
}

export async function getPosts(perPage: number = 6, page: number = 1): Promise<WPPost[]> {
  try {
    const res = await fetch(
      `http://catsoftoyouryard.local/wp-json/wp/v2/posts?_embed&per_page=${perPage}&page=${page}`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) throw new Error(`Ошибка: ${res.status}`);
    const posts = await res.json();
    return Array.isArray(posts) ? posts : [];
  } catch (error) {
    console.error('Ошибка при получении постов:', error);
    return [];
  }
}

export async function getPets(perPage: number = 9, page: number = 1): Promise<WPPet[]> {
  try {
    const res = await fetch(
      `http://catsoftoyouryard.local/wp-json/wp/v2/pets?_embed&per_page=${perPage}&page=${page}`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) throw new Error(`Ошибка: ${res.status}`);
    const pets = await res.json();
    console.log('Получены котики:', pets);
    return Array.isArray(pets) ? pets : [];
  } catch (error) {
    console.error('Ошибка при загрузке котиков:', error);
    return [];
  }
}