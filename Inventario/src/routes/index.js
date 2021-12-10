const express = require('express');
const router = express.Router();
const Concepto = require('../models/Concepto');
const Historial = require('../models/Historial');
const authHelpers = require('../helpers/auth')

//Ruta publica: index o pagina de inicio
router.get('/index', authHelpers.isAuthenticated, async (req,res)=>{
    const jefedep = req.userRole==='jefeDep'? true:false;
    const aux = req.userRole==='auxLab'? true:false;
    const jefelab = req.userRole==='jefeLab'? true:false;
    res.render('index',{ jefedep, aux, jefelab });
    console.log(req);
});

//Ruta publica: Tipo bien (seleccionar si es mobiliario y equipo de computo o refacciones y accesorios) 
router.get('/tipo', authHelpers.isAuthenticated, async (req,res)=>{ 
    const jefedep = req.userRole==='jefeDep'? true:false;
    const aux = req.userRole==='auxLab'? true:false;
    const jefelab = req.userRole==='jefeLab'? true:false;
    res.render('layouts/tipoBien',{ jefedep, aux, jefelab });
});

//Ruta publica: Tipo bien (seleccionar si es es garantía de mobiliario y equipo de computo o refacciones y accesorios)
router.get('/tipo-garantia', authHelpers.isAuthenticated, async (req,res)=>{
    res.render('layouts/tipoGarantia');
});

//Ruta publica: Historial
router.get('/historial', authHelpers.isAuthenticated, async (req,res)=>{
    if(req.query.buscar){
        const conceptos = await Concepto.find({noresguardo:{$regex: req.query.buscar, $options:'x'}}).lean();
        const historial = await Historial.find({message:{$regex: req.query.buscar, $options:'x'}}).lean();
        if(conceptos==false){
            const conceptos = await Concepto.find({ubicacion:{$regex: req.query.buscar, $options:'x'}}).lean();
            const historial = await Historial.find({message:{$regex: req.query.buscar, $options:'x'}}).lean();
            res.render('layouts/historial', { conceptos, historial }); //ubicacion
        }else res.render('layouts/historial', { conceptos, historial }); //noresguardo
    } else {
        const conceptos = await Concepto.find(req.body).lean();
        const historial = await Historial.find(req.body).lean();
        res.render('layouts/historial', { conceptos, historial });
    }
});

//Ruta publica: Reporte
router.get('/reporte', authHelpers.isAuthenticated, async (req,res)=>{
    res.render('layouts/reporte');
});

module.exports = router; 



