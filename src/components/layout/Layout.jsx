import React, { useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Layout.css';
import { AuthContext } from '../../context/AuthContext';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const { currentUser, dispatch } = useContext(AuthContext);

  const handleLogout = () => {
    localStorage.removeItem('token'); 
    dispatch({ type: 'LOGOUT' }); 
    navigate('/'); 
  };

  return (
    <div className="container">
      <div className='header'>
        <div className='nav'>
          <div className="nav-bar">
            <div className="bg"></div>
            
            {!currentUser && (
              <>
                <li><Link to="/" className="nav-link active">LandingPage</Link></li>
                <li><Link to="/login" className="nav-link">Login</Link></li>
                <li><Link to="/signup" className="nav-link">Signup</Link></li>
              </>
            )}

            {currentUser && (
              <>
                <li><Link to="/home" className="nav-link active">Home</Link></li>
                <li><Link to="/admin" className="nav-link">Admin</Link></li>
              </>
            )}

            {currentUser && (
              <li className="nav-item-right">
                <button className="nav-link logout-button" onClick={handleLogout}>Logout</button>
              </li>
            )}
          </div>
        </div>
      </div>
      <main>
        <div id="home">
          <div className="filter"></div>
          <section className="intro">
            {children}  
          </section>
        </div>
      </main>
    </div>
  );
}

export default Layout;