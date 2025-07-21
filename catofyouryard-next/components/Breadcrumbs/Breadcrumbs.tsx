import Link from "next/link";
import { usePathname } from "next/navigation";
import { FC } from "react";
import styles from "./Breadcrumbs.module.scss";

interface BreadcrumbItem{
    label: string;
    path: string;
}
    Chat
    Ctrl+J

    Files

Tasks

Projects

History
Today
Yesterday
April
May
Как правильно реализовать компонент в next js для хлебных крошек?

Я покажу пример реализации компонента хлебных крошек в Next.js с использованием TypeScript, динамических ссылок и стилизации.
tsx
// components/Breadcrumbs.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FC } from 'react';
import styles from './Breadcrumbs.module.css';

// Тип для элемента хлебной крошки
interface BreadcrumbItem {
  label: string;
  path: string;
}

// Тип для пропсов компонента
interface BreadcrumbsProps {
  // Опционально: можно передать кастомные крошки
  customBreadcrumbs?: BreadcrumbItem[];
}

const Breadcrumbs: FC<BreadcrumbsProps> = ({ customBreadcrumbs }) => {
  const pathname = usePathname();

  // Функция для генерации хлебных крошек из пути
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    if (customBreadcrumbs) {
      return customBreadcrumbs;
    }

    // Разбиваем путь на сегменты
    const pathSegments = pathname.split('/').filter(segment => segment);

    // Создаем массив крошек
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Главная', path: '/' },
      ...pathSegments.map((segment, index) => {
        const path = `/${pathSegments.slice(0, index + 1).join('/')}`;
        // Форматируем заголовок: убираем дефисы и капитализируем
        const label = segment
          .replace(/-/g, ' ')
          .replace(/\b\w/g, char => char.toUpperCase());
          
        return { label, path };
      })
    ];

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <nav aria-label="breadcrumb" className={styles.breadcrumbs}>
      <ol className={styles.breadcrumbList}>
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;

          return (
            <li key={crumb.path} className={styles.breadcrumbItem}>
              {isLast ? (
                <span className={styles.current}>{crumb.label}</span>
              ) : (
                <>
                  <Link href={crumb.path} className={styles.link}>
                    {crumb.label}
                  </Link>
                  <span className={styles.separator}>/</span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
css
/* components/Breadcrumbs.module.css */
.breadcrumbs {
  padding: 1rem 0;
  font-size: 0.9rem;
}

.breadcrumbList {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.breadcrumbItem {
  display: flex;
  align-items: center;
}

.link {
  color: #007bff;
  text-decoration: none;
  transition: color 0.2s;
}

.link:hover {
  color: #0056b3;
  text-decoration: underline;
}

.current {
  color: #333;
}

.separator {
  margin: 0 0.5rem;
  color: #666;
}
Использование компонента
tsx
// app/page.tsx
import Breadcrumbs from '@/components/Breadcrumbs';

export default function Page() {
  return (
    <div>
      <Breadcrumbs />
      <h1>Контент страницы</h1>
    </div>
  );
}

// Или с кастомными крошками
import Breadcrumbs from '@/components/Breadcrumbs';

export default function Page() {
  const customBreadcrumbs = [
    { label: 'Главная', path: '/' },
    { label: 'Каталог', path: '/catalog' },
    { label: 'Товар', path: '/catalog/product' },
  ];

  return (
    <div>
      <Breadcrumbs customBreadcrumbs={customBreadcrumbs} />
      <h1>Контент страницы</h1>
    </div>
  );
}
Основные особенности реализации:

    Динамическая генерация: Компонент автоматически создает хлебные крошки на основе текущего URL с помощью usePathname из Next.js.
    Кастомизация: Поддерживает передачу пользовательских хлебных крошек через пропс customBreadcrumbs.
    Стилизация: Использует CSS-модули для изолированных стилей, которые легко кастомизировать.
    Доступность: Добавлен атрибут aria-label для улучшения доступности.
    TypeScript: Полная типизация для лучшей поддержки в редакторах кода.

Дополнительные рекомендации:

    SEO: Добавьте структурированные данные Schema.org для хлебных крошек:

tsx
import Head from 'next/head';

const Breadcrumbs: FC<BreadcrumbsProps> = ({ customBreadcrumbs }) => {
  // ... остальной код ...

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.label,
      item: `https://your-site.com${crumb.path}`,
    })),
  };

  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      </Head>
      <nav aria-label="breadcrumb" className={styles.breadcrumbs}>
        {/* ... остальной код ... */}
      </nav>
    </>
  );
};

    Динамические метки: Для страниц с динамическими маршрутами (например, [id]) можно добавить логику для получения человеко-читаемых названий из API или базы данных.
    Локализация: Если сайт мультиязычный, добавьте поддержку i18n для меток.
    Адаптивность: Убедитесь, что стили адаптируются под мобильные устройства, возможно, скрывая часть крошек на маленьких экранах.

Эта реализация универсальна и подходит для большинства случаев использования в Next.js приложениях.
1.2s
Upgrade to SuperGrok

interface BreadcrumbsProps{
    customBreadcrumbs?: BreadcrumbItem[];
}

const Breadcrumbs: FC<BreadcrumbsProps> = ({customBreadcrumbs}) =>{
    const pathname = usePathname();

    const generateBreadcrumbs = () =>: BreadcrumbItem[] => {
        if(customBreadcrumbs){
            return customBreadcrumbs;
        }

        const pathsegments = pathname.split('/').filter(segment => segment);

        const breadcrumbs: BreadcrumbItem[] = [
            { label: 'Главная', path: '/' },
            ...pathSegments.map((segment, index) => {
                const path = `/${pathSegments.slice(0, index + 1).join('/')}`;
                // Форматируем заголовок: убираем дефисы и капитализируем
                const label = segment
                .replace(/-/g, ' ')
                .replace(/\b\w/g, char => char.toUpperCase());
                
                return { label, path };
            })
            ];

            return breadcrumbs;
        };

}