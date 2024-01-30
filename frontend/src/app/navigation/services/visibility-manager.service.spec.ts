import { TestBed } from '@angular/core/testing';

import { EVisibilityStatus, VisibilityManagerService } from './visibility-manager.service';

describe('VisibilityManagerService', () => {
  let service: VisibilityManagerService;
  const TIMEOUT : number = 50;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers : [VisibilityManagerService]
    });
    service = TestBed.inject(VisibilityManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should emit correctly when changing visibility', doneCallback  => {
    
    let state : EVisibilityStatus = EVisibilityStatus.eShown
    service.sidebarVisibilityChanged$.subscribe(
      value => {
        expect(value).toEqual(EVisibilityStatus.eHidden);
        expect(value).toEqual(service.sidebarVisibility);
        doneCallback();
      }
    );

    service.sidebarVisibility = EVisibilityStatus.eHidden;
  }, TIMEOUT);

});


