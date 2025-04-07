import React, { useState, useEffect } from 'react';
import {
  GoogleOAuthProvider,
  useGoogleLogin,
  googleLogout,
} from '@react-oauth/google';
import axios from 'axios';

const clientId = '246245907863-sp8ffjig1cotv3p1ir5ffbiuh23qfedj.apps.googleusercontent.com'; // Replace with your Google Client ID

type UserInfo = {
  name: string;
  email: string;
  picture: string;
};

const App: React.FC = () => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setAccessToken(tokenResponse.access_token);

      // Decode user info from the id_token (optional)
      const userInfo = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: {
          Authorization: `Bearer ${tokenResponse.access_token}`,
        },
      });

      setUser({
        name: userInfo.data.name,
        email: userInfo.data.email,
        picture: userInfo.data.picture,
      });
    },
    onError: (errorResponse) => {
      console.error('Login Failed:', errorResponse);
    },
    scope: 'https://www.googleapis.com/auth/youtube.force-ssl https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
    flow: 'implicit',
  });

  const handleLogout = () => {
    googleLogout();
    setUser(null);
    setAccessToken(null);
  };

  // 🔁 Auto-fetch YouTube comments on login
  useEffect(() => {
    if (accessToken) {
      fetchYouTubeComments(accessToken);
    }
  }, [accessToken]);

  const fetchYouTubeComments = async (token: string) => {
    try {
      const res = await axios.get(
        'https://www.googleapis.com/youtube/v3/commentThreads',
        {
          params: {
            part: 'snippet',
            maxResults: 25,
            mine: true,
          },
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        }
      );
      console.log('YouTube Comments:', res.data);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    }
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 50 }}>
        <h2>YouTube Comment Viewer</h2>

        {!user ? (
          <button onClick={() => login()}>Login with Google</button>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <img src={user.picture} alt="User" style={{ borderRadius: '50%', width: 80 }} />
            <h3>{user.name}</h3>
            <button onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>
    </GoogleOAuthProvider>
  );
};

export default App;
