import React, { useEffect, useRef } from 'react';
import {  useNavigate } from 'react-router-dom';
import { validateSessionToken } from './sessionService';
import Cookies from 'js-cookie';

function SessionValidationHOC(WrappedComponent) {
  const ValidateSessionWrapper = (props) => {
    const navigate = useNavigate();
    const isValidSessionRef = useRef(false);

    useEffect(() => {
      
      // Check session validity here
      const sessionID = Cookies.get('sessionID');
      const userID = Cookies.get('userID');
      
      // Ensure both sessionID and userID are available
      if (sessionID && userID) {
        const isValidSession = validateSessionToken(sessionID, userID);
       
        
        isValidSessionRef.current = isValidSession;
        // Redirect to login page if session is not valid
        if (!isValidSession) {
          console.log('SessionValidationHOC: Redirecting to /home');
          navigate('/home');
        }
      } else {
        // Handle missing session data
        
        navigate('/home');
      }
    }, [navigate]);


    // Render WrappedComponent only if session is valid
    return isValidSessionRef ? <WrappedComponent {...props} /> : ('/home');
    // Return null if session is not valid, which will result in a blank page
  };

  return ValidateSessionWrapper;
}

export default SessionValidationHOC;
