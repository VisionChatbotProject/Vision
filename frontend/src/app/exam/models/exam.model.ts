import { IIdentifiable } from "src/app/core/models/base";

/**
 * Base interface for exams
 */
export interface IExam extends IIdentifiable {
  /**
   * The name of this exam
   */
  name: string,
  
  /**
   * A description of this exam
   */
  description: string,
  
  /**
   * The observation for this exam
   */
  observation: string,

  /**
   * The date and time of this exam
   */
  date: string,

  /**
   * Flag which identifies this exam is active
   */
  isActive: boolean
}
