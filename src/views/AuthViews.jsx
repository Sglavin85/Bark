import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import Login from '../auth/Login'
import Register from '../auth/Register'
import { withRouter } from 'react-router'

class AuthViews extends Component {
    render() {
        return (
            <>
                <Route exact path="/auth/login" render={(props) => {
                    return <Login {...props}
                        loginState={this.props.loginState}
                        login={this.props.login}
                    />
                }}
                />
                <Route exact path="/auth/register" render={(props) => {
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

export default withRouter(AuthViews)