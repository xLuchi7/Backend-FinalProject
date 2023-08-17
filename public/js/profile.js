const formLogout = document.querySelector('#formLogout')

if (formLogout instanceof HTMLFormElement) {
    formLogout.addEventListener('submit', async event => {
      event.preventDefault()
  
      const { status } = await fetch('/api/sesiones', {
        method: 'DELETE'
      })
  
      if (status === 200) {
        alert("se cerro sesion exitosamente")
        window.location.href = '/login'
      } else {
        alert("error al cerrar la sesion")
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
  })
}