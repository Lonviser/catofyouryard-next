import Image from 'next/image';
import { getPets, WPPet } from '../lib/api';
import styles from '../components/Main/Main.module.scss';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import Pagination from '@/components/Pagination/Pagination';
import { useState } from 'react';

interface PetsPageProps {
  pets: WPPet[];
  error?: string;
}

const customBreadcrumbs = [
  { label: 'Главная', path: '/' },
  { label: 'Наши подопечные', path: '/pets' },
];

export default function Cats({ pets, error }: PetsPageProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const petsPerPage = 16;

  const indexOfLastPet = currentPage * petsPerPage;
  const indexOfFirstPet = indexOfLastPet - petsPerPage;
  const currentPets = pets.slice(indexOfFirstPet, indexOfLastPet);
  const totalPages = Math.ceil(pets.length / petsPerPage);

  if (error) {
    return (
      <div className="container">
        <Breadcrumbs customBreadcrumbs={customBreadcrumbs} />
        <div className="text-red-500 text-center py-8">
          Ошибка загрузки котиков: {error}. Пожалуйста, попробуйте позже.
        </div>
      </div>
    );
  }

  if (!pets || pets.length === 0) {
    return (
      <div className="container">
        <Breadcrumbs customBreadcrumbs={customBreadcrumbs} />
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold mb-4">Наши подопечные</h2>
          <p className="text-gray-600">
            Котиков пока нет 😢. Проверьте соединение с сервером или попробуйте позже.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container">
        <Breadcrumbs customBreadcrumbs={customBreadcrumbs} />
        <section className={styles.cats__page}>
          <h2 className="page__title">Наши подопечные</h2>
          <p className={styles.cats__description}>
            Для того, чтобы узнать о котике подробнее, нажмите на его фото или имя. <br />
            У котиков, рядом с которыми вы видите пометку &quot;заметь меня&quot;, - 
            есть особенности здоровья (диагнозы ВИК или ВЛК, хронические инфекции в стадии ремиссии). <br />
            Они не влияют на жизнь котиков в семье, и не создают для владельца трудностей, 
            но требуют особого внимания и подхода. <br /> Хозябам особенных котиков 
            мы гарантируем полную информационную поддержку по содержанию и 
            лечению котика с указанным заболеванием. <br /> Хотите взять котика?<br /> Звоните  +79935662070 Сергей, +79303025121 Ольга
          </p>

          <div className={styles.cats__container}>
            {currentPets.map((pet) => (
              <div key={pet.id} className={styles.cats__block}>
                <div className="relative">
                  <Image
                    src={pet.pet_info?.photo || '/nophoto.png'}
                    alt={pet.title.rendered}
                    width={260}
                    height={260}
                    className="w-full h-48 object-cover mb-2 rounded"
                    onError={(e) => {
                      // Если изображение не загрузилось, показываем заглушку
                      const target = e.target as HTMLImageElement;
                      target.src = '/nophoto.png';
                    }}
                  />
                </div>
                
                <div className={styles.cats__block_info}>
                  <h3 className={styles.cats__block_title}>
                    <Link href={`/pets/${pet.slug}`}>{pet.title.rendered}</Link>
                  </h3>
                  <Link className={styles.cats__block_link} href={`/pets/${pet.slug}`}>Подробнее</Link>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
            />
          )}
        </section>
      </div>
    </>
  );
}

export const getStaticProps = async () => {
  try {
    const pets = await getPets();
    return { props: { pets }, revalidate: 60 };
  } catch (error) {
    console.error('Ошибка при загрузке котиков:', error);
    return { props: { pets: [], error: error.message }, revalidate: 60 };
  }
};