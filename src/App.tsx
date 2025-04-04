import { useState } from "react";
import { auth, provider } from "./firebaseConfig";
import { signInWithPopup, signOut } from "firebase/auth";
import { User } from "firebase/auth";

//const CLIENT_ID = "YOUR_YOUTUBE_CLIENT_ID";
//const API_KEY = "YOUR_YOUTUBE_API_KEY";
const CLIENT_ID = "246245907863-sp8ffjig1cotv3p1ir5ffbiuh23qfedj.apps.googleusercontent.com";
const API_KEY = "AIzaSyCpmRrs9_qgl7S6MC3gcmlGQmE7nXfKPfI";
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest"];
const SCOPES = "https://www.googleapis.com/auth/youtube.force-ssl";

declare global {
  interface Window {
    gapi: any;
  }
}


function App() {
  const [user, setUser] = useState<User | null>(null);
	interface Comment {
	  id: string;
	  snippet: {
		topLevelComment: {
		  snippet: {
			textDisplay: string;
		  };
		};
	  };
	}

	const [comments, setComments] = useState<Comment[]>([]);

  const login = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      
      window.gapi.load("client:auth2", () => {
        window.gapi.client.init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          discoveryDocs: DISCOVERY_DOCS,
          scope: SCOPES,
        }).then(() => {
          window.gapi.auth2.getAuthInstance().signIn();
        });
      });
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const fetchComments = async () => {
    if (!window.gapi.auth2.getAuthInstance().isSignedIn.get()) return;
    const response = await window.gapi.client.youtube.commentThreads.list({
      part: "snippet",
      mine: true,
      maxResults: 10,
    });
    setComments(response.result.items);
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setComments([]);
  };

  return (
    <div>
      {!user ? (
        <button onClick={login}>Login with Google</button>
      ) : (
        <div>
          <p>Welcome, {user.displayName}!</p>
          <button onClick={fetchComments}>Fetch Comments</button>
          <button onClick={logout}>Logout</button>
          <ul>
            {comments.map((comment) => (
              <li key={comment.id}>{comment.snippet.topLevelComment.snippet.textDisplay}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
