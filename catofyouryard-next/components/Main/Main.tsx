import styles from './Main.module.scss';
import Image from 'next/image';
import Link from 'next/link';

export default function Main(){
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
                                        посвятивших свою  жизнь спасению животных, и представляет собой сообщество,  
                                        организовавшее частный "приют-передержку",  в котором содержатся кошки,  
                                        попавшие в беду или пострадавшие на улицах города, принятые  нами на лечение и выхаживание,
                                        с последующим пристройством в добрые руки (по возможности).
                                        Местонахождение –  с. Печерск Смоленской области.
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

        </main>
    );
}