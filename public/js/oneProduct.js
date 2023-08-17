const buttonAddToCart = document.querySelector("#addProd")

if (buttonAddToCart) {
    buttonAddToCart.addEventListener(
        'click', async evento => {
            const carritoID = document.querySelector("#cartID")
            const prodID = document.querySelector("#prodID")
    
            const datos = {
                productID: prodID.value,
                cartID: carritoID.value
            }
    
            const { addToCart } = await fetch('/product/addProductToCart', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(datos)
            })
        }
    )
}
