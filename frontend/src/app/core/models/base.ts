
/**
 * Base interface for Identifiable objects
 * 
 * An identifiable object can be anything the
 * backend has knowledge about.
 * In laymans terms, this is simply the database id
 * of the associated object.
 */
export interface IIdentifiable {
  /**
   * The object id
   */
  readonly id: number,
}


/**
 * Enum for distinguishing languages
 */
export enum ELanguage {
  /**
   * German locale
   */
  eGerman = 'de',

  /**
   * English locale
   */
  eEnglish = 'en'
}

/**
 * Interface for messages from the backend
 */
export interface IBackendMessage {
  /**
   * String containing more detailed information about an operation
   */
  detail: string
}

/**
 * Interface for an asset
 */
export interface IAssetSource {
  /**
   * String containing the url to the asset.
   */
  file: string
}

/**
 * Interface for an asset blob
 */
export interface IAsset {
  /**
   * String containing the blob as data
   */
  file: Blob
}

/**
 * Interface containing basic audit information
 */
export interface IAuditable {
  /**
   * The organization membership id of the member that created this entity
   */
  createdBy: number,

  /**
   * The organization membership id of the member that updated this entity
   */
  updatedBy: number,

  /**
   * The full date time when this entity was created
   */
  createdAt: Date | string,

  /**
   * The full date time when this entity was last updated
   */
  updatedAt: Date | string
}

/**
 * Interface containing order information
 */
export interface IOrderable {
  order: number
}
