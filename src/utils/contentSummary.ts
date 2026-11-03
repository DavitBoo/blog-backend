import { decode } from 'html-entities';

const EXCERPT_LENGTH = 300;
const WORDS_PER_MINUTE = 200;

// Los listados solo necesitan un extracto: enviar el HTML completo de cada elemento pesaba mucho
export const toContentSummary = <T extends { content: string }>({ content, ...post }: T) => {
  // El contenido puede venir codificado: se decodifica para quitar las etiquetas y otra vez para
  // que el texto resultante no enseñe entidades como &amp;
  const text = decode(
    decode(content)
      .replace(/<\/?(p|div|h[1-6]|li|ul|ol|br|blockquote|pre|tr|td|th)\b[^>]*>/gi, ' ')
      .replace(/<[^>]*>/g, ''),
  )
    .replace(/\s+/g, ' ')
    .trim();

  return {
    ...post,
    excerpt: text.slice(0, EXCERPT_LENGTH),
    readingTime: Math.max(1, Math.ceil(text.split(' ').length / WORDS_PER_MINUTE)),
  };
};
