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

// let plantillaDinamica
// if(user.role == "user"){
//     plantillaDinamica = `
//         <button><a href="/carrito/{{user.cartID}}/producto/{{product._id}}">Agregar al carrito</a></button><br><br>
//     `
// }else{
//     plantillaDinamica = `
//         <p>Solo el usuario puede agregar productos al carrito</p>
//     `
// }

// const armarAgregar = Handlebars.compile(plantillaDinamica)

// const divAgregar = document.getElementById("agregar")

// divAgregar.innerHTML = armarAgregar({product, user})
