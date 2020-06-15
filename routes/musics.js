const express = require('express');
const router = express.Router();

// Mucic Model
const Music = require('../model/Music');
// User Model
const User = require('../model/Users');

// eA = middle function

const eA = (req,res,next) => {
    if (req.isAuthenticated()){
      next();
    } else{
        req.flash('danger', 'Iltimos Tizimga Kiring !!!');
        res.redirect('/login');
    }
};

// FOR ADD MUSICS GET
router.get('/musics/add', eA, (req,res) => {
    res.render('music_add', {
        title: 'Musiqa Qo\'shish'
    });
});
// FOR ADD MUSICS POST
router.post('/musics/add', eA, (req,res) => {

    req.checkBody('name', "Ism Bo'sh Bo'lmasligi Kerak").notEmpty();
    //req.checkBody('singer', "Bastakor Bo'sh Bo'lmasligi Kerak").notEmpty();
    req.checkBody('comment', "Izoh Bo'sh Bo'lmasligi Kerak").notEmpty();

    const errors = req.validationErrors();

    if (errors){
        res.render('music_add', {
            title: 'Musiqa Qo\'shish',
            errors: errors
        })
    }else{
        const music = new Music();
        music.name = req.body.name;
        music.singer = req.user._id;
        music.comment = req.body.comment;

        music.save((err) => {
            if (err){
                console.log(err);
            } else{
                req.flash('success', 'Musiqa Muvaffaqiyatli Qo\'shildi !');
                res.redirect('/');
            }
        });
    }
});
// FOR GET BY ID MUSICS GET
router.get('/musics/:id', eA, (req,res) => {
    Music.findById(req.params.id, (err, music) => {
        User.findById(music.singer, (err, user) => {
            res.render('music', {
                music: music,
                singer: user.name
            });
        });

    });
});

// FOR GET BY ID MUSICS GET
router.get('/music/edit/:id', eA, (req,res) => {
    Music.findById(req.params.id, (err, music) => {

        if (music.singer != req.user._id){
            req.flash('danger', 'Haqqingiz Yoq !');
            res.redirect('/');
        }
        res.render('music_edit', {
            title: 'Musiqani O\'zgartirish',
            music: music
        });
    });
});

// UPDATE MUSICS
router.post('/music/edit/:id', eA, (req,res) => {
    const music = {};
    music.name = req.body.name;
    music.singer = req.body.singer;
    music.comment = req.body.comment;

    const query = {_id:req.params.id};

    Music.updateOne(query, music, (err) => {
        if (err){
            console.log(err);
        } else{
            req.flash('success', 'Musiqa Muvaffaqiyatli O\'zgartirildi !');
            res.redirect('/');
        }
    })
});

// FOR GET BY ID MUSICS GET
router.delete('/musics/:id', eA, (req,res) => {
    if (!req.user._id)
        res.status(500).send();

    let a = {_id: req.params.id};

    Music.findById(req.params.id, (err, music) => {
       if (music.singer != req.user._id)
           res.status(500).send();
       else{
           Music.deleteOne(a, (err) => {
               if (err)
                   console.log(err)

               res.send('Success');
           });
       }
    });


});


module.exports = router;