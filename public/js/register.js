const form = document.getElementById("formRegister")

if (form instanceof HTMLFormElement) {
    form.addEventListener('submit', async event => {
        event.preventDefault()

        const input_first_name = document.getElementById("input_first_name")
        const input_last_name = document.getElementById("input_last_name")
        const input_email = document.getElementById("input_email")
        const input_age = document.getElementById("input_age")
        const input_password = document.getElementById("input_password")

        console.log(input_first_name.value)

        if(
            input_first_name instanceof HTMLInputElement &&
            input_last_name instanceof HTMLInputElement &&
            input_email instanceof HTMLInputElement &&
            input_age instanceof HTMLInputElement &&
            input_password instanceof HTMLInputElement
        ) {
            const datosUsuario = {
                first_name: input_first_name.value,
                last_name: input_last_name.value,
                email: input_email.value,
                age: input_age.value,
                password: input_password.value,
            }

            const { usuarioCreado } = await fetch('/api/usuarios', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(datosUsuario)
            })
            //.then(res => res.json())
            window.location.href = '/profile'

            // if (usuarioCreado === 201) {
            //     window.location.href = '/profile'
            // } else {
            //     console.log('[login] estado inesperado: ' + status)
            // }
        }
    })
}