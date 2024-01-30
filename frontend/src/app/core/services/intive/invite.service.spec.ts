import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { IInviteBase } from 'src/app/core/models/invite';
import { IOrganization } from 'src/app/core/models/organization';
import { environment } from 'src/environments/environment';
import { dummyInvites } from 'src/testutils/object-mocks';
import { buildErrorMessage, handlesError, hasErrorHandler } from 'src/testutils/utils';
import { ErrorMessages } from '../interfaces/errors.interface';

import { InviteService } from './invite.service';

describe('InviteService', () => {
  const TIMEOUT: number = 50;
  const errorMessage: string = 'some failure';

  let service: InviteService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(InviteService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve invites', doneCallback => {
    service.getInvites({ id: 1 } as IOrganization).subscribe(
      invites => {
        expect(invites).toEqual(dummyInvites);
        doneCallback();
      }
    );

    const testRequest = httpTestingController.expectOne(`${environment.apiUrl}/invite/1`)
    expect(testRequest.request.method).toEqual('GET');
    testRequest.flush(dummyInvites);

  }, TIMEOUT);

  it('should add invite', doneCallback => {
    let invite: IInviteBase = {
      email: 'john-doe@test.com',
      firstName: 'John',
      lastName: 'Doe',
      role: 1
    }

    service.addInvite({ id: 1 } as IOrganization, invite).subscribe(
      courses => {
        expect(courses).toEqual(dummyInvites[0]);
        doneCallback();
      }
    );

    const testRequest = httpTestingController.expectOne(`${environment.apiUrl}/invite/1`)
    expect(testRequest.request.method).toEqual('POST');
    testRequest.flush(dummyInvites[0]);

  }, TIMEOUT);

  // Error handler testcases
  it('error handler should handle "unknown" errors  gracefully', doneCallback => {
    const errorResponse = buildErrorMessage('some unknown key', errorMessage);
    handlesError(service.getInvites({ id: 1 } as IOrganization), httpTestingController, doneCallback, errorResponse, ErrorMessages.unknown_error);
  }, TIMEOUT);

  it('getInvites should have an error handler attached', doneCallback => {
    hasErrorHandler(service.getInvites({ id: 1 } as IOrganization), httpTestingController, doneCallback);
  }, TIMEOUT);

  it('addInvite should have an error handler attached', doneCallback => {
    hasErrorHandler(service.addInvite({ id: 1 } as IOrganization, {} as IInviteBase), httpTestingController, doneCallback);
  }, TIMEOUT);

});
