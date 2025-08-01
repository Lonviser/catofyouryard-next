import Link from 'next/link';

export default function ServerError() {
  return (
    <div className="text-center py-16">
      <h1 className="text-4xl mb-4">500 - Ошибка сервера</h1>
      <p>Что-то пошло не так. Пожалуйста, попробуйте позже.</p>
      <Link href="/" className="text-blue-500 underline">
        Вернуться на главную
      </Link>
    </div>
  );
}