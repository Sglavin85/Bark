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
            owner: ""
        }
    }

    //prepares the fence logic to ensure that if a fence exists that is is rendered on the the map component that is below, this is done by using the dogs Id to get the dog record and then using the ownerId from that to retrieve the fence record.

    componentDidMount() {
        const thisDog = this.props.match.params.id
        API.getDog(thisDog)
            .then(dog => {
                API.getFence(dog.ownerId)
                    .then(fence => {
                        const fenceArray = Object.values(fence)
                        this.setState({ fence: fenceArray }, () => {
                            API.getOwner(dog.ownerId)
                                .then(owner => { this.setState({ owner: owner, dog: dog, lat: owner.lat, long: owner.long }) })
                        })
                    })
            })
    }

    render() {
        return (
            <div>
                <h1>{this.props.dog.name}'s walk</h1>
                {!!this.state.lat ? <WalkerMap owner={this.state.owner} lat={this.state.lat} long={this.state.long} fence={this.state.fence[0]} dog={this.state.dog} /> : null}
            </div>
        )
    }
}
