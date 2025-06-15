import { useState, useEffect, useMemo } from 'react';
import { useUser } from '../context/UserContext';
import {Headers,PrimaryButton,FloatingLabelInput, SecondaryButton, Modal, Card, PieChart, Loader} from '../components';
import {fetchTransactions,addTransaction,updateTransaction,deleteTransaction} from '../services/TransactionServices';
import '../styles/styles.module.css';
import { timeStampConverter, GroupByCategory } from '../utils/helper';


export const Income = () => {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const[incomes, setIncomes] = useState();
  const [transactionData, setTransactionData] = useState({
    amount: '',
    transacType: 'expense',
    category: '',
    description: '',
    dateCreated: new Date().toISOString().split('T')[0],
  });

  const weeklyIncomes = useMemo(() => {
    if (!incomes) return [];
  
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday
    startOfWeek.setHours(0, 0, 0, 0);
  
    return incomes.filter(income => {
      const date = new Date(income.dateCreated);
      return date >= startOfWeek && date <= now;
    });
  }, [incomes]);

  const totalWeeklyIncome = useMemo(() => {
    return weeklyIncomes.reduce((sum, income) => sum + Number(income.amount), 0);
  }, [weeklyIncomes]);
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // You can change this number

  const paginatedIncomes = useMemo(() => {
    if (!incomes || incomes.length === 0) return [];
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return incomes.slice(indexOfFirstItem, indexOfLastItem);
  }, [incomes, currentPage, itemsPerPage]);

  const totalPages = useMemo(() => {
    return incomes ? Math.ceil(incomes.length / itemsPerPage) : 0;
  }, [incomes, itemsPerPage]);

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
        transacType: 'income',
        description: '',
        category: '',
        dateCreated: new Date().toISOString().split('T')[0],
      });
      setEditId(null);
      setIsEditing(false);
      setModalOpen(false);
      fetchIncomes();
    } catch (error) {
      console.error('Error adding/updating transaction:', error);
    } finally {
      setLoading(false);
    }
  };
  

  const fetchIncomes = async () => {
    setLoading(true);
    try {
      await fetchTransactions(user._id).then(data => {
        const filteredDataIncome = data.filter(transac => transac.transacType === 'income');
        setIncomes(filteredDataIncome);
        localStorage.setItem('incomes', JSON.stringify(filteredDataIncome));
      });
    } catch(err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const deleteIncomes = async (itemId, userId) => {
    setLoading(true);
   try {
    await deleteTransaction(itemId,userId).then(response => {
      alert('Item deleted successfully');
      console.log(response);
      fetchIncomes();
    });
   } catch(err) {
    console.error(err)
   } finally {
    setLoading(false);
   }
  }

  const handleEdit = (income) => {
    setTransactionData({
      amount: income.amount,
      transacType: income.transacType,
      description: income.description,
      category: income.category,
      dateCreated: income.dateCreated.split('T')[0],
    });
    setEditId(income._id);
    setIsEditing(true);
    setModalOpen(true);
  };
  
  useEffect(() => {
    if (!user) return;  
    const cached = JSON.parse(localStorage.getItem('incomes'));
    if (cached) setIncomes(cached); 
    console.log('cache',cached)
    fetchIncomes();
  }, [user]);
  
  console.log('Incomes per account',incomes);
  console.log(isEditing)
  return (
    <div className='container'>
      {loading && <Loader />}
      <div className='cardsContainer'>
      <Card cardTitle='Weekly Incomes'>
        <div>
          <Headers label={`₱ ${totalWeeklyIncome.toFixed(2)}`} />
        </div>
      </Card>

        <Card cardTitle='Where Your Money Comes From'>
            <div>
               <PieChart transactions={weeklyIncomes} />
            </div>
        </Card>
      </div>
       {user ? (
          <div className="Income">
              <div className='headers-btn-div'>
                <Headers label="Incomes" />
              
                <div>
                  <PrimaryButton label="Add Income" onClick={() => {
                        setIsEditing(false); // reset editing state
                        setEditId(null);     // clear any existing ID
                        setTransactionData({ // clear input fields
                          amount: '',
                          transacType: 'income',
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
                    {!incomes ? (
                        <div>no data</div>
                      ) : (
                        paginatedIncomes.map(income => (
                          <tr key={income._id}>
                              <td>{income.amount}</td>
                              <td className='desc'>{income.description}</td>
                              <td className='category'>{income.category}</td>
                              <td>{timeStampConverter(income.dateCreated)}</td>
                              <td className='action-btn'><PrimaryButton label='edit'onClick={() => handleEdit(income)} /> <SecondaryButton label='delete' onClick={() => deleteIncomes(income._id, user._id)}/></td>
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
                <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title={isEditing ? 'Edit Income' : 'Add Income'}> 
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
                      <PrimaryButton label={isEditing ? 'Update Income' : 'Create Income'} type="submit" />
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
