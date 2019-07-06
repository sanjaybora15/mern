const express = require('express');
const router = express.Router();
const config = require('config');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator/check');
const User = require('../../models/user');
const jwt = require('jsonwebtoken');

// @route post all users
// @access public
router.post('/',[
    check('name','Name is required').not().isEmpty(),
    check('email','please include a valid email id').isEmail(),
    check('password','please enter a password with minimum 6 character').isLength({min: 6,})
],
async (req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    const {name,email,password} = req.body;

    try {
    //see if user exists
        let user = await User.findOne({email});
        if(user){
           return res
            .status(400)
            .json({errors: [{msg: 'user already exists'}] });
        }
    //get users gravator
        const avatar = gravatar.url(email,{
            s: '200',
            r: 'pg',
            d: 'mm'
        });

        user = new User({
            name,
            email,
            avatar,
            password
        });
    //encrypt password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();

    //return json web token(Jwt)
        const payload = {
            user:{
                id: user.id,
            }
        }
        jwt.sign(payload, config.get('jwtSecret'), {expiresIn: 360000},
        (err, token) => {
            if(err) throw err;
            res.json({token});
        });
        } catch (err) {
        console.error(err.message);
        return res.status(500).send('Internal Server Error');
    }
});

module.exports = router;