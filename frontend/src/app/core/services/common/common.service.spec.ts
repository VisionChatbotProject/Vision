import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { CommonService } from './common.service';

describe('BackendCommonService', () => {
  let service: CommonService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(CommonService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve a blob', doneCallback => {
    const url: string = 'http://testurl.com/someContent.html';
    const data: Blob = new Blob(['content']);

    service.getBlob(url).subscribe(
      data => {
        expect(data).toEqual(data);
        doneCallback();
      }
    );

    const testRequest = httpTestingController.expectOne(url)
    expect(testRequest.request.method).toEqual('GET');
    testRequest.flush(data);
  });
});
