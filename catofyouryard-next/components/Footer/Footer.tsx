import React from 'react';
import styles from './Footer.module.scss';
import Image from 'next/image';


function Footer(props) {
    return (
        <footer className={styles.footer}>
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
                        <h2 className={styles.footer__logoTitle}>Кошки <br /> Вашего <br /> двора</h2>
                        
                    </div>
                    <div className={styles.footer__contacts}>
                        <h3 className={styles.footer__title}>
                            Контакты :
                        </h3>
                        <ul className={styles.footer__list}>
                            <li><a className={styles.footer__listItem} href="">+79935662070 Сергей</a></li>
                            <li><a className={styles.footer__listItem} href="">+79303025121 Ольга</a></li>
                            <li className={styles.footer__listItem}>Местоположение: <br />с. Печёрск</li>
                        </ul>
                    </div>
                    <div className={styles.footer__donate}>
                        <h3 className={styles.footer__title}>
                            Пожертвования :
                        </h3>
                        <p className={styles.footer__donateText}>
                            Банк: "Т-банк" <br /> Номер карты: 2200 7017 2339 9488 <br />Привязка к номеру: 8930 302 51 21 <br />Получатель: Барынина Ольга Александровна
                        </p>
                    </div>
                    <div className={styles.footer__menu}>
                         <h3 className={styles.footer__title}>
                            Меню :
                        </h3>           
                        <ul className={styles.footer__list}>
                            <li>
                                <a className={styles.footer__listItem} href="/about">О нас</a>
                            </li>
                            <li>
                                <a className={styles.footer__listItem} href="/pets">Котики</a>
                            </li>
                            <li>
                                <a className={styles.footer__listItem} href="/news">Новости</a>
                            </li>
                            <li>
                                <a className={styles.footer__listItem} href="/news">Новости</a>
                            </li>
                        </ul>            
                    </div>
                </div>
                <div className={styles.footer__copy}>
                    <p>© 2025 Кошки Вашего двора. Все права защищены.</p>
                    <div className={styles.footer__developer}>
                        Разработка сайта: <a target='_blank' href="https://t.me/lonviser">Иван Ленковец</a>
                    </div>
                </div>
            </div>
            <div className={styles.footer__under}>

            </div>
        </footer>
    );
}

export default Footer;