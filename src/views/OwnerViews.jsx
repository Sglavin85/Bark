import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { Route, Redirect } from 'react-router-dom'
import OwnerHomeView from '../components/owner/OwnerHomeView'
import OwnerDogs from '../components/owner/OwnerDogs'
import OwnerRoutes from '../components/owner/OwnerRoutes'
import Walkers from '../components/owner/Walkers'
import OwnerAccount from '../components/owner/OwnerAccount'

class OwnerViews extends Component {

    isAuthenticated = () => sessionStorage.getItem("credentials") !== null

    render() {
        return (
            <>
                <Route path="/owners-home" render={(props) => {
                    if (this.isAuthenticated()) {
                        return <OwnerHomeView {...props} />
                    } else {
                        return <Redirect to="/login"
                        />
                    }
                }}
                />
                <Route path="/owner-dogs" render={(props) => {
                    if (this.isAuthenticated()) {
                        return <OwnerDogs {...props} />
                    } else {
                        return <Redirect to="/login"
                        />
                    }
                }}
                />
                <Route path="/owner-routes" render={(props) => {
                    if (this.isAuthenticated()) {
                        return <OwnerRoutes {...props} />
                    } else {
                        return <Redirect to="/login"
                        />
                    }
                }}
                />
                <Route path="/walkers" render={(props) => {
                    if (this.isAuthenticated()) {
                        return <Walkers {...props} />
                    } else {
                        return <Redirect to="/login"
                        />
                    }
                }}
                />
                <Route path="/owner-account" render={(props) => {
                    if (this.isAuthenticated()) {
                        return <OwnerAccount {...props} />
                    } else {
                        return <Redirect to="/login"
                        />
                    }
                }}
                />
            </>
        )
    }
}

export default withRouter(OwnerViews)
