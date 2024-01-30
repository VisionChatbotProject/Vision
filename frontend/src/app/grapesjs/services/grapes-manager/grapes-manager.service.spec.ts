import { TestBed } from '@angular/core/testing';
import { EEditorState } from '../../interfaces/common.interface';

import { GrapesManagerService } from './grapes-manager.service';

describe('GrapesManagerService', () => {
  let service: GrapesManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GrapesManagerService] // we need to provide the service because it is not root provided
    });
    service = TestBed.inject(GrapesManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should emit the new editor context, if set', (done) => {
    
    service.editorContextChanged$.subscribe(
      context => {
        expect(context).toEqual({});
        done();
      }
    );

    service.setEditorContext({});
  });

  it('should emit a save request, if sent', (done) => {
    service.saveRequested$.subscribe(_ => { 
      expect(true).toBeTrue(); 
      done();
    });

    service.requestSave();
  });

  it('should emit a state change, if sent', (done) => {
    service.editorStateChanged$.subscribe(value => {
      expect(value).toEqual(EEditorState.eDirty);
      done();
    });

    service.setEditorState(EEditorState.eDirty);
  });

  it('should throw if not onLoad callback has been set', () => {
    expect(() => { service.onLoad([], function(x: any) { return null }, function(x: any) { return null }) }).toThrow(jasmine.anything())
  });

  it('should throw if not onStore callback has been set', () => {
    expect(() => { service.onStore([], function(x: any) { return null }, function(x: any) { return null }) }).toThrow(jasmine.anything())
  });

  it('should throw if not onAssetUpload callback has been set', () => {
    expect(() => { service.onAssetUpload('', {}) }).toThrow(jasmine.anything())
  });

  it('should throw if not onAssetUpload callback has been set', () => {
    expect(() => { service.onAssetsRequested() }).toThrow(jasmine.anything())
  });


});
