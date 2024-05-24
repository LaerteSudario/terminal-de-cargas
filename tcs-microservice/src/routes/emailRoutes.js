const express = require('express');
const EmailController = require('../controllers/emailController');

const router = express.Router();

router.post('/getDocuments', EmailController.getDocuments);
router.get('/getInfoDocument/:filename', EmailController.getInfoDocument);

module.exports = router;

