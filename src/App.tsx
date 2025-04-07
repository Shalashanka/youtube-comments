import React from 'react';
import { GoogleOAuthProvider, GoogleLogin, googleLogout } from '@react-oauth/google';

const clientId = '246245907863-sp8ffjig1cotv3p1ir5ffbiuh23qfedj.apps.googleusercontent.com'; // Replace with your actual client ID

const App: React.FC = () => {
  const handleLoginSuccess = (credentialResponse: any) => {
    console.log('Login Success:', credentialResponse);
    // You can decode the token if needed using jwt-decode
    // const decoded = jwtDecode(credentialResponse.credential);
    // console.log('Decoded token:', decoded);
  };

  const handleLoginError = () => {
    console.log('Login Failed');
  };

  const handleLogout = () => {
    googleLogout();
    console.log('Logged out');
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 50 }}>
        <h2>Login with Googla</h2>
        <GoogleLogin
          onSuccess={handleLoginSuccess}
          onError={handleLoginError}
        />
        <button onClick={handleLogout} style={{ marginTop: 20 }}>
          Logout
        </button>
      </div>
    </GoogleOAuthProvider>
  );
};

export default App;
