import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import Login from '../auth/Login'
import Register from '../auth/Register'

export default class AuthViews extends Component {
    render() {
        return (
            <>
                <Route path="/login" render={(props) => {
                    return <Login {...props}
                        loginState={this.props.loginState}
                        login={this.props.login}
                    />
                }}
                />
                <Route path="/register" render={(props) => {
                    return <Register {...props}
                        loginState={this.props.loginState}
                        login={this.props.login}
                    />
                }}
                />
            </>
        )
    }
}
