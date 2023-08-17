let idUsuario
document.addEventListener('DOMContentLoaded', function(){
    let elemento = document.getElementById('myElemento');
    idUsuario = elemento.getAttribute('data-id');
})

const btnCambiar = document.getElementById("btnMoficarRol")

btnCambiar.onclick = async () => {
    const { status } = await fetch(`/api/modificarRol/${idUsuario}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    })
    if (status == 200) {
      alert("Se modifico correctamente el rol")
      window.location.href = `/modificarUsuario/${idUsuario}`
    } else {
      alert("Error al modificar el usuario")
    }
}

const btnEliminar = document.getElementById("btnEliminarUsuario")

btnEliminar.onclick = async () => {
    const { status } = await fetch(`/api/eliminarUsuario/${idUsuario}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    })
    if (status == 200) {
      alert("Se elimino correctamente el usuario")
      window.location.href = '/profile'
    } else {
      alert("Error al eliminar el usuario")
    }
}