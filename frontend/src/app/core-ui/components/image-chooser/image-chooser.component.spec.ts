import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ImgSrcDirective } from 'src/app/core/directives/img-src/img-src.directive';
import { AuthoringApiService } from 'src/app/core/services/authoringApi/authoring-api.service';
import { authoringApiServiceMock } from 'src/testutils/service-mocks';
import { clickElement, getHTMLElement } from 'src/testutils/utils';

import { IImage, ImageChooserComponent } from './image-chooser.component';

describe('ImageChooserComponent', () => {
  let component: ImageChooserComponent;
  let fixture: ComponentFixture<ImageChooserComponent>;  
  const data: Blob = new Blob();
  const dataUrl = URL.createObjectURL(data);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ImageChooserComponent, ImgSrcDirective],
      imports: [HttpClientTestingModule],
      providers: [
        { provide: AuthoringApiService, useValue: authoringApiServiceMock }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    authoringApiServiceMock.commonService.getBlob.and.returnValue(of(data))
    fixture = TestBed.createComponent(ImageChooserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show a default image if none is provided', () => {
    expect(getHTMLElement(fixture, 'img').src.startsWith('blob:http://')).toBeTrue();
  });

  it('should accept an image and display it', () => {
    const image: IImage = { data: new Blob(), url: 'http://wwww.test.com/image.png'}
    component.image = image;
    fixture.detectChanges();

    expect(getHTMLElement(fixture, 'img').src.startsWith('blob:http://')).toBeTrue();
  });

  it('should upload image files and update the view', () => {
    const onChangeSpy = spyOn(component, 'onChange').and.callThrough();
    const dataTransfer = new DataTransfer();
    const file: File = new File(['someFile'], 'testFile.png');
    dataTransfer.items.add(file)

    const input  = getHTMLElement(fixture, 'input[type=file]');
    input.files = dataTransfer.files;

    input.dispatchEvent(new InputEvent('change'));

    fixture.detectChanges();

    expect(onChangeSpy).toHaveBeenCalled();
    expect(getHTMLElement(fixture, 'img').src.startsWith('blob:http://')).toBeTrue();
  });

  it('should upload image files when the image is clicked', () => {
    const onChangeSpy = spyOn(component, 'onChange');
    const input  = getHTMLElement(fixture, 'input[type=file]');
   
    clickElement(fixture, 'img');
    input.dispatchEvent(new InputEvent('change'));

    fixture.detectChanges();

    expect(onChangeSpy).toHaveBeenCalled();
  });
});
