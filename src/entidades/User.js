export class User {
    constructor({ password, first_name, last_name, age, email, cartID, role }) {
        this.password = password,
        this.first_name = first_name,
        this.last_name = last_name,
        this.age = age,
        this.email = email,
        this.cartID = cartID,
        this.role = role
    }
}