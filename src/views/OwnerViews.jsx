import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { Route, Redirect } from 'react-router-dom'
import OwnerHomeView from '../components/owner/OwnerHomeView'
import OwnerDogs from '../components/owner/OwnerDogs'
import OwnerRoutes from '../components/owner/OwnerRoutes'
import Walkers from '../components/owner/Walkers'
import OwnerAccount from '../components/owner/OwnerAccount'

class OwnerViews extends Component {
    isAuthenticated = () => sessionStorage.getItem("user") !== null



    render() {
        return (
            <>
                <Route exact path="/owners/home" render={(props) => {
                    if (this.isAuthenticated()) {
                        return <OwnerHomeView {...props} user={this.props.user} />
                    } else {
                        return <Redirect to="/auth/login"
                        />
                    }
                }}
                />
                <Route exact path="/owners/dogs" render={(props) => {
                    if (this.isAuthenticated()) {
                        return <OwnerDogs {...props} user={this.props.user} />
                    } else {
                        return <Redirect to="/auth/login"
                        />
                    }
                }}
                />
                <Route exact path="/owners/routes" render={(props) => {
                    debugger
                    if (this.isAuthenticated()) {
                        return <OwnerRoutes {...props} user={this.props.user} />
                    } else {
                        return <Redirect to="/auth/login"
                        />
                    }
                }}
                />
                <Route exact path="/owners/walkers" render={(props) => {
                    if (this.isAuthenticated()) {
                        return <Walkers {...props} user={this.props.user} />
                    } else {
                        return <Redirect to="/auth/login"
                        />
                    }
                }}
                />
                <Route exact path="/owners/account" render={(props) => {
                    if (this.isAuthenticated()) {
                        return <OwnerAccount {...props} user={this.props.user} />
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
