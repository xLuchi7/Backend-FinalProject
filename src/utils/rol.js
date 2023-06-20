export function validarRol(email){
    if (email.includes("admin")) {
        return "admin"
    }else{
        return "user"
    }
}