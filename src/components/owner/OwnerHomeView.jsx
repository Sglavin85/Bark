import React, { Component } from 'react'
import API from '../../modules/API'
import { Row, Col, Button } from 'antd'
import DogCard from '../dogs/DogCard'
import './owner.css'
import WalkerCard from '../walker/WalkerCard'

export default class OwnerHomeView extends Component {
    state = {
        user: {},
        dogs: [],
        walkers: [],
        dogPage: false,
        isWalkerPage: false
    }

    //gets user from session storage then gets all the users dog and also gets all the walkers.

    componentDidMount() {
        var currentUser = JSON.parse(sessionStorage.getItem("user"))
        API.getUserDogs(currentUser).then(userDogs => {
            const dogArray = Object.values(userDogs)
            this.setState({ dogs: dogArray })
        })
        this.setState({ user: currentUser })
        API.getWalkers().then(walkers => {
            const walkerArray = Object.values(walkers)
            this.setState({ walkers: walkerArray })
        })
    }

    //makes cards for each dog that the owner has. passes dogpage as false so that no buttons render on the home page as this is just an overview.

    makeDogCards = dogs => {
        if (this.state.dogs.length > 0) {
            const dogCards = dogs.map((dog, index) => (
                <Col key={index}>
                    <DogCard
                        dogPage={this.state.dogPage}
                        dog={dog}
                        key={index}
                    />
                </Col>)

            );
            return dogCards
        }
    }

    //takes the walkers array array and then sorts them by thier rating, reverse the sort and slices off the first three which is set to a variable. This leaves us with the top three highest rated walkers which is then maped over to render their cards.

    makeWalkerCards = walkers => {
        if (this.state.walkers.length > 0) {
            const sortedWalkers = walkers.sort((a, b) => (a.rating > b.rating ? 1 : -1))
            const topWalkers = sortedWalkers.reverse().slice(0, 3)
            const walkerCards = topWalkers.map(walker => (
                <Col key={walker.uid}>
                    <WalkerCard walker={walker}
                        isWalkerPage={this.state.isWalkerPage} />
                </Col>
            )
            )
            return walkerCards
        }
    }


    render() {
        const firstName = this.state.user.firstName
        return (
            <>
                <Row type="flex" justify="center">
                    <Col>
                        <h1 className="homeTypeFace">Hi {firstName}, Welcome Back</h1>
                        <div className="firstHR"></div>
                        <Row type="flex" justify="start">
                            {this.makeDogCards(this.state.dogs)}
                        </Row>
                        <Row type="flex" justify="center">
                            <Col>
                                <div className="dogButton">
                                    <Button href='/owners/dogs' size="large" type="primary">Manage Dogs</Button>
                                </div>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <div className="Line"></div>
                <Row type="flex" justify="center">
                    <Col>
                        <h1 className="homeTypeFace">Featured Walkers</h1>
                        <Row type="flex" justify="center">
                            {this.makeWalkerCards(this.state.walkers)}
                        </Row>
                    </Col>
                </Row>
            </>
        )
    }
}
