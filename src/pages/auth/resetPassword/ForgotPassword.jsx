import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Layout from '../../../components/layout/Layout';
import "../form.css";
import Loading from '../../../components/Loading/Loading';
import Alerts, { showSuccessToast, showErrorToast } from '../../../components/layout/Alerts';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await axios.post('http://localhost:5000/api/forgot-password', { email });
      setIsLoading(false);
      showSuccessToast('Email de redefinição de senha enviado com sucesso!');
      navigate('/login');
    } catch (error) {
      console.error('Erro ao enviar email de redefinição:', error);
      setIsLoading(false);
      showErrorToast('Erro ao enviar email de redefinição. Verifique o email e tente novamente.');
    }
  };

  return (
    <Layout>
      <Alerts />
      {isLoading && <Loading />}
      <div className="form-popup">
        <div className="form-box">
          <div className="form-content">
            <h2>Redefinir Senha</h2>
            <form onSubmit={handleSubmit}>
              <div className="input-field">
                <input
                  type="email"
                  id="forgotPasswordEmail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <label htmlFor="forgotPasswordEmail">Email</label>
              </div>
              <button type="submit">Enviar Email</button>
              <p className="forgot-password-message">
                Um email com instruções para redefinir sua senha <br/> será enviado para o endereço informado.
              </p>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ForgotPassword;
