// @login & register
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');
const keys = require('../../config/keys');
const passport = require('passport');

const User = require('../../models/User');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

// @route  GET api/users/test
// @desc   返回的请求的json数据
// @access public
router.get('/test', (req, res) => {
    res.json({
        msg: 'login works'
    });
});

// @route  POST api/users/register
// @desc   返回的请求的json数据
// @access public
router.post('/register', (req, res) => {
    //查询数据是否有邮箱
    console.log('email:', req.body.email)
    User.findOne({
            where: {
                [Op.or]: [
                    {name: req.body.name},
                    {email: req.body.email}
                ]
            }
        })
        .then(user => {
            if (user) {
                return res.status(400).json(user.name == req.body.name ? '用户名已被注册':'邮箱已被注册');
            } else {
                const avatar = gravatar.url(req.body.email, {
                    s: '200',
                    r: 'pg',
                    d: 'mm'
                });
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    avatar,
                    password: req.body.password,
                    identity: req.body.identity
                });
                // console.log(newUser)
                bcrypt.genSalt(10, function (err, salt) {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        // Store hash in your password DB.
                        if (err) {
                            throw err;
                        }
                        newUser.password = hash;
                        newUser.save()
                            .then(user => res.json(user))
                            .catch(err => console.log(err))
                    });
                });
            }
        })
});

router.post('/login', (req, res) => {
    const account = req.body.account;
    const password = req.body.password;
    User.findOne({
            where: {
                [Op.or]: [
                    {name: account},
                    {phone: account},
                    {email: account}
                ]
            }
        })
        .then(user => {
            if (!user) {
                return res.status(404).json('用户不存在');
            }
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    console.log('isMatch:', isMatch)
                    if (isMatch) {
                        const rule = {
                            id: user.id,
                            nickName: user.nickName,
                            name: user.name,
                            sex: user.sex,
                            birthday: user.birthday,
                            phone: user.phone,
                            avatar: user.avatar,
                            identity: user.identity
                        };
                        jwt.sign(rule, keys.secretOrKey, {
                            expiresIn: "1 days" //过期时间
                        }, (err, token) => {
                            if (err) throw err;
                            console.log('token:', token)
                            res.json({
                                success: true,
                                token: 'Bearer ' + token
                            })
                        })
                    } else {
                        return res.status(400).json("密码错误");
                    }
                })
        })
});

// @route  GET api/users
// @desc   return all users
// @access Private
router.get(
    '/',
    passport.authenticate('jwt', {
        session: false
    }),
    (req, res) => {
        User.findAll()
            .then(users => {
                if (!users) {
                    return res.status(404).json('没有任何内容');
                }
                res.json(users);
            })
            .catch(err => {
                console.log(err);
                res.status(404).json(err)
            });
    }
);

// @route  POST api/users/edit
// @desc   编辑用户信息接口
// @access Private
router.post(
    '/edit/:id',
    passport.authenticate('jwt', {
        session: false
    }),
    (req, res) => {
        const _user = {};
        if (req.body.nickName != undefined) _user.nickName = req.body.nickName;
        if (req.body.name != undefined) _user.name = req.body.name;
        if (req.body.sex != undefined) _user.sex = req.body.sex;
        if (req.body.birthday != undefined) _user.birthday = req.body.birthday;
        if (req.body.phone != undefined) _user.phone = req.body.phone;
        if (req.body.cardNum != undefined) _user.cardNum = req.body.cardNum;
        if (req.body.email != undefined) _user.email = req.body.email;
        if (req.body.password != undefined) _user.password = req.body.password;
        if (req.body.avatar != undefined) _user.avatar = req.body.avatar;
        if (req.body.state != undefined) _user.state = req.body.state;
        User.update(_user, {
            where: {
                id: req.params.id
            }
        }).then(user => res.json(user));
    }
);

// @route  GET api/users/current
// @desc   return current user
// @access Private
router.get(
    '/current',
    passport.authenticate('jwt', {
        session: false
    }),
    (req, res) => {
        res.json({
            id: req.user.id,
            name: req.user.name,
            email: req.user.email,
            identity: req.user.identity
        });
    }
);

module.exports = router;