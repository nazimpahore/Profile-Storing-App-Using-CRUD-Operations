const express = require('express');
const router = express.Router();
const userModel = require('../models/user');

// GET / — Show create-user form
router.get('/', (req, res) => {
  res.render('index');
});

// GET /read — List all users
router.get('/read', async (req, res) => {
  try {
    const users = await userModel.find().sort({ createdAt: -1 });
    res.render('read', { users });
  } catch (err) {
    console.error('Error fetching users:', err.message);
    res.status(500).send('Server error: could not fetch users.');
  }
});

// POST /create — Create a new user
router.post('/create', async (req, res) => {
  try {
    const { name, email, image } = req.body;
    await userModel.create({ name, email, image });
    res.redirect('/read');
  } catch (err) {
    console.error('Error creating user:', err.message);
    res.status(500).send('Server error: could not create user.');
  }
});

// GET /edit/:id — Show edit form
router.get('/edit/:id', async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);
    if (!user) return res.status(404).send('User not found.');
    res.render('edit', { user });
  } catch (err) {
    console.error('Error loading user for edit:', err.message);
    res.status(500).send('Server error: could not load user.');
  }
});

// POST /update/:id — Update a user
router.post('/update/:id', async (req, res) => {
  try {
    const { name, email, image } = req.body;
    const user = await userModel.findByIdAndUpdate(
      req.params.id,
      { name, email, image },
      { new: true, runValidators: true }
    );
    if (!user) return res.status(404).send('User not found.');
    res.redirect('/read');
  } catch (err) {
    console.error('Error updating user:', err.message);
    res.status(500).send('Server error: could not update user.');
  }
});

// GET /delete/:id — Delete a user
router.get('/delete/:id', async (req, res) => {
  try {
    const user = await userModel.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).send('User not found.');
    res.redirect('/read');
  } catch (err) {
    console.error('Error deleting user:', err.message);
    res.status(500).send('Server error: could not delete user.');
  }
});

module.exports = router;
