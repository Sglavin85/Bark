import React, { Component } from 'react'
import { Route, Redirect } from 'react-router-dom'
import Walkers from '../components/owner/Walkers'
import WalkerDetails from '../components/walker/WalkerDetails'
import API from '../modules/API'

export default class OwnerWalkerViews extends Component {
    // state = {
    //     walkers: []
    // }

    // componentDidMount() {
    //     API.getWalkers().then(walkers => {
    //         const walkerArray = Object.values(walkers)
    //         this.setState({ walkers: walkerArray })
    //     })
    // }



    isAuthenticated = () => sessionStorage.getItem("user") !== null



    render() {
        return (
            <>
                <Route exact path="/owners/walkers/all" render={(props) => {
                    if (this.isAuthenticated()) {
                        return <Walkers {...props} walkers={this.props.walkers} user={this.props.user} />
                    } else {
                        return <Redirect to="/auth/login"
                        />
                    }
                }}
                />

                {this.props.walkersAreReady ?
                    <Route exact path="/owners/walkers/user/:uid" render={(props) => {
                        if (this.isAuthenticated()) {

                            let walker = this.props.walkers.find(walker =>
                                walker.uid === props.match.params.uid
                            )
                            if (!walker) {
                                walker = {
                                    address: null,
                                    bio: null,
                                    birthday: null,
                                    city: null,
                                    email: null,
                                    firstName: null,
                                    image: null,
                                    lastName: null,
                                    rating: null,
                                    state: null,
                                    uid: null,
                                    zip: null
                                }
                            }
                            return <WalkerDetails {...props}
                                walker={walker}
                            />
                        } else {
                            return <Redirect to="/auth/login" />
                        }
                    }}
                    /> : null

                }
            </>
        )
    }
}



