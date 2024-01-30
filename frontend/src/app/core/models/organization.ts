import { ELanguage, IIdentifiable } from "./base";


/**
 * Base interface for Organization objects
 * 
 * An organization is a container for memberships
 */
export interface IOrganizationBase {
  /**
   * The name of the organization
   */
  name: string,

  /**
   * The website url of the organization
   */
  url: string,

  /**
   * The default language for the organization
   * See {@link ELanguage} for choices
   */
  language: ELanguage
}

/**
 * Interface for Organization objects as returned by the backend
 * 
 * Interhits from {@link IOrganizationBase} and {@link IIdentifiable}
 */
export interface IOrganization extends IOrganizationBase, IIdentifiable {

  /**
  * The organization membership id that created the organization
  */
  createdBy: number
}