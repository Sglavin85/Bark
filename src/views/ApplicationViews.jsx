import React, { Component } from 'react'
import ViewLogic from './ViewLogic'
import AuthViews from './AuthViews'

export default class ApplicationViews extends Component {
    render() {
        return (
            <>
                <ViewLogic userLoggedIn={this.state.userLoggedIn} userIsOwner={this.state.userIsOwner} />
            </>
        )
    }
}
