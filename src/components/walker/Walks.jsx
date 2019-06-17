import React, { Component } from 'react'
import API from '../../modules/API'
import WalkerMap from '../../maps/WalkerMap'

export default class Walks extends Component {
    constructor(props) {
        super(props)
        this.state = {
            lat: "",
            long: "",
            fence: [],
        }
    }
    componentDidMount() {
        const thisDog = this.props.match.params.id
        API.getDog(thisDog)
            .then(dog => {
                API.getFence(dog.ownerId)
                    .then(fence => {
                        const fenceArray = Object.values(fence)
                        this.setState({ fence: fenceArray }, () => {
                            API.getOwner(dog.ownerId)
                                .then(owner => { this.setState({ lat: owner.lat, long: owner.long }) })
                        })
                    })
            })
    }

    render() {
        return (
            <div>
                <h1>{this.props.dog.name}'s walk</h1>
                {!!this.state.lat ? <WalkerMap lat={this.state.lat} long={this.state.long} fence={this.state.fence[0]} /> : null}
            </div>
        )
    }
}
