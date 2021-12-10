
const fs = require('fs');
const json2csv = require('json2csv').parse;
const path = require('path')
const express = require('express');
const router = express.Router();
const Concepto = require('../models/Concepto');
const ConceptoAux = require('../models/ConceptoAux');
const Bien = require('../models/Bien');
const logger = require('../loggers/logger');
const authHelpers = require('../helpers/auth');

/******************** PUBLICAS ********************/
//Ver mobiliario o equipo de computo
router.get('/conceptos/ver/:id', authHelpers.isAuthenticated, async (req, res) => {
    const { id } = req.params;
    const conceptos = await Concepto.findById(id).lean();
    res.render('conceptos/verconcepto', { conceptos });
});

//Ver lista de garantias
router.get('/garantias-mobiliario-equipo-computo', authHelpers.isAuthenticated, async (req,res)=>{  
    if(req.query.buscar){
        const conceptos = await Concepto.find({fecha:{$regex: req.query.buscar, $options:'i'}}).lean();
        if(conceptos==false){
            const conceptos = await Concepto.find({noresguardo:{$regex: req.query.buscar, $options:'i'}}).lean();
            if(conceptos==false){
                const conceptos = await Concepto.find({nointerno:{$regex: req.query.buscar, $options:'i'}}).lean();
                if(conceptos==false){
                    const conceptos = await Concepto.find({proveedor:{$regex: req.query.buscar, $options:'i'}}).lean();
                    if(conceptos==false){
                        const conceptos = await Concepto.find({nombre:{$regex: req.query.buscar, $options:'i'}}).lean();
                        res.render('layouts/garantias', { conceptos }); //nombre
                    }else res.render('layouts/garantias', { conceptos }); //proveedor
                }else res.render('layouts/garantias', { conceptos }); //nointerno
            }else res.render('layouts/garantias', { conceptos }); //noresguardo
        }else res.render('layouts/garantias', { conceptos }); //fecha
    } else {
        const conceptos = await Concepto.find(req.body).lean();
        res.render('layouts/garantias', { conceptos });
    }
});

/******************** FEJE DE LABORATORIO ********************/
//Agregar tipo de mobiliario o equipo de computo
router.get('/ingresar-tipo-mobiliario-equipo-computo', authHelpers.isAuthenticated, authHelpers.isJefeLab, async (req,res)=>{
    const biens = await Bien.find().lean();
    res.render('layouts/ingresarBien', { biens });
});
router.post('/ingresar-tipo-mobiliario-equipo-computo', authHelpers.isAuthenticated, authHelpers.isJefeLab, async (req, res) => {
    const newBien = new Bien({bien: req.body.bien});
    await newBien.save();
    res.redirect('/ingresar-tipo-mobiliario-equipo-computo');
});

//Eliminar tipo de mobiliario o equipo de computo
router.get('/ingresar-tipo-mobiliario-equipo-computo/delete/:id', authHelpers.isAuthenticated, authHelpers.isJefeLab, async (req, res) => {
    const { id } = req.params;
    await Bien.findByIdAndDelete({_id:id});
    res.redirect('/ingresar-tipo-mobiliario-equipo-computo');
});

//Lista tipo de mobiliario o equipo de computo en el select del formulario
router.get('/ingresar-mobiliario-equipo-computo', authHelpers.isAuthenticated, authHelpers.isJefeLab, async (req,res)=>{  
    const biens = await Bien.find().lean();
    res.render('layouts/inventario', { biens });
});

//Crear mobiliario o equipo de computo
router.get('/ingresar-mobiliario-equipo-computo', authHelpers.isAuthenticated, authHelpers.isJefeLab, async (req,res)=>{
    res.render('layouts/inventario');
});
router.post('/mobiliario-equipo-computo', authHelpers.isAuthenticated, authHelpers.isJefeLab, async (req, res) => {
    const body = req.body
    const newBien = new Concepto({
        noresguardo: body.noresguardo,
        nointerno: "01" + body.nointerno + "SyC",
        nombre:  body.nombre,
        noserie: body.noserie,
        fecha: body.fecha,
        ubicacion: body.ubicacion,
        status: body.status,
        descripcion: body.descripcion,
        garantia: body.garantia,
        createdAt: body.createdAt
    });
    await newBien.save();
    logger.info({message: 'NUEVO INGRESO: Mobiliario o equipo de computo, con no. de resguardo: '+newBien.noresguardo+' ubicación: '+newBien.ubicacion});
    res.redirect('/mobiliario-equipo-computo');
});

