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

    uploadFilePinata(data: FormData): Observable<any> {
        let token: any = env['PINATA_JWT'];
        // let token: any = ''; Solo para pruebas es poner token quemado aqui
        return this.http.post(`${this.urlBase}/pinning/pinFileToIPFS`, data, {
            headers: { Authorization: token },
        });
    }
}
