const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/user');
const Profile = require('../../models/Profile');
const { check, validationResult } = require('express-validator/check');

// @route GET user api/profile/me
// get current users profile
// @access private
router.get('/me', auth, async (req,res) => {

    try {
        const profile = await Profile.findOne({user: req.user.id}).populate('user',['name','avatar']);

        if(!profile){
            return res.status(400).send('There is no profile for this user'); 
        }

    } catch (error) {
        console.error(err.message);
       return res.stauts(500).send('server error');
    }
});
// @route POST user api/profile/
// create user profile
// @access private

router.post('/', [
                    auth,
                    [
                        check('status','status required').not().isEmpty(),
                        check('skills','skill is requuired').not().isEmpty()
                    ]
                 ],
            async (req,res) => {
                const errors = await validationResult(req);
                if(!errors.isEmpty()){
                    return res.status(500).json({errors: errors.array() });
        }

        const {
            company,
            website,
            location,
            bio,
            status,
            githubusername,
            skills,
            youtube,
            facebook,
            twitter,
            instagram,
            linkedin
          } = req.body;

    //build profile object
    const profileField = {};
    profileField.user = req.user.id;
    if(company) profileField.company = company;
    if(website) profileField.website = website;
    if(location) profileField.location = location;
    if(bio) profileField.bio = bio;
    if(status) profileField.status = status;
    if(githubusername) profileField.githubusername = githubusername;
    if(skills){
        profileField.skills = skills.split(',').map(skill => skill.trim());

    //build social object
    profileField.social = {};
    if(twitter) profileField.social.twitter = twitter;
    if(facebook) profileField.social.facebook = facebook;
    if(linkedin) profileField.social.linkedin = linkedin;
    if(instagram) profileField.social.instagram = instagram;
    if(youtube) profileField.social.youtube = youtube;

    try {
        let profile = await Profile.findOne({user: req.user.id});
        if(profile){
            //update the profile
            profile = await Profile.findOneAndUpdate(
                { user: req.user.id}, 
                { $set: profileField},
                {new: true}
                );
            return res.json(profile); 
        }
        //create a profile if not find
        profile = new Profile(profileField);
        await profile.save();
        res.json(profile);

    } catch (err) {
        console.error(err.message);
        res.stauts(500).send('server error'); 
    }
    }
});

// @route GET user api/profile/
// GET ALL user profile
// @access public
router.get('/', async (req,res) => {
try {
    const profiles = await Profile.find().populate('User',['name','avatar']);
   return res.json(profiles);
} catch (err) {
    console.error(err.message);
    res.status(500).send('server errorr');    
}
});

// @route GET user api/profile/user/:user_id
// GET  user profile by user id
// @access public
router.get('/user/:user_id', async (req,res) => {
    try {
        const profile = await Profile.findOne({user: req.params.user_id}).populate('User',['name','avatar']);
        if(!profile){
            return res.status(400).json({msg: 'profile not found'});
        }
            return res.json(profile);
     } catch (err) {
        console.error(err.message);
        if(err.kind == 'ObjectId'){
            return res.status(400).json({msg: 'profile not found !!!'});
        }
        res.status(500).send('server errorr');
        
    }
    });

// @route Delete api/profile
// delete profile user and post
// @access private
router.delete('/', auth, async (req,res) => {
    try {
        //remove profile
        await Profile.findOneAndRemove({user: req.user.id});
        //remove user
        await User.findOneAndRemove({ _id: req.user.id});
        res.json({msg: 'user deleted'});

     } catch (err) {
        console.error(err.message);
        res.status(500).send('server errorr');
        
    }
    });

// @route put api/profile/experience
// @desc all profile experience
// @access private
router.put('/experience',[
    auth,[
        check('title', 'Titile is required').not().isEmpty(),
        check('company', 'company is required').not().isEmpty(),
        check('from', 'From date is required').not().isEmpty(),
    ]
], 
async (req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.stauts(400).json({errors: errors.array() });
    }

    const {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    } = req.body;
    
    const newExp = {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    }

    try {
        const profile = await Profile.findOne({user: req.user.id});
        profile.experience.unshift(newExp);
        await profile.save();
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('server error');
    }
});

module.exports = router;