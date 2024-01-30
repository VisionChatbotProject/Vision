import { IAuditable, IIdentifiable } from "./base";


/**
 * Base interface for question objects
 * 
 * A question is the actual information holder
 */
export interface IQuestionBase {
  /**
   * The title of the question
   */
  title: string,

  /**
   * The questionnaire tho which the question belongs
   */
  questionnaire: number,

  /**
   * The text of the question
   */
  text: string,

  /**
   * An asset for the question
   */
  asset: string

  /**
   * The resourcetype allows the backend to identify the type of this entity
   */
    resourcetype: 'ChoiceQuestion'
}

/**
 * Interface for Question objects as returned by the backend
 * 
 * Interhits from {@link IQuestionBase}, {@link IIdentifiable} and {@link IAuditable}
 */
export interface IQuestion extends IQuestionBase, IIdentifiable, IAuditable {}
