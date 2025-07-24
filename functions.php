<?php
use Carbon_Fields\Container;
use Carbon_Fields\Field;
add_theme_support('post-thumbnails');


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
        'menu_icon' => 'dashicons-pets', // Иконка котика
        'supports' => ['title', 'editor', 'thumbnail', 'custom-fields'],
        'show_in_rest' => true,
        'show_in_menu' => true, // Важно!
        'capability_type' => 'post',
        'map_meta_cap' => true,
    ];

    register_post_type('pets', $args);
}

// Добавляем кастомные поля для котиков
add_action('carbon_fields_register_fields', 'add_pets_fields');
function add_pets_fields() {
    Container::make('post_meta', 'Дополнительные поля')
        ->where('post_type', '=', 'pets')
        ->add_fields([
            Field::make('image', 'pet_photo', 'Фото котика')
                ->set_value_type('url'), // Сохраняем URL изображения
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

// Добавляем кастомные поля в REST API
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
            ];
        },
    ]);
}

// wp-content/themes/your-theme/functions.php
add_filter('preview_post_link', function ($link, $post) {
  return 'http://localhost:3000/api/preview?slug=' . $post->post_name . '&nonce=' . wp_create_nonce('wp_rest');
}, 10, 2);

// ВРЕМЕННЫЙ КОД ДЛЯ СОЗДАНИЯ ТЕСТОВЫХ КОТОВ
function create_test_cats() {
    if (!current_user_can('administrator')) return;
    
    if (isset($_GET['create_test_cats'])) {
        $cat_names = [
            'Барсик', 'Мурзик', 'Рыжик', 'Снежок', 'Пушок',
            'Том', 'Гарфилд', 'Чешир', 'Матроскин', 'Леопольд',
            'Мурка', 'Васька', 'Пират', 'Зевс', 'Аполлон'
        ];
        
        foreach ($cat_names as $index => $name) {
            $post_data = [
                'post_title'    => $name,
                'post_content'  => 'Это тестовый котик номер ' . ($index + 1) . '. Очень добрый и игривый!',
                'post_status'   => 'publish',
                'post_type'     => 'pets',
                'meta_input'    => [
                    'pet_age' => rand(1, 10),
                    'pet_gender' => (rand(0, 1) ? 'male' : 'female'),
                    'pet_adopted' => (rand(0, 1) ? 'yes' : ''),
                    'pet_story' => 'История этого котика очень интересная. Он был найден на улице и теперь ищет дом.'
                ]
            ];
            
            $post_id = wp_insert_post($post_data);
            
            // Устанавливаем тестовое изображение (если есть)
            // Или просто оставляем без фото
        }
        
        echo '<div class="notice notice-success"><p>Создано 15 тестовых котов!</p></div>';
    }
}
add_action('admin_notices', 'create_test_cats');

// Добавляем ссылку в админку для удобства
function add_test_cats_menu() {
    add_submenu_page(
        'edit.php?post_type=pets',
        'Создать тестовых котов',
        'Создать тестовых котов',
        'administrator',
        'create-test-cats',
        'test_cats_page_content'
    );
}
add_action('admin_menu', 'add_test_cats_menu');

function test_cats_page_content() {
    if (isset($_GET['create'])) {
        // Создаем котов
        create_sample_cats();
        echo '<div class="notice notice-success"><p>Тестовые коты созданы!</p></div>';
    }
    
    echo '<div class="wrap">';
    echo '<h1>Тестовые коты</h1>';
    echo '<a href="?post_type=pets&page=create-test-cats&create=1" class="button button-primary">Создать 15 тестовых котов</a>';
    echo '</div>';
}

function create_sample_cats() {
    $cat_names = [
        'Барсик', 'Мурзик', 'Рыжик', 'Снежок', 'Пушок',
        'Том', 'Гарфилд', 'Чешир', 'Матроскин', 'Леопольд',
        'Мурка', 'Васька', 'Пират', 'Зевс', 'Аполлон'
    ];
    
    foreach ($cat_names as $index => $name) {
        $post_data = [
            'post_title'    => $name,
            'post_content'  => 'Это тестовый котик номер ' . ($index + 1) . '. Очень добрый и игривый!',
            'post_status'   => 'publish',
            'post_type'     => 'pets',
            'meta_input'    => [
                'pet_age' => rand(1, 10),
                'pet_gender' => (rand(0, 1) ? 'male' : 'female'),
                'pet_adopted' => (rand(0, 1) ? 'yes' : ''),
                'pet_story' => 'История этого котика очень интересная. Он был найден на улице и теперь ищет дом.'
            ]
        ];
        
        $post_id = wp_insert_post($post_data);
    }
}