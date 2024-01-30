import { IIdentifiable } from "src/app/core/models/base";

/**
 * Base interface for tasks
 */
export interface ITask extends IIdentifiable {
  /**
   * The title of this task
   */
  title: string,
  
  /**
   * A description of this task
   */
  description: string,
  
  /**
   * The observation for this task
   */
  resources: string,

  /**
   * The date of this task
   */
  deadline: string,

  /**
   * Flag which identifies this task is active
   */
  isActive: boolean
}
