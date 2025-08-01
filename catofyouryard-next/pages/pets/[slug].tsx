// pages/pets/[slug].tsx
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { getPetBySlug, getPets, WPPet } from '@/lib/api';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import styles from '@/components/Main/Main.module.scss';

interface PetPageProps {
  pet: WPPet | null;
  error?: string;
  slug?: string;
}

export default function PetPage({ pet, error, slug }: PetPageProps) {
  if (error) {
    return <div className="text-red-500 text-center">Ошибка: {error}</div>;
  }

  if (!pet) {
    return <div className="text-center">Котик не найден 😢</div>;
  }

  const customBreadcrumbs = [
    { label: 'Главная', path: '/' },
    { label: 'Наши подопечные', path: '/pets' },
    { label: pet.title.rendered, path: `/pets/${slug}` },
  ];

  return (
    <>
      <Head>
        <title>{pet.title.rendered}</title>
        <meta name="description" content={pet.pet_info?.story || 'Информация о котике'} />
      </Head>
      <div className="container mx-auto p-4">
        <Breadcrumbs customBreadcrumbs={customBreadcrumbs} />
        
        <h2 className={styles.pet__title}>{pet.title.rendered}</h2> {/* Примечание: styles не импортирован, но используется. Если стили нужны, верни импорт. Если нет - удали className={styles.pet__title} */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Image
              src={pet.pet_info?.photo || '/default-cat.jpg'}
              alt={pet.title.rendered}
              width={500}
              height={400}
              className="w-full h-auto object-cover rounded-lg"
              loading="lazy"
            />
          </div>
          <div>
            <div
              className="prose mt-4"
              dangerouslySetInnerHTML={{ __html: pet.content?.rendered || '' }}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const pets = await getPets();
    const paths = pets.map((pet) => ({ params: { slug: pet.slug } }));
    return { paths, fallback: false }; // <-- ИЗМЕНЕНО С 'blocking' НА false
  } catch (err) {
    console.error("Ошибка при получении slug'ов котиков для статической генерации:", err);
    // Если ошибка получения slug'ов, возвращаем пустой массив путей
    return {
      paths: [],
      fallback: false, // <-- ВАЖНО: false для совместимости с output: 'export'
    };
  }
};

export const getStaticProps: GetStaticProps<PetPageProps> = async ({ params }) => { // Добавлен явный тип
  try {
    const slug = params?.slug as string;
    if (!slug) {
       return { notFound: true };
    }
    const pet = await getPetBySlug(slug);
    if (!pet) {
      return { notFound: true };
    }
    return { props: { pet, slug } };
  } catch (error) {
    console.error("Ошибка при получении данных котика:", error);
    // В режиме статической генерации лучше возвращать notFound при ошибке
    return { notFound: true };
    // Или, если хочешь показать ошибку на странице:
    // return {
    //   props: {
    //     pet: null,
    //     error: 'Не удалось загрузить информацию о котике',
    //     slug: params?.slug as string,
    //   },
    // };
  }
};