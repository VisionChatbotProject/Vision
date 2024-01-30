import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthoringApiService } from 'src/app/core/services/authoringApi/authoring-api.service';
import { authoringApiServiceMock } from 'src/testutils/service-mocks';

import { OrganizationPreviewComponent } from './organization-preview.component';
import { FontAwesomeIconsModuleMock } from 'src/testutils/built-in-mocks';

describe('OrganizationPreviewComponent', () => {
  let component: OrganizationPreviewComponent;
  let fixture: ComponentFixture<OrganizationPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrganizationPreviewComponent ],
      imports: [ FontAwesomeIconsModuleMock ],
      providers: [
        { provide: AuthoringApiService, useValue: authoringApiServiceMock }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
