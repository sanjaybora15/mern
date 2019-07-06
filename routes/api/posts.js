const express = require('express');
const router = express.Router();

// @route GET user posts
// @access public
router.get('/',(req,res) => res.send('post api'));

module.exports = router;