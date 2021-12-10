const fs = require('fs');
const json2csv = require('json2csv').parse;
const path = require('path')
const express = require('express');
const router = express.Router();
const Refyacc = require('../models/Refyacc');
const RefyaccAux = require('../models/RefyaccAux');
const Bienr = require('../models/Bienr');
const logger = require('../loggers/logger');
const authHelpers = require('../helpers/auth')

/******************** PUBLICAS ********************/
//Ver refacciones y accesorios
router.get('/refacciones-accesorios/ver/:id', authHelpers.isAuthenticated, async (req, res) => {
    const { id } = req.params;
    const refyaccs = await Refyacc.findById(id).lean();
    res.render('refyacc/verrefacc', { refyaccs });
});

//Ver lista de garantias
router.get('/garantias-refacciones-accesorios', authHelpers.isAuthenticated, async (req,res)=>{  
    if(req.query.buscar){
        const refyaccs = await Refyacc.find({fecha:{$regex: req.query.buscar, $options:'i'}}).lean();
        if(refyaccs==false){
            const refyaccs = await Refyacc.find({noresguardo:{$regex: req.query.buscar, $options:'i'}}).lean();
            if(refyaccs==false){
                const refyaccs = await Refyacc.find({nointerno:{$regex: req.query.buscar, $options:'i'}}).lean();
                if(refyaccs==false){
                    const refyaccs = await Refyacc.find({proveedor:{$regex: req.query.buscar, $options:'i'}}).lean();
                    if(refyaccs==false){
                        const refyaccs = await Refyacc.find({nombre:{$regex: req.query.buscar, $options:'i'}}).lean();
                        res.render('layouts/garantiasR', { refyaccs }); //nombre
                    }else res.render('layouts/garantiasR', { refyaccs }); //proveedor
                }else res.render('layouts/garantiasR', { refyaccs }); //nointerno
            }else res.render('layouts/garantiasR', { refyaccs }); //noresguardo
        }else res.render('layouts/garantiasR', { refyaccs }); //fecha
    } else {
        const refyaccs = await Refyacc.find(req.body).lean();
        res.render('layouts/garantiasR', { refyaccs });
    }
});

/******************** FEJE DE LABORATORIO ********************/

//Agregar tipo de refacciones o accesorios
router.get('/ingresar-tipo-refacciones-accesorios', authHelpers.isAuthenticated, authHelpers.isJefeLab, async (req,res)=>{
    const bienrs = await Bienr.find().lean();
    res.render('layouts/ingresarBienR', { bienrs });
});
router.post('/ingresar-tipo-refacciones-accesorios', authHelpers.isAuthenticated, authHelpers.isJefeLab, async (req, res) => {
    const newBienr = new Bienr({bienr: req.body.bienr});
    await newBienr.save();
    res.redirect('/ingresar-tipo-refacciones-accesorios');
});

//Eliminar tipo de refacciones o accesorios
router.get('/ingresar-tipo-refacciones-accesorios/delete/:id', authHelpers.isAuthenticated, authHelpers.isJefeLab, async (req, res) => {
    const { id } = req.params;
    await Bienr.findByIdAndDelete({_id:id});
    res.redirect('/ingresar-tipo-refacciones-accesorios');
});

//Lista tipo de refacciones o accesorios
router.get('/ingresar-refacciones-accesorios', authHelpers.isAuthenticated, authHelpers.isJefeLab, async (req,res)=>{  
    const bienrs = await Bienr.find().lean();
    res.render('layouts/inventarioR', { bienrs });
});

//Crear refacciones y accesorios
router.get('/ingresar-refacciones-accesorios', authHelpers.isAuthenticated, authHelpers.isJefeLab, async (req,res)=>{
    res.render('layouts/inventarioR');
});
router.post('/refacciones-accesorios', authHelpers.isAuthenticated, authHelpers.isJefeLab, async (req, res) => {
    const body = req.body
    const newRef = new Refyacc({
        noresguardo: body.noresguardo,
        nointerno: "02" + body.nointerno + "SyC",
        nombre: body.nombre,
        fecha: body.fecha,
        ubicacion: body.ubicacion,
        status: body.status,
        descripcion: body.descripcion,
        garantia: body.garantia,
        createdAt: body.createdAt
    });
    await newRef.save();
    logger.info({message: 'NUEVO INGRESO: Refacción o accesorio, con no. de resguardo: '+newRef.noresguardo+' ubicación: '+newRef.ubicacion});
    res.redirect('/refacciones-accesorios');
});

