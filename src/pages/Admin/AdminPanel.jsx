import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Layout from '../../components/layout/Layout';
import Loading from '../../components/Loading/Loading';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate, Navigate } from 'react-router-dom';
import './AdminPanel.css';
import Alerts, { showSuccessToast, showErrorToast } from '../../components/layout/Alerts';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/users', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(users.filter((user) => user.id !== userId));
      showSuccessToast('Usuário excluído!');

      // Faz logout APENAS se o usuário excluído for o usuário logado
      if (userId === currentUser.id) {
        dispatch({ type: "LOGOUT" });
        navigate("/login");
      }

    } catch (err) {
      showErrorToast('Erro ao excluir usuário!');
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Verifica se o usuário está logado
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return (
    <Layout>
      <Alerts/>
      {isLoading && <Loading />}
        <div className="form-content-adminpanel">
          <h1>Gerenciamento de Usuários</h1>
          {isLoading ? (
            <p>Carregando...</p>
          ) : error ? (
            <p>Erro ao carregar usuários: {error.message}</p>
          ) : (
            <table className="user-table">
              <thead>
                
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className='user-item'>
                    <td>{user.email}</td>
                    <td>
                      <button className="btn btn-edit" onClick={() => navigate(`/users/${user.id}/edit`)}>
                        Editar
                      </button>
                      <button className="btn btn-delete" onClick={() => handleDeleteUser(user.id)}>
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
    </Layout>
  );
};

export default AdminPanel;