//Lista de mobiliario o equipo de computo
router.get('/mobiliario-equipo-computo', authHelpers.isAuthenticated, authHelpers.isJefeLab, async (req,res)=>{ 
    if(req.query.buscar){
        const conceptos = await Concepto.find({fecha:{$regex: req.query.buscar, $options:'i'}}).lean();
        if(conceptos==false){
            const conceptos = await Concepto.find({ubicacion:{$regex: req.query.buscar, $options:'i'}}).lean();
            if(conceptos==false){
                const conceptos = await Concepto.find({nombre:{$regex: req.query.buscar, $options:'i'}}).lean();
                if(conceptos==false){
                    const conceptos = await Concepto.find({status:{$regex: req.query.buscar, $options:'i'}}).lean();
                    if(conceptos==false){
                        const conceptos = await Concepto.find({noserie:{$regex: req.query.buscar, $options:'i'}}).lean();
                        res.render('conceptos/conceptos', { conceptos }); //noserie
                    }else res.render('conceptos/conceptos', { conceptos }); //status
                }else res.render('conceptos/conceptos', { conceptos }); //nombre
            }else res.render('conceptos/conceptos', { conceptos }); //ubicacion
        }else res.render('conceptos/conceptos', { conceptos }); //fecha
    } else {
        const conceptos = await Concepto.find().lean();
        res.render('conceptos/conceptos', { conceptos });
    }
}); 

//Editar mobiliario o equipo de computo
router.get('/conceptos/editar/:id', authHelpers.isAuthenticated, authHelpers.isJefeLab, async (req, res) => {
    const { id } = req.params;
    const conceptos = await Concepto.findById(id).lean();
    const biens = await Bien.find().lean();
    res.render('conceptos/editconceptos', { conceptos,biens });
});
router.post('/conceptos/editar/:id', authHelpers.isAuthenticated, authHelpers.isJefeLab, async (req, res) => {
    const { id } = req.params;
    await Concepto.updateOne({_id:id}, req.body);
    logger.info({message: 'ACTUALIZACIÓN: Mobiliario o equipo de computo, con no. de resguardo: '+req.body.noresguardo+' ubicación: '+req.body.ubicacion});
    res.redirect('/mobiliario-equipo-computo');
});

//Crear Garantia
router.get('/conceptos/garantia/:id', authHelpers.isAuthenticated, authHelpers.isJefeLab, async (req, res) => {
    const { id } = req.params;
    const conceptos = await Concepto.findById(id).lean();
    res.render('garantias/formgarantia', { conceptos });
});
router.post('/conceptos/garantia/:id', authHelpers.isAuthenticated, async (req, res) => {    
    const { id } = req.params;
    await Concepto.updateOne({_id: id}, {
            'garantia': {
                fechavencimiento: req.body.fechavencimiento,
                proveedor: req.body.proveedor
            }
    });
    res.redirect('/garantias-mobiliario-equipo-computo');
});

//Lista de mobiliario o equipo de computo sin alta
router.get('/mobiliario-equipo-computo-sin-alta', authHelpers.isAuthenticated, authHelpers.isJefeLab, async (req,res)=>{ 
    const conceptoauxes = await ConceptoAux.find().lean();
    res.render('conceptos/conceptosSinAlta', { conceptoauxes });
});

//Dar de alta mobiliario o equipo de computo que ingreso el auxiliar
router.get('/ingresar-mobiliario-equipo-computo-sin-alta-autorizar/:id', authHelpers.isAuthenticated, authHelpers.isJefeLab, async (req, res) => {
    const { id } = req.params;
    const conceptoauxes = await ConceptoAux.findById({_id:id}, req.body).lean();
    const conceptos = await Concepto(conceptoauxes);
    await conceptos.save();
    await ConceptoAux.findByIdAndDelete({_id:id});
    logger.info({message: 'NUEVO INGRESO: Mobiliario o equipo de computo, con no. de resguardo: '+conceptoauxes.noresguardo+' ubicación: '+conceptoauxes.ubicacion});
    res.redirect('/mobiliario-equipo-computo-sin-alta');
});

//Rechazar alta mobiliario o equipo de computo que ingreso el auxiliar
router.get('/ingresar-mobiliario-equipo-computo-sin-alta-rechazar/:id', authHelpers.isAuthenticated, authHelpers.isJefeLab, async (req, res) => {
    const { id } = req.params;
    await ConceptoAux.findByIdAndDelete({_id:id});
    res.redirect('/mobiliario-equipo-computo-sin-alta');
});

