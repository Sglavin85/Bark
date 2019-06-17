import React, { Component } from 'react'
import './routes.css'
import OwnerMap from '../../maps/OwnerMap'
import mapCalls from '../../maps/APIcalls'

export default class OwnerRoutes extends Component {
    state = {
        lat: '',
        long: '',
    }

    async componentDidMount() {
        var currentUser = JSON.parse(sessionStorage.getItem("user"))
        mapCalls.getUserAddress(currentUser)
            .then(location => {
                const currentAddress = location.results[0].locations[0].latLng
                this.setState({ lat: currentAddress.lat, long: currentAddress.lng })
            })

    }
    render() {
        return (
            <div>
                {!!this.state.lat ? <OwnerMap user={this.props.user} lat={this.state.lat} long={this.state.long} /> : null}
            </div>
        )
    }
}
