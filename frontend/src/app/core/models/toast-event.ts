import { EventTypes } from './event-types';

export interface ToastEvent {
  type: EventTypes;
  title: string;
  message: string;
}

export class ToastStrings {
  public static success_header: string = 
    $localize`:SuccessHeader|Default string to be used for 'success' toasts@@smartauthoring.generic.headers:Success!`;

  public static info_header: string = 
    $localize`:InfoHeader|Default string to be used for 'info' toasts@@smartauthoring.generic.headers:Info`;

  public static warning_header: string = 
    $localize`:WarningHeader|Default string to be used for 'warning' toasts@@smartauthoring.generic.headers:Warning`;

  public static error_header: string = 
    $localize`:ErrorHeader|Default string to be used for 'error' toasts@@smartauthoring.generic.headers:Error!`;
}