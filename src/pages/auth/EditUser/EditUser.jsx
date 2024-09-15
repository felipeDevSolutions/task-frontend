import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from '../../../components/layout/Layout';
import Loading from '../../../components/Loading/Loading';
import Alerts, { showSuccessToast, showErrorToast } from '../../../components/layout/Alerts';
import "../form.css";

function EditUser() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      showErrorToast("As senhas não estão iguais.");
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');

      await axios.put(`http://localhost:5000/api/users/${userId}/password`, { 
        oldPassword,
        newPassword,
        confirmPassword
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      

      showSuccessToast('Senha atualizada com sucesso!');
      console.log("Senha atualizada com sucesso!")
      navigate('/home');
    } catch (error) {
      console.error('Erro ao atualizar senha:', error);
      showErrorToast('Erro ao atualizar senha!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <Alerts />
      {isLoading && <Loading />}
      <div className="form-popup"> {/* Classe do formulário */}
        <div className="form-box">
          <div className="form-content">
            <h2>Atualizar Senha</h2>
            <form onSubmit={handleSubmit} method="post"> {/* Formulário */}
              <div className="input-field"> {/* Campo para a senha antiga */}
                <input
                  type="password"
                  id="oldPassword"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  required
                />
                <label htmlFor="oldPassword">Senha Antiga</label>
              </div>
              <div className="input-field"> {/* Campo para a nova senha */}
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <label htmlFor="newPassword">Nova Senha</label>
              </div>
              <div className="input-field"> {/* Campo para confirmar a nova senha */}
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <label htmlFor="confirmPassword">Confirmar Nova Senha</label>
              </div>
              <button type="submit">Atualizar</button> {/* Botão para enviar o formulário */}
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default EditUser;