// pages/api/preview.ts
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { slug, nonce } = req.query;

  if (!slug || !nonce) {
    return res.status(401).json({ message: 'Недостаточно параметров' });
  }

  // Аутентификация через WordPress (например, с помощью WPGraphQL JWT)
  try {
    const page = await getPageBySlug(slug as string);
    if (!page) {
      return res.status(404).json({ message: 'Страница не найдена' });
    }

    res.setPreviewData({ slug, nonce });
    res.redirect(`/${slug}`);
  } catch (error) {
    return res.status(500).json({ message: 'Ошибка сервера' });
  }
}