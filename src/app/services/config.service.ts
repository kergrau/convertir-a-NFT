import { Injectable } from '@angular/core';
import { ABI } from 'src/assets/abi';
import Web3 from 'web3';

@Injectable({
    providedIn: 'root',
})
export class ConfigService {
    Contract: any = require('web3-eth-contract');
    contract: any;
    pinataJWT: string = '';
    privateKey: string = '';
    addressContract: string = '0x3b59750001C0E5705Ca55638923dF08FC599e139';
    provider: string = '';
    web3: any;
    constructor() {}

    /**
     * Configura los parametros de configuracion antes de subir un archivo
     * o crear un NFT
     */
    configKeys(pinataJWT: string, privateKey: string, provider: string): void {
        this.pinataJWT = `Bearer ${pinataJWT}`;
        this.privateKey = privateKey;
        this.provider = provider;
        this.web3 = new Web3(provider);
        this.setContract();
    }

    setContract() {
        this.Contract.setProvider(this.provider);
        this.contract = new this.Contract(ABI.abi, this.addressContract);
    }

    checkKeys(): boolean {
        if (this.pinataJWT && this.privateKey && this.provider) {
            return true;
        }
        return false;
    }

    clearKeys() {
        this.pinataJWT = '';
        this.privateKey = '';
        this.provider = '';
    }
}
