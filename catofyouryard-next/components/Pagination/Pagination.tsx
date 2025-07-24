// components/Pagination/Pagination.tsx
import React from 'react';
import styles from './Pagination.module.scss';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (pageNumber: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ 
  currentPage, 
  totalPages, 
  onPageChange 
}) => {
  // Обработчик перехода на предыдущую страницу
  const goToPrevPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };
  
  // Обработчик перехода на следующую страницу
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  // Генерация массива страниц для отображения
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5; // Максимальное количество отображаемых страниц
    
    if (totalPages <= maxVisiblePages) {
      // Если страниц меньше или равно максимальному количеству, показываем все
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Если страниц больше, показываем "умную" пагинацию
      if (currentPage <= 3) {
        // В начале показываем первые 5 страниц
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // В конце показываем последние 5 страниц
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // В середине показываем текущую страницу и по 2 с каждой стороны
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className={styles.pagination}>
      <button 
        onClick={goToPrevPage}
        disabled={currentPage === 1}
        className={`${styles.pagination__button} ${currentPage === 1 ? styles.disabled : ''}`}
      >
        Назад
      </button>
      
      {getPageNumbers().map((page, index) => (
        typeof page === 'number' ? (
          <button
            key={index}
            onClick={() => onPageChange(page)}
            className={`${styles.pagination__button} ${
              currentPage === page ? styles.active : ''
            }`}
          >
            {page}
          </button>
        ) : (
          <span key={index} className={styles.pagination__dots}>
            {page}
          </span>
        )
      ))}
      
      <button 
        onClick={goToNextPage}
        disabled={currentPage === totalPages}
        className={`${styles.pagination__button} ${currentPage === totalPages ? styles.disabled : ''}`}
      >
        Вперед
      </button>
    </div>
  );
};

export default Pagination;