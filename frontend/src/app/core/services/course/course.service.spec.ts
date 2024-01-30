import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { IAsset, IAssetSource } from 'src/app/core/models/base';
import { ICourse, ICourseBase } from 'src/app/core/models/course';
import { IOrganization } from 'src/app/core/models/organization';
import { environment } from 'src/environments/environment';
import { dummyCourse, dummyCourses, dummyExams, dummyTasks, dummyIntents, dummyOrganizations } from 'src/testutils/object-mocks';
import { buildErrorMessage, handlesError, hasErrorHandler } from 'src/testutils/utils';
import { ErrorMessages } from '../interfaces/errors.interface';

import { CourseService } from './course.service';

describe('BackendCourseService', () => {
  const TIMEOUT: number = 50;
  const errorMessage: string = 'some failure';

  let service: CourseService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(CourseService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Course', () => {

    it('should retrieve a course', doneCallback => {

      service.getCourse(dummyCourse.id).subscribe(
        course => {
          expect(course).toEqual(dummyCourse);
          doneCallback();
        }
      );
  
      const testRequest = httpTestingController.expectOne(`${environment.apiUrl}/courses/1`)
      expect(testRequest.request.method).toEqual('GET');
      testRequest.flush(dummyCourse);
  
    }, TIMEOUT);
  
    it('should retrieve all courses', doneCallback => {
  
      service.getCourses({ id: 1 } as IOrganization).subscribe(
        courses => {
          expect(courses).toEqual(dummyCourses);
          doneCallback();
        }
      );
  
      const testRequest = httpTestingController.expectOne(`${environment.apiUrl}/organizations/1/courses`)
      expect(testRequest.request.method).toEqual('GET');
      testRequest.flush(dummyCourses);
  
    }, TIMEOUT);
  
    it('should add courses', doneCallback => {
      let course: ICourseBase = {
        longDescription: 'test',
        shortDescription: 'test short',
        name: 'course name',
        image: '',
        teacherName: "test teacher",
        teacherEmail: "teach@smartauthoring.com",
        courseBeginDate: "2023-02-05T09:00:00",
        courseEndDate: "2023-02-05T09:00:00",
        materials: "some materials",
        ressources: "https://smartauthoring.com/test.pdf",
      }
  
      service.addCourse({ id: 1 } as IOrganization, course).subscribe(
        courses => {
          expect(courses).toEqual(dummyCourse);
          doneCallback();
        }
      );
  
      const testRequest = httpTestingController.expectOne(`${environment.apiUrl}/organizations/1/courses`)
      expect(testRequest.request.method).toEqual('POST');
      testRequest.flush(dummyCourse);
  
    }, TIMEOUT);
  
    it('should modify courses', doneCallback => {
      let course: ICourse = {
        longDescription: 'test',
        shortDescription: 'test short',
        name: 'course name',
        id: 1,
        createdBy: -1,
        image: '',
        teacherName: "test teacher",
        teacherEmail: "teach@smartauthoring.com",
        courseBeginDate: "2023-02-05T09:00:00",
        courseEndDate: "2023-02-05T09:00:00",
        materials: "some materials",
        ressources: "https://smartauthoring.com/test.pdf",
      }
  
      service.modifyCourse(course).subscribe(
        courses => {
          expect(courses).toEqual(course);
          doneCallback();
        }
      );
  
      const testRequest = httpTestingController.expectOne(`${environment.apiUrl}/courses/${course.id}`)
      expect(testRequest.request.method).toEqual('PUT');
      testRequest.flush(course);
  
    }, TIMEOUT);
  
    it('should delete courses', doneCallback => {
      let course: ICourse = {
        longDescription: 'test',
        shortDescription: 'test short',
        name: 'course name',
        id: 1,
        createdBy: -1,
        image: '',
        teacherName: "test teacher",
        teacherEmail: "teach@smartauthoring.com",
        courseBeginDate: "2023-02-05T09:00:00",
        courseEndDate: "2023-02-05T09:00:00",
        materials: "some materials",
        ressources: "https://smartauthoring.com/test.pdf",
      }
  
      service.deleteCourse(course).subscribe(
        courses => {
          expect(courses).toEqual(course);
          doneCallback();
        }
      );
  
      const testRequest = httpTestingController.expectOne(`${environment.apiUrl}/courses/${course.id}`)
      expect(testRequest.request.method).toEqual('DELETE');
      testRequest.flush(course);
  
    }, TIMEOUT);
  
    it('should retrieve course assets', doneCallback => {
      const expectedAssets: IAssetSource[] = [
        { file: 'http://assertUrl1', },
        { file: 'http://assertUrl1', },
        { file: 'http://assertUrl1', }
      ]
      service.getCourseAssets(dummyCourse).subscribe(
        assets => {
          expect(assets).toEqual(expectedAssets);
          doneCallback();
        }
      );
  
      const testRequest = httpTestingController.expectOne(`${environment.apiUrl}/courses/${dummyCourse.id}/store`)
      expect(testRequest.request.method).toEqual('GET');
      testRequest.flush(expectedAssets);
  
    }, TIMEOUT);
  
    it('should add course assets', doneCallback => {
      const expectedAsset: IAssetSource = { file: 'http://assertUrl1', };
      const blob = new Blob(['test']);
      const addedAsset: IAsset = { file: blob }
      service.addCourseAsset(dummyCourse, addedAsset).subscribe(
        asset => {
          expect(asset).toEqual(expectedAsset);
          doneCallback();
        }
      );
  
      const testRequest = httpTestingController.expectOne(`${environment.apiUrl}/courses/${dummyCourse.id}/store`)
      expect(testRequest.request.method).toEqual('POST');
      testRequest.flush(expectedAsset);
  
    }, TIMEOUT);


    it('should get performance', doneCallback => {
      let course: ICourse = {
        longDescription: 'test',
        shortDescription: 'test short',
        name: 'course name',
        id: 1,
        createdBy: -1,
        image: '',
        teacherName: "test teacher",
        teacherEmail: "teach@smartauthoring.com",
        courseBeginDate: "2023-02-05T09:00:00",
        courseEndDate: "2023-02-05T09:00:00",
        materials: "some materials",
        ressources: "https://smartauthoring.com/test.pdf",
      }
  
      service.performanceCourse(course).subscribe(
        number => {
          expect(number).toEqual(-1);
          doneCallback();
        }
      );
  
      const testRequest = httpTestingController.expectOne(environment.apiUrl + '/courses/' + course.id + '/performance')
      expect(testRequest.request.method).toEqual('GET');
      testRequest.flush(-1);
  
    }, TIMEOUT);
  
    // Error handler testcases
    it('error handler should handle "unknown" errors  gracefully', doneCallback => {
      const errorResponse = buildErrorMessage('some unknown key', errorMessage);
      handlesError(service.getCourses({ id: 1 } as IOrganization), httpTestingController, doneCallback, errorResponse, ErrorMessages.unknown_error);
    }, TIMEOUT);
  
    it('getCourse should have an error handler attached', doneCallback => {
      hasErrorHandler(service.getCourse(1), httpTestingController, doneCallback);
    }, TIMEOUT);
  
    it('getCourses should have an error handler attached', doneCallback => {
      hasErrorHandler(service.getCourses({ id: 1 } as IOrganization), httpTestingController, doneCallback);
    }, TIMEOUT);
  
    it('addCourse should have an error handler attached', doneCallback => {
      hasErrorHandler(service.addCourse({ id: 1 } as IOrganization, {} as ICourseBase), httpTestingController, doneCallback);
    }, TIMEOUT);
  
    it('modifyCourse should have an error handler attached', doneCallback => {
      hasErrorHandler(service.modifyCourse({ id: 1 } as ICourse), httpTestingController, doneCallback);
    }, TIMEOUT);
  
    it('deleteCourse should have an error handler attached', doneCallback => {
      hasErrorHandler(service.deleteCourse({ id: 1 } as ICourse), httpTestingController, doneCallback);
    }, TIMEOUT);
  
    it('getCourseAssets should have an error handler attached', doneCallback => {
      hasErrorHandler(service.getCourseAssets({ id: 1 } as ICourse), httpTestingController, doneCallback);
    }, TIMEOUT);
  
    it('addCourseAsset should have an error handler attached', doneCallback => {
      hasErrorHandler(service.addCourseAsset({ id: 1 } as ICourse, {} as IAsset), httpTestingController, doneCallback);
    }, TIMEOUT);
    
    it('performanceCourse should have an error handler attached', doneCallback => {
      hasErrorHandler(service.performanceCourse({ id: 1 } as ICourse), httpTestingController, doneCallback);
    }, TIMEOUT);  

  });

  describe('Exams', () => {

    it('should retrieve all exams', doneCallback => {
  
      service.getExams({ id: 1 } as ICourse).subscribe(
        exams => {
          expect(exams).toEqual(dummyExams);
          doneCallback();
        }
      );
  
      const testRequest = httpTestingController.expectOne(`${environment.apiUrl}/courses/1/exams`)
      expect(testRequest.request.method).toEqual('GET');
      testRequest.flush(dummyExams);
  
    }, TIMEOUT);
  
    it('should add exams', doneCallback => {  
      service.addExam({ id: dummyCourse.id } as ICourse, dummyExams[0]).subscribe(
        exam => {
          expect(exam).toEqual(dummyExams[0]);
          doneCallback();
        }
      );
  
      const testRequest = httpTestingController.expectOne(`${environment.apiUrl}/courses/${dummyCourse.id}/exams`)
      expect(testRequest.request.method).toEqual('POST');
      testRequest.flush(dummyExams[0]);
  
    }, TIMEOUT);
  

    it('should modify exams', doneCallback => {
      service.modifyExam(dummyExams[0]).subscribe(
        exams => {
          expect(exams).toEqual(dummyExams[0]);
          doneCallback();
        }
      );
  
      const testRequest = httpTestingController.expectOne(`${environment.apiUrl}/courseExams/${dummyExams[0].id}`)
      expect(testRequest.request.method).toEqual('PUT');
      testRequest.flush(dummyExams[0]);
  
    }, TIMEOUT);

    it('should delete exams', doneCallback => {
      service.deleteExam(dummyExams[0]).subscribe(
        exams => {
          expect(exams).toEqual(dummyExams[0]);
          doneCallback();
        }
      );
  
      const testRequest = httpTestingController.expectOne(`${environment.apiUrl}/courseExams/${dummyExams[0].id}`)
      expect(testRequest.request.method).toEqual('DELETE');
      testRequest.flush(dummyExams[0]);
  
    }, TIMEOUT);

  });


  
  describe('Tasks', () => {

    it('should retrieve all tasks', doneCallback => {
  
      service.getTasks({ id: 1 } as ICourse).subscribe(
        tasks => {
          expect(tasks).toEqual(dummyTasks);
          doneCallback();
        }
      );
  
      const testRequest = httpTestingController.expectOne(`${environment.apiUrl}/courses/1/tasks`)
      expect(testRequest.request.method).toEqual('GET');
      testRequest.flush(dummyTasks);
  
    }, TIMEOUT);
  
    it('should add tasks', doneCallback => {  
      service.addTask({ id: dummyCourse.id } as ICourse, dummyTasks[0]).subscribe(
        task => {
          expect(task).toEqual(dummyTasks[0]);
          doneCallback();
        }
      );
  
      const testRequest = httpTestingController.expectOne(`${environment.apiUrl}/courses/${dummyCourse.id}/tasks`)
      expect(testRequest.request.method).toEqual('POST');
      testRequest.flush(dummyTasks[0]);
  
    }, TIMEOUT);
  

    it('should modify tasks', doneCallback => {
      service.modifyTask(dummyTasks[0]).subscribe(
        tasks => {
          expect(tasks).toEqual(dummyTasks[0]);
          doneCallback();
        }
      );
  
      const testRequest = httpTestingController.expectOne(`${environment.apiUrl}/courseTasks/${dummyTasks[0].id}`)
      expect(testRequest.request.method).toEqual('PUT');
      testRequest.flush(dummyTasks[0]);
  
    }, TIMEOUT);

    it('should delete tasks', doneCallback => {
      service.deleteTask(dummyTasks[0]).subscribe(
        tasks => {
          expect(tasks).toEqual(dummyTasks[0]);
          doneCallback();
        }
      );
  
      const testRequest = httpTestingController.expectOne(`${environment.apiUrl}/courseTasks/${dummyTasks[0].id}`)
      expect(testRequest.request.method).toEqual('DELETE');
      testRequest.flush(dummyTasks[0]);
  
    }, TIMEOUT);

  });

  describe('Intents', () => {

    it('should retrieve all intent', doneCallback => {
  
      service.getIntents({ id: 1 } as ICourse).subscribe(
        intents => {
          expect(intents).toEqual(dummyIntents);
          doneCallback();
        }
      );
  
      const testRequest = httpTestingController.expectOne(`${environment.apiUrl}/courses/1/intents`)
      expect(testRequest.request.method).toEqual('GET');
      testRequest.flush(dummyIntents);
  
    }, TIMEOUT);
  
    it('should add intent', doneCallback => {  
      service.addIntent({ id: dummyCourse.id } as ICourse, dummyIntents[0]).subscribe(
        intent => {
          expect(intent).toEqual(dummyIntents[0]);
          doneCallback();
        }
      );
  
      const testRequest = httpTestingController.expectOne(`${environment.apiUrl}/courses/${dummyCourse.id}/intents`)
      expect(testRequest.request.method).toEqual('POST');
      testRequest.flush(dummyIntents[0]);
  
    }, TIMEOUT);
  

    it('should modify intent', doneCallback => {
      service.modifyIntent(dummyIntents[0]).subscribe(
        intent => {
          expect(intent).toEqual(dummyIntents[0]);
          doneCallback();
        }
      );
  
      const testRequest = httpTestingController.expectOne(`${environment.apiUrl}/courseIntents/${dummyIntents[0].id}`)
      expect(testRequest.request.method).toEqual('PUT');
      testRequest.flush(dummyIntents[0]);
  
    }, TIMEOUT);

    it('should delete intent', doneCallback => {
      service.deleteIntent(dummyIntents[0]).subscribe(
        intent => {
          expect(intent).toEqual(dummyIntents[0]);
          doneCallback();
        }
      );
  
      const testRequest = httpTestingController.expectOne(`${environment.apiUrl}/courseIntents/${dummyIntents[0].id}`)
      expect(testRequest.request.method).toEqual('DELETE');
      testRequest.flush(dummyIntents[0]);
  
    }, TIMEOUT);

  });

  describe('Others', () => {

    xit('should call trainCourse', doneCallback => {
  
      service.trainCourse({ id: dummyCourse.id } as ICourse).subscribe(
        _ => {
          doneCallback();
        }
      );
  
      const testRequest = httpTestingController.expectOne(`${environment.apiUrl}/courses/${dummyCourse.id}/train`)
      expect(testRequest.request.method).toEqual('GET');
  
    }, TIMEOUT);

  });

});
