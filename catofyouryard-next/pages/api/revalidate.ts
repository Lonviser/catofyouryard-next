// pages/api/revalidate.ts
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Проверяем, что запрос — POST
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Метод не разрешён' });
  }

  try {
    // Получаем пути для ревалидации из тела запроса
    const { paths } = req.body;

    if (!Array.isArray(paths) || paths.length === 0) {
      return res.status(400).json({ message: 'Не указаны пути для ревалидации' });
    }

    // Ревалидируем каждый путь
    for (const path of paths) {
      await res.revalidate(path);
      console.log(`Ревалидирована страница: ${path}`);
    }

    return res.status(200).json({ revalidated: true });
  } catch (error) {
    console.error('Ошибка ревалидации:', error);
    return res.status(500).json({ message: 'Ошибка ревалидации' });
  }
}