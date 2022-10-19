import { Component, OnInit } from '@angular/core';
import { UploadFileService } from '../services/upload-file.service';

@Component({
    selector: 'app-upload-file',
    templateUrl: './upload-file.component.html',
    styleUrls: ['./upload-file.component.css'],
})
export class UploadFileComponent implements OnInit {
    file: File = new File([], ''); // Variable to store file

    constructor(private readonly upFileService: UploadFileService) {}

    ngOnInit(): void {}

    onChange(event: any) {
        this.file = event.target.files[0];
    }

    pruebaSubida() {
        let pinataOption: Object = { cidVersion: 1 };
        let pinataMetadata: Object = {
            name: 'MyFile2',
            keyvalue: { coleccion: 'prueba2' },
        };
        this.upFilePinata(this.file, pinataOption, pinataMetadata);
    }

    /**
     * This method is to upload file to Pinata
     * @param file File to upload to Pinata.
     * @param pinataOptions Object with Pinata options
     * @param pinataMetadata Object with file metadata
     */
    upFilePinata(
        file: File,
        pinataOptions?: Object,
        pinataMetadata?: Object,
    ): void {
        let isValidSize: boolean = this.validateFileSize(file);
        let isValidType: boolean = this.validateFileType(file);
        if (!isValidSize) {
            throw 'Your exceed size limit';
        }
        if (!isValidType) {
            throw 'No valid file type';
        }
        let data: FormData = this.prepareToDataUp(
            file,
            pinataOptions,
            pinataMetadata,
        );

        this.upFileService.uploadFilePinata(data).subscribe((response) => {
            console.log(response);
        });
    }

    validateFileSize(file: File): boolean {
        let size: number = file.size / 1000_000; // Size to MB
        if (size <= 4) {
            return true;
        }
        return false;
    }

    validateFileType(file: File): boolean {
        let type: string = file.type.split('/')[1];
        let allowedTypes: Array<string> = ['pdf', 'jpg', 'jpeg', 'png'];
        let isAllowed: boolean = allowedTypes.includes(type);
        return isAllowed;
    }

    /**
     * Prepared data to upload to Pinata
     * @param file File to upload to Pinata
     * @param pinataOptions Object with Pinata options
     * @param pinataMetadata Object with file metadata
     * @returns FormData object
     */
    prepareToDataUp(
        file: File,
        pinataOptions?: Object,
        pinataMetadata?: Object,
    ): FormData {
        let data: FormData = new FormData();
        let pinOptionStr: string = JSON.stringify(pinataOptions);
        let pinMetedataStr: string = JSON.stringify(pinataMetadata);
        data.append('file', file);
        if (pinataOptions) {
            data.append('pinataOptions', pinOptionStr);
        }
        if (pinataMetadata) {
            data.append('pinataMetadata', pinMetedataStr);
        }
        return data;
    }
}
