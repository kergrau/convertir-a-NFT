import { Component, OnInit } from '@angular/core';
import { UploadFileComponent } from '../upload-file/upload-file.component';
import { Transaction } from 'src/app/models/transaction';
import { ConfigService } from 'src/app/services/config.service';

@Component({
    selector: 'app-access-to-nft',
    templateUrl: './access-to-nft.component.html',
    styleUrls: ['./access-to-nft.component.css'],
})
export class AccessToNFTComponent implements OnInit {
    baseURI: string = 'https://ipfs.io/ipfs/';
    file: File = new File([], ''); // Variable to store file

    constructor(
        private readonly upFile: UploadFileComponent,
        private readonly configService: ConfigService,
    ) {}

    ngOnInit(): void {
        this.getBalance('0x86e47D698CD2544EB3dEa3d7a89693FD72fe0Eb2');
    }

    onChange(event: any) {
        this.file = event.target.files[0];
    }

    pruebaSubida() {
        let pinataMetadata: Object = {
            coleccion: 'prueba2',
            autor: 'alguien',
            universidad: 'Alguna',
        };
        this.mintNFT(
            '0x86e47D698CD2544EB3dEa3d7a89693FD72fe0Eb2',
            this.file,
            pinataMetadata,
        );
    }

    getBalance(address: string) {
        this.configService.contract.methods
            .balanceOf(address)
            .call({ from: address })
            .then((response: any) => {
                console.log(response);
            })
            .catch((err: any) => {
                console.error(err);
            });
    }

    /**
     * Crear un NFT a partir de un archivo siempre y cuando sea menos de
     * 4MB y sea PNG JPG JPEG o PDF
     * @param from direccion de cuenta que paga la creacion de NFT
     * @param to direccion de cuenta donde va el NFT un vez creado
     * @param file el archivo que se va a pasar a NFT
     * @param keyValueMetadata Un objeto con los metadatos que se le quieren poner al archivo
     */
    async mintNFT(address: string, file: File, keyValueMetadata: Object) {
        let hash: string = '';
        await this.upFile
            .upFilePinata(file, keyValueMetadata)
            .then((hashIPFS: string) => {
                hash = hashIPFS;
            });

        let transaction: Transaction = await this.prepareTran(
            address,
            this.configService.contract.methods.mint(address, hash),
        );

        let signedTransaction = await this.signTransaction(transaction);
        await this.sendTransaction(signedTransaction);
    }

    /**
     * Modela el objeto de una transaccion
     * @param address direccion que va a ejecutar la transaccion
     * @param method Metodo del contrato que se quiere ejecutar o tranzar
     * @returns retorna el objeto formado de la transaccion
     */
    async prepareTran(address: string, method: any) {
        const nonce: number =
            await this.configService.web3.eth.getTransactionCount(
                address,
                'latest',
            );
        const gasEsitmated: number = await method.estimateGas();

        const transaction: Transaction = {
            from: address,
            to: this.configService.addressContract, // Contrato que al que esta ligado la libreria
            nonce: nonce,
            gas: gasEsitmated,
            data: method.encodeABI(),
        };

        console.log(transaction);
        return transaction;
    }

    /**
     * Firma la transaccion con la llave privada de la cuenta suministrada
     * se debe configurar la llave privada de la cuenta a utilizar en el
     * metodo de configuracion antes de ejecutar cualquier transaccion
     * @param transaction Objeto de la transaccion que se va a firmar
     * @returns Retorna una promesa con la transaccion firmada
     */
    async signTransaction(transaction: Transaction) {
        const signPromise =
            await this.configService.web3.eth.accounts.signTransaction(
                transaction,
                this.configService.privateKey,
            );
        return signPromise;
    }

    /**
     * Envia la transaccion firmada a la Blockchain
     * @param signedTransaction Transaccion firmada
     * @returns Retorna el has de la transaccion o NFT
     */
    async sendTransaction(signedTransaction: any) {
        let hashTransaction: string = '';
        await this.configService.web3.eth
            .sendSignedTransaction(signedTransaction.rawTransaction)
            .then((response: any) => {
                console.log('Completed transaction');
                console.log(response);
                hashTransaction = response.transactionHash;
            })
            .catch((err: any) => {
                console.error(err);
            });

        console.log(hashTransaction);
        return hashTransaction;
    }
}
