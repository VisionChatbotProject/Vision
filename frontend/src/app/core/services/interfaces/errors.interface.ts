
/** ErrorMessages
 * A collection of generic, localized error messages, suitable for use with backend responses.
 * 
 */
export class ErrorMessages {
  /** unknown_error
   * A localized error string denoting an unknown error from the backend.
   */
  public static unknown_error : string = 
    $localize`:UnknownError|An unknown Error response from the backend@@smartauthoring.generic.errors:An unknown error has occurred`;
}

export class SmartAuthoringBackendError extends Error {

  public get code(): number { return this._code; }
  public get message(): string { return this._message; }

  constructor(
    private _code: number,
    private _message: string,

  ) {
    super();
  }
}