import Link from 'next/link';
import Image from 'next/image';
import styles from './Header.module.scss';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.header__container}`}>
        <div className={styles.header__logoblock}>
          {/* Оптимизированное изображение */}
          <Image 
            src="/logo.svg"  // Обрати внимание на слеш в начале!
            alt="Логотип"
            width={100}      // Обязательно укажи ширину и высоту
            height={100}
          />
          <div className={styles.header__logoTitle}>
            <Link href="/">Кошки <br /> вашего <br /> двора</Link>
          </div>
        </div>

        <div className={styles.header__main}>
          {/* Поиск и контакты */}
          <div className={styles.header__info}>
            <div className={styles.header__infoSearch}>
              <input 
                type="text" 
                placeholder="Поиск" 
                aria-label="Поиск по сайту"
              />
              <a href="tel:+79303025121" aria-label="Позвонить по номеру +7 930 302-51-21">
                +7 (930) 302-51-21
              </a>
              <a href="tel:+79935662070" aria-label="Позвонить по номеру +7 993 566-20-70">
                +7 (993) 566-20-70
              </a>
            </div>
          </div>

          {/* Навигационное меню */}
          <nav className={styles.header__menu} aria-label="Основное меню">
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
                  <Link href={item.href}>{item.text}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}