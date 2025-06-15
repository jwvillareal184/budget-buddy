import { useState, useEffect, useMemo } from 'react';
import { useUser } from '../context/UserContext';
import {Headers,PrimaryButton,FloatingLabelInput, SecondaryButton, Modal, Card, PieChart, Loader} from '../components';
import {fetchTransactions,addTransaction,updateTransaction,deleteTransaction} from '../services/TransactionServices';
import '../styles/styles.module.css';
import { timeStampConverter, GroupByCategory } from '../utils/helper';


export const Expense = () => {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const[expenses, setExpenses] = useState();
  const [transactionData, setTransactionData] = useState({
    amount: '',
    transacType: 'expense',
    category: '',
    description: '',
    dateCreated: new Date().toISOString().split('T')[0],
  });
  
  const weeklyExpenses = useMemo(() => {
    if (!expenses) return [];
  
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday
    startOfWeek.setHours(0, 0, 0, 0);
  
    return expenses.filter(exp => {
      const expDate = new Date(exp.dateCreated);
      return expDate >= startOfWeek && expDate <= now;
    });
  }, [expenses]);

  const totalWeeklyExpense = useMemo(() => {
    return weeklyExpenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
  }, [weeklyExpenses]);
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // You can change this number

  const paginatedExpenses = useMemo(() => {
    if (!expenses || expenses.length === 0) return [];
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return expenses.slice(indexOfFirstItem, indexOfLastItem);
  }, [expenses, currentPage, itemsPerPage]);

  const totalPages = useMemo(() => {
    return expenses ? Math.ceil(expenses.length / itemsPerPage) : 0;
  }, [expenses, itemsPerPage]);
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTransactionData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
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
        category: '',
        dateCreated: new Date().toISOString().split('T')[0],
      });
      setEditId(null);
      setIsEditing(false);
      setModalOpen(false);
      fetchExpenses();
    } catch (error) {
      console.error('Error adding/updating transaction:', error);
    } finally {
      setLoading(false);
    }
  };
  

  const fetchExpenses = async () => {
    setLoading(true);
   try {
    await fetchTransactions(user._id).then(data => {
      const filteredDataExpense = data.filter(transac => transac.transacType === 'expense');
      setExpenses(filteredDataExpense);
      localStorage.setItem('expenses', JSON.stringify(filteredDataExpense));
    });
   } catch (err) {
    console.error(err);
   } finally {
    setLoading(false);
   }
  }

  const deleteExpense = async (itemId, userId) => {
    setLoading(true);
    try {
      await deleteTransaction(itemId,userId).then(response => {
        alert('Item deleted successfully');
        console.log(response);
        fetchExpenses();
      })
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleEdit = (expense) => {
    setTransactionData({
      amount: expense.amount,
      transacType: expense.transacType,
      description: expense.description,
      category: expense.category,
      dateCreated: expense.dateCreated.split('T')[0],
    });
    setEditId(expense._id);
    setIsEditing(true);
    setModalOpen(true);
  };
  
  useEffect(() => {
    if (!user) return; 
    const cached = JSON.parse(localStorage.getItem('expenses'));
    if (cached) setExpenses(cached); 
    fetchExpenses();
  }, [user]);

  
  
  console.log('Expenses per account',expenses);
  console.log(isEditing)


  
  return (
    <div className='container'>
      {loading && <Loader />}
      <div className='cardsContainer'>
        <Card cardTitle='Weekly Expenses'>
          <div>
            <Headers label={`₱ ${totalWeeklyExpense.toFixed(2)}`} />
          </div>
        </Card>
        <Card cardTitle='Where Your Money Goes'>
            <div>
            <PieChart transactions={weeklyExpenses} />
            </div>
        </Card>
      </div>
       {user ? (
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
                          category: '',
                          dateCreated: new Date().toISOString().split('T')[0],
                        });
                        setModalOpen(true);  // finally open modal
                      }}
                    />
                </div>
              </div>
              <div>
                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>Amount</th>
                        <th>Description</th>
                        <th>Category</th>
                        <th>Date Created</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                  <tbody>
                    {!expenses ? (
                        <div>no data</div>
                      ) : (
                        paginatedExpenses.map(expense => (
                          <tr key={expense._id}>
                              <td>{expense.amount}</td>
                              <td className='desc'>{expense.description}</td>
                              <td className='category'>{expense.category}</td>
                              <td>{timeStampConverter(expense.dateCreated)}</td>
                              <td className='action-btn'><PrimaryButton label='edit'onClick={() => handleEdit(expense)} /> <SecondaryButton label='delete' onClick={() => deleteExpense(expense._id, user._id)}/></td>
                          </tr>
                        )) 
                      )}
                  </tbody>
                  </table>
                </div>

                <div className="pagination">
                    {Array.from({ length: totalPages }, (_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentPage(index + 1)}
                        className={currentPage === index + 1 ? 'active-page' : ''}
                      >
                        {index + 1}
                      </button>
                    ))}
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
                  <FloatingLabelInput
                      label="Category"
                      type="text"
                      value={transactionData.category}
                      onChange={handleChange}
                      name="category"
                    />
                  <div className="btn-container">
                      <PrimaryButton label={isEditing ? 'Update Expense' : 'Create Expense'} type="submit" />
                      <SecondaryButton label='Close' onClick={() => setModalOpen(false)} />
                  </div>
                  </form>
                
                </Modal>
              </div>
          </div>
        ) : (
          <div>No user Logged in</div>
        )}
    </div>
  );
};
