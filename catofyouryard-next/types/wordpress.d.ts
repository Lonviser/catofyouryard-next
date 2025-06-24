interface WPPost {
  id: number;
  title: { rendered: string };
  content: { rendered: string };
  slug: string;
}