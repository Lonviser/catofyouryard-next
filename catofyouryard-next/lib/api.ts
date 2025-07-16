export interface WPPost {
  id: number;
  title: { rendered: string };
  content: { rendered: string };
  slug: string;
  excerpt: { rendered: string };
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string;
    }>;
  };
}

interface PetInfo {
  photo: string;
  age: string;
  story: string;
  gender: string;
  adopted: boolean;
}

interface WPPet extends WPPost {
  pet_info: PetInfo;
}

export async function getPosts(perPage: number = 6, page: number = 1): Promise<WPPost[]> {
  const res = await fetch(
    `http://catsoftoyouryard.local/wp-json/wp/v2/posts?_embed&per_page=${perPage}&page=${page}`,
    { next: { revalidate: 60 } }
  );
  
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }

  return await res.json();
}

export async function getPostBySlug(slug: string): Promise<WPPost | null> {
  const res = await fetch(`http://catsoftoyouryard.local/wp-json/wp/v2/posts?slug=${slug}&_embed`);
  
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }

  const data = await res.json();
  return data[0] || null;
}

export async function getPets(): Promise<WPPet[]> {
  try {
    const res = await fetch('http://catsoftoyouryard.local/wp-json/wp/v2/pets?_embed', {
      next: { revalidate: 60 }
    });
    
    if (!res.ok) {
      throw new Error(`Ошибка! Статус: ${res.status}`);
    }
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Ошибка при загрузке котиков:', error);
    return [];
  }
}