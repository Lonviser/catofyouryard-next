export async function getPosts(): Promise<WPPost[]> {
  const res = await fetch('http://localhost/mur/wp-json/wp/v2/posts');
  
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }

  return await res.json();
}

export async function getPostBySlug(slug: string): Promise<WPPost> {
  const res = await fetch(`http://localhost/mur/wp-json/wp/v2/posts?slug=${slug}`);
  
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }

  const data = await res.json();
  return data[0];
}

interface WPPost {
  id: number;
  title: { rendered: string };
  content: { rendered: string };
  slug: string;
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

export async function getPets(): Promise<WPPet[]> {
  try {
    const res = await fetch('http://localhost/mur/wp-json/wp/v2/pets?_embed',{
            next: { revalidate: 60 } // Обновление данных каждые 60 сек
    });
    
    if (!res.ok) {
      throw new Error(`Ошибка! Статус: ${res.status}`);
    }
    const data = await res.json();
    return Array.isArray(data) ? data : []; // Всегда возвращаем массив
  } catch (error) {
    console.error('Ошибка при загрузке котиков:', error);
    return []; // Возвращаем пустой массив при ошибке
  }
}
