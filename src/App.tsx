import React, { useState, useEffect } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const clientId = '246245907863-sp8ffjig1cotv3p1ir5ffbiuh23qfedj.apps.googleusercontent.com'; // Replace with your Google Client ID

type UserInfo = {
  name: string;
  email: string;
  picture: string;
};

interface DecodedToken {
  name: string;
  email: string;
  picture: string;
  sub: string;
  exp: number;
  iat: number;
  // Add other fields as needed
}

const App: React.FC = () => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = () => {
    setUser(null);
    setAccessToken(null);
    setComments([]);
  };

  const handleLogin = async (credentialResponse: any) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Step 1: Decode the ID token to get basic user info
      const decoded = jwtDecode<DecodedToken>(credentialResponse.credential);
      
      setUser({
        name: decoded.name,
        email: decoded.email,
        picture: decoded.picture
      });
      
      try {
        const gsiClient = window.google?.accounts?.oauth2.initTokenClient({
          client_id: clientId,
          scope: 'https://www.googleapis.com/auth/youtube.force-ssl https://www.googleapis.com/auth/youtube.readonly',
          callback: (tokenResponse) => {
            setAccessToken(tokenResponse.access_token);
          },
        });
        
        if (gsiClient) {
          gsiClient.requestAccessToken();
        }
      } catch (err) {
        console.error('Failed to exchange token:', err);
        setError('Failed to get access token. Please try again.');
      }
    } catch (err) {
      console.error('Login Failed:', err);
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch YouTube comments when access token is available
  useEffect(() => {
    if (accessToken) {
      fetchYouTubeComments(accessToken);
    }
  }, [accessToken]);

  const fetchYouTubeComments = async (token: string) => {
    try {
      setIsLoading(true);
      console.log("Attempting to fetch with token:", token.substring(0, 10) + "...");
      
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
      
      setComments(res.data.items || []);
      console.log('YouTube Comments Response:', res.data);
    } catch (err: any) {
      console.error('Failed to fetch comments:', err);
      
      // Log detailed error information
      if (err.response) {
        console.error('Error response data:', err.response.data);
        console.error('Error response status:', err.response.status);
        setError(`API Error (${err.response.status}): ${err.response.data?.error?.message || 'Unknown error'}`);
      } else {
        setError('Failed to connect to YouTube API');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
        <h1>YouTube Comment Viewer</h1>
        
        {user ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '800px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
              <img 
                src={user.picture} 
                alt={user.name} 
                style={{ borderRadius: '50%', width: '50px', height: '50px', marginRight: '10px' }} 
              />
              <div>
                <h3 style={{ margin: '0' }}>{user.name}</h3>
                <p style={{ margin: '0', color: '#666' }}>{user.email}</p>
              </div>
              <button 
                onClick={handleLogout}
                style={{ 
                  marginLeft: '20px', 
                  backgroundColor: '#f44336', 
                  color: 'white', 
                  border: 'none', 
                  padding: '8px 16px', 
                  borderRadius: '4px', 
                  cursor: 'pointer' 
                }}
              >
                Logout
              </button>
            </div>
            
            {isLoading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            
            {!accessToken && !isLoading && (
              <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <p>Additional YouTube permissions are required to view comments.</p>
                <button
                  onClick={() => {
                    const gsiClient = window.google?.accounts?.oauth2.initTokenClient({
                      client_id: clientId,
                      scope: 'https://www.googleapis.com/auth/youtube.force-ssl',
                      callback: (tokenResponse) => {
                        setAccessToken(tokenResponse.access_token);
                      },
                    });
                    
                    if (gsiClient) {
                      gsiClient.requestAccessToken();
                    }
                  }}
                  style={{ 
                    backgroundColor: '#4285F4', 
                    color: 'white', 
                    border: 'none', 
                    padding: '10px 20px', 
                    borderRadius: '4px', 
                    cursor: 'pointer' 
                  }}
                >
                  Grant YouTube Access
                </button>
              </div>
            )}
            
            {accessToken && comments.length > 0 && (
              <div style={{ width: '100%' }}>
                <h2>Your Comments</h2>
                <div>
                  {comments.map((comment) => (
                    <div 
                      key={comment.id} 
                      style={{ 
                        border: '1px solid #ddd', 
                        borderRadius: '8px', 
                        padding: '15px', 
                        marginBottom: '15px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                        <img 
                          src={comment.snippet.topLevelComment.snippet.authorProfileImageUrl} 
                          alt={comment.snippet.topLevelComment.snippet.authorDisplayName}
                          style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '10px' }}
                        />
                        <div>
                          <p style={{ fontWeight: 'bold', margin: '0' }}>
                            {comment.snippet.topLevelComment.snippet.authorDisplayName}
                          </p>
                          <p style={{ color: '#666', margin: '0', fontSize: '12px' }}>
                            {new Date(comment.snippet.topLevelComment.snippet.publishedAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <p style={{ margin: '0' }}>{comment.snippet.topLevelComment.snippet.textDisplay}</p>
                      <p style={{ color: '#666', fontSize: '14px', margin: '10px 0 0 0' }}>
                        Video: {comment.snippet.videoId}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {accessToken && comments.length === 0 && !isLoading && (
              <p>No comments found. Have you commented on any YouTube videos?</p>
            )}
          </div>
        ) : (
          <div style={{ marginTop: '40px', textAlign: 'center' }}>
            <p>Sign in with Google to view your YouTube comments</p>
            <GoogleLogin
              onSuccess={handleLogin}
              onError={() => {
                console.log('Login Failed');
                setError('Login failed. Please try again.');
              }}
              useOneTap
            />
          </div>
        )}
      </div>
    </GoogleOAuthProvider>
  );
};

// Add this type declaration to make TypeScript happy with the Google OAuth library
declare global {
  interface Window {
    google?: {
      accounts?: {
        oauth2: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (response: { access_token: string }) => void;
          }) => {
            requestAccessToken: () => void;
          };
        };
      };
    };
  }
}

export default App;