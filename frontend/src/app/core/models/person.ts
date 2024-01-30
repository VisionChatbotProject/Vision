import { IIdentifiable } from "./base";

/**
 * Interface for Person objects as returned by the backend
 * 
 * Interhits from {@link IIdentifiable}
 */
export interface IPerson extends IIdentifiable {

  /**
   * The first name of the person
   */
  firstName: string,

  /**
   * The last name of the person
   */
  lastName: string

}