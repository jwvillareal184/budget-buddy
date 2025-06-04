const express = require('express');
const router = express.Router();

const Transaction = require('../Models/Transactions');

router.post('/add-transaction', async(request, response) => {
    try {
        const transaction = new Transaction(request.body);
        await transaction.save();
        response.status(2001).json(transaction);
    } catch(err) {
        response.status(400).json({error: err.message});
    }
});

router.get('/by-user', async (request, response) => {
    const userId = request.query.userId;
  
    try {
      const transactions = await Transaction.find({ user: userId }).populate('user');
      response.json(transactions);
    } catch (err) {
      response.status(500).json({ error: err.message });
    }
  });

  router.put('/update-transaction', async (request, response) => {
    const { transactionId, userId, ...updateData } = request.body;
  
    try {
      const transaction = await Transaction.findOneAndUpdate(
        { _id: transactionId, user: userId }, // match both transaction and user
        updateData,
        { new: true } // return the updated transaction
      );
  
      if (!transaction) {
        return response.status(404).json({ message: 'Transaction not found or not authorized' });
      }
  
      response.json(transaction);
    } catch (err) {
      response.status(500).json({ error: err.message });
    }
  });

  router.delete('/delete-transaction', async (request, response) => {
    const { transactionId, userId } = request.body;
  
    try {
      const transaction = await Transaction.findOneAndDelete({
        _id: transactionId,
        user: userId
      });
  
      if (!transaction) {
        return response.status(404).json({ message: 'Transaction not found or not authorized to delete' });
      }
  
      response.json({ message: 'Transaction deleted successfully', transaction });
    } catch (err) {
      response.status(500).json({ error: err.message });
    }
  });
  
module.exports = router;
  