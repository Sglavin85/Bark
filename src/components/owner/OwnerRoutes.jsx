import React, { Component } from 'react'
import './routes.css'
import OwnerMap from '../../maps/OwnerMap'
import API from '../../modules/API'

export default class OwnerRoutes extends Component {
    state = {
        lat: '',
        long: '',
        userFence: []
    }

    async componentDidMount() {
        var currentUser = JSON.parse(sessionStorage.getItem("user"))
        API.getFence(currentUser.uid)
            .then(fence => {
                if (fence.length > 0) {
                    this.setState({ lat: currentUser.lat, long: currentUser.long, userFence: fence })
                }

            })
    }
    render() {
        return (
            <div>
                {!!this.state.lat ? <OwnerMap user={this.props.user} fence={this.state.userFence} lat={this.state.lat} long={this.state.long} /> : null}
            </div>
        )
    }
}
