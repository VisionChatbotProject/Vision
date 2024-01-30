import { IIdentifiable } from "./base";

/**
 * Base interface for organization role objects
 */
export interface IOrganizationRoleBase {
  /**
   * Name of the organization role
   */
  name: string,

  /**
   * Identifier that describes if the details of an organization can be modified
   */
  canModifyOrganizationDetails: boolean,

  /**
   * Identifier that describes if organization roles can me modified
   */
  canModifyOrganizationRoles: boolean,

  /**
   * Identifier that describes if organization memberships can me modified
   */
  canModifyOrganizationMembers: boolean,

  /**
   * Identifier that describes if the details of organization units can be modified
   */
  canModifyOrganizationUnitDetails: boolean,

  /**
   * Identifier that describes if roles of organization units can be modified
   */
  canModifyOrganizationUnitRoles: boolean,

  /**
   * Identifier that describes if members of organization units can be modified
   */
  canModifyOrganizationUnitMembers: boolean,

  /**
   * Identifier that describes if courses can be managed
   */
  canManageCourses: boolean
}

/**
 * Interface for organization roles returned by the backend
 * 
 * Interhits from {@link IOrganizationRoleBase} and {@link IIdentifiable}
 */
export interface IOrganizationRole extends IOrganizationRoleBase, IIdentifiable {

  /**
   * Describes if the role can be modified. The backend provides default roles that can not
   * be modified such as 'Administrator' and 'Member'
   */
  modifiable: boolean
}