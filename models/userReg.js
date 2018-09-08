const mongoose = require('mongoose');
const userRegisterSchema = new mongoose.Schema({
    userName: String,
    password: String,
	whieght: Number,
    hight : Number,
    birthDay: { year:Number ,
        month:Number ,
        daymonth:Number },
    gender: Boolean,
    activity: Number,
    sickness: Array,
    phoneNumber: String
});



var bcrypt = require('bcrypt'),
    SALT_WORK_FACTOR = 10;


userRegisterSchema.pre('save', function(next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});





var registerInformation = mongoose.model('user',userRegisterSchema);

module.exports = {registerInformation};