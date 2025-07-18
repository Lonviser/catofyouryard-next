// pages/api/revalidate.ts
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { paths } = req.body;
    for (const path of paths) {
      await res.revalidate(path);
    }
    return res.json({ revalidated: true });
  } catch (error) {
    return res.status(500).json({ message: 'Ошибка ревалидации' });
  }
}