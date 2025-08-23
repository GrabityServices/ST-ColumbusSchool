const express = require('express')
const stcolumbus=express.Router()
const handelGet=require('../handler/get.js')
const getAdmin=require('../handler/handelAdmin.js')
stcolumbus.route('/').get(handelGet)
stcolumbus.route('/admin').get(getAdmin)
module.exports=stcolumbus