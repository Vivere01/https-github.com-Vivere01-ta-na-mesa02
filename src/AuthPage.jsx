import React, { useState } from 'react';
    import { useNavigate } from 'react-router-dom';
    import { supabase } from './supabaseClient';
    import { FaUser, FaLock, FaSignInAlt, FaUserPlus } from 'react-icons/fa';

    const AuthPage = () => {
      const [isLogin, setIsLogin] = useState(true);
      const [name, setName] = useState('');
      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');
      const [errorMessage, setErrorMessage] = useState('');
      const navigate = useNavigate();

      const toggleAuth = () => {
        setIsLogin(!isLogin);
      };

      const handleAuth = async (event) => {
        event.preventDefault();
        setErrorMessage('');

        try {
          if (isLogin) {
            const { data, error } = await supabase.auth.signInWithPassword({
              email,
              password,
            });

            if (error) {
              setErrorMessage('Erro ao fazer login: ' + error.message);
            } else {
              alert('Login bem-sucedido!');
              navigate('/');
            }
          } else {
            const { data, error } = await supabase.auth.signUp({
              email,
              password,
              options: {
                data: {
                  name,
                },
              },
            });

            if (error) {
              setErrorMessage('Erro ao cadastrar: ' + error.message);
            } else {
              alert('Cadastro bem-sucedido! Verifique seu e-mail para continuar.');
              setIsLogin(true);
            }
          }
        } catch (err) {
          setErrorMessage('Erro inesperado: ' + err.message);
        }
      };

      return (
        <div id="auth-container">
          <h1 id="form-title">{isLogin ? 'Login' : 'Cadastro'}</h1>
          <form id="auth-form" onSubmit={handleAuth}>
            {!isLogin && (
              <input
                type="text"
                id="name"
                placeholder="Nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            )}
            <input
              type="email"
              id="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              id="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">
              {isLogin ? <FaSignInAlt style={{ marginRight: '5px' }} /> : <FaUserPlus style={{ marginRight: '5px' }} />}
              {isLogin ? 'Entrar' : 'Cadastrar'}
            </button>
          </form>
          <p id="error-message">{errorMessage}</p>
          <p className="toggle-link" id="toggle-auth" onClick={toggleAuth}>
            {isLogin ? 'Não tem uma conta? Cadastre-se' : 'Já tem uma conta? Faça login'}
          </p>
        </div>
      );
    };

    export default AuthPage;
