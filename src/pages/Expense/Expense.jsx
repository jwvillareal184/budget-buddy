import { useState, useEffect } from 'react';
import { useUser } from '../../context/UserContext';
import {Headers,PrimaryButton,FloatingLabelInput, SecondaryButton, Modal, Card} from '../../components';
import {fetchTransactions,addTransaction,updateTransaction,deleteTransaction} from '../../services/TransactionServices';
import '../../styles/styles.css';
import { timeStampConverter } from '../../utils/timeStampConverter';


export const Expense = () => {
  const { user } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const[expenses, setExpenses] = useState();
  const [transactionData, setTransactionData] = useState({
    amount: '',
    transacType: 'expense',
    description: '',
    dateCreated: new Date().toISOString().split('T')[0],
  });
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTransactionData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const transaction = {
      ...transactionData,
      amount: Number(transactionData.amount),
      dateCreated: new Date().toISOString(),
    };
  
    try {
      if (isEditing) {
        await updateTransaction({
          transactionId: editId,
          userId: user._id,
          ...transaction,
        });
      } else {
        await addTransaction({ ...transaction, user: user._id });
      }
  
      setTransactionData({
        amount: '',
        transacType: 'expense',
        description: '',
        dateCreated: new Date().toISOString().split('T')[0],
      });
      setEditId(null);
      setIsEditing(false);
      setModalOpen(false);
      fetchExpenses();
    } catch (error) {
      console.error('Error adding/updating transaction:', error);
    }
  };
  

  const fetchExpenses = async () => {
    await fetchTransactions(user._id).then(data => {
      const filteredDataExpense = data.filter(transac => transac.transacType === 'expense');
      setExpenses(filteredDataExpense);
    });
  }

  const deleteExpense = async (itemId, userId) => {
    await deleteTransaction(itemId,userId).then(response => {
      alert('Item deleted successfully');
      console.log(response);
      fetchExpenses();
    })
  }

  const handleEdit = (expense) => {
    setTransactionData({
      amount: expense.amount,
      transacType: expense.transacType,
      description: expense.description,
      dateCreated: expense.dateCreated.split('T')[0],
    });
    setEditId(expense._id);
    setIsEditing(true);
    setModalOpen(true);
  };
  
  useEffect(() => {
    if (!user) return;  
    fetchExpenses();
  }, [user]);
  
  console.log('Expenses per account',expenses);
  console.log(isEditing)



  return (
    <div className="Expense">
      <div className='headers-btn-div'>
        <Headers label="Expenses" />
      
        <div>
          <PrimaryButton label="Add Expense" onClick={() => {
                setIsEditing(false); // reset editing state
                setEditId(null);     // clear any existing ID
                setTransactionData({ // clear input fields
                  amount: '',
                  transacType: 'expense',
                  description: '',
                  dateCreated: new Date().toISOString().split('T')[0],
                });
                setModalOpen(true);  // finally open modal
              }}
            />
        </div>
      </div>

      {user ? (
        <div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Amount</th>
                  <th>Description</th>
                  <th>Date Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
            <tbody>
              {!expenses ? (
                  <div>no data</div>
                ) : (
                  expenses.map(expense => (
                    <tr key={expense._id}>
                        <td>{expense.amount}</td>
                        <td>{expense.description}</td>
                        <td>{timeStampConverter(expense.dateCreated)}</td>
                        <td className='action-btn'><PrimaryButton label='edit'onClick={() => handleEdit(expense)} /> <SecondaryButton label='delete' onClick={() => deleteExpense(expense._id, user._id)}/></td>
                    </tr>
                  )) 
                )}
            </tbody>
            </table>
          </div>
          <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title={isEditing ? 'Edit expense' : 'Add Expense'}>
            
            <form onSubmit={handleSubmit}>
              <FloatingLabelInput
                label="Amount"
                type="number"
                value={transactionData.amount}
                onChange={handleChange}
                name="amount"
              />
              <FloatingLabelInput
                label="Transaction Type"
                type="text"
                value={transactionData.transacType}
                onChange={handleChange}
                name="transacType"
              />
              <FloatingLabelInput
                label="Description"
                type="text"
                value={transactionData.description}
                onChange={handleChange}
                name="description"
              />
             
             <div className="btn-container">
                <PrimaryButton label={isEditing ? 'Update Expense' : 'Create Expense'} type="submit" />
                <SecondaryButton label='Close' onClick={() => setModalOpen(false)} />
             </div>
            </form>
           
          </Modal>
        </div>
      ) : (
        <div>Loading</div>
      )}
    </div>
  );
};
