const formLogin = document.querySelector('#formLogin')

if (formLogin instanceof HTMLFormElement) {
    formLogin.addEventListener('submit', async event => {
        event.preventDefault()

        const input_email = document.querySelector('#input_email')
        const input_password = document.querySelector('#input_password')

        if (
            input_email instanceof HTMLInputElement &&
            input_password instanceof HTMLInputElement
        ){
            const datosUsuario = {
                email: input_email.value,
                password: input_password.value,
            }
            const response  = await fetch('/api/sesiones', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(datosUsuario)
            })
            .then(res => res.json())
            
            if (response.estado  !== "error") {
                alert("Se inicio sesion existosamente")
                window.location.href = '/products'
            } else {
                console.log(response)
                alert("Credenciales Invalidas")
            }
            // if (response == 201) {
            //     alert("login BIEN")
            //     window.location.href = '/products'
            // }else{
            //     alert("login MAL")
            //     console.log("fallo el login")
            // }
        }
    })
}