const express = require('express');
const router = express.Router();
const Goal = require('../Models/Goal');

// Create a transaction
router.post('/create', async (req, res) => {
  try {
    const transaction = new Goal(req.body);
    await transaction.save();
    res.status(201).json(transaction);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all transactions for a specific user
router.get('/by-user/:userId', async (req, res) => {
  try {
    const transactions = await Goal.find({ user: req.params.userId }).populate('user');
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a transaction by ID and user ID (combined filter)
router.put('/update/:transactionId', async (req, res) => {
  try {
    const { transactionId } = req.params;
    const { userId } = req.query;

    const updated = await Goal.findOneAndUpdate(
      { _id: transactionId, user: userId },
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Transaction not found or not owned by user' });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a transaction by ID and user ID
router.delete('/delete/:transactionId', async (req, res) => {
  try {
    const { transactionId } = req.params;
    const { userId } = req.query;

    const deleted = await Goal.findOneAndDelete({
      _id: transactionId,
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
