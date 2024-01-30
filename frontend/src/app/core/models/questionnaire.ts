import { IIdentifiable } from "./base";

/**
 * Base interface for questionaire objects
 * 
 */
 export interface IQuestionnaireBase { 
   /**
    * The title of the questionaire
    */
   title: string

  /**
   * The chapter of the questionnaire
   */
  chapter?: number | null
 }

/**
 * Interface for Questionnaire objects as returned by the backend
 * 
 * Interhits from {@link IIdentifiable}
 */
 export interface IQuestionnaire extends IQuestionnaireBase, IIdentifiable {
  /**
   * The id of the course to which this questionnaire belongs.
   */
  course: number,

  /**
   * The organization membership id that created the questionnaire
   */
  createdBy?: number,

  /**
   * The date on which the questionnaire was last updated
   */
  modifiedAt?: Date,

  /**
   * The title of the questionnaire
   */
  title: string

  /**
   * The chapter of the questionnaire
   */
  chapter?: number | null
}