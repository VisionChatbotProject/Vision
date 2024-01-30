import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterOutlet } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { IOrganization } from 'src/app/core/models/organization';
import { AuthoringApiService } from 'src/app/core/services/authoringApi/authoring-api.service';
import { OrganizationCheckComponentMock, SidebarMock, TopbarMock } from 'src/testutils/component-mocks';
import { dummyOrganization } from 'src/testutils/object-mocks';
import { authoringApiServiceMock } from 'src/testutils/service-mocks';
import { getHTMLElement, spyOnGetter } from 'src/testutils/utils';

import { HolderComponent } from './holder.component';

describe('HolderComponent', () => {
  let component: HolderComponent;
  let fixture: ComponentFixture<HolderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HolderComponent, TopbarMock, SidebarMock, OrganizationCheckComponentMock],
      imports : [RouterTestingModule],
      providers: [
        { provide: AuthoringApiService, useValue: authoringApiServiceMock }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    
  });

  it('should create', () => {
    spyOnGetter(authoringApiServiceMock.contextService, 'activeOrganization$').and.returnValue(of(dummyOrganization as IOrganization));

    fixture = TestBed.createComponent(HolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should show the router outlet as soon as an organization is set', () => {
    spyOnGetter(authoringApiServiceMock.contextService, 'activeOrganization$').and.returnValue(of(dummyOrganization as IOrganization));
    
    fixture = TestBed.createComponent(HolderComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();

    const router = getHTMLElement(fixture, 'router-outlet');
    
    expect(router).toBeTruthy();
  });

  it('should not show the router outlet if no organization is set', () => {
    
    spyOnGetter(authoringApiServiceMock.contextService, 'activeOrganization$').and.returnValue(of());
    
    fixture = TestBed.createComponent(HolderComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();

    const router = getHTMLElement(fixture, 'router-outlet');
    
    expect(router).toEqual(null);
  });
});
