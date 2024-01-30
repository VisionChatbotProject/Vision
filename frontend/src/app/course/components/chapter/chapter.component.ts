import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-chapter',
  templateUrl: './chapter.component.html',
  styleUrls: ['./chapter.component.scss']
})
export class ChapterComponent implements OnInit {

  private _chapterId : number = -1;
  public get chapterId() : number { return this._chapterId; }


  constructor(
    private _activatedRoute : ActivatedRoute
  ) { }

  ngOnInit(): void {
    let chapterIdStr : string | null = this._activatedRoute.snapshot.queryParamMap.get('id');
    if(chapterIdStr) {
      if(!isNaN(+chapterIdStr)) {
        this._chapterId = +chapterIdStr;
      }
      else {
        // TODO
        console.log('chapter Id is NaN');
      }
    }
  }

}