/******************** FEJE DE DEPARTAMENTO ********************/
//Lista de mobiliario o equipo de computo
router.get('/jd-mobiliario-equipo-computo', authHelpers.isAuthenticated, authHelpers.isJefeDep, async (req,res)=>{ 
    if(req.query.buscar){
        const conceptos = await Concepto.find({fecha:{$regex: req.query.buscar, $options:'i'}}).lean();
        if(conceptos==false){
            const conceptos = await Concepto.find({ubicacion:{$regex: req.query.buscar, $options:'i'}}).lean();
            if(conceptos==false){
                const conceptos = await Concepto.find({nombre:{$regex: req.query.buscar, $options:'i'}}).lean();
                if(conceptos==false){
                    const conceptos = await Concepto.find({status:{$regex: req.query.buscar, $options:'i'}}).lean();
                    if(conceptos==false){
                        const conceptos = await Concepto.find({noserie:{$regex: req.query.buscar, $options:'i'}}).lean();
                        res.render('conceptos/conceptosJD', { conceptos }); //noserie
                    }else res.render('conceptos/conceptosJD', { conceptos }); //status
                }else res.render('conceptos/conceptosJD', { conceptos }); //nombre
            }else res.render('conceptos/conceptosJD', { conceptos }); //ubi
        }else res.render('conceptos/conceptosJD', { conceptos }); //fecha
    } else {
        const conceptos = await Concepto.find().lean();
        res.render('conceptos/conceptosJD', { conceptos });
    }
});

/******************** AUXILIAR DE LABORATORIO ********************/
//Lista tipo de mobiliario o equipo de computo en el select del formulario
router.get('/al/ingresar-mobiliario-equipo-computo', authHelpers.isAuthenticated, authHelpers.isAuxLab, async (req,res)=>{  
    const biens = await Bien.find().lean();
    res.render('layouts/inventarioAux', { biens });
});

//Crear mobiliario o equipo de computo
router.get('/al/ingresar-mobiliario-equipo-computo', authHelpers.isAuthenticated, authHelpers.isAuxLab, async (req,res)=>{
    res.render('layouts/inventarioAux');
});
router.post('/al-mobiliario-equipo-computo', authHelpers.isAuthenticated, authHelpers.isAuxLab, async (req, res) => {
    const body = req.body
    const newBien = new ConceptoAux({
        noresguardo: body.noresguardo,
        nointerno: "01" + body.nointerno + "SyC",
        nombre: body.nombre,
        noserie: body.noserie,
        fecha: body.fecha,
        ubicacion: body.ubicacion,
        status: body.status,
        descripcion: body.descripcion,
        garantia: body.garantia,
        createdAt: body.createdAt
    });
    await newBien.save();
    res.redirect('/al-mobiliario-equipo-computo');
});

//Lista de mobiliario o equipo de computo
router.get('/al-mobiliario-equipo-computo', authHelpers.isAuthenticated, authHelpers.isAuxLab, async (req,res)=>{ 
    if(req.query.buscar){
        const conceptos = await Concepto.find({fecha:{$regex: req.query.buscar, $options:'i'}}).lean();
        if(conceptos==false){
            const conceptos = await Concepto.find({ubicacion:{$regex: req.query.buscar, $options:'i'}}).lean();
            if(conceptos==false){
                const conceptos = await Concepto.find({nombre:{$regex: req.query.buscar, $options:'i'}}).lean();
                if(conceptos==false){
                    const conceptos = await Concepto.find({status:{$regex: req.query.buscar, $options:'i'}}).lean();
                    if(conceptos==false){
                        const conceptos = await Concepto.find({noserie:{$regex: req.query.buscar, $options:'i'}}).lean();
                        res.render('conceptos/conceptosAux', { conceptos }); //noserie
                    }else res.render('conceptos/conceptosAux', { conceptos }); //status
                }else res.render('conceptos/conceptosAux', { conceptos }); //nombre
            }else res.render('conceptos/conceptosAux', { conceptos }); //ubi
        }else res.render('conceptos/conceptosAux', { conceptos }); //fecha
    } else {
        const conceptos = await Concepto.find().lean();
        res.render('conceptos/conceptosAux', { conceptos });
    }
});

//Lista de mobiliario o equipo de computo sin alta
router.get('/al/mobiliario-equipo-computo-sin-alta', authHelpers.isAuthenticated, authHelpers.isAuxLab, async (req,res)=>{ 
    const conceptoauxes = await ConceptoAux.find().lean();
    res.render('conceptos/conceptosAuxSinAlta', { conceptoauxes });
});

