import '../styles/globals.scss';
import { Montserrat } from 'next/font/google';
import Header from '../components/Header/Header';
import Footer from '@/components/Footer/Footer';
import type { AppProps } from 'next/app';
import LoadingIndicator from '@/components/LoadingIndicator';

const montserrat = Montserrat({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '700'],
  variable: '--font-montserrat',
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={`${montserrat.className} app-wrapper`}>
      <Header />
      <main className="main-content">
        <LoadingIndicator />
        <Component {...pageProps} />
      </main>
      <Footer />
    </div>
  );
}