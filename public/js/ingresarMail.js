const mail= document.getElementById("mail")

if (mail instanceof HTMLFormElement) {
    mail.addEventListener('submit', async event => {
        event.preventDefault()

        const input_mail = document.getElementById("input_email")

        if (
            input_mail instanceof HTMLInputElement
        ){
            const datos = input_mail.value
            const  { status } = await fetch(`/enviarEmailSinLogin/${datos}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
            })
            if (status === 200) {
                alert("Se envio un mail a: "+ datos +" para restablecer la contraseña")
            } else {
                alert("No se encontro ese email")
            }
        }
    })
}