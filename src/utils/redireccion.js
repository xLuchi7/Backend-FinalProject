export function redireccion(req, res, user){
    if (user) {
        res.redirect('/products')
    } 
}