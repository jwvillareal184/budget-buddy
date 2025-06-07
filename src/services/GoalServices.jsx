import axios from 'axios';

const BASE_URL = 'http://localhost:3001/goals';

export const fetchGoals = async (userId) => {
    const response = await axios.get(`${BASE_URL}/by-user`, {
        params: {userId},
    });

    return response.data;
}

export const addGoal = async (data) => {
    const response = await axios.post(`${BASE_URL}/add-goal`, data);

    return response.data;
}

export const updateGoal = async ({goalId, userId, ...data}) => {
    const response = await axios.put(`${BASE_URL}/update-goal`, {
        goalId,
        userId,
        ...data,
    });
    return response.data;
}

export const deleteGoal = async (goalId, userId) => {
    const response = await axios.delete(`${BASE_URL}/delete-goal`, {
        data: {goalId, userId},
    });
    return response.data;
}