import { useUser } from '../UserContext';

export const Dashboard = () => {
  const { user } = useUser();

  return (
    <div>
      {user ? (
        <h2>Welcome back, {user.fname} {user.lname}</h2>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};
