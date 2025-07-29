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
  date: string; // Добавлено
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
    story: string;
    gender: string;
    adopted: string;
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

export async function getAllPostSlugs(): Promise<string[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/wp/v2/posts`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error(`Ошибка: ${res.status}`);
    const posts = await res.json();
    return posts.map((post: WPPost) => post.slug);
  } catch (error) {
    console.error('Ошибка при получении slug\'ов постов:', error);
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<WPPost | null> {
  try {
    const res = await fetch(
      `${API_BASE_URL}/wp/v2/posts?slug=${slug}&_embed`,
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

export async function getPets(): Promise<WPPet[]> {
  try {
    let allPets: WPPet[] = [];
    let page = 1;
    const perPage = 100;
    
    while (true) {
      const res = await fetch(
        `${API_BASE_URL}/wp/v2/pets?_embed&per_page=${perPage}&page=${page}`,
        { next: { revalidate: 60 } }
      );
      
      if (!res.ok) throw new Error(`Ошибка: ${res.status}`);
      
      const pets = await res.json();
      
      if (!Array.isArray(pets) || pets.length === 0) {
        break;
      }
      
      allPets = allPets.concat(pets);
      
      // Если получили меньше, чем запрашивали - значит это последняя страница
      if (pets.length < perPage) {
        break;
      }
      
      page++;
    }
    
    console.log('Получены все котики:', allPets);
    return allPets;
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

