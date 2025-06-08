
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