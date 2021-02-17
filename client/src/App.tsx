import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from "react-router-dom";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import LoginScreen from './screens/LoginScreen';
import firebase from "firebase/app";


const firebaseConfig = {
  apiKey: "AIzaSyDlLLKKqYu7ghdEr0U42WS6YPOHUK8bxHw",
  authDomain: "store-shopify-technical.firebaseapp.com",
  projectId: "store-shopify-technical",
  storageBucket: "store-shopify-technical.appspot.com",
  messagingSenderId: "159608292461",
  appId: "1:159608292461:web:3bf6aecc2bea416220ab64"
};

firebase.initializeApp(firebaseConfig);

const App = () => {
  return (
    <div>
      <Router>
        <Switch>
          <Route path="/login">
            <LoginScreen />
          </Route>
        </Switch>
        <Redirect path="/" to="/login" />
      </Router>
    </div>
  );
}

export default App;
