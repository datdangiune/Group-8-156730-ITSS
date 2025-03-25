const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const login = async(req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        res.status(200).json({ message: 'Login successful', token });
    } catch (err) {
        res.status(500).json({ message: 'Error logging in', error: err.message });
    }
}

const register = async(req, res) => {
    try {
        const { username, email, password} = req.body;
        if(!username || !email || !password){
            return res.status(400).json({message: 'Please fill in all fields'});
        }
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        const user = await User.create({ username, email, password});
        res.status(201).json({ message: 'User registered successfully', user });
    } catch (err) {
        res.status(500).json({ message: 'Error registering user', error: err.message });
    }
}

module.exports = {login, register}