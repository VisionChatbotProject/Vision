import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Editor } from 'grapesjs';
import { Observable, of, ReplaySubject, Subject } from 'rxjs';
import { EEditorState, IEditorContext } from '../../interfaces/common.interface';
import { GrapesManagerService } from '../../services/grapes-manager/grapes-manager.service';

import { HolderComponent } from './holder.component';


describe('HolderComponent', () => {
  let component: HolderComponent;
  let fixture: ComponentFixture<HolderComponent>;
  let service: GrapesManagerService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HolderComponent],
      providers: [
        { provide: GrapesManagerService, useValue: new GrapesManagerService()}
      ]

    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HolderComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(GrapesManagerService);

    service.onLoad = jasmine.createSpy('');
    service.onStore = jasmine.createSpy('').and.callFake( (keys: string[], successCallback: (result: any) => any, errorCallback: (error: any) => any) => { successCallback(true); });
    service.onAssetsRequested = jasmine.createSpy('').and.returnValue(['']);
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load contents when the context changes', () => {    
    service.setEditorContext({});
    
    expect(service.onLoad).toHaveBeenCalled();
  });

  it('should request assets when the context changes', () => {    
    service.setEditorContext({});
    
    expect(service.onAssetsRequested).toHaveBeenCalled();
  });

  it('should store contents if requested', () => {    
    const editor: Editor = component['_editor']!;
    editor.setComponents('foo');

    const editorSpy = spyOn(editor, 'store').and.callThrough();
    
    service.requestSave();
   
    expect(editorSpy).toHaveBeenCalled();
    expect(service.onStore).toHaveBeenCalled();
  });

  it('should set a clean state after storing', () => {    
    const editor: Editor = component['_editor']!;
    editor.setComponents('foo');

    const editorSpy = spyOn(editor, 'store').and.callThrough();
    const editorState = spyOn(service, 'setEditorState');
    
    service.requestSave();
    
    expect(editorSpy).toHaveBeenCalled();
    expect(editorState).toHaveBeenCalledOnceWith(EEditorState.eClean);
  });

  it('should set a dirty state after modifying contents', () => {    
    const editor: Editor = component['_editor']!;
    const editorState = spyOn(service, 'setEditorState');
    
    editor.trigger('update');
    
    expect(editorState).toHaveBeenCalledOnceWith(EEditorState.eDirty);
  });

});
