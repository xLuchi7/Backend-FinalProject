const formDigitos = document.getElementById("sixDigits")

if (formDigitos instanceof HTMLFormElement) {
    formDigitos.addEventListener('submit', async event => {
        event.preventDefault()

        const input_digits = document.getElementById("input_digits")

        if (
            input_digits instanceof HTMLInputElement
        ){
            const digitos = {
                digits: input_digits.value
            }
            const  { status } = await fetch('/nuevaContra', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(digitos)
            })
        }
    })
}