import React from 'react';
import ReactDOM from 'react-dom';
import './global.css';
import Wag from './Wag';
import { BrowserRouter as Router } from "react-router-dom"
import * as firebase from 'firebase/app';
import "firebase/database"
import keys from './keys/Keys'

const firebaseConfig = keys.firebase;

firebase.initializeApp(firebaseConfig);

ReactDOM.render(
    <Router>
        <Wag />
    </Router>,
    document.getElementById('root')
);
