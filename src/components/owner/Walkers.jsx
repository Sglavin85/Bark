import React, { Component } from 'react'
import WalkerCard from '../walker/WalkerCard'
import { Row, Col } from 'antd'
import './owner.css'


export default class Walkers extends Component {
    state = {
        isWalkerPage: true
    }

    cancelModal = () => {
        const stateToChange = { modalVis: false }
        this.setState(
            stateToChange
        )
    }

    makeWalkerCards = walkers => {

        if (this.props.walkers.length > 0) {
            const walkerCards = walkers.map(walker => (
                <Col key={walker.uid}>
                    <WalkerCard
                        {...this.props}
                        isWalkerPage={this.state.isWalkerPage}
                        walker={walker}
                    />
                </Col>
            )
            )
            return walkerCards
        }
    }



    render() {
        return (
            <>
                <Row type="flex" justify="center">
                    <Col>
                        <h1 className="homeTypeFace">Walkers</h1>
                        <div className="firstHR"></div>
                        <Row type="flex" justify="center">
                            {this.makeWalkerCards(this.props.walkers)}
                        </Row>
                    </Col>
                </Row>
            </>
        )
    }
}