import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { Route, Redirect } from 'react-router-dom'
import WalkerHomeView from '../components/walker/WalkerHomeView'
import WalkerDetails from '../components/walker/WalkerDetails'
import WalkerDogViews from './WalkerDogViews'
import WalkerAccount from '../components/walker/WalkerAccount'
import Walks from '../components/walker/Walks'
import API from '../modules/API'
import PathModal from '../components/owner/payment/PathModal'



class WalkerViews extends Component {
    state = {
        dogs: [],
        isOwner: false
    }

    componentDidMount() {
        API.getAllDogs()
            .then(allDogs => {
                const dogArray = Object.values(allDogs)
                this.setState({ dogs: dogArray })
            })
        API.getAllInvoices().then(invoices => {
            if (invoices !== null) {
                const parsedInvoices = Object.values(invoices)
                this.setState({ invoices: parsedInvoices })
            }
        })
    }

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
                <Route path="/walkers/dogs" render={(props) => {
                    if (this.isAuthenticated()) {
                        return <WalkerDogViews {...props} user={this.props.user} />
                    } else {
                        return <Redirect to="/auth/login"
                        />
                    }
                }}
                />
                <Route exact path="/walkers/walks/:id" render={(props) => {
                    if (this.isAuthenticated()) {
                        let dog = this.state.dogs.find(dog =>
                            dog.id === props.match.params.id
                        )
                        if (!dog) {
                            dog = {
                                age: null,
                                breed: null,
                                color: null,
                                gender: null,
                                id: null,
                                image: null,
                                name: null,
                                notes: null,
                                ownerId: null,
                                rating: null,
                                temperment: null
                            }
                        }
                        return <Walks {...props}
                            dog={dog}
                        />
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
                <Route exact path="/walkers/paths/:id" render={(props) => {
                    if (this.isAuthenticated()) {

                        let invoice = this.state.invoices.find(invoice =>
                            invoice.id === props.match.params.id
                        )
                        if (!invoice) {
                            return
                        }
                        return <PathModal {...props}
                            isOwner={this.state.isOwner}
                            invoice={invoice}
                        />
                    } else {
                        return <Redirect to="/auth/login" />
                    }
                }}
                />
            </>
        )
    }
}

export default withRouter(WalkerViews)
