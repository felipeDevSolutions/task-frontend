import { useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import Layout from '../../../components/layout/Layout';
import "../form.css";
import Loading from '../../../components/Loading/Loading';
import Alerts, { showSuccessToast, showErrorToast } from '../../../components/layout/Alerts';

const Signup = () => {
  const navigate = useNavigate();
  const [emailSignup, setEmailSignup] = useState("");
  const [passwordSignup, setPasswordSignup] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const handleSignup = (e) => {
    e.preventDefault();

    if (passwordSignup !== confirmPassword) {
      showErrorToast("As senhas não estão iguais.");
      return;
    }
    if (!acceptedTerms) {
      showErrorToast("Você precisa aceitar os Termos de Uso e Política de Privacidade para continuar.");
      return;
    }

    setIsLoading(true);

    axios.post('https://mytask-ze7d.onrender.com/api/signup', { 
      email: emailSignup,
      password: passwordSignup
    })
      .then(response => {
        showSuccessToast("Usuário cadastrado com sucesso!");
        setIsLoading(false);
        navigate("/login");
      })
      .catch(error => {
        if (error.response && error.response.status === 409) {
          showErrorToast("O email informado já está cadastrado. Por favor, escolha outro.");
        } else if (error.response && error.response.status === 400) {
          showErrorToast("Erro de validação. Verifique os campos e tente novamente.");
        } else if (error.response && error.response.status === 500) {
          showErrorToast("Ocorreu um erro inesperado no servidor. Por favor, tente novamente mais tarde.");
        } else if (error.response && error.response.data && error.response.data.message) {
          showErrorToast(error.response.data.message);
        } else {
          console.error("Error signing up: ", error);
          showErrorToast("Ocorreu um erro ao cadastrar o usuário. Por favor, tente novamente.");
        }
        setIsLoading(false); 
      });
  };

  return (
    <Layout>
      <Alerts /> 
      {isLoading && <Loading />}
      <hr />
      <div className="form-popup">
        <div className="form-box">
          <div className="form-content">
            <h2>CADASTRAR</h2>
            <form onSubmit={handleSignup}>
              <div className="input-field">
                <input
                  type="email"
                  id="signupEmail"
                  value={emailSignup}
                  onChange={(e) => setEmailSignup(e.target.value)}
                  required
                />
                <label htmlFor="signupEmail">Cadastrar email</label>
              </div>
              <div className="input-field">
                <input
                  type="password"
                  id="signupSenha"
                  value={passwordSignup}
                  onChange={(e) => setPasswordSignup(e.target.value)}
                  required
                />
                <label htmlFor="signupSenha">Criar senha</label>
              </div>
              <div className="input-field">
                <input
                  type="password"
                  id="signupConfirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <label htmlFor="signupConfirmPassword">Confirmar senha</label>
              </div>
              <div className="input-field-terms">
                <label htmlFor="termsCheckbox">
                  <input
                    type="checkbox"
                    id="termsCheckbox"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    required
                  />
                    <div>Li e concordo com os <a href="/terms" target="_blank" rel="noopener noreferrer">Termos de Uso e Política de Privacidade</a>.</div>
                </label>
              </div>

              <button type="submit">Cadastrar</button>
              <div className="bottom-link">
                Já tem uma conta?
                <a href="/login" id="login-link"> Login</a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Signup;