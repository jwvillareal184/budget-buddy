import axios from 'axios';

const BASE_URL = `${process.env.REACT_APP_BACKEND_URL}transaction`;

export const fetchTransactions = async (userId) => {
    const response = await axios.get(`${BASE_URL}/by-user`, {
        params: {userId},
    });
    return response.data;
}

export const addTransaction = async (data) => {
  console.log(data)
    const response = await axios.post(`${BASE_URL}/add-transaction`, data);
    return response.data;
}

export const updateTransaction = async ({ transactionId, userId, ...rest }) => {
    const res = await axios.put(`${BASE_URL}/update-transaction`, {
      transactionId,
      userId,
      ...rest,
    });
    return res.data;
  };
  
export const deleteTransaction = async (transactionId, userId) => {
    const res = await axios.delete(`${BASE_URL}/delete-transaction`, {
      data: { transactionId, userId },
    });
    return res.data;
};