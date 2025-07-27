'use client';

import { useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';
import 'swiper/css/pagination';
import styles from './SliderComponent.module.scss';

export default function SliderComponent() {
  const swiperRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        // Проверяем, работаем ли мы в браузере
        if (typeof window === 'undefined') {
          setLoading(false);
          return;
        }

        // Используем proxy через rewrites
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
        
        const data = await response.json();
        console.log('Полученные данные:', data);
        setSlides(data);
        setLoading(false);
      } catch (err) {
        console.error('Ошибка загрузки слайдов:', err);
        setError(`Не удалось загрузить слайды: ${err.message}`);
        setLoading(false);
      }
    };

    fetchSlides();
  }, []);

  const handleSlideChange = (swiper) => {
    setActiveIndex(swiper.realIndex);
  };

  // Показываем загрузку на сервере
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
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
          setActiveIndex(swiper.realIndex);
        }}
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className={styles['slide-content']}>
              <img 
                src={slide.image} 
                alt={slide.alt || slide.title || 'Изображение слайда'} 
                className={styles['slide-image']} 
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/800x400?text=Image+Not+Found';
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