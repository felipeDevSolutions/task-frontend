import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Layout from '../../../components/layout/Layout';
import Alerts, { showErrorToast, showSuccessToast } from '../../../components/layout/Alerts';

const VerifyEmail = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const uid = searchParams.get('uid'); 
  const navigate = useNavigate();

  // Verifica se o email foi verificado (opcional)
  useEffect(() => {
    const checkVerificationStatus = async () => {
      if (!uid) return; 

      try {
        const response = await axios.get(`http://localhost:5000/api/validate`, { // Verifica o status de login
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, 
          },
        });

        if (response.status === 200) { 
          // O usuário está logado (e portanto verificado)
          showSuccessToast('E-mail verificado com sucesso!');
          navigate('/home'); 
        } 
      } catch (error) {
        // Ignora erros aqui, pois o usuário pode ainda não estar logado
      }
    };

    checkVerificationStatus();
  }, [uid, navigate]);

  // Função para reenviar o email de verificação
  const resendVerificationEmail = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/resend-verification', { uid });
      if (response.status === 200) {
        showSuccessToast('Email de verificação reenviado!');
      } else {
        showErrorToast('Erro ao reenviar email. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao reenviar email:', error);
      showErrorToast('Erro ao reenviar email. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <Alerts />
      <div className="verify-email-container">
        <h2>Verifique seu email</h2>
        <p>Um email de verificação foi enviado para o endereço que você forneceu. Por favor, verifique sua caixa de entrada e clique no link para verificar sua conta.</p>

        {isLoading && (
          <div className="loading-indicator">Enviando...</div>
        )}

        {!isLoading && (
          <button onClick={resendVerificationEmail} disabled={isLoading}>
            Reenviar Email de Verificação
          </button>
        )}

        <Link to="/login">Voltar para o Login</Link>
      </div>
    </Layout>
  );
};

export default VerifyEmail;