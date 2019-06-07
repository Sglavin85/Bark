import React from 'react'
import OwnerViews from './OwnerViews'
import WalkerViews from './WalkerViews'
import AuthViews from './AuthViews'

const ViewLogic = (props) => {

    if (props.userLoggedIn === true) {
        if (props.userIsOwner === true) {
            return <OwnerViews userLoggedIn={props.userLoggedIn} />
        } else {
            return <WalkerViews userLoggedIn={props.userLoggedIn} />
        }
    } else {
        return <AuthViews {...props} login={props.login} />
    }
}

export default ViewLogic