import React from 'react';
import firebase from "firebase/app";
import "firebase/auth";
import { useState } from "react";
import { createContext } from "react";
import { useContext } from 'react';
import { useEffect } from 'react';
import {Route,Redirect} from 'react-router-dom'
import firebaseConfig from '../../firebase.config';

firebase.initializeApp(firebaseConfig);

const AuthContext = createContext();

export const AuthContextProvider = props => {
    const auth = Auth();
    return <AuthContext.Provider value={auth}>{props.children}</AuthContext.Provider>;
}

const getUser = user => {
    const {displayName, email, photoURL} = user;
     return {
        name: displayName,
        email,
        photo: photoURL
    }
    
}

export const useAuth = () => useContext(AuthContext);

// handel private route

export const PrivateRoute = ({ children, ...rest }) => {

    const auth = useAuth();

    return (
      <Route
        {...rest}
        render={({ location }) =>
            auth.user? (
            children
          ) : (
            <Redirect
              to={{
                pathname: "/login",
                state: { from: location }
              }}
            />
          )
        }
      />
    );
  }
  

const Auth = () => {
    const [user, setUser] = useState(null);

    const signInWithGoogle = () => {
        const provider = new firebase.auth.GoogleAuthProvider();
       return firebase.auth().signInWithPopup(provider)
        .then(res => {
            const signedInUser = getUser(res.user);
            setUser(signedInUser);
            // console.log(signedInUser);
           console.log(res.user);
            return res.user;
        })
        .catch(err => {
            setUser(null);
            console.log(user)
            return err.message;
        })
    }

    const signOut = () => {
        return firebase.auth().signOut().then(function() {
            setUser(null);
            return true;
          }).catch(function(error) {
            console.log(error);
            return false;
          });
    }

    useEffect(() => {
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
              const currentUser = getUser(user);
              setUser(currentUser);
            } else {
              // No user is signed in.
            }
          });
    },[])

    return {
        user,
        signInWithGoogle,
        signOut,
    }
}

export default Auth;