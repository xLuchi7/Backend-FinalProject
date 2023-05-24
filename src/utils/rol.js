export function validarRol(email){
    console.log("adentro de funcion email vale: ", email)
    if (email.includes("admin")) {
        return "admin"
    }else{
        return "user"
    }
}