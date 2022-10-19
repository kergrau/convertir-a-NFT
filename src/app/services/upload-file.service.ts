import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { env } from 'process';

@Injectable({
    providedIn: 'root',
})
export class UploadFileService {
    urlBase: string = 'https://api.pinata.cloud';

    constructor(private http: HttpClient) {}

    uploadFilePinata(token: string, data: FormData): Observable<any> {
        return this.http.post(`${this.urlBase}/pinning/pinFileToIPFS`, data, {
            headers: { Authorization: token },
        });
    }
}
