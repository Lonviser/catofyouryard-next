import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { getPetBySlug, getPets, WPPet } from '@/lib/api';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import styles from './PetPage.module.scss';

interface PetPageProps {
  pet: WPPet | null;
  error?: string;
  slug?: string; // Добавляем slug в пропсы
}

export default function PetPage({ pet, error, slug }: PetPageProps) {
  if (error) {
    return <div className="text-red-500 text-center">Ошибка: {error}</div>;
  }

  if (!pet) {
    return <div className="text-center">Котик не найден 😢</div>;
  }

  // Динамические хлебные крошки
  const customBreadcrumbs = [
    { label: 'Главная', path: '/' },
    { label: 'Наши подопечные', path: '/cats' },
    { label: pet.title.rendered, path: `/cats/${slug}` }, // Используем заголовок питомца и slug
  ];

  return (
    <>
      <Head>
        <title>{pet.title.rendered}</title>
        <meta name="description" content={pet.pet_info?.description || 'Информация о котике'} />
      </Head>
      <div className="container mx-auto p-4">
        <Breadcrumbs customBreadcrumbs={customBreadcrumbs} />
        
        <h2 className="pet__title">{pet.title.rendered}</h2>
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
              dangerouslySetInnerHTML={{ __html: pet.content.rendered }}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const pets = await getPets();
  const paths = pets.map((pet) => ({ params: { slug: pet.slug } }));
  return { paths, fallback: 'blocking' };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  try {
    const slug = params?.slug as string;
    const pet = await getPetBySlug(slug);
    if (!pet) {
      return { notFound: true };
    }
    return { props: { pet, slug }, revalidate: 60 }; // Передаем slug в пропсы
  } catch (error) {
    return {
      props: {
        pet: null,
        error: error instanceof Error ? error.message : 'Неизвестная ошибка',
        slug: params?.slug as string,
      },
      revalidate: 60,
    };
  }
};