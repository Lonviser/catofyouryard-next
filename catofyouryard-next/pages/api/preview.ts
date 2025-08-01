// pages/api/preview.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getPageBySlug } from '../../lib/api';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { slug, nonce } = req.query;

  if (!slug || !nonce) {
    return res.status(401).json({ message: 'Недостаточно параметров' });
  }

  try {
    const page = await getPageBySlug(slug as string);
    if (!page) {
      return res.status(404).json({ message: 'Страница не найдена' });
    }

    res.setPreviewData({ slug, nonce });
    res.redirect(`/${slug}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Ошибка сервера';
    return res.status(500).json({ message });
  }
}