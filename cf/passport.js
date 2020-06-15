const localStrategy = require('passport-local').Strategy;
const User = require('../model/Users');
const dbb = require('../cf/db');
const bcrypt = require('bcryptjs');

module.exports = (passport) => {
    passport.use(new localStrategy((username, password, done) => {
        let a = {username:username};
        User.findOne(a, (err, user) => {
            if (err)
                throw err;

            if (!user)
                done(null, false, {message: 'Foydalanuvchi Topilmadi !!!'})

            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err)
                    throw err;
                if (isMatch)
                    done(null, user)
                else
                    done(null, false, {message: 'Notogri Parol'})
            });
        });
    }));
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
};

