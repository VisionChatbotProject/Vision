import { Optional } from "@angular/core";
import { IAuditable, IIdentifiable } from "./base";


/**
 * Base interface for AnswerOptions objects
 * 
 * A answer is the actual information holder
 */
export interface IAnswerOptionBase {
  /**
   * The text of the answer
   */
  text: string

  /**
   * An asset to like an image to the answer
   */
  asset: string

  /**
   * Indicator if this is the correct answer
   */
  correctAnswer: boolean

  /**
  * The resourcetype allows the backend to identify the type of this entity
  */
  resourcetype: 'AnswerOption'


}

/**
 * Interface for AnswerOptions objects as returned by the backend
 * 
 * Interhits from {@link IAnswerOptionBase}, {@link IIdentifiable} and {@link IAuditable}
 */
export interface IAnswerOption extends IAnswerOptionBase, IIdentifiable, IAuditable {
    /**
   * The question id to which the answer belongs
   */
    question: number
}