//Lista de refacciones y accesorios
router.get('/refacciones-accesorios', authHelpers.isAuthenticated, authHelpers.isJefeLab, async (req,res)=>{ 
    if(req.query.buscar){
        const refyaccs = await Refyacc.find({fecha:{$regex: req.query.buscar, $options:'i'}}).lean();
        if(refyaccs==false){
            const refyaccs = await Refyacc.find({ubicacion:{$regex: req.query.buscar, $options:'i'}}).lean();
            if(refyaccs==false){
                const refyaccs = await Refyacc.find({nombre:{$regex: req.query.buscar, $options:'i'}}).lean();
                if(refyaccs==false){
                    const refyaccs = await Refyacc.find({status:{$regex: req.query.buscar, $options:'i'}}).lean();
                    res.render('refyacc/refyaccs', { refyaccs }); //status
                }else res.render('refyacc/refyaccs', { refyaccs }); //nombre
            }else res.render('refyacc/refyaccs', { refyaccs }); //ubicacion
        }else res.render('refyacc/refyaccs', { refyaccs }); //fecha
    } else {
        const refyaccs = await Refyacc.find().lean();
        res.render('refyacc/refyaccs', { refyaccs });
    }
}); 

//Editar refacciones y accesorios
router.get('/refacciones-accesorios/editar/:id', authHelpers.isAuthenticated, authHelpers.isJefeLab, async (req, res) => {
    const { id } = req.params;
    const refyaccs = await Refyacc.findById(id).lean();
    const bienrs = await Bienr.find().lean();
    res.render('refyacc/editrefacc', { refyaccs,bienrs });
});
router.post('/refacciones-accesorios/editar/:id', authHelpers.isAuthenticated, authHelpers.isJefeLab, async (req, res) => {
    const { id } = req.params;
    await Refyacc.updateOne({_id:id}, req.body);
    logger.info({message: 'ACTUALIZACIÓN: Refacción o accesorio, con no. de resguardo: '+req.body.noresguardo+' ubicación: '+req.body.ubicacion});
    res.redirect('/refacciones-accesorios');
});

//Crear Garantia
router.get('/refacciones-accesorios/garantia/:id', authHelpers.isAuthenticated, authHelpers.isJefeLab, async (req, res) => {
    const { id } = req.params;
    const refyaccs = await Refyacc.findById(id).lean();
    res.render('garantias/formgarantiaR', { refyaccs });
});
router.post('/refacciones-accesorios/garantia/:id', async (req, res) => {
    const { id } = req.params;
    await Refyacc.updateOne({_id: id}, {
            'garantia': {
                fechavencimiento: req.body.fechavencimiento,
                proveedor: req.body.proveedor
            }
    });
    res.redirect('/garantias/refacciones-accesorios');
});

//Lista de refacciones y accesorios sin alta
router.get('/refacciones-accesorios-sin-alta', authHelpers.isAuthenticated, authHelpers.isJefeLab, async (req,res)=>{ 
    const refyaccauxes = await RefyaccAux.find().lean();
    res.render('refyacc/refyaccsSinAlta', { refyaccauxes });
});

//Dar de alta refacciones y accesorios que ingreso el auxiliar
router.get('/ingresar-refacciones-accesorios-sin-alta-autorizar/:id', authHelpers.isAuthenticated, authHelpers.isJefeLab, async (req, res) => {
    const { id } = req.params;
    const refyaccauxes = await RefyaccAux.findById({_id:id}, req.body).lean();
    const refyaccs = await Refyacc(refyaccauxes);
    await refyaccs.save();
    await RefyaccAux.findByIdAndDelete({_id:id});
    logger.info({message: 'NUEVO INGRESO: Refacción o accesorio, con no. de resguardo: '+refyaccauxes.noresguardo+' ubicación: '+refyaccauxes.ubicacion});
    res.redirect('/refacciones-accesorios-sin-alta');
});
//Rechazar alta refacciones y accesorios que ingreso el auxiliar
router.get('/ingresar-refacciones-accesorios-sin-alta-rechazar/:id', authHelpers.isAuthenticated, authHelpers.isJefeLab, async (req, res) => {
    const { id } = req.params;
    await RefyaccAux.findByIdAndDelete({_id:id});
    res.redirect('/refacciones-accesorios-sin-alta');
});

