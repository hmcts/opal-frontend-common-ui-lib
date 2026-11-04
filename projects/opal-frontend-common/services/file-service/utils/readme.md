# File Service download utilities

These internal functions support the retained `FileService` download methods. Consumers import
`FileService` from `@hmcts/opal-frontend-common/services/file-service` rather than deep-importing these files.
Public option interfaces, download types and default constants have dedicated `/interfaces`, `/types` and
`/constants` entrypoints under that service path.

| Utility                                                        | Used by                                                                          |
| -------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| `getFileBlob` in `file-blob.utils.ts`                          | `FileService.createBlob`, then the save methods.                                 |
| `getFileDownloadFilename` in `file-download-filename.utils.ts` | Response-option resolution for header/fallback filenames.                        |
| `getFileResponseOptions` in `file-response-options.utils.ts`   | `FileService.saveResponse` and `downloadFile`.                                   |
| `saveFileToLink` in `file-save-link.utils.ts`                  | `FileService.saveFile`; preserves the caller's anchor and cleans up object URLs. |

Upload progress, byte limits, extension checks and error formatting are implemented directly on `FileService`.
They have no separate utility entrypoint. See the [service guide](../readme.md) for the public API and ownership rules.
