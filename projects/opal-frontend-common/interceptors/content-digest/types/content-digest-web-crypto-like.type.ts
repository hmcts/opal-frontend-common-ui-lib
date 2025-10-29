export type WebCryptoLikeType = {
  subtle?: {
    digest: (algorithm: string, data: ArrayBufferLike) => Promise<ArrayBuffer>;
  };
};
