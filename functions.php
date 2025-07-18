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