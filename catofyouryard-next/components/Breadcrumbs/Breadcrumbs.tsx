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