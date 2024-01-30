import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

export interface IImage {
  url : string;
  data : Blob;
}

@Component({
  selector: 'sms-image-chooser',
  templateUrl: './image-chooser.component.html',
  styleUrls: ['./image-chooser.component.scss']
})
export class ImageChooserComponent {
  public static DEFAULT_ASSET_URL: string = '/assets/img/dummy.png'; 
  
  private _image: IImage = { url: ImageChooserComponent.DEFAULT_ASSET_URL, data: new Blob() };
  @Input() public set image(i: IImage) { this._image.url = i.url, this._image.data = i.data }
  public get image(): IImage { return this._image; }
  
  @Output() public imageChange: EventEmitter<IImage> = new EventEmitter(); 
  @ViewChild('uploadHandle') private _uploadHandle: ElementRef | null = null;
  
  constructor(
  ) { }

  onChange(event : any) {
    if (event.target.files.length > 0) {
      const file: File = event.target.files[0];
      this.image.url = URL.createObjectURL(file);
      
      const newEvent: IImage = {
        data: file,
        url: this.image.url
      };
      this.imageChange.emit(newEvent);
    }
  }

  public changeImage() {
    this._uploadHandle!.nativeElement.click();
  }

}
