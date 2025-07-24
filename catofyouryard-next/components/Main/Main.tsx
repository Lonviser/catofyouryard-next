import styles from './Main.module.scss';
import Image from 'next/image';
import Link from 'next/link';
import { WPPost } from '@/lib/api';
import { getPets, WPPet } from '@/lib/api';

interface MainProps {
  posts: WPPost[];
  pets?: WPPet[];
  error?: string;
  page?: number; // Делаем необязательным, если не используется
}


export default function Main({ posts, error,pets, page }: MainProps) {
  if (error) {
    return (
      <div className="text-red-500 text-center">
        Ошибка загрузки новостей: {error}
      </div>
    );
  }

  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <h2 className={styles.hero__title}>Взять котика домой</h2>
        <Link className={styles.hero__button} href="/cats">Найти друга</Link>
      </section>
      <section className={styles.about}>
        <div className="container">
          <div className={styles.about__container}>
            <div className={styles.about__content}>
              <h2 className={styles.about__title}>Проект "Кошки Вашего двора"</h2>
              <p>"Кошки Вашего двора» - это проект нескольких волонтеров, посвятивших свою  жизнь спасению животных, и представляет собой сообщество,  организовавшее частный "приют-передержку",  в котором содержатся кошки,  попавшие в беду или пострадавшие на улицах города, принятые  нами на лечение и выхаживание, с последующим пристройством в добрые руки (по возможности).  Местонахождение –  с. Печерск Смоленской области.В своей работе мы стараемся сочетать клинический профессиональный подход к лечению животных с волонтерской эмпатией спасателей: если после спасения даже у тяжелого животного есть шанс, то мы вместе с врачами сражаемся за его жизнь до последнего.</p>
              <Link href="/about" className={styles.about__link}>
                Подробнее о нас
              </Link>
            </div>
            <div className={styles.about__image}>
              <Image
                src="/cat_about.jpeg"
                alt="Кошки твоего двора"
                width={576}
                height={560}
              />
            </div>
          </div>
        </div>
      </section>
      <section className={styles.news}>
        <div className="container">
          <div className={styles.section__header}>
            <h2 className={styles.section__title}>Новости</h2>
            <Link href="/news" className={styles.section__link}>
              Все новости
            </Link>
          </div>
          <ul className={styles.news__blocks}>
            {posts.map((post) => (
              <li key={post.id} className={styles.news__block}>
                {post._embedded?.['wp:featuredmedia']?.[0]?.source_url && (
                  <Image
                    src={post._embedded['wp:featuredmedia'][0].source_url}
                    alt={post.title.rendered}
                    width={363}
                    height={220}
                    className="w-full h-48 object-cover mb-2"
                  />
                )}
                <div className={styles.news__block_info}>
                  <h3 className={styles.news__block_title}>
                    <Link href={`/posts/${post.slug}`}>{post.title.rendered}</Link>
                  </h3>
                  <div
                    className="text-gray-600"
                    dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className={styles.support}>
        <div className="container">
          <div className={styles.support__container}>
            <div className={styles.support__info}>
              <h2 className={styles.support__title}>
                Поддержите нас, чтобы мы смогли спасти больше жизней
              </h2>
              <Link className={styles.support__link} href="/help">
                Сделать пожертвование
              </Link>
            </div>
            <div className={styles.support__img}>
              <Image
                src="/cat_about.jpeg"
                alt="Кошки твоего двора"
                width={460}
                height={331}
              />
            </div>
          </div>
        </div>
      </section>
      <section className={styles.cats}>
        <div className={styles.section__header}>
          <div className="container">
            <div className={styles.section__header}>
              <h2 className={styles.section__title}>Наши подопечные</h2>
              <Link href="/cats" className={styles.section__link}>
                Смотреть все котиков →
              </Link>
            </div>
            <div className={styles.cats__container}>
              {pets.map((pet) => (
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
          </div>
        </div>
      </section>
    </main>
  );
}