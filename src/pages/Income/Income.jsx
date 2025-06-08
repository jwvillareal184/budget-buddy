import {useState, useEffect} from "react";
import {useUser} from '../../context/UserContext';
import {Headers,PrimaryButton,FloatingLabelInput, SecondaryButton, Modal} from '../../components';
import {fetchTransactions,addTransaction,updateTransaction,deleteTransaction} from '../../services/TransactionServices';
import '../../styles/styles.css';
import { timeStampConverter } from "../../utils/timeStampConverter";


export const Income = () => {
    const {user} = useUser();
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [isModalOpen, setModalOpen] = useState(false);
    const [incomes, setIncomes] = useState();
    const [incomeData, setIncomeData] = useState({
        amount: '',
        transacType: 'income',
        description: '',
        dateCreated: new Date().toISOString().split('T')[0],
    });

    const handleChange = (e) => {
        const {name, value} = e.target;
        setIncomeData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const transaction = {
            ...incomeData,
            amount: Number(incomeData.amount),                     
            dateCreated: new Date().toISOString(),
          };
          try {
            console.log(transaction);
            if(isEditing) {
              await updateTransaction({
                transactionId: editId,
                userId: user._id,
                ...transaction,
              });
            } else {
              await addTransaction({ ...transaction, user: user._id });
            }
            setIncomeData({
              amount: 0,
              transacType: 'income',
              description: '',
              dateCreated: new Date().toISOString().split('T')[0],
            });
            setEditId(null);
            setIsEditing(false);
            setModalOpen(false);
            fetchIncomes();
          } catch (error) {
            console.error('Error adding transaction:', error);
          }
    }

    const fetchIncomes = async () => {
        await fetchTransactions(user._id).then(data => {
          const filteredDataExpense = data.filter(transac => transac.transacType === 'income');
          setIncomes(filteredDataExpense);
        });
       
      }
    
      const deleteIncome = async (itemId, userId) => {
        await deleteTransaction(itemId,userId).then(response => {
          alert('Item deleted successfully');
          console.log(response);
          fetchIncomes();
        })
      }

      
  const handleEdit = (income) => {
    setIncomeData({
      amount: income.amount,
      transacType: income.transacType,
      description: income.description,
      dateCreated: income.dateCreated.split('T')[0],
    });
    setEditId(income._id);
    setIsEditing(true);
    setModalOpen(true);
  };
    
      useEffect(() => {
        if (!user) return;  
        fetchIncomes();
      }, [user]);
      
      console.log('Incomes per account',incomes);
    
    

    return (
        <div className="Income">
            <div className="headers-btn-div">
                <Headers label="Income" />
                <div>
                <PrimaryButton label="Add Income" onClick={() => {
                      setIsEditing(false); // reset editing state
                      setEditId(null);     // clear any existing ID
                      setIncomeData({ // clear input fields
                        amount: '',
                        transacType: 'income',
                        description: '',
                        dateCreated: new Date().toISOString().split('T')[0],
                      });
                      setModalOpen(true);  // finally open modal
                    }}
                 />
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title={isEditing ? 'Edit Income' : 'Add Income'}>
            <form onSubmit={handleSubmit}>
                <FloatingLabelInput
                  label="Amount"
                  type="number"
                  value={incomeData.amount}
                  onChange={handleChange}
                  name="amount"
                />
                <FloatingLabelInput
                  label="Transaction Type"
                  type="text"
                  value={incomeData.transacType}
                  onChange={handleChange}
                  name="transacType"
                />
                <FloatingLabelInput
                  label="Description"
                  type="text"
                  value={incomeData.description}
                  onChange={handleChange}
                  name="description"
                />
                <div className="btn-container">
                <PrimaryButton label={isEditing ? 'Update Income' : 'Create Income'} type="submit" />
                <SecondaryButton label='Close' onClick={() => setModalOpen(false)} />
                </div>
              </form>
             
            </Modal>
            
        {user ? (
         <div>
         <div className="modal">

         </div>

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
            {!incomes  ? (
                <div>no data</div>
             ) 
             : (
                incomes.map(income => (
                    <tr key={income._id}>
                        <td>{income.amount}</td>
                        <td>{income.description}</td>
                        <td>{timeStampConverter(income.dateCreated)}</td>
                        <td className="action-btn"><PrimaryButton label='edit' onClick={() => handleEdit(income)}/> <SecondaryButton label='delete' onClick={() => deleteIncome(income._id, user._id)}/></td>
                    </tr>
                  )) 
             )}
            </tbody>         
           </table>
         </div>
       </div>
        ) : (
            <div>
                Loading
            </div>
        )}</div>
    )
}