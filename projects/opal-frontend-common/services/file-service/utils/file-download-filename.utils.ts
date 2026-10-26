/**
 * Resolves a filename from UTF-8 or plain Content-Disposition values, falling back when neither is usable.
 * @param contentDisposition - Response header containing an optional download filename.
 * @param fallbackFilename - Filename to use when the header provides no usable value.
 * @returns The decoded UTF-8 filename, plain filename or caller-supplied fallback, in that order.
 */
export function getFileDownloadFilename(contentDisposition: string | null, fallbackFilename: string): string {
  const encoded = contentDisposition?.match(/filename\*\s*=\s*UTF-8''([^;]+)/i)?.[1];
  if (encoded) {
    try {
      return decodeURIComponent(encoded.trim());
    } catch {
      // Use the plain filename or list metadata when the encoded filename is malformed.
    }
  }
  const plain = contentDisposition?.match(/filename\s*=\s*(?:"([^"]+)"|([^;]+))/i);
  return plain?.[1]?.trim() || plain?.[2]?.trim() || fallbackFilename;
}
