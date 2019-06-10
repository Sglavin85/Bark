import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { Route, Redirect } from 'react-router-dom'
import WalkerHomeView from '../components/walker/WalkerHomeView'
import WalkerDetails from '../components/walker/WalkerDetails'
import WalkerCalendar from '../components/walker/WalkerCalendar'
import Walks from '../components/walker/Walks'
import WalkerAccount from '../components/walker/WalkerAccount'



class WalkerViews extends Component {

    isAuthenticated = () => sessionStorage.getItem("user") !== null

    render() {
        return (
            <>
                <Route exact path="/walkers/home" render={(props) => {
                    if (this.isAuthenticated()) {
                        return <WalkerHomeView {...props} user={this.props.user} />
                    } else {
                        return <Redirect to="/auth/login"
                        />
                    }
                }}
                />
                <Route exact path="/walkers/profile" render={(props) => {
                    if (this.isAuthenticated()) {
                        return <WalkerDetails {...props} user={this.props.user} />
                    } else {
                        return <Redirect to="/auth/login"
                        />
                    }
                }}
                />
                <Route exact path="/walkers/calendar" render={(props) => {
                    if (this.isAuthenticated()) {
                        return <WalkerCalendar {...props} user={this.props.user} />
                    } else {
                        return <Redirect to="/auth/login"
                        />
                    }
                }}
                />
                <Route exact path="/walkers/walks" render={(props) => {
                    if (this.isAuthenticated()) {
                        return <Walks {...props} user={this.props.user} />
                    } else {
                        return <Redirect to="/auth/login"
                        />
                    }
                }}
                />
                <Route exact path="/walkers/account" render={(props) => {
                    if (this.isAuthenticated()) {
                        return <WalkerAccount {...props} user={this.props.user} />
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

export default withRouter(WalkerViews)
