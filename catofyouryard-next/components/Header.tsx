import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import styles from './Header.module.scss';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  return (
    <header className={styles.header}>
      <div className={styles.navbar}>
        <div className={styles.logoContainer}>
          <div className={styles.logoTitle}>
            <Link href="/" className={styles.logoLink}>
              Cozy House
            </Link>
          </div>
          <div className={styles.logoSubtitle}>Кошки вашего города</div>
        </div>

        <div 
          className={`${styles.burgerMenu} ${isMenuOpen ? styles.active : ''}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span className={styles.burgerLine}></span>
          <span className={styles.burgerLine}></span>
          <span className={styles.burgerLine}></span>
        </div>

        <nav className={`${styles.navContainer} ${isMenuOpen ? styles.active : ''}`}>
          <ul className={styles.navList}>
             <li className={styles.navItem}>
              <Link 
                href="/about-us" 
                className={`${styles.navLink} ${router.pathname === '/about-us' ? styles.active : ''}`}
              >
                О нас
              </Link>
            </li>           
            <li className={styles.navItem}>
              <Link 
                href="/pets" 
                className={`${styles.navLink} ${router.pathname === '/pets' ? styles.active : ''}`}
              >
                Взять котика
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link 
                href="#help" 
                className={styles.navLink}
                onClick={() => setIsMenuOpen(false)}
              >
                Помочь приюту
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link 
                href="#contacts" 
                className={styles.navLink}
                onClick={() => setIsMenuOpen(false)}
              >
                Контакты
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}