/******************** FEJE DE DEPARTAMENTO ********************/
//Lista de refacciones y accesorios
router.get('/jd-refacciones-accesorios', authHelpers.isAuthenticated, authHelpers.isJefeDep, async (req,res)=>{ 
    if(req.query.buscar){
        const refyaccs = await Refyacc.find({fecha:{$regex: req.query.buscar, $options:'i'}}).lean();
        if(refyaccs==false){
            const refyaccs = await Refyacc.find({ubicacion:{$regex: req.query.buscar, $options:'i'}}).lean();
            if(refyaccs==false){
                const refyaccs = await Refyacc.find({nombre:{$regex: req.query.buscar, $options:'i'}}).lean();
                if(refyaccs==false){
                    const refyaccs = await Refyacc.find({status:{$regex: req.query.buscar, $options:'i'}}).lean();
                    res.render('refyacc/refyaccsJD', { refyaccs }); //status
                }else res.render('refyacc/refyaccsJD', { refyaccs }); //nombre
            }else res.render('refyacc/refyaccsJD', { refyaccs }); //ubicacion
        }else res.render('refyacc/refyaccsJD', { refyaccs }); //fecha
    } else {
        const refyaccs = await Refyacc.find().lean();
        res.render('refyacc/refyaccsJD', { refyaccs });
    }
}); 

/******************** AUXILIAR DE LABORATORIO ********************/
//Agregar tipo de refacciones o accesorios
router.get('/al/ingresar-refacciones-accesorios', authHelpers.isAuthenticated, authHelpers.isAuxLab, async (req,res)=>{
    const bienrs = await Bienr.find().lean();
    res.render('layouts/inventarioRAux', { bienrs });
});

//Crear refacciones y accesorios
router.get('/al/ingresar-refacciones-accesorios', authHelpers.isAuthenticated, authHelpers.isAuxLab, async (req,res)=>{
    res.render('layouts/inventarioRAux');
});
router.post('/al-refacciones-accesorios', authHelpers.isAuthenticated, authHelpers.isAuxLab, async (req, res) => {
    const body = req.body
    const newRef = new RefyaccAux({
        noresguardo: body.noresguardo,
        nointerno: "02" + body.nointerno + "SyC",
        nombre: body.nombre,
        fecha: body.fecha,
        ubicacion: body.ubicacion,
        status: body.status,
        descripcion: body.descripcion,
        garantia: body.garantia,
        createdAt: body.createdAt
    });
    await newRef.save();
    res.redirect('/al-refacciones-accesorios');
});

//Lista de refacciones y accesorios
router.get('/al-refacciones-accesorios', authHelpers.isAuthenticated, authHelpers.isAuxLab, async (req,res)=>{ 
    if(req.query.buscar){
        const refyaccs = await Refyacc.find({fecha:{$regex: req.query.buscar, $options:'i'}}).lean();
        if(refyaccs==false){
            const refyaccs = await Refyacc.find({ubicacion:{$regex: req.query.buscar, $options:'i'}}).lean();
            if(refyaccs==false){
                const refyaccs = await Refyacc.find({nombre:{$regex: req.query.buscar, $options:'i'}}).lean();
                if(refyaccs==false){
                    const refyaccs = await Refyacc.find({status:{$regex: req.query.buscar, $options:'i'}}).lean();
                    res.render('refyacc/refyaccsAux', { refyaccs }); //status
                }else res.render('refyacc/refyaccsAux', { refyaccs }); //nombre
            }else res.render('refyacc/refyaccsAux', { refyaccs }); //ubicacion
        }else res.render('refyacc/refyaccsAux', { refyaccs }); //fecha
    } else {
        const refyaccs = await Refyacc.find().lean();
        res.render('refyacc/refyaccsAux', { refyaccs });
    }
}); 

//Lista de refacciones y accesorios sin alta
router.get('/al/refacciones-accesorios-sin-alta', authHelpers.isAuthenticated, authHelpers.isAuxLab, async (req,res)=>{ 
    const refyaccauxes = await RefyaccAux.find().lean();
    res.render('refyacc/refyaccsAuxSinAlta', { refyaccauxes });
});

