export class UploadedFile {
    IpfsHash: string;
    PinSize: number;
    Timestamp: string;

    constructor() {
        this.IpfsHash = '';
        this.PinSize = 0;
        this.Timestamp = '';
    }
}
