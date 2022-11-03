import { Component, Injectable, OnInit } from '@angular/core';
import { FileTypes } from '../../enums/file-types';
import { MeasurementUnits } from '../../enums/measurement-units';
import { UploadFile } from '../../enums/upload-file';
import { UploadFileService } from '../../services/upload-file.service';
import { lastValueFrom } from 'rxjs';
import { UploadedFile } from 'src/app/models/uploaded-file';
import { ConfigService } from 'src/app/services/config.service';

@Injectable({
    providedIn: 'root',
})
@Component({
    selector: 'app-upload-file',
    templateUrl: './upload-file.component.html',
    styleUrls: ['./upload-file.component.css'],
})
export class UploadFileComponent implements OnInit {
    file: File = new File([], ''); // Variable to store file

    constructor(
        private readonly upFileService: UploadFileService,
        private readonly configService: ConfigService,
    ) {}

    ngOnInit(): void {}

    onChange(event: any) {
        this.file = event.target.files[0];
    }

    pruebaSubida() {
        let pinataMetadata: Object = {
            coleccion: 'prueba2',
            autor: 'alguien',
            universidad: 'Alguna',
        };
        this.upFilePinata(this.file, pinataMetadata);
    }

    /**
     * This method is to upload file to Pinata
     * @param token Bearer PINATA_JWT_TOKEN
     * @param file File to upload to Pinata.
     * @param keyValueMetadata Object with key value for metadata
     */
    async upFilePinata(file: File, keyValueMetadata?: Object) {
        let isValidSize: boolean = this.validateFileSize(file);
        let isValidType: boolean = this.validateFileType(file);
        if (!isValidSize) throw 'Your exceed size limit';
        if (!isValidType) throw 'No valid file type';

        let data: FormData = this.prepareToDataUp(file, keyValueMetadata);
        let hash = await lastValueFrom(
            this.upFileService.uploadFilePinata(
                this.configService.pinataJWT,
                data,
            ),
        )
            .then((response: UploadedFile) => {
                console.log(response);
                return response.IpfsHash;
            })
            .catch((err: any) => {
                console.error(err);
                return '';
            });
        return hash;
    }

    validateFileSize(file: File): boolean {
        let size: number = file.size / MeasurementUnits.MB; // Size to MB
        if (size <= UploadFile.LIMIT_SIZE) {
            return true;
        }
        return false;
    }

    validateFileType(file: File): boolean {
        let type: string = file.type.split('/')[1];
        let isAllowed: boolean = FileTypes.ALLOWED.includes(type);
        return isAllowed;
    }

    /**
     * Prepared data to upload to Pinata
     * @param file File to upload to Pinata
     * @param keyValueMetadata Object with file metadata
     * @returns FormData object
     */
    prepareToDataUp(file: File, keyValueMetadata?: Object): FormData {
        let data: FormData = new FormData();
        let metadata: Object = { keyvalues: keyValueMetadata };
        let pinMetedataStr: string = JSON.stringify(metadata);
        data.append('file', file);
        if (keyValueMetadata) {
            data.append('pinataMetadata', pinMetedataStr);
        }
        return data;
    }
}
