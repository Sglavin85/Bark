import React from 'react';
import ReactDOM from 'react-dom';
import './global.css';
import Wag from './Wag';
import { BrowserRouter as Router } from "react-router-dom"
import * as firebase from 'firebase/app';
import "firebase/database"

const firebaseConfig = {
    apiKey: "AIzaSyCbWrTuqvgfKsEPl8ZdA0NtRHrfWYAuhPU",
    authDomain: "wag-app-d212c.firebaseapp.com",
    databaseURL: "https://wag-app-d212c.firebaseio.com",
    projectId: "wag-app-d212c",
    storageBucket: "wag-app-d212c.appspot.com",
    messagingSenderId: "161461596955",
    appId: "1:161461596955:web:9892a9ae666c5c36"
};

firebase.initializeApp(firebaseConfig);

ReactDOM.render(
    <Router>
        <Wag />
    </Router>,
    document.getElementById('root')
);
