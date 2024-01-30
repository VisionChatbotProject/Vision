import { TestBed } from '@angular/core/testing';
import { EventTypes } from '../../models/event-types';
import { ToastService } from './toast.service';

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToastService);
  });

  it('should be created', (done) => {
    expect(service).toBeTruthy();
    done();
  })
  
  it('should fire success toast event', (done) => {
    const title = 'some title for success toast';
    const message = 'some message for success toast';

    service.toastEvents.subscribe((event) => {
      expect(event).toEqual({ type: EventTypes.Success, title, message });
      done();
    });

    service.showSuccessToast(title, message);
  });

  it('should fire info toast event', (done) => {
    const title = 'some title for info toast';
    const message = 'some message for info toast';

    service.toastEvents.subscribe((event) => {
      expect(event).toEqual({ type: EventTypes.Info, title, message });
      done();
    });
    service.showInfoToast(title, message);
  });

  it('should fire warning toast event', (done) => {
    const title = 'some title for warning toast';
    const message = 'some message for warning toast';

    service.toastEvents.subscribe((event) => {
      expect(event).toEqual({ type: EventTypes.Warning, title, message });
      done();
    });

    service.showWarningToast(title, message);
  });

  it('should fire error toast event', (done) => {
    const title = 'some title for error toast';
    const message = 'some message for error toast';

    service.toastEvents.subscribe((event) => {
      expect(event).toEqual({ type: EventTypes.Error, title, message });
      done();
    });

    service.showErrorToast(title, message);
  });
});
