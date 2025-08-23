const express = require('express')
const stcolumbus=express.Router()
const handelGet=require('../handler/get.js')
stcolumbus.route('/').get(handelGet)

module.exports=stcolumbus