import React from 'react'
import OwnerViews from './OwnerViews'
import WalkerViews from './WalkerViews'
import { Redirect } from 'react-router'
import { Route } from 'react-router-dom'
import { withRouter } from 'react-router'


const ViewLogic = (props) => {
    if (props.userLoggedIn === true) {

        if (props.userIsOwner === true) {
            return <Route path="/owners" render={(props) => {
                return <OwnerViews userLoggedIn={props.userLoggedIn} />
            }}
            />
        } else {
            return <Route path="/walkers" render={(props) => {
                return <WalkerViews userLoggedIn={props.userLoggedIn} />
            }}
            />
        }
    } else {
        return <Redirect to='auth/login' />
    }
}

export default withRouter(ViewLogic)