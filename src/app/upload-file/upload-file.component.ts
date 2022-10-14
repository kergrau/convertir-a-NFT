import { Component, OnInit } from '@angular/core';
import * as fs from 'fs';
import * as FormData from 'form-data';
import { UploadFileService } from '../services/upload-file.service';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.css'],
})
export class UploadFileComponent implements OnInit {
  constructor(private readonly upFileService: UploadFileService) {}

  ngOnInit(): void {}

  /**
   * This method is to upload file to Pinata
   * @param path is the absolute path of the file
   * @param pinataOptions JSON with Pinata options
   * @param pinataMetadata JSON with file metadata
   */
  upFilePinata(
    path: string,
    pinataOptions?: JSON,
    pinataMetadata?: JSON
  ): void {
    let data: FormData = this.prepareToDataUp(
      path,
      pinataOptions,
      pinataMetadata
    );
    this.upFileService.uploadFilePinata(data).subscribe();
  }

  /**
   * Prepared data to upload to Pinata
   * @param path is the absolute path of the file
   * @param pinataOptions JSON with Pinata options
   * @param pinataMetadata JSON with file metadata
   * @returns FormData object
   */
  prepareToDataUp(
    path: string,
    pinataOptions?: JSON,
    pinataMetadata?: JSON
  ): FormData {
    let data: FormData = new FormData();
    data.append('file', fs.createReadStream('/home/grau/prueba.txt'));
    data.append('pinataOptions', '{"cidVersion": 1}');
    data.append(
      'pinataMetadata',
      '{"name": "MyFile", "keyvalues": {"company": "Pinata"}}'
    );
    return data;
  }
}
