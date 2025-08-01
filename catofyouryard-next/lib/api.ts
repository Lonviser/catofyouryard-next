// lib/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://catsoftoyouryard.local/wp-json';

export interface WPPage {
  id: number;
  title: { rendered: string };
  content: { rendered: string };
  slug: string;
}

// lib/api.ts (обновите интерфейс WPPost)
export interface WPPost {
  id: number;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  slug: string;
  date: string;
  author_name?: string; // Add author_name as optional
  tags_names?: string[]; // Add tags_names as optional
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string;
    }>;
    'wp:term'?: Array<Array<{
      name: string;
    }>>;
    author?: Array<{
      name: string;
    }>;
  };
}

export interface WPPet {
  id: number;
  title: { rendered: string };
  slug: string;
  content?: { rendered: string }; // Add content field
  pet_info?: {
    photo: string;
    age: string;
    story: string;
    gender: string;
    adopted: string;
    description?: string; // If you added this previously
  };
}

export interface WPSlide {
  title: string;
  image: string;
  alt: string;
}


export async function getAllPageSlugs(): Promise<string[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/wp/v2/pages`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error(`Ошибка: ${res.status}`);
    const pages = await res.json();
    return pages.map((page: WPPage) => page.slug);
  } catch (error) {
    console.error('Ошибка при получении slug\'ов страниц:', error);
    return [];
  }
}

export async function getPageBySlug(slug: string): Promise<WPPage | null> {
  try {
    const res = await fetch(
      `${API_BASE_URL}/wp/v2/pages?slug=${slug}&_embed`,
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

export async function getPostBySlug(slug: string): Promise<WPPost | null> {
  try {
    const res = await fetch(
      `${API_BASE_URL}/wp/v2/posts?slug=${slug}&_embed=wp:featuredmedia,author,wp:term`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) throw new Error(`Ошибка: ${res.status}`);
    const posts = await res.json();
    if (posts.length === 0) return null;

    const post = posts[0];
    return {
      ...post,
      author_name: post._embedded?.author?.[0]?.name || '', // Extract author name
      tags_names: post._embedded?.['wp:term']?.[0]?.map((tag: { name: string }) => tag.name) || [], // Extract tag names
    };
  } catch (error) {
    console.error(`Ошибка при получении поста ${slug}:`, error);
    return null;
  }
}

export async function getAllPostSlugs(): Promise<string[]> {
  try {
    let allSlugs: string[] = [];
    let page = 1;
    const perPage = 100;

    while (true) {
      const res = await fetch(`${API_BASE_URL}/wp/v2/posts?per_page=${perPage}&page=${page}`, {
        next: { revalidate: 60 },
      });
      if (!res.ok) throw new Error(`Ошибка: ${res.status}`);
      const posts = await res.json();

      if (!Array.isArray(posts) || posts.length === 0) {
        break;
      }

      allSlugs = allSlugs.concat(posts.map((post: WPPost) => post.slug));

      if (posts.length < perPage) {
        break;
      }

      page++;
    }

    return allSlugs;
  } catch (error) {
    console.error('Ошибка при получении slug\'ов постов:', error);
    return [];
  }
}

export async function getPosts(perPage: number = 6, page: number = 1): Promise<WPPost[]> {
  try {
    const res = await fetch(
      `${API_BASE_URL}/wp/v2/posts?_embed&per_page=${perPage}&page=${page}`,
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

export async function getPets(perPage: number = 10, page: number = 1): Promise<WPPet[]> {
  try {
    const res = await fetch(
      `${API_BASE_URL}/wp/v2/pets?_embed&per_page=${perPage}&page=${page}`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) throw new Error(`Ошибка: ${res.status}`);
    const pets = await res.json();
    return Array.isArray(pets) ? pets : [];
  } catch (error) {
    console.error('Ошибка при загрузке котиков:', error);
    return [];
  }
}

export async function getPetBySlug(slug: string): Promise<WPPet | null> {
  try {
    const res = await fetch(
      `${API_BASE_URL}/wp/v2/pets?slug=${slug}&_embed`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) throw new Error(`Ошибка: ${res.status}`);
    const pets = await res.json();
    return pets.length > 0 ? pets[0] : null;
  } catch (error) {
    console.error(`Ошибка при получении питомца ${slug}:`, error);
    return null;
  }
}

// Новый метод для получения слайдов
export async function getSlides(): Promise<WPSlide[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/custom/v1/slider`, {
      next: { revalidate: 60 },
      headers: {
        'Content-Type': 'application/json',
      },
      // Отключаем credentials для обхода CORS проблем
      credentials: 'omit' as RequestCredentials
    });
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const slides = await res.json();
    return Array.isArray(slides) ? slides : [];
  } catch (error) {
    console.error('Ошибка при получении слайдов:', error);
    return [];
  }
}