/*************************** EXPORTAR ***************************/
//jefe de laboratorio
router.get('/mobiliario-equipo-computo-exportar', authHelpers.isAuthenticated, authHelpers.isJefeLab, async (req,res)=>{ 
    const dateTime = new Date().toISOString().slice(-24).replace(/\D/g, '').slice(0, 14); 
    const filePath = path.join(__dirname,"../../", "mobiliario-equipo-de-computo-" + dateTime + ".csv");
    let csv; 

    if(req.query.buscar){
        const conceptos = await Concepto.find({fecha:{$regex: req.query.buscar, $options:'i'}}).lean();
        if(conceptos==false){
            const conceptos = await Concepto.find({ubicacion:{$regex: req.query.buscar, $options:'i'}}).lean();
            const fields = ['noresguardo', 'nointerno', 'nombre', 'noserie', 'fecha', 'ubicacion', 'status', 'descripcion'];
            try {
                    csv = json2csv(conceptos, {fields});
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
            if(conceptos==false){
                const conceptos = await Concepto.find({nombre:{$regex: req.query.buscar, $options:'i'}}).lean();
                if(conceptos==false){
                    const conceptos = await Concepto.find({status:{$regex: req.query.buscar, $options:'i'}}).lean();
                    const fields = ['noresguardo', 'nointerno', 'nombre', 'noserie', 'fecha', 'ubicacion', 'status', 'descripcion'];
                    try {
                            csv = json2csv(conceptos, {fields});
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
                    if(conceptos==false){
                        const conceptos = await Concepto.find({noserie:{$regex: req.query.buscar, $options:'i'}}).lean();
                        res.redirect('/mobiliario-equipo-computo'); //noserie
                    }else res.redirect('/mobiliario-equipo-computo'); //status
                }else res.redirect('/mobiliario-equipo-computo'); //nombre
            }else res.redirect('/mobiliario-equipo-computo'); //ubicacion
        }else res.redirect('/mobiliario-equipo-computo'); //fecha
    } else {
        const conceptos = await Concepto.find().lean();
        const fields = ['noresguardo', 'nointerno', 'nombre', 'noserie', 'fecha', 'ubicacion', 'status', 'descripcion'];
                    try {
                            csv = json2csv(conceptos, {fields});
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
        res.redirect('/mobiliario-equipo-computo');
    }
}); 

//jefe de departamento
router.get('/jd-mobiliario-equipo-computo-exportar', authHelpers.isAuthenticated, authHelpers.isJefeDep, async (req,res)=>{ 
    const dateTime = new Date().toISOString().slice(-24).replace(/\D/g, '').slice(0, 14); 
    const filePath = path.join(__dirname,"../../", "mobiliario-equipo-de-computo-" + dateTime + ".csv");
    let csv; 

    if(req.query.buscar){
        const conceptos = await Concepto.find({fecha:{$regex: req.query.buscar, $options:'i'}}).lean();
        if(conceptos==false){
            const conceptos = await Concepto.find({ubicacion:{$regex: req.query.buscar, $options:'i'}}).lean();
            const fields = ['noresguardo', 'nointerno', 'nombre', 'noserie', 'fecha', 'ubicacion', 'status', 'descripcion'];
            try {
                    csv = json2csv(conceptos, {fields});
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
            if(conceptos==false){
                const conceptos = await Concepto.find({nombre:{$regex: req.query.buscar, $options:'i'}}).lean();
                if(conceptos==false){
                    const conceptos = await Concepto.find({status:{$regex: req.query.buscar, $options:'i'}}).lean();
                    const fields = ['noresguardo', 'nointerno', 'nombre', 'noserie', 'fecha', 'ubicacion', 'status', 'descripcion'];
                    try {
                            csv = json2csv(conceptos, {fields});
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
                    if(conceptos==false){
                        const conceptos = await Concepto.find({noserie:{$regex: req.query.buscar, $options:'i'}}).lean();
                        res.redirect('/jd-mobiliario-equipo-computo'); //noserie
                    }else res.redirect('/jd-mobiliario-equipo-computo'); //status
                }else res.redirect('/jd-mobiliario-equipo-computo'); //nombre
            }else res.redirect('/jd-mobiliario-equipo-computo'); //ubi
        }else res.redirect('/jd-mobiliario-equipo-computo'); //fecha
    } else {
        const conceptos = await Concepto.find().lean();
        const fields = ['noresguardo', 'nointerno', 'nombre', 'noserie', 'fecha', 'ubicacion', 'status', 'descripcion'];
                    try {
                            csv = json2csv(conceptos, {fields});
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
        res.redirect('/jd-mobiliario-equipo-computo');
    }
});

module.exports = router;