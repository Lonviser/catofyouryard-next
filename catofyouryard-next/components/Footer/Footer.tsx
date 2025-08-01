// components/Footer/Footer.tsx
import React from 'react';
import styles from './Footer.module.scss';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Footer: React.FC = () => {
  const router = useRouter();
  const isHomePage = router.pathname === '/';

  return (
    <footer className={`${styles.footer} ${!isHomePage ? styles.withMargin : ''}`}>
      <div className="container">
        <div className={styles.footer__block}>
          <div className={styles.footer__logo}>
            <Image
              src="/logo.svg"
              alt="Логотип"
              width={150}
              height={150}
              priority
            />
            <h2 className={styles.footer__logoTitle}>
              Кошки <br /> Вашего <br /> двора
            </h2>
          </div>
          <div className={styles.footer__contacts}>
            <h3 className={styles.footer__title}>Контакты:</h3>
            <ul className={styles.footer__list}>
              <li>
                <a className={styles.footer__listItem} href="tel:+79935662070">
                  +79935662070 Сергей
                </a>
              </li>
              <li>
                <a className={styles.footer__listItem} href="tel:+79303025121">
                  +79303025121 Ольга
                </a>
              </li>
              <li className={styles.footer__listItem}>
                Местоположение: <br />с. Печёрск
              </li>
            </ul>
          </div>
          <div className={styles.footer__donate}>
            <h3 className={styles.footer__title}>Пожертвования:</h3>
            <div className={styles.footer__donateText}>
              <ul className={styles.footer__list}>
                <li className={styles.footer__listItem}>Банк: Т-банк</li>
                <li className={styles.footer__listItem}>Номер карты: 2200 7017 2339 9488</li>
                <li className={styles.footer__listItem}>Привязка к номеру: 8930 302 51 21</li>
                <li className={styles.footer__listItem}>Получатель: Барынина Ольга Александровна</li>
              </ul>
            </div>
          </div>
          <div className={styles.footer__menu}>
            <h3 className={styles.footer__title}>Меню:</h3>
            <ul className={styles.footer__list}>
              <li>
                <Link href="/about" className={styles.footer__listItem}>
                  О нас
                </Link>
              </li>
              <li>
                <Link href="/pets" className={styles.footer__listItem}>
                  Котики
                </Link>
              </li>
              <li>
                <Link href="/posts" className={styles.footer__listItem}>
                  Новости
                </Link>
              </li>
              <li>
                <Link href="/contacts" className={styles.footer__listItem}>
                  Контакты
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className={styles.footer__copy}>
          <p>© 2025 Кошки Вашего двора. Все права защищены.</p>
          <div className={styles.footer__developer}>
            Разработка сайта:{' '}
            <a target="_blank" href="https://t.me/lonviser" rel="noopener noreferrer">
              Иван Ленковец
            </a>
          </div>
        </div>
      </div>
      <div className={styles.footer__under}></div>
    </footer>
  );
};

export default Footer;