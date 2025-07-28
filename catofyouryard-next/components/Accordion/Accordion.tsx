// components/Accordion/Accordion.tsx
import { useState } from 'react';
import styles from './Accordion.module.scss';

interface AccordionProps {
  title: string;
  children: React.ReactNode;
}

export default function Accordion({ title, children }: AccordionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.accordion__item}>
      <div 
        className={styles.accordion__title} 
        onClick={() => setIsOpen(!isOpen)}
      >
        {title}
        <span style={{ float: 'right' }}>{isOpen ? '▲' : '▼'}</span>
      </div>
      {isOpen && (
        <div className={styles.accordion__content}>
          {children}
        </div>
      )}
    </div>
  );
}