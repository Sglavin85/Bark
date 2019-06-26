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
        //declares and empty array for the listener refs to be stored in.
        this.refArray = []
    }
    state = {
        invoices: [],
        dogs: [],
        pathTrack: [],
        fence: [],
        user: {},
        isOwner: true

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
        //once the dogs is loaded into the parent components state then the refs will be created for each of the dogs that the owner has.
        if (this.props.dogs !== prevProps.dogs) {
            //in case this is not the first update for the dogs in the parent components array this will turn off all the refs for an owner.
            this.refArray.forEach(ref => {
                ref.off()

            })
            //and then reset the array to be empty
            this.refArray = []

            //sets the props to state and then on the callback from setstate iterates over the array to create listeners for the real time database
            this.setState({ dogs: this.props.dogs }, () => {
                this.props.dogs.forEach(dog => {

                    //listens to the databse for a new child that is created. When a walk is started a new key is created called "walk" once the conditions are met then the navbar is changed to conditionally render a button which allows the owner to go to the live tracking page and also opens a modal to alert the user that thier dog is being walked.
                    var walkRef = firebase.database().ref(`animals/${dog.id}`)
                    this.refArray.push(walkRef)
                    walkRef.on(`child_added`, (snapshot) => {
                        var parsedSnapshot = snapshot.hasChildren()
                        if (parsedSnapshot) {
                            this.props.changeNavBar(dog)
                            this.startModal(dog)
                        }
                    })

                    //listens to that child that was created and pulls any changes that come back. These changes are the lat and long of the current position of the  person walking thier dog. Once the new position is back they they are added to an array and then  pushed in to an array in state, which is passed to the component that renders the map.
                    var trackRef = firebase.database().ref(`animals/${dog.id}/walk`)
                    this.refArray.push(trackRef)
                    trackRef.on(`child_added`, (snapshot) => {
                        var parsedSnapshot = snapshot.val()
                        this.updatePath(parsedSnapshot.lat, parsedSnapshot.long)
                    })

                    //listens to the database for the dogs record for anything that gets deleted. if the condition is met then the button on the nav bar goes away and the user is alerted that the walk has ended which will redirect them to the checkout page.
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
    //notication modals
    startModal = (dog) => {
        Modal.confirm({
            title: `Hey ${this.state.user.firstName}!`,
            content: (
                <div>
                    <h2>{dog.name} is on a walk!</h2>
                    <p>Click OK below to watch where the walker goes</p>
                </div>
            ),
            onOk: () => {
                this.props.history.push(`/owners/walks/${dog.id}`)
            },
            onCancel() { }
        })
    }

    endModal = (dog) => {
        Modal.confirm({
            title: `Hey ${this.state.user.firstName}!`,
            content: (
                <div>
                    <h2>{dog.name}'s walk has ended!</h2>
                    <p>Click OK below to finalize payment</p>
                </div>
            ),
            onOk: () => {
                this.props.history.push(`/owners/account`)
            }
            ,
            onCancel() { }
        })
    }
    //adds the new coords to the array in state
    updatePath = (lat, long) => {
        debugger
        const newLatLong = [lat, long]
        const newArray = [...this.state.pathTrack, newLatLong]
        this.setState({ pathTrack: newArray })
    }
    //if component is about to unmount (i.e. user logs out ) the listeners are turned off and the listener array is emptied.
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
