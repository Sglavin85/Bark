import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { Route, Redirect } from 'react-router-dom'
import WalkerHomeView from '../components/walker/WalkerHomeView'
import WalkerDetails from '../components/walker/WalkerDetails'
import WalkerCalendar from '../components/walker/WalkerCalendar'
import WalkerDogs from '../components/walker/WalkerDogs'
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
                        return <WalkerDetails {...props} isUser={true} walker={this.props.user} />
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
                <Route exact path="/walkers/dogs" render={(props) => {
                    if (this.isAuthenticated()) {
                        return <WalkerDogs {...props} user={this.props.user} />
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
