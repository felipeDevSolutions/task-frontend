import React, { useContext, useState } from "react";
import axios from 'axios';
import Layout from '../../../components/layout/Layout';
import "../form.css";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import Loading from '../../../components/Loading/Loading';
import Alerts, { showSuccessToast, showErrorToast } from '../../../components/layout/Alerts'; // Importe as funções

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { dispatch } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post('https://mytask-ze7d.onrender.com/api/login', { email, password }); // URL correta

      const { token, user } = response.data;

      localStorage.setItem('token', token); // Salva o token no localStorage
      dispatch({ type: "LOGIN", payload: user }); // Salva o usuário no contexto

      setIsLoading(false);
      navigate("/home");
      showSuccessToast('Login efetuado com sucesso!');
    } catch (error) {
      console.error("Error logging in: ", error);
      setIsLoading(false); // Esconde a animação de loading

      // Ajustando mensagens de erro
      if (error.response && error.response.status === 400) {
        showErrorToast('Credenciais inválidas. Verifique o usuário e senha ou faça seu cadastro');
      } else {
        showErrorToast('Ocorreu um erro ao fazer login. Tente novamente.'); 
      }
    }
  }

  return (
    <Layout>
      <Alerts /> 
      {isLoading && <Loading />}
      <div className="form-popup">
        <div className="form-box">
          <div className="form-content">
            <h2>LOGIN</h2>
            <form onSubmit={handleLogin} method="post">
              <div className="input-field">
                <input
                  type="text"
                  id="loginEmail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <label htmlFor="loginEmail">Email</label>
              </div>
              <div className="input-field">
                <input
                  type="password"
                  id="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <label htmlFor="Password">Senha</label>
              </div>
              <button type="submit">Entrar</button>
              <div className="bottom-link">
                Ainda não criou sua conta?
                <a href="/signup" id="signup-link"> Criar conta</a>
              </div>
              <p className="forgot-password">Esqueceu sua senha? <a href="/forgot-password">Redefinir senha</a></p>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Login;