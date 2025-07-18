import styles from './Main.module.scss';
import Image from 'next/image';
import Link from 'next/link';
import { getPosts, WPPost } from '@/lib/api';

export default async function Main() { // Add async here
  let posts: WPPost[] = [];
  let error = '';

  try {
    posts = await getPosts();
  } catch (err) {
    error = err instanceof Error ? err.message : 'Неизвестная ошибка';
  }

  if (error) {
    return <div>Ошибка: {error}</div>;
  }

  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <h2 className={styles.hero__title}>Взять котика домой</h2>
        <button className={styles.hero__button}>Найти друга</button>
      </section>
      <section className={styles.about}>
        <div className="container">
          <div className={styles.about__container}>
            <div className={styles.about__content}>
              <h2 className={styles.about__title}>Проект "Кошки Вашего двора"</h2>
              <p>
                "Кошки Вашего двора» - это проект нескольких волонтеров, 
                посвятивших свою жизнь спасению животных, и представляет собой сообщество,  
                организовавшее частный "приют-передержку", в котором содержатся кошки,  
                попавшие в беду или пострадавшие на улицах города, принятые нами на лечение и выхаживание,
                с последующим пристройством в добрые руки (по возможности).
                Местонахождение – с. Печерск Смоленской области.
                В своей работе мы стараемся сочетать клинический профессиональный подход к лечению животных
                с волонтерской эмпатией спасателей: если после спасения даже у тяжелого животного есть шанс,
                то мы вместе с врачами сражаемся за его жизнь до последнего.
              </p>
              <Link href={'/about'} className={styles.about__link}>Подробнее о нас</Link>
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
                        <a href={`/posts/${post.slug}`}>{post.title.rendered}</a>
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
              <h2 className={styles.support__title}>Поддержите нас, чтобы мы смогли спасти больше жизней</h2>
              <Link className={styles.support__link} href={'/help'}>Сделать пожертвование</Link>
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
    </main>
  );
}