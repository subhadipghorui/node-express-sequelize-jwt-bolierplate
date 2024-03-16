
const bcrypt = require('bcrypt');
const usersDB = {
    users: require('../models/users.json'),
    setUsers: function (data) { this.users = data }
}
const jwt = require('jsonwebtoken');
require('dotenv').config();

const { sequelize, User, RevokeToken } = require('../models')
const handleLogin = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ 'message': 'email and password are required.' });
    const foundUser = await User.findOne({ where: { email } });
    if (!foundUser) return res.sendStatus(401); //Unauthorized 
    // evaluate password 
    const match = await bcrypt.compare(password, foundUser.password);

    if (match) {
        // create JWTs
        const accessToken = jwt.sign(
            { "email": foundUser.email, "name":  foundUser.name, "role": foundUser.role},
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '30s' }
        );
        const refreshToken = jwt.sign(
            { "email": foundUser.email, "name":  foundUser.name, "role": foundUser.role},
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );
       
 
        res.cookie('jwt', refreshToken, { httpOnly: true,  maxAge: 24 * 60 * 60 * 1000 }); // sameSite: 'None', secure: true,   
        res.json({ accessToken });
    } else {
        res.sendStatus(401);
    }
}

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;
    
    // Check if token is revoked
    const revokedToken = await RevokeToken.findOne({ where: { token: refreshToken } });
    if (revokedToken) {
        return res.status(401).json({ message: 'Token has been revoked' });
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, user) => {
        if (err) return res.status(403).json({ message: 'Forbidden' });
        const foundUser = await User.findOne({ where: { email: user.email } });
        if (!foundUser) return res.sendStatus(401); //Unauthorized 
        const {email, name, role} = foundUser

        const accessToken = jwt.sign( 
            {email, name, role}
            , process.env.REFRESH_TOKEN_SECRET, 
            { expiresIn: '30m' });
        res.json({ accessToken });
    });
}

const handleNewUser = async (req, res) => {
    let { name, email, password, role } = req.body;
    if (!email || !password) return res.status(400).json({ 'message': 'Email and password are required.' });
    password = await bcrypt.hash(password, 10);
    try {
        const userExist = await User.findOne({ where: { email } });
        if (userExist) return  res.status(400).json({ message: 'Email already exists' }); //Unauthorized 

        const newUser = await User.create({ name, email, password, role });
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Something worng', error: error });
    }
}


const handleLogout = async (req, res) => {
    // On client, also delete the accessToken

    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204); //No content
    const token = cookies.jwt;

    try {
        await RevokeToken.create({ token });
        res.clearCookie('jwt', { httpOnly: true});
        res.json({ message: 'Token revoked successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

module.exports = { handleLogin, handleRefreshToken, handleNewUser, handleLogout };