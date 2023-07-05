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
            const  { status } = await fetch('/api/nuevaContra', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(datos)
            })
            if (status === 200) {
                window.location.href = '/profile'
                alert("contraseña modificada correctamente")
            } else {
                console.log("error al cambiar la contraseña "+ status)
                //winstonLogger.error("Error en el logout "+ status)
            }
        }
    })
}