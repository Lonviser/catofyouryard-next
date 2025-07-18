import Link from 'next/link';
import Image from 'next/image';
import styles from './Header.module.scss';
import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  const handleBurgerClick = () => {
    console.log('Burger clicked, isMenuOpen:', !isMenuOpen);
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className={styles.header}>
      <div className={`container ${styles.header__container}`}>
        <div className={styles.header__logoblock}>
          <Image
            src="/logo.svg"
            alt="Логотип"
            width={66}
            height={66}
            priority
          />
          <div className={styles.header__logoTitle}>
            <Link href="/" onClick={handleLinkClick}>
              Кошки <br /> вашего <br /> двора
            </Link>
          </div>
        </div>

        <div className={`${styles.header__main} ${isMenuOpen ? styles.open : ''}`}>
          <div className={styles.header__info}>
            <div className={styles.header__infoSearch}>
              <input
                type="text"
                placeholder="Поиск"
                aria-label="Поиск по сайту"
              />
              <div className={styles.header__infoCont}>
                <a href="tel:+79303025121" aria-label="Позвонить по номеру +7 930 302-51-21" onClick={handleLinkClick}>
                  +7 (930) 302-51-21
                </a>
                <a href="tel:+79935662070" aria-label="Позвонить по номеру +7 993 566-20-70" onClick={handleLinkClick}>
                  +7 (993) 566-20-70
                </a>
                <a href="" onClick={handleLinkClick}>
                  <Image
                    src="/vk.svg"
                    alt="vk.com"
                    width={24}
                    height={24}
                    priority
                  />
                </a>
                <Link className={styles.header__infoHelp} href="/help" onClick={handleLinkClick}>
                  Помочь</Link>
              </div>
            </div>
          </div>

          <nav className={styles.header__menu} aria-label="Основное меню" aria-hidden={!isMenuOpen}>
            <ul>
              {[
                { href: "/about", text: "О нас" },
                { href: "/help", text: "Помочь" },
                { href: "/cats", text: "Взять котика" },
                { href: "/blog", text: "Блог" },
                { href: "/hospital", text: "Домашний стационар" },
                { href: "/reviews", text: "Отзывы" },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} onClick={handleLinkClick}>
                    {item.text}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <button
          className={`${styles.burger} ${isMenuOpen ? styles.burgerActive : ''}`}
          onClick={handleBurgerClick}
          aria-label="Открыть/закрыть меню"
          aria-expanded={isMenuOpen}
        >
          <div className={styles.burgerLines}></div>
        </button>
      </div>
    </header>
  );
}