import React, { Component } from 'react'
import API from '../../modules/API'
import { Row, Col, Button } from 'antd'
import DogCard from '../dogs/DogCard'
import '../owner/owner.css'

export default class OwnerHomeView extends Component {
    state = {
        user: {},
        dogs: [],
        walkers: [],
        dogPage: false,
        isWalkerPage: false
    }

    componentDidMount() {
        var currentUser = JSON.parse(sessionStorage.getItem("user"))
        API.getAllDogs().then(dogs => {
            const dogArray = Object.values(dogs)
            this.setState({ dogs: dogArray })
        })
        this.setState({ user: currentUser })
    }

    makeDogCards = dogs => {
        if (this.state.dogs.length > 0) {
            const sortedDogs = dogs.sort(function (a, b) {
                return a - b;
            }, dogs.rating)
            const topDogs = sortedDogs.reverse().slice(0, 3)
            const dogCards = topDogs.map((dog, index) => (
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


    render() {
        const firstName = this.state.user.firstName
        return (
            <>
                <Row type="flex" justify="center">
                    <Col>
                        <h1 className="homeTypeFace">Hi {firstName}, Welcome Back</h1>
                        <div className="firstHR"></div>
                        <Row type="flex" justify="center">
                            <h1>PlaceHolder</h1>
                        </Row>
                        <Row type="flex" justify="center">
                            <Col>
                                <div className="dogButton">
                                    <Button href='/walkers/calendar' size="large" type="primary">Manage Calendar</Button>
                                </div>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <div className="Line"></div>
                <Row type="flex" justify="center">
                    <Col>
                        <h1 className="homeTypeFace">Featured Dogs</h1>
                        <Row type="flex" justify="center">
                            {this.makeDogCards(this.state.dogs)}
                        </Row>
                    </Col>
                </Row>
            </>
        )
    }
}
