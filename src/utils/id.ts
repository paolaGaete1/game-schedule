/**
 * Genera un identificador único simple, suficiente para uso local
 * (no requiere criptografía fuerte). Evita dependencias extra como `uuid`.
 */
export function generateId(): string {
  const random = Math.random().toString(36).slice(2, 10);
  const timestamp = Date.now().toString(36);
  return `${timestamp}-${random}`;
}
