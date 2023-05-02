export function autenticacion(req, res, next){
    if (req.user) {
       next() 
    }else{
        res.redirect('/register')
    }
}