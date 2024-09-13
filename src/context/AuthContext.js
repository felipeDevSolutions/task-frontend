import { createContext, useEffect, useReducer } from "react";
import AuthReducer from "./AuthReducer";

const INITIAL_STATE = {
  currentUser: null,
  isLoading: true,
  error: null,
};

export const AuthContext = createContext(INITIAL_STATE);

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

  // Validação do token no primeiro carregamento da página
  useEffect(() => {
    const token = localStorage.getItem("token");

    const validateToken = async () => {
      try {
        const response = await fetch('https://mytask-ze7d.onrender.com/api/validate', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Token inválido!');
        }

        const responseData = await response.json();
        dispatch({ type: "LOGIN", payload: responseData.user });
      } catch (err) {
        console.error('Erro ao validar token:', err);
        dispatch({ type: "LOGOUT" });
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    };

    if (token) {
      validateToken();
    } else {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, []);

  // Atualiza o token no localStorage quando ele expira ou está prestes a expirar
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const expirationTime = parseInt(localStorage.getItem("tokenExpiration"));
      const now = new Date().getTime();

      if (expirationTime && now > expirationTime) {
        // Token expirou, faça o logout
        dispatch({ type: "LOGOUT" });
      } else if (expirationTime && now + 1000 * 60 * 150 > expirationTime) { // 2h30min após a emissão do token
        // Atualize o token 30 minutos antes de expirar
        const updateToken = async () => {
          try {
            // Chame a rota no backend para renovar o token
            const response = await fetch('https://mytask-ze7d.onrender.com/api/refreshToken', {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${token}`
              }
            });
            if (!response.ok) {
              throw new Error('Erro ao atualizar token');
            }

            const newTokenData = await response.json();
            localStorage.setItem("token", newTokenData.token);
            localStorage.setItem("tokenExpiration", newTokenData.expirationTime);
          } catch (err) {
            console.error('Erro ao atualizar token:', err);
            dispatch({ type: "LOGOUT" });
          }
        };

        updateToken();
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser: state.currentUser, isLoading: state.isLoading, error: state.error, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};