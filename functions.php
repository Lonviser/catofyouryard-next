<?php
use Carbon_Fields\Container;
use Carbon_Fields\Field;

add_theme_support('post-thumbnails');

// Регистрация типа записи "Котики"
add_action('init', 'register_pets_post_type');
function register_pets_post_type() {
    $labels = [
        'name' => 'Котики',
        'singular_name' => 'Котик',
        'add_new' => 'Добавить котика',
        'add_new_item' => 'Добавить нового котика',
        'edit_item' => 'Редактировать котика',
        'new_item' => 'Новый котик',
        'view_item' => 'Просмотреть котика',
        'search_items' => 'Искать котиков',
        'not_found' => 'Котиков не найдено',
        'not_found_in_trash' => 'В корзине котиков не найдено',
    ];

    $args = [
        'labels' => $labels,
        'public' => true,
        'has_archive' => true,
        'menu_position' => 5,
        'menu_icon' => 'dashicons-pets',
        'supports' => ['title', 'editor', 'thumbnail', 'custom-fields'],
        'show_in_rest' => true,
        'show_in_menu' => true,
        'capability_type' => 'post',
        'map_meta_cap' => true,
    ];

    register_post_type('pets', $args);
}

// Кастомные поля для "Котиков"
add_action('carbon_fields_register_fields', 'add_pets_fields');
function add_pets_fields() {
    Container::make('post_meta', 'Дополнительные поля')
        ->where('post_type', '=', 'pets')
        ->add_fields([
            Field::make('image', 'pet_photo', 'Фото котика')
                ->set_value_type('url'),
            Field::make('text', 'pet_age', 'Возраст (лет)'),
            Field::make('rich_text', 'pet_story', 'История котика'),
            Field::make('select', 'pet_gender', 'Пол')
                ->add_options([
                    'male' => 'Мальчик',
                    'female' => 'Девочка',
                ]),
            Field::make('checkbox', 'pet_adopted', 'Пристроен в семью'),
        ]);
}

// REST API для "Котиков"
add_action('rest_api_init', 'register_pets_rest_fields');
function register_pets_rest_fields() {
    register_rest_field('pets', 'pet_info', [
        'get_callback' => function($post) {
            return [
                'photo' => carbon_get_post_meta($post['id'], 'pet_photo'),
                'age' => carbon_get_post_meta($post['id'], 'pet_age'),
                'story' => carbon_get_post_meta($post['id'], 'pet_story'),
                'gender' => carbon_get_post_meta($post['id'], 'pet_gender'),
                'adopted' => carbon_get_post_meta($post['id'], 'pet_adopted'),
                'title' => get_the_title($post['id']),
            ];
        },
    ]);
}

// Новая страница настроек для слайдера
add_action('carbon_fields_register_fields', 'add_slider_settings');
function add_slider_settings() {
    Container::make('theme_options', 'Настройки слайдера')
        ->set_page_menu_title('Слайдер')
        ->set_page_parent('options-general.php')
        ->set_icon('dashicons-slides')
        ->add_fields([
            Field::make('complex', 'slider_slides', 'Слайды')
                ->set_layout('tabbed-horizontal')
                ->add_fields([
                    Field::make('text', 'title', 'Заголовок слайда')
                        ->set_required(true),
                    Field::make('image', 'image', 'Изображение слайда')
                        ->set_value_type('url')
                        ->set_required(true),
                    Field::make('text', 'alt', 'Описание для alt')
                        ->set_default_value('Изображение слайда'),
                ])
                ->set_header_template('<%- title %>')
                ->set_collapsed(true),
        ]);
}

// Новый REST API endpoint для слайдера
add_action('rest_api_init', function () {
    register_rest_route('custom/v1', '/slider', [
        'methods' => 'GET',
        'callback' => function () {
            $slides = carbon_get_theme_option('slider_slides');
            
            // Если слайды не найдены, возвращаем пустой массив
            if (!$slides || !is_array($slides)) {
                return rest_ensure_response([]);
            }

            $formatted_slides = [];

            foreach ($slides as $slide) {
                // Проверяем наличие изображения
                if (!empty($slide['image'])) {
                    $formatted_slides[] = [
                        'title' => !empty($slide['title']) ? sanitize_text_field($slide['title']) : '',
                        'image' => esc_url_raw($slide['image']),
                        'alt' => !empty($slide['alt']) ? sanitize_text_field($slide['alt']) : 'Изображение слайда',
                    ];
                }
            }

            return rest_ensure_response($formatted_slides);
        },
        'permission_callback' => '__return_true',
    ]);
});

// Разрешаем CORS для разработки
function add_cors_headers() {
    // Разрешаем запросы только в режиме разработки
    if (defined('WP_DEBUG') && WP_DEBUG) {
        header('Access-Control-Allow-Origin: http://localhost:3000');
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');
        header('Access-Control-Allow-Credentials: true');
    }
}
add_action('init', 'add_cors_headers');

// Обрабатываем preflight OPTIONS запросы
add_action('rest_api_init', function() {
    register_rest_route('custom/v1', '/slider', array(
        'methods' => 'OPTIONS',
        'callback' => function() {
            return new WP_REST_Response('', 200);
        },
        'permission_callback' => '__return_true',
    ));
});

// Preview link filter
add_filter('preview_post_link', function ($link, $post) {
    return 'http://localhost:3000/api/preview?slug=' . $post->post_name . '&nonce=' . wp_create_nonce('wp_rest');
}, 10, 2);

?>