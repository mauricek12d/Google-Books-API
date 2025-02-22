// use this to decode a token and get the user's information out of it
import { jwtDecode } from 'jwt-decode';

interface UserToken {
  name: string;
  exp: number;
}

// create a new class to instantiate for a user
class AuthService {
  // get user data
  getProfile() {
    const token = this.getToken();  
    if (!token) return null;
    try {
      return jwtDecode<UserToken>(token);
    } catch (error) {
      console.error("Invalid token", error);
      return null;
    }
  }

  // check if user's logged in
  loggedIn() {
    // Checks if there is a saved token and it's still valid
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token); // handwaiving here
  }

  // check if token is expired
  isTokenExpired(token: string) {
    try {
      const decoded = jwtDecode<UserToken>(token);
      return decoded.exp < Date.now() / 1000; 
    } catch (error) {
      console.error("Error decoding token", error);
        return true;
      } 
    }

  getToken() {
    // Retrieves the user token from localStorage
    return localStorage.getItem('id_token');
  }

  login(idToken: string) {
    // Saves user token to localStorage
    localStorage.setItem('id_token', idToken);
    window.location.assign('/');
  }

  logout() {
    // Clear user token and profile data from localStorage
    localStorage.removeItem('id_token');
    // this will reload the page and reset the state of the application
    window.location.assign('/');
  }
}

export default new AuthService();
