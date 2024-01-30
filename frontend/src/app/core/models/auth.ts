/**
 * A token response from the backend
 */
export interface IToken {
  /**
   * The key as string
   */
  key: string
}


/**
 * A login request for the backend authentication
 */
export interface ILoginRequest {

  /**
   * The email adress
   */
  email: string,

  /**
   * The password
   */
  password: string
}


/**
 * A signup request for backend registration
 */
export interface ISignupRequest {

  /**
   * The email adress
   */
  email: string,

  /**
   * The password
   */
  password1: string

  /**
   * The password (again)
   */
  password2: string

  /**
   * The firstName of the new user
   */
  firstName: string

  /**
   * The lastName of the new user
   */
  lastName: string
}


/**
 * A confirm email request for the backend
 */
export interface IConfirmEmailRequest {
  /**
   * The key which associates a registered user with an unverified mail adress
   */
  key: string
}



/**
 * A password reset request for backend password reset
 */
export interface IPasswordResetRequest {
  /**
   * The email adress for which to reset the password
   */
  email: string
}


/**
 * A password reset for backend password reset
 */
 export interface IConfirmPasswordResetRequest {
  
  /**
   * The uid from the url
   */
  uid: string

  /**
   * The token from the url
   */
  token: string

  /**
   * The new password
   */
  new_password1: string

  /**
   * The new password (again)
   */
  new_password2: string
}