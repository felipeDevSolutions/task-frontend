import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Layout from '../../components/layout/Layout';
import Loading from '../../components/Loading/Loading';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate, Navigate } from 'react-router-dom';
import './AdminPanel.css';
import Alerts, { showErrorToast } from '../../components/layout/Alerts';

const AdminPanel = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://task-backend-3crz.onrender.com/api/users/me', { // Nova rota
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
      } catch (err) {
        showErrorToast('Erro ao carregar dados do usuário!');
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, []);

  // Verifica se o usuário está logado
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return (
    <Layout>
      <Alerts />
      {isLoading && <Loading />}
      <div className="form-content-adminpanel">
        <h1>Painel do Usuário</h1> {/* Título modificado */}
        {isLoading ? (
          <p>Carregando...</p>
        ) : error ? (
          <p>Erro ao carregar dados do usuário: {error.message}</p>
        ) : user ? ( // Renderiza a tabela apenas se o usuário existir
          <table className="user-table">
            <tbody>
              <tr className='user-item'>
                <td>{user.email}</td>
                <td>
                  <button className="btn btn-edit" onClick={() => navigate(`/users/${user.id}/edit`)}>
                    Editar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        ) : (
          <p>Usuário não encontrado</p>
        )}
      </div>
    </Layout>
  );
};

export default AdminPanel;