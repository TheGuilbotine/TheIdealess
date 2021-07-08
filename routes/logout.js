const express = require('express');
const { logoutUser } = require('../auth');

const router = express.Router();

router.get('/', (req, res) => {
    logoutUser(req, res);
    res.redirect('/');
});

module.exports = router;
