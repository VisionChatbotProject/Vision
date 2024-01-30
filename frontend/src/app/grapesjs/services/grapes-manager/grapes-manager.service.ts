import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { EEditorState, IEditorContext } from '../../interfaces/common.interface';


@Injectable()
export class GrapesManagerService {
  // From parent component -> editor holder
  private _editorContextChangedSubject: ReplaySubject<IEditorContext> = new ReplaySubject(1);
  private _editorContextChanged$: Observable<IEditorContext> = this._editorContextChangedSubject.asObservable();
  public get editorContextChanged$(): Observable<IEditorContext> { return this._editorContextChanged$; }

  public setEditorContext(context: IEditorContext) { this._editorContextChangedSubject.next(context); }

  private _requestSaveSubject: ReplaySubject<void> = new ReplaySubject(1);
  private _saveRequested$: Observable<void> = this._requestSaveSubject.asObservable();
  public get saveRequested$(): Observable<void> { return this._saveRequested$; }
  
  public requestSave(): void { this._requestSaveSubject.next(); }

  // From editor holder -> parent component
  private _editorState: EEditorState = EEditorState.eClean;
  private _editorStateSubject: ReplaySubject<EEditorState> = new ReplaySubject(1);
  private _editorStateChanged$: Observable<EEditorState> = this._editorStateSubject.asObservable();
  public get editorStateChanged$(): Observable<EEditorState> { return this._editorStateChanged$; }

  public setEditorState(state: EEditorState) {
    if(state != this._editorState) {
      this._editorState = state;
      this._editorStateSubject.next(state);
    }
  }

  // callbacks that need to be set by parent component:
  public onLoad: (keys: string[], successCallback: (result: any) => any, errorCallback: (error: any) => any) => void = function(){ throw Error('onLoad is not implemented'); };
  public onStore: (data: string[], successCallback: (result: any) => any, errorCallback: (error: any) => any) => void = function(){ throw Error('onStore is not implemented'); };

  public onAssetUpload: (url: string, options: any) => Promise<any> = function(){ throw Error('onAssetUpload is not implemented'); };
  public onAssetsRequested: () => Promise<any> = function(){ throw Error('onAssetRequested is not implemented'); };
 
  constructor() { }
}
