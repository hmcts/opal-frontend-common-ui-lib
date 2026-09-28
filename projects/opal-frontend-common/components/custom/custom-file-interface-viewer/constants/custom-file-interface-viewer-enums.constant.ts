export enum InterfaceType {
  BteckohReport = 'BTECKOH_REPORT',
  CapsReport = 'CAPS_REPORT',
  Opal = 'OPAL',
  Natwest = 'NATWEST',
  Allpay = 'ALLPAY',
  AllpayDd = 'ALLPAY_DD',
  Barclaycard = 'BARCLAYCARD',
  Bteckoh = 'BTECKOH',
  Dwp = 'DWP',
  Cder = 'CDER',
  Jacobs = 'JACOBS',
  Marston = 'MARSTON',
  Other = 'OTHER',
  VariantBanking = 'VARIANT_BANKING',
}

export enum InterfaceFileType {
  Source = 'SOURCE',
  SourceJson = 'SOURCE_JSON',
  TransformedJson = 'TRANSFORMED_JSON',
}

export enum InterfaceFileSupportedDomain {
  Fines = 'FINES',
  Confiscation = 'CONFISCATION',
  Maintenance = 'MAINTENANCE',
  FileHandler = 'FILE_HANDLER',
}

export enum InterfaceFileStatus {
  Duplicate = 'DUPLICATE',
  Ingested = 'INGESTED',
  Success = 'SUCCESS',
  SuccessNoTransactions = 'SUCCESS_NO_TRANSACTIONS',
  Superseded = 'SUPERSEDED',
  Failed = 'FAILED',
  FailedSuperseded = 'FAILED_SUPERSEDED',
}
