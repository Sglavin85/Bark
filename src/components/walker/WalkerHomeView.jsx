import React, { Component } from 'react'
import API from '../../modules/API'
import { Row, Col } from 'antd'
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

    //on mount gets all dogs from the database and sets thems to state. also sets current user to state.

    componentDidMount() {
        var currentUser = JSON.parse(sessionStorage.getItem("user"))
        API.getAllDogs().then(dogs => {
            const dogArray = Object.values(dogs)
            this.setState({ dogs: dogArray })
        })
        this.setState({ user: currentUser })
    }

    //takes all the dogs and sorts them by reviews. then reverses the sort and slices off the first three dogs. this leaves us with the three highest rateed dogs in the array and we then display those dogs. We pass dog page as a boolean so that no buttons are renderesd on the compoenent as this is only an overview.

    makeDogCards = dogs => {
        if (this.state.dogs.length > 0) {
            const sortedDogs = dogs.sort((a, b) => (a.rating > b.rating ? 1 : -1))
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
                        {/* <Row type="flex" justify="center">
                            <h1>PlaceHolder</h1>
                        </Row>
                        <Row type="flex" justify="center">
                            <Col>
                                <div className="dogButton">
                                    <Button href='/walkers/calendar' size="large" type="primary">Manage Calendar</Button>
                                </div>
                            </Col>
                        </Row> */}
                    </Col>
                </Row>
                <div className="Line"></div>
                <Row type="flex" justify="center">
                    <Col>
                        <h1 className="homeTypeFace">Featured Dogs</h1>
                        <Row type="flex" justify="start">
                            {this.makeDogCards(this.state.dogs)}
                        </Row>
                    </Col>
                </Row>
            </>
        )
    }
}
