// components/Main/Main.tsx
import styles from './Main.module.scss';
import Image from 'next/image';
import Link from 'next/link';
import { WPPost, WPPet } from '@/lib/api';
import sanitizeHtml from 'sanitize-html';

interface MainProps {
  posts: WPPost[];
  pets?: WPPet[];
  error?: string;
}

export default function Main({ posts, error, pets = [] }: MainProps) {
  if (error) {
    return (
      <div className="text-red-500 text-center">
        Ошибка загрузки новостей: {error}
      </div>
    );
  }

  // Берем только первые 4 котика для отображения на главной
  const featuredPets = pets.slice(0, 4);

  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <h2 className={styles.hero__title}>Взять котика домой</h2>
        <Link className={styles.hero__button} href="/cats">
          Найти друга
        </Link>
      </section>
      <section className={styles.about}>
        <div className="container">
          <div className={styles.about__container}>
            <div className={styles.about__content}>
              <h2 className={styles.about__title}>Проект &quot;Кошки Вашего двора&quot;</h2>
              <p>
                &quot;Кошки Вашего двора&quot; - это проект нескольких волонтеров, посвятивших свою жизнь спасению животных, и представляет собой сообщество, организовавшее частный &quot;приют-передержку&quot;, в котором содержатся кошки, попавшие в беду или пострадавшие на улицах города, принятые нами на лечение и выхаживание, с последующим пристройством в добрые руки (по возможности). Местонахождение – с. Печерск Смоленской области. В своей работе мы стараемся сочетать клинический профессиональный подход к лечению животных с волонтерской эмпатией спасателей: если после спасения даже у тяжелого животного есть шанс, то мы вместе с врачами сражаемся за его жизнь до последнего.
              </p>
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
            <Link href="/posts" className={styles.section__link}>
              Все новости
            </Link>
          </div>

          {posts.length === 0 ? (
            <p className="text-center py-8">Новости скоро появятся</p>
          ) : (
            <div className={styles.news__grid}>
              {posts.slice(0, 3).map((post) => (
                <article key={post.id} className={styles.news__item}>
                  <Link href={`/posts/${post.slug}`} className={styles.news__link}>
                    {post._embedded?.['wp:featuredmedia']?.[0]?.source_url && (
                      <div className={styles.news__imageWrapper}>
                        <Image
                          src={post._embedded['wp:featuredmedia'][0].source_url}
                          alt={post.title.rendered}
                          width={600}
                          height={300}
                          className={styles.news__img}
                        />
                      </div>
                    )}
                    <div className={styles.news__content}>
                      <h3 className={styles.news__title}>{post.title.rendered}</h3>
                      <div className={styles.news__date}>
                        <time dateTime={post.date}>
                          {new Date(post.date).toLocaleDateString('ru-RU', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </time>
                      </div>
                      <div
                        className={styles.news__excerpt}
                        dangerouslySetInnerHTML={{
                          __html: sanitizeHtml(post.excerpt?.rendered || 'Нет описания', {
                            allowedTags: ['p', 'strong', 'em'],
                            allowedAttributes: {},
                          }),
                        }}
                      />
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          )}
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
                Смотреть всех
              </Link>
            </div>
            <div className={styles.cats__container}>
              {featuredPets.map((pet) => (
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
                    <Link className={styles.cats__block_link} href={`/pets/${pet.slug}`}>
                      Подробнее
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      {/* <section className={styles.happycats}>
        <div className="container">
          <h2 className={styles.happycats__title}>Радуемся за наших котиков</h2>
          <p className={styles.happycats__text}>
            Здесь вы можете увидеть главный итог нашей общей поддержки котиков. Эти фотографии подтверждают: у каждого маленького хвостика есть шанс на счастливое будущее! Когда позади остаются суровая уличная жизнь с ее опасностями, серьезные травмы и болезни, сложные операции и долгий путь восстановления — приходит долгожданное счастье. Но для этого нам с вами нужно приложить усилия! Прокрутите фото котиков, которые мы разместили выше: они до сих пор ждут своего хозяина! Может быть, этим человеком станете вы?
          </p>
          <SliderComponent />
        </div>
      </section> */}
    </main>
  );
}