/*************************** EXPORTAR ***************************/
//jefe de laboratorio
router.get('/refacciones-accesorios-exportar', authHelpers.isAuthenticated, authHelpers.isJefeLab, async (req,res)=>{ 
    const dateTime = new Date().toISOString().slice(-24).replace(/\D/g, '').slice(0, 14); 
    const filePath = path.join(__dirname,"../../", "refacciones-accesorios-" + dateTime + ".csv");
    let csv; 

    if(req.query.buscar){
        const refyaccs = await Refyacc.find({fecha:{$regex: req.query.buscar, $options:'i'}}).lean();
        if(refyaccs==false){
            const refyaccs = await Refyacc.find({ubicacion:{$regex: req.query.buscar, $options:'i'}}).lean();
            const fields = ['noresguardo', 'nointerno', 'nombre', 'fecha', 'ubicacion', 'status', 'descripcion'];
            try {
                    csv = json2csv(refyaccs, {fields});
                } catch (err) {
                    return res.status(500).json({err});
                }
            fs.writeFile(filePath, csv, function (err) {
                    if (err) {
                        return res.json(err).status(500);
                    }
                    else {
                    }
                });
            if(refyaccs==false){
                const refyaccs = await Refyacc.find({nombre:{$regex: req.query.buscar, $options:'i'}}).lean();
                if(refyaccs==false){
                    const refyaccs = await Refyacc.find({status:{$regex: req.query.buscar, $options:'i'}}).lean();
                    const fields = ['noresguardo', 'nointerno', 'nombre', 'fecha', 'ubicacion', 'status', 'descripcion'];
                    try {
                            csv = json2csv(refyaccs, {fields});
                        } catch (err) {
                            return res.status(500).json({err});
                        }
                    fs.writeFile(filePath, csv, function (err) {
                            if (err) {
                                return res.json(err).status(500);
                            }
                            else {
                            }
                        });
                    res.redirect('/refacciones-accesorios'); //status
                }else res.redirect('/refacciones-accesorios'); //nombre
            }else res.redirect('/refacciones-accesorios'); //ubicacion
        }else res.redirect('/refacciones-accesorios'); //fecha
    } else {
        const refyaccs = await Refyacc.find().lean();
        const fields = ['noresguardo', 'nointerno', 'nombre', 'fecha', 'ubicacion', 'status', 'descripcion'];
                    try {
                            csv = json2csv(refyaccs, {fields});
                        } catch (err) {
                            return res.status(500).json({err});
                        }
                    fs.writeFile(filePath, csv, function (err) {
                            if (err) {
                                return res.json(err).status(500);
                            }
                            else {
                            }
                        });
        res.redirect('/refacciones-accesorios');
    }
}); 

//jefe de departamento
router.get('/jd-refacciones-accesorios-exportar', authHelpers.isAuthenticated, authHelpers.isJefeDep, async (req,res)=>{ 
    const dateTime = new Date().toISOString().slice(-24).replace(/\D/g, '').slice(0, 14); 
    const filePath = path.join(__dirname,"../../", "refacciones-accesorios-" + dateTime + ".csv");
    let csv; 

    if(req.query.buscar){
        const refyaccs = await Refyacc.find({fecha:{$regex: req.query.buscar, $options:'i'}}).lean();
        if(refyaccs==false){
            const refyaccs = await Refyacc.find({ubicacion:{$regex: req.query.buscar, $options:'i'}}).lean();
            const fields = ['noresguardo', 'nointerno', 'nombre', 'fecha', 'ubicacion', 'status', 'descripcion'];
            try {
                    csv = json2csv(refyaccs, {fields});
                } catch (err) {
                    return res.status(500).json({err});
                }
            fs.writeFile(filePath, csv, function (err) {
                    if (err) {
                        return res.json(err).status(500);
                    }
                    else {
                    }
                });
            if(refyaccs==false){
                const refyaccs = await Refyacc.find({nombre:{$regex: req.query.buscar, $options:'i'}}).lean();
                if(refyaccs==false){
                    const refyaccs = await Refyacc.find({status:{$regex: req.query.buscar, $options:'i'}}).lean();
                    const fields = ['noresguardo', 'nointerno', 'nombre', 'fecha', 'ubicacion', 'status', 'descripcion'];
                    try {
                            csv = json2csv(refyaccs, {fields});
                        } catch (err) {
                            return res.status(500).json({err});
                        }
                    fs.writeFile(filePath, csv, function (err) {
                            if (err) {
                                return res.json(err).status(500);
                            }
                            else {
                            }
                        });
                    res.redirect('/jd-refacciones-accesorios'); //status
                }else res.redirect('/jd-refacciones-accesorios'); //nombre
            }else res.redirect('/jd-refacciones-accesorios'); //ubicacion
        }else res.redirect('/jd-refacciones-accesorios'); //fecha
    } else {
        const refyaccs = await Refyacc.find().lean();
        const fields = ['noresguardo', 'nointerno', 'nombre', 'fecha', 'ubicacion', 'status', 'descripcion'];
                    try {
                            csv = json2csv(refyaccs, {fields});
                        } catch (err) {
                            return res.status(500).json({err});
                        }
                    fs.writeFile(filePath, csv, function (err) {
                            if (err) {
                                return res.json(err).status(500);
                            }
                            else {
                            }
                        });
        res.redirect('/jd-refacciones-accesorios');
    }
}); 


module.exports = router;