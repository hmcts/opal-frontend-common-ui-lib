/**
 * Creates a Blob from file content without converting its format or changing its bytes.
 * @param content - Existing Blob, text or binary content to wrap.
 * @param mimeType - Optional MIME label; existing Blob labels are retained when it is omitted.
 * @returns The original Blob when its label matches, otherwise a Blob containing the supplied content.
 */
export function getFileBlob(content: BlobPart, mimeType?: string): Blob {
  if (content instanceof Blob) {
    return mimeType !== undefined && mimeType.toLowerCase() !== content.type
      ? content.slice(0, content.size, mimeType)
      : content;
  }

  return new Blob([content], mimeType === undefined ? undefined : { type: mimeType });
}
