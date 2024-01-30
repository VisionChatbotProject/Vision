import { IIdentifiable } from "./base";

/**
 * Base interface for organization membership objects
 */
export interface IOrganizationMembershipBase {
  /**
   * First name of a user's organization membership
   */
  firstName: string,

  /**
   * Last name of a user's organization membership
   */
  lastName: string,

  /**
   * EMail of a user's organization membership
   */
  email: string,

  /**
   * The role of a user's organization membership
   */
  role: number
}

/**
 * Interface for organization memberships returned by the backend
 * 
 * Interhits from {@link IOrganizationMembershipBase} and {@link IIdentifiable}
 */
export interface IOrganizationMembership extends IOrganizationMembershipBase, IIdentifiable {

  /**
   * Describes if there exists a user account for this organization membership object
   */
  virtual: boolean
}