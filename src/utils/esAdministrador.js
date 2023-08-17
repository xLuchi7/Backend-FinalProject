export  function esAdministrador(req, res, next){
    if(req.user){
        if (req.user.role == "admin") {
            next() 
        }else{
            res.redirect('/products')
        }
    }else{
        res.redirect('/products')
    }
}