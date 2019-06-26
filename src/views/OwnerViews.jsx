import React, { Component } from 'react'
import { Route, Redirect } from 'react-router-dom'
import OwnerHomeView from '../components/owner/OwnerHomeView'
import OwnerDogs from '../components/owner/OwnerDogs'
import OwnerRoutes from '../components/owner/OwnerRoutes'
import Payments from '../components/owner/payment/Payments'
import OwnerWalkersViews from './OwnerWalkersViews';
import PathModal from '../components/owner/payment/PathModal'
import OwnerProfile from '../components/owner/OwnerProfile'
import LiveWatch from '../components/owner/LiveWatch'
import { Modal } from 'antd'
import API from '../modules/API'
import * as firebase from 'firebase/app';
import "firebase/database"


export default class OwnerViews extends Component {
    constructor(props) {
        super(props)
        this.refArray = []
    }
    state = {
        invoices: [],
        dogs: [],
        pathTrack: [],
        fence: [],
        user: {},

    }

    isAuthenticated = () => sessionStorage.getItem("user") !== null

    componentDidMount() {
        API.getAllInvoices().then(invoices => {
            if (invoices !== null) {
                const parsedInvoices = Object.values(invoices)
                this.setState({ invoices: parsedInvoices })
            }
        })
        var currentUser = JSON.parse(sessionStorage.getItem("user"))
        this.setState({ user: currentUser })

        API.getFence(this.props.user.uid).then(fence => this.setState({ fence: fence }))
        this.setState({ dogs: this.props.dogs })

    }

    componentDidUpdate(prevProps) {

        if (this.props.dogs !== prevProps.dogs) {

            this.refArray.forEach(ref => {
                ref.off()

            })
            this.refArray = []


            this.setState({ dogs: this.props.dogs }, () => {
                this.props.dogs.forEach(dog => {
                    var walkRef = firebase.database().ref(`animals/${dog.id}`)
                    this.refArray.push(walkRef)
                    walkRef.on(`child_added`, (snapshot) => {
                        var parsedSnapshot = snapshot.hasChildren()
                        if (parsedSnapshot) {
                            this.props.changeNavBar(dog)
                            this.startModal(dog)
                        }
                    })
                    var trackRef = firebase.database().ref(`animals/${dog.id}/walk`)
                    this.refArray.push(trackRef)
                    trackRef.on(`child_added`, (snapshot) => {
                        var parsedSnapshot = snapshot.val()
                        this.updatePath(parsedSnapshot.lat, parsedSnapshot.long)
                    })
                    var endWalkRef = firebase.database().ref(`animals/${dog.id}`)
                    this.refArray.push(endWalkRef)
                    endWalkRef.on(`child_removed`, (_snapshot) => {
                        this.props.hideNavBar()
                        this.endModal(dog)
                    })
                })
            })
        }
    }

    startModal = (dog) => {
        Modal.confirm({
            title: `A Walk has started!`,
            content: (
                <div>
                    <h2>{dog.name} is on a walk!</h2>
                    <h3>Click OK below to watch where the walker goes</h3>
                </div>
            ),
            onOk: () => {
                this.props.history.push(`/owners/walks/${dog.id}`)
            }
            ,
            onCancel() { }
        })
    }

    endModal = (dog) => {
        Modal.confirm({
            title: `A Walk has started!`,
            content: (
                <div>
                    <h2>{dog.name}'s walk has ended!</h2>
                    <h3>Click OK below to finalize payment</h3>
                </div>
            ),
            onOk: () => {
                this.props.history.push(`/owners/account`)
            }
            ,
            onCancel() { }
        })
    }

    updatePath = (lat, long) => {
        debugger
        const newLatLong = [lat, long]
        const newArray = [...this.state.pathTrack, newLatLong]
        this.setState({ pathTrack: newArray })
    }

    componentWillUnmount() {

        this.refArray.forEach(ref => {
            ref.off()

        })
        this.refArray = []
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
                <Route exact path="/owners/profile" render={(props) => {
                    if (this.isAuthenticated()) {
                        return <OwnerProfile {...props} user={this.props.user} />
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

                <Route exact path="/owners/walks/:id" render={(props) => {
                    if (this.isAuthenticated()) {

                        let dog = this.state.dogs.find(dog =>
                            dog.id === props.match.params.id

                        )
                        if (!dog) {
                            return
                        }
                        return <LiveWatch {...this.props} path={this.state.pathTrack} fence={this.state.fence} lat={this.state.user.lat} long={this.state.user.long} dog={dog} />

                    } else {
                        return <Redirect to="/auth/login" />
                    }
                }}
                />
                <Route exact path="/owners/paths/:id" render={(props) => {
                    if (this.isAuthenticated()) {

                        let invoice = this.state.invoices.find(invoice =>
                            invoice.id === props.match.params.id
                        )
                        if (!invoice) {
                            // invoice = {
                            //     ammount: null,
                            //     date: null,
                            //     distance: null,
                            //     dogName: null,
                            //     ownerId: null,
                            //     ownerFirstName: null,
                            //     ownerLastName: null,
                            //     walkerId: null,
                            //     walkerFirstName: null,
                            //     walkerLastName: null,
                            //     path: [],
                            //     resolved: null,
                            //     dogImg: null
                            // }
                            return
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
