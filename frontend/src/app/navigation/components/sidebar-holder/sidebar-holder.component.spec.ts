import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { createVisibilityManagerServiceMock, VisibilityManagerServiceMock } from 'src/testutils/service-mocks';
import { EVisibilityStatus, VisibilityManagerService } from '../../services/visibility-manager.service';

import { SidebarHolderComponent } from './sidebar-holder.component';

describe('SidebarHolderComponent', () => {
  let component: SidebarHolderComponent;
  let fixture: ComponentFixture<SidebarHolderComponent>;
  let visibilityServiceManagerMock : VisibilityManagerServiceMock;

  beforeEach(async () => {

    visibilityServiceManagerMock = createVisibilityManagerServiceMock();

    await TestBed.configureTestingModule({
      declarations: [SidebarHolderComponent],
      imports: [NgbCollapseModule, RouterTestingModule],
      providers : [
        { provide: VisibilityManagerService, useValue : visibilityServiceManagerMock }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarHolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should change the collapse state of the sidebar', waitForAsync(() => {
    visibilityServiceManagerMock.sidebarVisibilityChanged.next(EVisibilityStatus.eShown);
    fixture.whenStable().then(() => {
      expect(component.isSidebarCollapsed).toEqual(false);
    })
  }));

});
