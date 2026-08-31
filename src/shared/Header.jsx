//shared/Header.jsx

import { useAuth } from '../contexts/AuthContext';
import Logoff from '../features/Logoff';

function Header() {
  const { isAuthenticated, logout } = useAuth();

  return(
    <div>
        <h1>Todo List</h1>

        {isAuthenticated && <Logoff />}
    </div> 
  );
}

export default Header;
