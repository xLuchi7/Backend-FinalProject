export function validarRol(email){
    if (email.includes("admin")) {
        return "admin"
    }else{
        if(email.includes("premium")){
            return "premium"
        }else{
            return "user"
        }
    }
}