const express = require('express');
const app =express();
const Joi = require('joi');
var bcrypt = require('bcrypt');

/**
 * This modules created by me!
 */
var {mongoose} = require('./db/mongoose');
var {registerInformation} =require('./models/userReg');
const myQuery = require('./db/mongooseQuery');

/**
 * 
 * @param {Real password. Should be a string} candidatePassword 
 * @param {Hashed password. Should be a string and hashed} ownPassword 
 * @param {A callBack function} cb 
 * A function for compare password and hashed password
 */
var comparePassword = function(candidatePassword,ownPassword, cb) {
    bcrypt.compare(candidatePassword, ownPassword, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

/**
 * Using JSON format for request and respons
 */
app.use(express.json());

/**
 * 
 * @param {This is an object and it should be a valid Object.For more information about structure of Object, see models file } user 
 * This method call when we need to add new user to our system
 */
async function createUser(user) {
    const myUser = new registerInformation({
        userName: user.userName,
        password: user.password,
        whieght: user.whieght,
        hight : user.hight,
        birthDay: user.birthDay,
        gender: user.gender,
        activity: user.activity,
        sickness: user.sickness,
        phoneNumber: user.phoneNumber
    });
    const result = await myUser.save()
    .then((doc)=>{console.log('Saved user ',doc.id);},(e)=>{console.log('Unable save user');});
}


/**
 * Post section for this url: http://host:3000/login
 */
app.post('/login',(req,res)=>{
    const schema = {
        userName: Joi.string().min(5).required(),
        password : Joi.string().min(8).max(20).required()
    };
    const result =Joi.validate(req.body,schema);
    if(result.error)
    {
        res.status(400).send(result.error.details[0].message);
        return;
    }

    registerInformation.find({ userName: req.body.userName }, function(err, user) {
        if(err)
        {
            console.log('Error in run qurey');
        }
        //console.log(user);
        if(user.length === 0){
            res.status(400).send('Could not find. UserName incorect');
        }
        else
        {
            comparePassword(req.body.password,user[0].password, function(err, isMatch) {
                if (err){
                    console.log(err);
                    res.status(500).send('Internal Error');
                }
                else {
                    if(isMatch)
                    {
                        console.log('Password is correct');
                        res.status(201).send('Passwor is ok');
                    }
                    else
                    {
                        console.log('Password is notx correct');
                        res.status(400).send('Password is not ok');
                    }
                    
                }
            });
        }
    });    
});

/**
 *  Post section for this url: http://host:3000/register
 */
app.post('/register',(req,res)=>{
    const schema = {
        whieght: Joi.number().min(40).required(),
        hight : Joi.number().min(100).max(250).required(),
        birthDay: Joi.object({year: Joi.number().min(1340).max(1395).required(),month: Joi.number().min(1).max(12).required(),daymonth: Joi.number().min(1).max(31).required()}),
        gender: Joi.boolean().required(),
        activity: Joi.number().min(0).max(4).required(),
        sickness: Joi.array().items(Joi.number()),
        userName: Joi.string().min(5).required(),
        phoneNumber: Joi.string().min(11).max(11).required(),
        password: Joi.string().min(8).max(20).required()
    };
    const result =Joi.validate(req.body,schema);
    if(result.error)
    {
        res.status(400).send(result.error.details[0].message);
        return;
    }
    var Qr = registerInformation.find({userName :req.body.userName});
    Qr.exec((err, user)=>{
        if(err)
        {
            console.log('Error in run qurey');
        }
        if(user.length === 0){
            createUser(req.body);
            res.status(201).send(result);
        }
        else
        {
            res.status(400).send('Could not add. UserName Duplicated');
        }
    });
    //console.log(Qr);
});

/**
 * Find port and listen to this port
 */
const port = process.env.PORT ||3000;
app.listen(port,()=>{
   console.log(`Listening port ${port}`); 
});