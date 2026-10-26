export interface IFileSaveOptions {
  /** Caller-owned native save anchor without a click handler; its attributes are restored after saving. */
  link: HTMLAnchorElement;
  /** Original user event whose default action is prevented synchronously before saving or requesting content. */
  event?: Event;
  /** Explicit download filename, overriding the response Content-Disposition filename. */
  filename?: string;
  /** Filename used when no explicit or response filename is available; defaults to 'download'. */
  fallbackFilename?: string;
  /** Optional MIME label for the original bytes; this does not convert the file format. */
  mimeType?: string;
}
