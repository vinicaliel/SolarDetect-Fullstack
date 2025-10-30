import Cookies from 'js-cookie';

// Define os tipos para o nosso serviço de autenticação
interface AuthResponse {
  token: string;
  userType: string;
}

// Tempo de expiração do token em dias
const TOKEN_EXPIRATION_DAYS = 7;

export const authService = {
  // Função para decodificar token JWT
  decodeToken: (token: string): any => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (error) {
      return null;
    }
  },

  // Função para verificar se o token está próximo de expirar (menos de 5 minutos)
  isTokenNearExpiration: (token: string): boolean => {
    const decoded = authService.decodeToken(token);
    if (!decoded || !decoded.exp) return true;

    const expirationTime = decoded.exp * 1000; // converter para milissegundos
    const currentTime = Date.now();
    const timeUntilExpiration = expirationTime - currentTime;

    // Retorna true se faltar menos de 5 minutos para expirar
    return timeUntilExpiration < 300000;
  },

  // Função para salvar o token e tipo de usuário
  setAuth: (authResponse: AuthResponse) => {
    // Salva no localStorage
    localStorage.setItem('token', authResponse.token);
    localStorage.setItem('userType', authResponse.userType);
    
    // Salva nos cookies para o middleware com mesmo tempo de expiração do JWT
    const decoded = authService.decodeToken(authResponse.token);
    if (decoded && decoded.exp) {
      const expirationDate = new Date(decoded.exp * 1000);
      Cookies.set('token', authResponse.token, { expires: expirationDate });
    } else {
      // Fallback para 24 horas se não conseguir decodificar
      Cookies.set('token', authResponse.token, { expires: 1 });
    }
  },

  // Função para limpar a autenticação
  clearAuth: () => {
    // Remove do localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    
    // Remove dos cookies
    Cookies.remove('token');
  },

  // Função para verificar se está autenticado
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    return !!token;
  },

  // Função para obter o token
  getToken: () => {
    return localStorage.getItem('token');
  },

  // Função para obter o tipo de usuário
  getUserType: () => {
    return localStorage.getItem('userType');
  }
};