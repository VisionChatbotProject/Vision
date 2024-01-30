import { HttpClient } from '@angular/common/http';
import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { take } from 'rxjs/operators';
import { AuthoringApiService } from '../../services/authoringApi/authoring-api.service';

@Directive({
  selector: '[imgSrc]'
})
export class ImgSrcDirective {

  public static DEFAULT_ASSET_URL: string = '/assets/img/dummy.png'; 

  @Input() public set imgSrc(s: string | Blob ) { 
    if(s != null) { 
      this._authoringApi.commonService.getBlob(s as string).subscribe(blob => {
        this._renderer.setAttribute(this._element.nativeElement, 'src', URL.createObjectURL(blob));
      });
    }
    else { this._renderer.setAttribute(this._element.nativeElement, 'src', this._defaultUrl); }
  }

  private _defaultUrl: string = ImgSrcDirective.DEFAULT_ASSET_URL;
  @Input() public set defaultUrl(s: string) { this._defaultUrl = s; }
  
  constructor(
    private _element : ElementRef,
    private _renderer: Renderer2,
    private _authoringApi: AuthoringApiService
  ) { }

}
