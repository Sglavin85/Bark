import React from 'react';
import ReactDOM from 'react-dom';
import './global.css';
import Wag from './Wag';
import { BrowserRouter as Router } from "react-router-dom"


ReactDOM.render(
    <Router>
        <Wag />
    </Router>,
    document.getElementById('root')
);
