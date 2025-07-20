import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { getPetBySlug, getPets, WPPet } from '@/lib/api';

interface PetPageProps {
  pet: WPPet | null;
  error?: string;
}

export default function PetPage({ pet, error }: PetPageProps) {
  if (error) {
    return <div className="text-red-500 text-center">Ошибка: {error}</div>;
  }

  if (!pet) {
    return <div className="text-center">Котик не найден 😢</div>;
  }

  return (
    <>
      <Head>
        <title>{pet.title.rendered}</title>
        <meta name="description" content={pet.pet_info?.description || 'Информация о котике'} />
      </Head>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl mb-6">{pet.title.rendered}</h1>
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
            <h2 className="text-2xl mb-4">Информация о котике</h2>
            <p className="mb-2"><strong>Возраст:</strong> {pet.pet_info?.age || 'не указан'}</p>
            <p className="mb-2"><strong>Порода:</strong> {pet.pet_info?.breed || 'не указана'}</p>
            <p className="mb-2"><strong>Описание:</strong> {pet.pet_info?.description || 'Нет описания'}</p>
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
    return { props: { pet }, revalidate: 60 };
  } catch (error) {
    return { props: { pet: null, error: error instanceof Error ? error.message : 'Неизвестная ошибка' }, revalidate: 60 };
  }
};