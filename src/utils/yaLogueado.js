export function yaLogueado(req, res, user){
    if (user) {
        res.redirect('/products')
    }
}