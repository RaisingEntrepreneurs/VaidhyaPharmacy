// sessionService.js

import Cookies from 'js-cookie';
import { v4 as uuid } from 'uuid';

const sessionStore = new Map();

// Function to validate a session token
function validateSessionToken(sessionID, userID) {
  const CKsessionID = Cookies.get('sessionID');
  const CKuserID = Cookies.get('userID');

  if (sessionID && userID && CKsessionID && CKuserID) {
    try {
      if (CKsessionID === sessionID && CKuserID === userID) {
        // Update last activity time
        updateLastActivity();
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Error validating session token:", error);
      return false;
    }
  } else {
    return false;
  }
}

// Function to generate a session and store it in cookies
const GenerateSession = async (user) => {
  try {
    const sessionID = uuid();
    const sessionResponse = await fetch('http://127.0.0.1:5000/api/checkSession', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionID: sessionID,
        userID: user,
        username: user,
        createdAt: new Date().toLocaleString()
      })
    });

    const sessionData = await sessionResponse.json();
    if (sessionData.message === 'Session created successfully') {
      Cookies.set('sessionID', sessionID, { expires: 7, path: '/' });
      Cookies.set('userID', user, { expires: 7, path: '/' });
      Cookies.set('createdAt', new Date().toISOString(), { expires: 7, path: '/' });
      sessionStore.set(user, sessionID);
      // Update last activity time
      updateLastActivity();
    } else {
      console.log("Error creating session");
    }
  } catch (error) {
    console.error('Error generating session:', error);
  }
};

// Function to update last activity time
const updateLastActivity = () => {
  Cookies.set('lastActivity', new Date().toISOString(), { expires: 1, path: '/' });
};

// Function to check for inactivity and logout if necessary
const checkInactivity = (navigate) => {
  const lastActivity = Cookies.get('lastActivity');
  if (lastActivity) {
    const lastActivityTime = new Date(lastActivity);
    const currentTime = new Date();
    const inactiveDuration = currentTime - lastActivityTime;
    const maxInactiveDuration = 30 * 60 * 1000; // 30 minutes in milliseconds

    if (inactiveDuration > maxInactiveDuration) {
      logout(navigate);
    }
  }
};

// Function to logout the user
const logout = async (navigate) => {
  try {
    const sessionID = Cookies.get('sessionID');
    const logoutResponse = await fetch(`http://127.0.0.1:5000/api/logout/${sessionID}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (logoutResponse.ok) {
      Cookies.remove('sessionID');
      Cookies.remove('userID');
      Cookies.remove('createdAt');
      Cookies.remove('lastActivity');
      // Redirect to the login page or perform any other necessary actions
      navigate('/home');
    } else {
      console.error('Logout request failed:', logoutResponse.statusText);
    }
  } catch (error) {
    console.error('Error logging out:', error);
  }
};

export { GenerateSession, validateSessionToken, checkInactivity ,logout};
