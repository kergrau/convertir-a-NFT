export class Transaction {
    from: string;
    to: string;
    nonce: number;
    gas: number;
    data: string;

    constructor() {
        this.from = '';
        this.to = '';
        this.nonce = 0;
        this.gas = 0;
        this.data = '';
    }
}
