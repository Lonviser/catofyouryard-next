import '../styles/globals.scss';
import { Montserrat } from 'next/font/google';
import Header from '../components/Header/Header';
import type { AppProps } from 'next/app';

const montserrat = Montserrat({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '700'],
  variable: '--font-montserrat',
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={montserrat.className}>
      <Header />
      <Component {...pageProps} /> 
    </div>
  );
}