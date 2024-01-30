import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(
    private _httpClient: HttpClient
  ) { }


  /**
   * Helper method for retrieving file blobs
   * 
   * @param url to retrieve files from
   * @returns an {@link Observable} containing the blob
   */
  public getBlob(url: string): Observable<Blob> {
    return this._httpClient.get(url, { responseType: 'blob' });
  }
}
