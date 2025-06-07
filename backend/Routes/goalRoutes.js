const express = require('express');
const router = express.Router();
const Goal = require('../Models/Goal');

// Create a transaction
router.post('/add-goal', async (req, res) => {
  try {
    const transaction = new Goal(req.body);
    await transaction.save();
    res.status(201).json(transaction);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all goals for a specific user
router.get('/by-user', async (req, res) => {
  const userId = req.query.userId;
  try {
    const goals = await Goal.find({ user: userId }).populate('user');
    res.json(goals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a transaction by ID and user ID (combined filter)
router.put('/update-goal', async (req, res) => {
  try {
    const { goalId, userId, ...updateData } = req.body;

    const updated = await Goal.findOneAndUpdate(
      { _id: goalId, user: userId },
      updateData,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Goal not found or not owned by user' });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a transaction by ID and user ID
router.delete('/delete-goal', async (req, res) => {
  const { goalId, userId } = req.body;
  try {
    const deleted = await Goal.findOneAndDelete({
      _id: goalId,
      user: userId
    });

    if (!deleted) {
      return res.status(404).json({ error: 'Transaction not found or not owned by user' });
    }

    res.json({ message: 'Transaction deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
