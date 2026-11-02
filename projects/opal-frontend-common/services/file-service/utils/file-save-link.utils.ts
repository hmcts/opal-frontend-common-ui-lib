/**
 * Restores an anchor attribute exactly as it existed before saving.
 * @param link - Caller-owned anchor whose attribute is being restored.
 * @param attribute - Attribute name to restore.
 * @param value - Original attribute value, or null when the attribute was absent.
 */
function restoreLinkAttribute(link: HTMLAnchorElement, attribute: string, value: string | null): void {
  if (value === null) {
    link.removeAttribute(attribute);
  } else {
    link.setAttribute(attribute, value);
  }
}

/**
 * Starts a native file download, restores the caller's anchor attributes and defers object-URL revocation.
 * The anchor remains attached and owned by the caller, including when clicking it fails.
 * @param blob - File content to expose through a temporary object URL.
 * @param link - Dedicated native save anchor without a click handler.
 * @param filename - Filename to apply while starting the download.
 */
export function saveFileToLink(blob: Blob, link: HTMLAnchorElement, filename: string): void {
  const previousHref = link.getAttribute('href');
  const previousDownload = link.getAttribute('download');
  const objectUrl = URL.createObjectURL(blob);

  try {
    link.href = objectUrl;
    link.download = filename;
    link.click();
  } finally {
    restoreLinkAttribute(link, 'href', previousHref);
    restoreLinkAttribute(link, 'download', previousDownload);
    setTimeout(() => URL.revokeObjectURL(objectUrl), 0);
  }
}
