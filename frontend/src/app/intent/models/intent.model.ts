import { IIdentifiable } from "src/app/core/models/base";

/**
 * Base interface for intents
 * 
 * An intent specifies the intention a user has w.r.t to a 
 * set of messages/questions. 
 */
export interface IIntent extends IIdentifiable {
  /**
   * The name of this intent
   */
  name: string,
  
  /**
   * A list of strings identifying what the user wants
   */
  intents: string[],
  
  /**
   * The bots response for this intent
   */
  response: string,

  /**
   * Flag which identifies this intent as a question
   */
  isQuestion: boolean,

  /**
   * The chapter of the intent
   */
  chapter?: number | null
}
