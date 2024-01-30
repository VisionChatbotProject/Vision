import { NgModule } from "@angular/core";
import { FaIconLibrary, FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";

@NgModule({
  imports: [FontAwesomeModule],
  exports: [FontAwesomeModule],
})
export class FontAwesomeIconsModuleMock {
  constructor(library: FaIconLibrary) {
    library.addIconPacks(fas, far);
  }
}

export interface IRouterSpy {
  navigate : jasmine.Spy<jasmine.Func>
}

export function createRouterSpy() : IRouterSpy {
  return  {
    navigate: jasmine.createSpy('navigate')
  }
}

export const domSanitizerMock = jasmine.createSpyObj('DomSanitizer', ['sanitize', 'bypassSecurityTrustUrl']);