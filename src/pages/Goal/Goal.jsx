import {useState, useEffect} from 'react';
import { useUser } from '../../context/UserContext';
import {Headers,PrimaryButton,FloatingLabelInput, SecondaryButton, Modal} from '../../components';
import { fetchGoals, addGoal, updateGoal, deleteGoal } from '../../services/GoalServices';

export const Goal = () => {
    const {user} = useUser();
    const [goals, setGoals] = useState();
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [isModalOpen, setModalOpen] = useState(false);
    const [goalData, setGoalData] = useState({
        targetAmount: '',
        currentAmount: '',
        description: '',
        dateCreated: new Date().toISOString().split('T')[0],
    });

    const handleChange = (e) => {
        const {name, value} = e.target;
        setGoalData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = {
            ...goalData,
            targetAmount: Number(goalData.targetAmount),
            currentAmount: Number(goalData.currentAmount),
            user: user._id,
            dateCreated: new Date(goalData.dateCreated).toISOString(),
        };

        try {
            console.log(data);
            if(isEditing) {
                await updateGoal({
                    goalId: editId,
                    userId: user._id,
                    ...data,
                });
            } else {
                await addGoal(data);
            }
            setGoalData({
                currentAmount: '',
                targetAmount: '',
                description: '',
                dateCreated: new Date().toISOString().split('T')[0],
            });
            setEditId(null);
            setIsEditing(false);
            setModalOpen(false);
            fetchGoalData();
        } catch (error) {
            console.error('Error adding the goal', error);
        }

    }

    const fetchGoalData = async () => {
        await fetchGoals(user._id).then(data => setGoals(data));
        
    }

    const deleteGoalData = async (goalId, userId) => {
        const response =  await deleteGoal(goalId, userId).then( response => {
            alert('Item deleted successfully');
        });
        console.log(response);
        fetchGoalData();
    }

    const handleEdit = (goal) => {
        setGoalData({
            currentAmount: goal.currentAmount,
            targetAmount: goal.targetAmount,
            description: goal.description,
            dateCreated: new Date().toISOString().split('T')[0],
        });
        setEditId(goal._id);
        setIsEditing(true);
        setModalOpen(true);
    }

    useEffect(() => {
        if (!user) return;
        fetchGoalData();
    }, [user]);

    console.log(goals);
    return(
        <div className="Goal">
        <PrimaryButton label="Add Goal" onClick={() => {
              setIsEditing(false); // reset editing state
              setEditId(null);     // clear any existing ID
              setGoalData({ // clear input fields
                currentAmount: '',
                targetAmount: '',
                description: '',
                dateCreated: new Date().toISOString().split('T')[0],
              });
              setModalOpen(true);  // finally open modal
            }}
          />

        <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title={isEditing ? 'Edit Goal' : 'Add Goal'}>
        <form onSubmit={handleSubmit}>
            <FloatingLabelInput
                label="Current Amount"
                type="number"
                value={goalData.currentAmount}
                onChange={handleChange}
                name="currentAmount"
            />
            <FloatingLabelInput
                label="Target Amount"
                type="number"
                value={goalData.targetAmount}
                onChange={handleChange}
                name="targetAmount"
            />
            <FloatingLabelInput
                label="Description"
                type="text"
                value={goalData.description}
                onChange={handleChange}
                name="description"
            />
            <PrimaryButton label={isEditing ? 'Update Goal' : 'Create Goal'} type="submit" />
        </form>
            <SecondaryButton label='Close' onClick={() => setModalOpen(false)} />
        </Modal>
            {user ? (
                <div>
                    {user.fname}
              

                    <div className="table-container">
                        <table>
                          <thead>
                          <tr>
                                <th>Current amount</th>
                                <th>Target amount</th>
                                <th>Description</th>
                                <th>Date Created</th>
                                <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                          {goals && goals.length > 0 ? (
                                goals.map(goal => (
                                    <tr key={goal._id}>
                                        <td>{goal.currentAmount}</td>
                                        <td>{goal.targetAmount}</td>
                                        <td>{goal.description}</td>
                                        <td>{goal.dateCreated}</td>
                                        <td>
                                            <PrimaryButton label='edit' onClick={() => handleEdit(goal)}/>
                                            <SecondaryButton label='delete' onClick={() => deleteGoalData(goal._id, user._id)}/>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5">No goals found.</td>
                                </tr>
                            )}

                          </tbody>

                            
                        </table>
                    </div>
                </div>
                
            ) :
            (
                <div>
                    Loading...
                </div>
            )}
        </div>
    )
}