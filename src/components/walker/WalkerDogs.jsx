import React, { Component } from 'react'
import DogCard from '../dogs/DogCard'
import { Row, Col } from 'antd'
import '../owner/owner.css'
import API from '../../modules/API'


export default class WalkerDogs extends Component {
    state = {
        dogPage: false,
        dogs: [],
        isWalker: true
    }

    componentDidMount() {
        API.getAllDogs()
            .then(allDogs => {
                const dogArray = Object.values(allDogs)
                this.setState({ dogs: dogArray })
            })
    }

    makeDogCards = dogs => {

        if (this.state.dogs.length > 0) {
            const dogCards = dogs.map((dog, index) => (
                <Col key={index}>
                    <DogCard
                        {...this.props}
                        dogPage={this.state.dogPage}
                        dog={dog}
                        key={index}
                        isWalker={this.state.isWalker}
                    />
                </Col>
            )
            )
            return dogCards
        }
    }



    render() {
        return (
            <>
                <Row type="flex" justify="center">
                    <Col>
                        <h1 className="homeTypeFace">Dogs</h1>
                        <div className="firstHR"></div>
                        <Row type="flex" justify="center">
                            {this.makeDogCards(this.state.dogs)}
                        </Row>
                    </Col>
                </Row>
            </>
        )
    }
}