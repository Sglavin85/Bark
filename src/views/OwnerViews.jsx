import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { Route, Redirect } from 'react-router-dom'
import OwnerHomeView from '../components/owner/OwnerHomeView'
import OwnerDogs from '../components/owner/OwnerDogs'
import OwnerRoutes from '../components/owner/OwnerRoutes'
import Walkers from '../components/owner/Walkers'
import OwnerAccount from '../components/owner/OwnerAccount'

class OwnerViews extends Component {

    render() {
        return (
            <>
                <Route exact path="/owners/home" render={(props) => {
                    debugger
                    if (this.props.userLoggedIn === true) {
                        return <OwnerHomeView {...props} />
                    } else {
                        return <Redirect to="/auth/login"
                        />
                    }
                }}
                />
                <Route exact path="/owners/dogs" render={(props) => {
                    if (this.props.userLoggedIn === true) {
                        return <OwnerDogs {...props} />
                    } else {
                        return <Redirect to="/auth/login"
                        />
                    }
                }}
                />
                <Route exact path="/owners/routes" render={(props) => {
                    debugger
                    if (this.props.userLoggedIn === true) {
                        return <OwnerRoutes {...props} />
                    } else {
                        return <Redirect to="/auth/login"
                        />
                    }
                }}
                />
                <Route exact path="/owners/walkers" render={(props) => {
                    if (this.props.userLoggedIn === true) {
                        return <Walkers {...props} />
                    } else {
                        return <Redirect to="/auth/login"
                        />
                    }
                }}
                />
                <Route exact path="/owners/account" render={(props) => {
                    if (this.props.userLoggedIn === true) {
                        return <OwnerAccount {...props} />
                    } else {
                        return <Redirect to="/auth/login"
                        />
                    }
                }}
                />
            </>
        )
    }
}

export default withRouter(OwnerViews)
