import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="text-center py-16">
      <h1 className="text-4xl mb-4">404 - Страница не найдена</h1>
      <p>К сожалению, запрошенная страница не существует.</p>
      <Link href="/" className="text-blue-500 underline">
        Вернуться на главную
      </Link>
    </div>
  );
}