const Transaction = require('./Transaction');
const User = require('./User');

async function createTransactionForUser(userId, amount, description) {
  const transaction = new Transaction({
    user: userId,  // this is the _id of an existing User document
    amount,
    description
  });

  await transaction.save();
  return transaction;
}
