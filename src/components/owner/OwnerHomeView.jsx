import React, { Component } from 'react'
import API from '../../modules/API'
import { Row, Col } from 'antd'
import DogCard from '../dogs/DogCard'

export default class OwnerHomeView extends Component {
    state = {
        user: {},
        dogs: []
    }

    componentDidMount() {
        var currentUser = JSON.parse(sessionStorage.getItem("user"))
        console.log(currentUser)
        API.getUserDogs(currentUser).then(userDogs => {
            const dogArray = Object.values(userDogs)
            this.setState({ dogs: dogArray })
        })
        this.setState({ user: currentUser })
    }

    makeDogCards = dogs => {
        if (this.state.dogs.length > 0) {
            const dogCards = dogs.map(dog => (
                <Col>
                    <DogCard
                        key={dog.id}
                        dog={dog}
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
                        <div className="firstHR"><hr /></div>
                        <Row>
                            {this.makeDogCards(this.state.dogs)}
                        </Row>
                    </Col>
                </Row>

            </>
        )
    }
}
