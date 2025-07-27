'use client';

import styles from './Breadcrumbs.module.scss';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FC } from 'react';

// Тип для элемента хлебной крошки
interface BreadcrumbItem {
  label: string;
  path: string;
}

// Тип для пропсов компонента
interface BreadcrumbsProps {
  // Опционально: можно передать кастомные крошки
  customBreadcrumbs?: BreadcrumbItem[];
  // Опционально: можно передать заголовок текущей страницы
  currentPageTitle?: string;
}

// Функция для форматирования slug в читаемый заголовок
const formatSlugToTitle = (slug: string): string => {
  return slug
    .replace(/-/g, ' ')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase());
};

const Breadcrumbs: FC<BreadcrumbsProps> = ({ customBreadcrumbs, currentPageTitle }) => {
  const pathname = usePathname();

  // Функция для генерации хлебных крошек
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    // Если переданы кастомные крошки, используем их
    if (customBreadcrumbs) {
      return customBreadcrumbs;
    }

    // Разбиваем путь на сегменты
    const pathSegments = pathname.split('/').filter(segment => segment);

    // Создаем массив крошек
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Главная', path: '/' }
    ];

    // Добавляем крошки для каждого сегмента
    pathSegments.forEach((segment, index) => {
      const path = `/${pathSegments.slice(0, index + 1).join('/')}`;
      
      // Для последнего элемента используем переданный заголовок
      let label = segment;
      if (index === pathSegments.length - 1 && currentPageTitle) {
        label = currentPageTitle;
      } else {
        // Форматируем slug в заголовок
        label = formatSlugToTitle(segment);
      }
      
      breadcrumbs.push({ label, path });
    });

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
                  <span className={styles.separator}>•</span>
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