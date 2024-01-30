import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import { NgbCollapse, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { AuthoringApiService } from 'src/app/core/services/authoringApi/authoring-api.service';
import { createRouterSpy, IRouterSpy } from 'src/testutils/built-in-mocks';
import { dummyOrganization, dummyOrganizationMembership } from 'src/testutils/object-mocks';
import { authoringApiServiceMock, createVisibilityManagerServiceMock, VisibilityManagerServiceMock } from 'src/testutils/service-mocks';
import { clickElement, getHTMLElement, spyOnGetter } from 'src/testutils/utils';
import { EVisibilityStatus, VisibilityManagerService } from '../../services/visibility-manager.service';

import { TopbarHolderComponent } from './topbar-holder.component';

declare const viewport: { reset: () => void; set: (arg0: string) => void; };

describe('TopbarHolderComponent', () => {
  let component: TopbarHolderComponent;
  let fixture: ComponentFixture<TopbarHolderComponent>;
  let router : IRouterSpy; 
  let visibilityServiceManagerMock: VisibilityManagerServiceMock;

  beforeEach(async() => {
    

    router = createRouterSpy();
    visibilityServiceManagerMock = createVisibilityManagerServiceMock();
    
    await TestBed.configureTestingModule({
      declarations: [TopbarHolderComponent, NgbCollapse],
      imports: [NgbDropdownModule],
      providers : [
        { provide: AuthoringApiService, useValue: authoringApiServiceMock }, 
        { provide: Router, useValue: router },
        { provide: VisibilityManagerService, useValue: visibilityServiceManagerMock }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    spyOnGetter(authoringApiServiceMock.contextService, 'activeOrganization$').and.returnValue(of(dummyOrganization));
    spyOnGetter(authoringApiServiceMock.contextService, 'self').and.returnValue(dummyOrganizationMembership);
    fixture = TestBed.createComponent(TopbarHolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    viewport.reset();
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not show the collapse buttons on wide screens', waitForAsync(() => {
    viewport.set('lg');
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      let topbarButton = getHTMLElement(fixture, '#btn-topnav-collapse');
      let sidebarButton = getHTMLElement(fixture, '#btn-sidenav-collapse');
      expect(getComputedStyle(topbarButton).display).toEqual('none');
      expect(getComputedStyle(sidebarButton).display).toEqual('none');
    })
  }));

  it('should show the collapse buttons on small screens', waitForAsync(() => {
    viewport.set('sm');
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      let topbarButton = getHTMLElement(fixture, '#btn-topnav-collapse');
      let sidebarButton = getHTMLElement(fixture, '#btn-sidenav-collapse');
      expect(getComputedStyle(topbarButton).display).toEqual('block');
      expect(getComputedStyle(sidebarButton).display).toEqual('block');
    })
  }));

  it('should collapse the topbar on small screens by default', waitForAsync(() => {
    viewport.set('sm');
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      let button = getHTMLElement(fixture, '#collapsable-div');
      expect(getComputedStyle(button).display).toEqual('none');
    })
  }));

  it('should not collapse the topbar on large screens by default', waitForAsync(() => {
    viewport.set('lg');
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      let div = getHTMLElement(fixture, '#collapsable-div');
      expect(getComputedStyle(div).display).toEqual('flex');
    })
  }));

  it('should uncollapse the topbar on small screens at button click', waitForAsync(() => {
    let spy = spyOnProperty(component, 'isTopbarCollapsed', 'set').and.callThrough();
    viewport.set('sm');
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      clickElement(fixture, '#btn-topnav-collapse');
      fixture.detectChanges();
      expect(spy).toHaveBeenCalled();
    })
  }));

  it('should logout and redirect to login on button click', waitForAsync(() => {
    authoringApiServiceMock.authService.logout.and.returnValue(of({'detail' : 'Successfully logged out' }));
    fixture.whenStable().then(() => {
      clickElement(fixture, '#btn-logout');
      expect(authoringApiServiceMock.contextService.clearOrganization).toHaveBeenCalled();
      expect(authoringApiServiceMock.authService.logout).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    })
  }));

  it('should set the collapsed state of the sidebar when clicked', waitForAsync(() => {
        
    fixture.whenStable().then(() => {
      let sideBarVisibilityGetSpy = spyOnProperty(visibilityServiceManagerMock, 'sidebarVisibility', 'get');
      let sideBarVisibilitySetSpy = spyOnProperty(visibilityServiceManagerMock, 'sidebarVisibility', 'set');
      sideBarVisibilityGetSpy.and.returnValue(EVisibilityStatus.eShown);

      let toggleSidebar = spyOn(component, 'toggleSidebar').and.callThrough();
      clickElement(fixture, '#btn-sidenav-collapse');
      expect(toggleSidebar).toHaveBeenCalledTimes(1);
      expect(sideBarVisibilitySetSpy).toHaveBeenCalledOnceWith(EVisibilityStatus.eHidden);
    })
  }));
});
