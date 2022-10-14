import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as FormData from 'form-data';
import { env } from 'process';

@Injectable({
  providedIn: 'root',
})
export class UploadFileService {
  urlBase: string = 'https://api.pinata.cloud';

  constructor(private http: HttpClient) {}

  uploadFilePinata(data: FormData): Observable<any> {
    let token: any = env['PINATA_JWT'];
    return this.http.post(`${this.urlBase}/pinning/pinFileToIPFS`, data, {
      headers: { Authorization: token, ...data.getHeaders },
    });
  }
}
