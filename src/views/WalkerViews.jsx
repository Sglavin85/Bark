import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { Route, Redirect } from 'react-router-dom'
import WalkerHomeView from '../components/walker/WalkerHomeView'
import WalkerDetails from '../components/walker/WalkerDetails'
import WalkerCalendar from '../components/walker/WalkerCalendar'
import Walks from '../components/walker/Walks'
import WalkerAccount from '../components/walker/WalkerAccount'



class WalkerViews extends Component {

    isAuthenticated = () => sessionStorage.getItem("credentials") !== null

    render() {
        return (
            <>
                <Route path="/walkers-home" render={(props) => {
                    if (this.isAuthenticated()) {
                        return <WalkerHomeView {...props} />
                    } else {
                        return <Redirect to="/login"
                        />
                    }
                }}
                />
                <Route path="/walker-profile" render={(props) => {
                    if (this.isAuthenticated()) {
                        return <WalkerDetails {...props} />
                    } else {
                        return <Redirect to="/login"
                        />
                    }
                }}
                />
                <Route path="/walker-calendar" render={(props) => {
                    if (this.isAuthenticated()) {
                        return <WalkerCalendar {...props} />
                    } else {
                        return <Redirect to="/login"
                        />
                    }
                }}
                />
                <Route path="/walks" render={(props) => {
                    if (this.isAuthenticated()) {
                        return <Walks {...props} />
                    } else {
                        return <Redirect to="/login"
                        />
                    }
                }}
                />
                <Route path="/walker-account" render={(props) => {
                    if (this.isAuthenticated()) {
                        return <WalkerAccount {...props} />
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

export default withRouter(WalkerViews)
