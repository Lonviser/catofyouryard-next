'use client';

import { useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, Pagination } from 'swiper/modules';
import type { Swiper as SwiperClass } from 'swiper/types'; // Импорт типа Swiper
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';
import 'swiper/css/pagination';
import Image from 'next/image';
import styles from './SliderComponent.module.scss';

// Определите интерфейс для слайда
interface Slide {
  image: string;
  alt?: string;
  title?: string;
  // Добавьте другие поля, если они есть в ваших данных
}

export default function SliderComponent() {
  // Используем импортированный тип SwiperClass
  const swiperRef = useRef<SwiperClass | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        if (typeof window === 'undefined') {
          setLoading(false);
          return;
        }

        const endpoint = `/wp-json/custom/v1/slider`;

        console.log('Запрос к:', endpoint);

        const response = await fetch(endpoint, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: Slide[] = await response.json();
        console.log('Полученные данные:', data);
        setSlides(data);
        setLoading(false);
      } catch (err: unknown) { // Используем unknown для лучшей практики
        console.error('Ошибка загрузки слайдов:', err);
        let errorMessage = 'Неизвестная ошибка';
        if (err instanceof Error) {
          errorMessage = err.message;
        } else if (typeof err === 'string') {
          errorMessage = err;
        }
        setError(`Не удалось загрузить слайды: ${errorMessage}`);
        setLoading(false);
      }
    };

    fetchSlides();
  }, []);

  // Указываем тип для параметра swiper
  const handleSlideChange = (swiper: SwiperClass) => {
    setActiveIndex(swiper.realIndex);
  };

  if (typeof window === 'undefined') {
    return <div className={styles['slider-container']}>Загрузка...</div>;
  }

  if (loading) {
    return <div className={styles['slider-container']}>Загрузка...</div>;
  }

  if (error) {
    return (
      <div className={styles['slider-container']}>
        <div>Ошибка: {error}</div>
        <div style={{ fontSize: '12px', marginTop: '10px', color: '#666' }}>
          Проверьте доступность API endpoint
        </div>
      </div>
    );
  }

  if (!slides || slides.length === 0) {
    return <div className={styles['slider-container']}>Нет доступных слайдов.</div>;
  }

  return (
    <div className={styles['slider-container']}>
      {/* Указываем тип для параметра swiper в onSwiper */}
      <Swiper
        modules={[Navigation, Autoplay, Pagination]}
        spaceBetween={30}
        slidesPerView={1.5}
        centeredSlides={true}
        navigation
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop={true}
        className={styles.swiper}
        onSlideChange={handleSlideChange}
        onSwiper={(swiper: SwiperClass) => {
          swiperRef.current = swiper;
          setActiveIndex(swiper.realIndex);
        }}
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className={styles['slide-content']}>
              <Image
                src={slide.image}
                alt={slide.alt || slide.title || 'Изображение слайда'}
                width={800}
                height={400}
                className={styles['slide-image']}
                unoptimized={true}
                onError={(e) => {
                  console.warn('Ошибка загрузки изображения слайда:', e);
                }}
              />
              <div className={styles['slide-caption']}>
                {slide.title || `Слайд ${index + 1}`}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {slides.length > 1 && (
        <div className={styles['custom-pagination']}>
          {slides.map((_, index) => (
            <span
              key={index}
              className={`${styles['pagination-bullet']} ${activeIndex === index ? styles['pagination-bullet-active'] : ''}`}
              onClick={() => swiperRef.current?.slideToLoop(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}