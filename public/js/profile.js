//import { winstonLogger } from "../../src/utils/winstonLogger.js"

const formLogout = document.querySelector('#formLogout')

if (formLogout instanceof HTMLFormElement) {
    formLogout.addEventListener('submit', async event => {
      event.preventDefault()
  
      const { status } = await fetch('/api/sesiones', {
        method: 'DELETE'
      })
  
      if (status === 200) {
        window.location.href = '/login'
      } else {
        console.log("error en el logout "+ status)
        //winstonLogger.error("Error en el logout "+ status)
      }
    })
}

const restablecerClick = document.getElementById("restablecer")

restablecerClick.onclick = async () => {
  await fetch('/api/restablecerClick', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    //body: JSON.stringify(datosUsuario)
  })
}