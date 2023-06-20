export function postSessionsController(req, res, next) {
    res.status(201).json(req.user)
    req.logger.info("en app.post adentro de funcion: "+ req.user)
    //console.log("en app.post adentro de funcion: ", req.user)
}

export function getCurrentSessionController(req, res, next) {
    // passport guarda la sesion directamente en ** req.user ** en lugar del campo session de la peticion !
    res.json(req.user)
}