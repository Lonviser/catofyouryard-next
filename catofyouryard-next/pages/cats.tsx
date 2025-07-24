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
  const petsPerPage =   16;

  const indexOfLastPet = currentPage * petsPerPage;
  const indexOfFirstPet = indexOfLastPet - petsPerPage;
  const currentPets = pets.slice(indexOfFirstPet, indexOfLastPet);
  const totalPages = Math.ceil(pets.length / petsPerPage);

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
            но требуют особого внимания и подхода. <br /> Хозяевам особенных котиков 
            мы гарантируем полную информационную поддержку по содержанию и 
            лечению котика с указанным заболеванием. <br /> Хотите взять котика?<br /> Звоните  +79935662070 Сергей, +79303025121 Ольга
          </p>

          <div className={styles.cats__container}>
            {currentPets.map((pet) => (
              <div key={pet.id} className={styles.cats__block}>
                {pet.pet_info?.photo && (
                  <Image
                    src={pet.pet_info.photo}
                    alt={pet.title.rendered}
                    width={260}
                    height={260}
                    className="w-full h-48 object-cover mb-2"
                  />
                )}
                <div className={styles.cats__block_info}>
                  <h3 className={styles.cats__block_title}>
                    <Link href={`/pets/${pet.slug}`}>{pet.title.rendered}</Link>
                  </h3>
                  <Link className={styles.cats__block_link} href={`/pets/${pet.slug}`}>Подробнее</Link>
                </div>
              </div>
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </section>
      </div>
    </>
  );
}

export const getStaticProps = async () => {
  try {
    const pets = await getPets(); // Без параметров
    return { props: { pets }, revalidate: 60 };
  } catch (error) {
    return { props: { pets: [], error: error.message }, revalidate: 60 };
  }
};