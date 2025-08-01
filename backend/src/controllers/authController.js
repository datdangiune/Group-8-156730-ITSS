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
        if(user.role === 'vet' || user.role === 'staff' || user.role === 'admin'){
            return res.status(401).json({ message: 'Access denied' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user.id, role: user.role, username: user.username, email: user.email}, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        res.status(200).json({ message: 'Login successful', token });
    } catch (err) {
        res.status(500).json({ message: 'Error logging in', error: err.message });
    }
}

const register = async(req, res) => {
    try {
        const { username, email, password, name} = req.body; // Add 'name' to destructuring
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Please fill in all required fields' });
        }
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        await User.create({
            username: username,
            email,
            password,
            name: name, // Use 'username' as the default value for 'name'
        });
        res.status(201).json({ message: 'User registered successfully', success: true });
    } catch (err) {
        res.status(500).json({ message: 'Error registering user', error: err.message });
    }
}
const loginVetStaff = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (user.role !== 'vet' && user.role !== 'staff') {
            return res.status(403).json({ message: 'Access denied' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user.id, role: user.role, username: user.username, email: user.email }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        res.status(200).json({ message: 'Login successful', token, role: user.role });
    } catch (err) {
        res.status(500).json({ message: 'Error logging in', error: err.message });
    }
};

const registerStaff = async(req, res) => {
    try {
        const { username, email, password, name} = req.body; // Add 'name' to destructuring
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Please fill in all required fields' });
        }
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        await User.create({
            username: username,
            email,
            password,
            name: name, // Use 'username' as the default value for 'name'
            role: 'vet', // Set the role to 'staff' for staff registration
        });
        res.status(201).json({ message: 'User registered successfully', success: true });
    } catch (err) {
        res.status(500).json({ message: 'Error registering user', error: err.message });
    }
};

const registerAdmin = async(req, res) => {
    try {
        const { username, email, password, name} = req.body; // Add 'name' to destructuring
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Please fill in all required fields' });
        }
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        await User.create({
            username: username,
            email,
            password,
            name: name, // Use 'username' as the default value for 'name'
            role: 'admin', // Set the role to 'staff' for staff registration
        });
        res.status(201).json({ message: 'User registered successfully', success: true });
    } catch (err) {
        res.status(500).json({ message: 'Error registering user', error: err.message });
    }
};

const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user.id, role: user.role, username: user.username, email: user.email }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });
        res.status(200).json({ message: 'Login successful', token, role: user.role });
    } catch (err) {
        res.status(500).json({ message: 'Error logging in', error: err.message });
    }
};
module.exports = { login, register, loginVetStaff, registerStaff , registerAdmin, loginAdmin};
