import { Component, OnInit } from '@angular/core';
import { Editor, init } from 'grapesjs';
import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { EEditorState, IEditorContext } from '../../interfaces/common.interface';
import { GrapesManagerService } from '../../services/grapes-manager/grapes-manager.service';
import "node_modules/grapesjs-blocks-basic/dist/grapesjs-blocks-basic.min"
import "node_modules/grapesjs-preset-webpage/dist/grapesjs-preset-webpage.min"
import "node_modules/grapesjs-preset-newsletter/dist/grapesjs-preset-newsletter.min"
import { GrapeJSBlocks } from '../../blocks/blocks';
import {Component as GrapeJSComponent} from "grapesjs";

@Component({
  selector: 'smg-grapes-js-holder',
  templateUrl: './holder.component.html',
  styleUrls: ['./holder.component.scss']
})
export class HolderComponent implements OnInit {

  private _editor: Editor | null = null;
  private _editorContext: IEditorContext = { }

  private _ignoreUpdate: boolean = false;
  private _saveRequested$: Observable<void> = this._manager.saveRequested$.pipe(
    tap(_ => this._ignoreUpdate = true),
    tap(_ => this._editor!.store())
  );
  public get saveRequested$(): Observable<void> { return this._saveRequested$; }

  private _editorContextChanged$: Observable<IEditorContext> = this._manager.editorContextChanged$.pipe(
    tap(context => this._editorContext = context),
    tap(_ => this._ignoreUpdate = true),
    tap(_ => this._editor!.load()),
    switchMap(_ => this._manager.onAssetsRequested()),
    tap(assets => this._editor!.AssetManager.add(assets))
  );

  public get editorContextChanged$(): Observable<IEditorContext> { return this._editorContextChanged$; }

  constructor(
    private _manager: GrapesManagerService,
  ) { }

  ngOnInit(): void {
    this._initGrapeJsEditor();
  }

  private _initGrapeJsEditor() {
    this._editor = init({
      canvas: {
        scripts: [ /* 'assets/main.bundle.js' */ ],
      },
      container: '#gjs',
      fromElement: false,
      height: '600px',
      width: 'auto',
      avoidInlineStyle: true,
      storageManager: { 
        id: 'authoring-',         // Prefix identifier that will be used on parameters
        type: 'custom-storage',   // Type of the storage
        autosave: true,           // Store data automatically
        autoload: false,          // do not autoload stored data on init
        stepsBeforeSave: 10,      // If autosave enabled, indicates how many changes are necessary before store method is triggered
      },
      assetManager: {
        upload: '_',
        customFetch: this._manager.onAssetUpload,
      },
      plugins: [
        "gjs-preset-newsletter",
        "gjs-blocks-basic",
        "gjs-preset-webpage",
      ],
      pluginsOpts: {
          "gjs-blocks-basic": {
        }
      }
    });

    [GrapeJSBlocks.basicTitleTextSlide,
     GrapeJSBlocks.sectionTitleTextSlide,
     GrapeJSBlocks.twoPaneSlide,
     GrapeJSBlocks.imageSlide
    ].forEach(b => {
      if(b.blockConfig) {
        const typeName: string = (<GrapeJSComponent>b.blockConfig.content).type;
        this._editor!.DomComponents.addType(
          typeName,
          {...b.typeConfig}
        );
      }

      const {id: blockId, ...blockConfig} = b.blockConfig;
      this._editor!.BlockManager.add(blockId, blockConfig);
  
    });
    
    this._editor.StorageManager.add('custom-storage', {
      load: this._load.bind(this),
      store: this._store.bind(this),
    });

    this._editor.on('update', () => {
      if(!this._ignoreUpdate) { this._manager.setEditorState(EEditorState.eDirty); }
      this._ignoreUpdate = false;
    });

    this._editor.on('storage:end', () => {
      this._ignoreUpdate = true;
      this._manager.setEditorState(EEditorState.eClean)
    });
  }


  private _load(keys: any, successCallback: (result: any) => any, errorCallback: (error: any) => any) {
    this._manager.onLoad(keys, successCallback, errorCallback)
  }

  private _store(data: any, successCallback: (result: any) => any, errorCallback: (error: any) => any) {
    const css: string = this._editor!.getCss();
    const html: string = this._editor!.getHtml();
    data['css'] = css;
    data['html'] = html;
    if (html !== '')  {
      this._manager.onStore(data, successCallback, errorCallback)
    }
  }
}
