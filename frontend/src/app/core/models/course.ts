import { IIdentifiable } from "./base";

/**
 * Base interface for Course objects
 *
 * A course is a collection of meta-information and chapters
 */
export interface ICourseBase {
  /**
   * The name of the course
   */
  name: string;

  /**
   * A short description for this course
   */
  shortDescription: string;

  /**
   * A long description for this course
   */
  longDescription: string;

  /**
   * A Name for the Teacher of this course
   */
  teacherName: string;
  /**
   * An Email for the Teacher of this course
   */
  teacherEmail: string;
  /**
   * A Begin Date for this course
   */
  courseBeginDate: string;
  /**
   * A End Date for this course
   */
  courseEndDate: string;
  /**
   * Materials provided or required for this course
   */
  materials: string;
  /**
   * Ressources for this course
   */
  ressources: string;

  /**
   * The image for the couse. If returned from the backend, contains an url (string)
   * The image can be changed by providing a data blob.
   */
  image: Blob | string;
}

/**
 * Interface for Course objects as returned by the backend
 *
 * Interhits from {@link IOrganizationBase} and {@link IIdentifiable}
 */
export interface ICourse extends ICourseBase, IIdentifiable {
  /**
   * The organization membership id that created the course
   */
  createdBy?: number;

  /**
   * The date on which the course was last updated
   */
  modifiedAt?: Date;

  /**
   * The name of the course
   */
  // name: string;


}
