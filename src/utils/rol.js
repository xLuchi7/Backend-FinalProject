export function validarRol(email){
    console.log("adentro de funcion email vale: ", email)
    if (email == 'admin@gmail.com') {
        return "admin"
    }else{
        return "user"
    }
}