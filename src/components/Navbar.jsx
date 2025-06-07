import { useUser } from '../context/UserContext';

export function Navbar() {
  const { user, logout } = useUser();

  return (
    <nav>
      {user ? (
        <>
          <span>Welcome, {user.fname}</span>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <span>Not logged in</span>
      )}
    </nav>
  );
}
