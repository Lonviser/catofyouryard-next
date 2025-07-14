import '@/styles/globals.css';
import { Montserrat } from 'next/font/google';
import Header from '../components/Header';
import type { AppProps } from 'next/app';

// Настройка шрифта Montserrat
const montserrat = Montserrat({
  subsets: ['latin', 'cyrillic'], // Поддержка латиницы и кириллицы
  weight: ['400', '500', '700'], // Достаточные начертания
  variable: '--font-montserrat', // Опционально: для использования CSS-переменной
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    // Применяем шрифт ко всему приложению
    <div className={montserrat.className}>
      <Header />
      <Component {...pageProps} />
    </div>
  );
}