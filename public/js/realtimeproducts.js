let idUsuario
document.addEventListener('DOMContentLoaded', function(){
    let elemento = document.getElementById('myElemento');
    idUsuario = elemento.getAttribute('data-id');
})

let productos
document.addEventListener('DOMContentLoaded', function(){
    let elemento = document.getElementById('productos');
    productos = elemento.getAttribute('data-id');
})

const serverSocket = io()

const plantillaProductsRealTime = `
<ul>
    {{#each productos}}
    <li>{{this.title}}: $ {{this.price}}</li>
    {{/each}}
</ul> 
`

const armarHtmlRealTime = Handlebars.compile(plantillaProductsRealTime)

serverSocket.on("actualizarProductos", productos => {
    const productsDiv = document.querySelector("#realtime")
    if (productsDiv) {
        productsDiv.innerHTML = armarHtmlRealTime({productos})
    }
})

const btnCargar = document.querySelector("#btnCargar")

if (btnCargar) {
    btnCargar.addEventListener(
        'click',
        evento => {
            const inputTitulo = document.querySelector("#inputTitulo")
            const inputDescripcion = document.querySelector("#inputDescripcion")
            const inputPrecio = document.querySelector("#inputPrecio")
            const inputImagen = document.querySelector("#inputImagen")
            const inputCodigo = document.querySelector("#inputCodigo")
            const inputStock = document.querySelector("#inputStock")

            if (inputTitulo.value == "" || inputDescripcion.value == "" || inputPrecio.value == "" || inputImagen.value == "" || inputCodigo.value == "" || inputStock.value == "") {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Todos los campos deben ser completados'
                })
            }else{
                const product = {
                    title: inputTitulo.value,
                    description: inputDescripcion.value,
                    price: inputPrecio.value,
                    thumbnail: inputImagen.value,
                    code: inputCodigo.value,
                    stock: inputStock.value,
                    owner: idUsuario
                }
                console.log("producto: ", product)
                //serverSocket.emit('nuevoProducto', product)
                serverSocket.emit('nuevoProducto', product, (response) => {
                    if(response.success){
                        Swal.fire({
                            icon: 'success',
                            title: 'Success',
                            text: 'Se creo exitosamente el producto'
                        })
                        //serverSocket.on("actualizarProductos")
                        window.location.href = '/realtimeproducts'
                    }else{
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'Datos invalidos, No se creo el producto'
                        })
                    }
                })
            }
        }
    )
}