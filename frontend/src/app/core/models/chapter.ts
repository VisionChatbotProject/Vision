import { IIdentifiable, IOrderable } from "./base";


/**
 * Base interface for Chapter objects
 * 
 * A chapter is a collection of meta-information
 */
export interface IChapterBase {
  /**
   * The title of the chapter
   */
  title: string,

  /**
   * A short description for this chapter
   */
  shortDescription: string,

  /**
   * A long description for this chapter
   */
  longDescription: string,
}

/**
 * Interface for Chapter objects as returned by the backend
 * 
 * Interhits from {@link IChapterBase} and {@link IIdentifiable}
 */
export interface IChapter extends IChapterBase, IIdentifiable, IOrderable {
  /**
   * The id of the course to which this chapter belongs.
   */
  course: number,

  /**
   * The organization membership id that created the course
   */
  createdBy?: number

  /**
   * The date on which the course was last updated
   */
  modifiedAt?: Date
}
