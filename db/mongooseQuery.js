const {mongoose} = require('./mongoose');
var {registerInformation} = require('./../models/userReg');

var getOneUser = function(_userName){
    registerInformation.find({userName :_userName}).then((user)=>{return user;});
};
module.exports = {getUser: getOneUser};