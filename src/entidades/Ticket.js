export class Ticket{
    constructor({code, purchaseDateTime, amount, purchaser}) {
        this.code = code;
        this.purchaseDateTime = purchaseDateTime;
        this.amount = amount;
        this.purchaser = purchaser
    }
}