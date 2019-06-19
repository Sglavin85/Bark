import React, { Component } from 'react'
import { Route, Redirect } from 'react-router-dom'
import OwnerHomeView from '../components/owner/OwnerHomeView'
import OwnerDogs from '../components/owner/OwnerDogs'
import OwnerRoutes from '../components/owner/OwnerRoutes'
import Payments from '../components/owner/payment/Payments'
import OwnerWalkersViews from './OwnerWalkersViews';
import PathModal from '../components/owner/payment/PathModal'
import API from '../modules/API'

export default class OwnerViews extends Component {
    state = {
        invoices: []
    }

    isAuthenticated = () => sessionStorage.getItem("user") !== null

    componentDidMount() {
        API.getAllInvoices().then(invoices => {
            const parsedInvoices = Object.values(invoices)
            this.setState({ invoices: parsedInvoices })
        })
    }


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
                    if (this.isAuthenticated()) {
                        return <OwnerRoutes {...props} user={this.props.user} />
                    } else {
                        return <Redirect to="/auth/login"
                        />
                    }
                }}
                />
                <Route path="/owners/walkers" render={(props) => {
                    if (this.isAuthenticated()) {
                        return <OwnerWalkersViews {...props} user={this.props.user} />
                    } else {
                        return <Redirect to="/auth/login"
                        />
                    }
                }}
                />

                <Route exact path="/owners/account" render={(props) => {
                    if (this.isAuthenticated()) {
                        return <Payments {...props} user={this.props.user} />
                    } else {
                        return <Redirect to="/auth/login"
                        />
                    }
                }}
                />
                <Route exact path="/owners/paths/:id" render={(props) => {
                    if (this.isAuthenticated()) {
                        let invoice = this.state.invoices.find(invoice =>
                            invoice.id === props.match.params.id
                        )
                        if (!invoice) {
                            invoice = {
                                ammount: null,
                                date: null,
                                distance: null,
                                dogName: null,
                                ownerId: null,
                                ownerFirstName: null,
                                ownerLastName: null,
                                walkerId: null,
                                walkerFirstName: null,
                                walkerLastName: null,
                                path: [],
                                resolved: null,
                                dogImg: null
                            }
                        }
                        return <PathModal {...props}
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
