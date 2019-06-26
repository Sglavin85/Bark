import React, { Component } from 'react'
import './routes.css'
import OwnerMap from '../../maps/OwnerMap'
import API from '../../modules/API'

export default class OwnerRoutes extends Component {
    state = {
        lat: '',
        long: '',
        userFenceObj: [{ fence: [] }],
        isStateBack: false
    }

    //prepares the fence logic to ensure that if a fence exists that is is rendered on the the map component that is below.

    componentDidMount() {

        var currentUser = JSON.parse(sessionStorage.getItem("user"))
        API.getFence(currentUser.uid)
            .then(fence => {
                if (fence.length > 0) {
                    this.setState({ lat: currentUser.lat, long: currentUser.long, userFenceObj: fence }, () => { this.setState({ isStateBack: true }) })
                } else {
                    this.setState({ lat: currentUser.lat, long: currentUser.long, userFence: [] }, () => { this.setState({ isStateBack: true }) })
                }

            })
    }
    render() {
        return (
            <div>
                {!!this.state.isStateBack ? <OwnerMap user={this.props.user} fence={this.state.userFenceObj[0].fence} fenceObj={this.state.userFenceObj} lat={this.state.lat} long={this.state.long} /> : null}
            </div>
        )
    }
}
