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
            const inputPrecio = document.querySelector("#inputPrecio")

            if (inputTitulo.value == "" || inputPrecio.value == "") {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Ambos campos deben ser completados'
                  })
            }else{
                const product = {
                    title: inputTitulo.value,
                    price: inputPrecio.value 
                }
                serverSocket.emit('nuevoProducto', product)
            }
        }
    )
}