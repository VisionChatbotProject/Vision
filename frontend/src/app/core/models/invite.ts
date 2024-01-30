import { IIdentifiable } from "./base";
import { IPerson } from "./person";


/**
 * Base interface for Invite objects
 */
export interface IInviteBase {
  /**
   * The email of the user
   */
  email: string,

  /**
   * The firstname of the user
   */
  firstName: string,

  /**
   * The lastname of the user
   */
  lastName: string,

  /**
   * The role of the user in the organization
   */
  role: number,
}

/**
 * Interface for Invite objects as returned by the backend
 * 
 * Interhits from {@link IInviteBase} and {@link IIdentifiable}
 */
export interface IInvite extends IInviteBase, IIdentifiable {

  /**
   * The invite code created for this invitation
   */
  code: string,

  /**
   * The date on which the invite was created
   */
  dateCreated?: Date,

  /**
   * The date on which the invite expires
   */
  expirationDate?: Date,

  /**
   * Indicator showing if the code was already used
   */
  used: boolean,

  /**
   * The person object the invite was created for
   */
  person: IPerson
}