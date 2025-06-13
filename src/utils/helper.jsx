export const timeStampConverter = (timestamp) => {
    const date = new Date(timestamp);
    const options = {
        timeZone: 'Asia/Manila',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    };
    return date.toLocaleString('en-PH', options);

}

export const GroupByCategory = (transactionsObj) => {
  const transactions = Object.values(transactionsObj); // if it's an object

  const grouped = transactions.reduce((acc, { category, amount }) => {
    if (!category || typeof amount !== 'number') return acc;
    acc[category] = (acc[category] || 0) + amount;
    return acc;
  }, {});

  console.log(grouped)
  return {
    labels: Object.keys(grouped),     // unique categories
    values: Object.values(grouped),   // summed amounts per category
  };
};





