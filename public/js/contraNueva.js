let idUsado
document.addEventListener('DOMContentLoaded', function(){
    let element = document.getElementById('myElement');
    idUsado = element.getAttribute('data-id');
})

let esHoraValida
document.addEventListener('DOMContentLoaded', function(){
    let elemento = document.getElementById('miElemento');
    esHoraValida = elemento.getAttribute('data-id');
})

if(esHoraValida == false){
    alert("expiro el tiempo para cambiar la contra")
}
if(esHoraValida == true){
    alert("puede cambiar la contra")
}

const formNueva = document.getElementById("formNuevaC")

if (formNueva instanceof HTMLFormElement) {
    formNueva.addEventListener('submit', async event => {
        event.preventDefault()

        const input_contra = document.getElementById("input_contra")
        const input_confirmar = document.getElementById("input_confirmar")

        if (
            input_contra instanceof HTMLInputElement &&
            input_confirmar instanceof HTMLInputElement
        ){
            const datos = {
                contra: input_contra.value,
                confirmar: input_confirmar.value
            }
            const  { status } = await fetch(`/api/cambiarContrasenia/${idUsado}`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(datos)
            })
            if(status == 401){
                alert("las contraseñas no coinciden")
            }
            if (status === 200) {
                alert("contraseña modificada correctamente")
                window.location.href = '/profile'
            } else {
                alert("error al cambiar la contraseña")
            }
        }
    })
}