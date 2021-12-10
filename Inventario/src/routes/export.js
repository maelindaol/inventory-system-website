
const express = require('express');
const router = express.Router();
const authHelpers = require('../helpers/auth');
const Concepto = require('../models/Concepto');
const XLSX = require('xlsx');

const convertJsonToExcel = () => {

    const conceptos = Concepto.find().lean();
    const workSheet = XLSX.utils.json_to_sheet(conceptos);
    const workBook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workBook, workSheet, "conceptos")
    // Generate buffer
    XLSX.write(workBook, { bookType: 'xlsx', type: "buffer" })

    // Binary string
    XLSX.write(workBook, { bookType: "xlsx", type: "binary" })

    XLSX.writeFile(workBook, "mobiliario-equipo-de-computo.xlsx")

}
//convertJsonToExcel()