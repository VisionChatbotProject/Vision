import { Directive, EventEmitter, Output } from '@angular/core';

@Directive({
  selector: 'imgSrc',
})
export class ImgSrcDirectiveMock {}

@Directive({
  selector: 'confirm',
})
export class ConfirmDirectiveMock {
  @Output() public confirm: EventEmitter<void> = new EventEmitter<void>();
  @Output() public reject: EventEmitter<void> = new EventEmitter<void>();
}