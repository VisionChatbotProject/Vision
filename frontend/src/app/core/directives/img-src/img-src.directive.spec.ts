import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { authoringApiServiceMock } from 'src/testutils/service-mocks';
import { getHTMLElement } from 'src/testutils/utils';
import { AuthoringApiService } from '../../services/authoringApi/authoring-api.service';
import { ImgSrcDirective } from './img-src.directive';

const default_url = 'http://default.com/image.jpg';

@Component({ template: '<img [imgSrc]="url">' })
class HostComponent { public url: string = null as any as string; }

@Component({ template: '<img [defaultUrl]="default" [imgSrc]="url">' })
class HostComponentWDefault { public url: string = null as any as string; public default: string = default_url; }

describe('ImgSrcDirective', () => {
  
  describe('ImgSrcDirective w/o default', () => {
    let fixture: ComponentFixture<HostComponent>;
    let component: HostComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        declarations: [ImgSrcDirective, HostComponent],
        providers: [{
          provide: AuthoringApiService, useValue: authoringApiServiceMock
        }]
      }).compileComponents();

      fixture = TestBed.createComponent(HostComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should show standard default image if null is passed', () => {
      expect(getHTMLElement(fixture, 'img').src).toContain(ImgSrcDirective.DEFAULT_ASSET_URL);
    });

    it('should show a given image if it is passed', () => {
      const url: string = 'http://sample.com/image.png'
      component.url = url;

      fixture.detectChanges();

      expect(getHTMLElement(fixture, 'img').src.startsWith('blob:http://')).toBeTrue();
    });
  });

  describe('ImgSrcDirective with default', () => {
    let fixture: ComponentFixture<HostComponentWDefault>;
    let component: HostComponentWDefault;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        declarations: [ImgSrcDirective, HostComponentWDefault],
        providers: [{
          provide: AuthoringApiService, useValue: authoringApiServiceMock
        }]
      }).compileComponents();

      fixture = TestBed.createComponent(HostComponentWDefault);
      component = fixture.componentInstance;
      fixture.detectChanges();
      
    });

    it('should show a given default image if it is passed', () => {
      component.url = null as any as string;
      fixture.detectChanges();

      expect(getHTMLElement(fixture, 'img').src).toContain(default_url);
    });
  });
});