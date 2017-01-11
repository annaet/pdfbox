var express = require('express');
var bodyParser = require('body-parser');
var pdf = require('./pdf');

var router = express.Router();
router.use(bodyParser.json());

router.post('/page', pdf.getPage);

module.exports = router;
