import Image from 'next/image';
import { getPets, WPPet } from '../lib/api';

interface PetsPageProps {
  pets: WPPet[];
  error?: string;
}

export default function Cats({ pets, error }: PetsPageProps) {
  if (error) {
    return (
      <div className="text-red-500 text-center">
        Ошибка загрузки котиков: {error}. Пожалуйста, попробуйте позже.
      </div>
    );
  }

  if (!pets || pets.length === 0) {
    return (
      <div className="text-center">
        Котиков пока нет 😢. Проверьте соединение с сервером или попробуйте позже.
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl mb-6">Наши котики</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {pets.map((pet) => (
          <div key={pet.id} className="border rounded-lg p-4">
            <Image
              src={pet.pet_info?.photo || '/default-cat.jpg'}
              alt={pet.title.rendered}
              width={300}
              height={200}
              className="w-full h-48 object-cover"
              loading="lazy"
            />
            <h2 className="text-xl mt-2">{pet.title.rendered}</h2>
            <p>Возраст: {pet.pet_info?.age || 'не указан'}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export const getStaticProps = async () => {
  try {
    const pets = await getPets();
    return { props: { pets }, revalidate: 60 };
  } catch (error) {
    return { props: { pets: [], error: error.message }, revalidate: 60 };
  }
};