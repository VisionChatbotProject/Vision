import { IIdentifiable, IOrderable } from "./base";


/**
 * Base interface for slide objects
 * 
 * A slide is the actual information holder
 */
export interface ISlideBase {
  /**
   * The title of the slide
   */
  title: string,

  /**
   * The content for the course. If returned from the backend, contains an url (string)
   * The content can be changed by providing a data blob.
   */
  content: string
}

/**
 * Interface for Slide objects as returned by the backend
 * 
 * Interhits from {@link ISlideBase} and {@link IIdentifiable}
 */
export interface ISlide extends ISlideBase, IIdentifiable, IOrderable {
  /**
  * The organization membership id that created the slide
  */
   createdBy?: number

   /**
   * The date on which the slide was last updated
   */
    modifiedAt?: Date
}