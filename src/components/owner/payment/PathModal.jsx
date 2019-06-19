import React, { Component } from 'react'
import { Row, Col, Modal, Button } from 'antd'
import '../../../maps/map.css'
import L from 'leaflet'
import API from '../../../modules/API'

export default class PathModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            ownerFence: [],
            lat: '',
            long: '',
            path: this.props.invoice.path
        }


    }
    componentDidMount() {
        console.log(this.props)
        API.getFence(this.props.invoice.ownerId)
            .then(fence => this.setState({ ownerFence: fence }, () => {

                API.getOwner(this.props.invoice.ownerId)
                    .then(owner => this.setState({ lat: owner.lat, long: owner.long }, () => {
                        // create map
                        this.map = L.map('map')
                            .setView([this.state.lat, this.state.long], 14)
                        // add tiles to map
                        L.tileLayer("https://api.mapbox.com/styles/v1/sglavin85/cjwwh144ha2rx1cnz8qgmjfe6/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1Ijoic2dsYXZpbjg1IiwiYSI6ImNqd3dhdWh1OTBldWg0OWxna2VuZmVxMDIifQ.ME2N9N5umfgKgVu7vnC2cQ", {
                            maxZoom: 18,
                            id: 'mapbox.streets'
                        }).addTo(this.map);
                        const fenceRender = L.polygon(this.state.ownerFence[0].fence, { lineCap: 'circle', color: '#324759', fillRule: "nonzero", })
                        fenceRender.addTo(this.map)
                        const pathRender = L.polyline(this.state.path, { lineCap: 'circle', color: '#324759' })
                        pathRender.addTo(this.map)
                    }))
            }))
    }

    cancel = () => {
        this.props.history.goBack()
    }

    render() {
        return (
            <>

                <Row type="flex" justify="center">
                    <Col>
                    </Col>
                </Row>

                <Row type="flex" justify="center">
                    <Col>
                        <h1>{this.props.invoice.dogName}'s Walk</h1>
                        <Row type='flex' justify='center'>
                            <Col>
                                <Button type="primary" onClick={this.cancel}>
                                    Go Back</Button>
                            </Col></Row>
                        <div id="map"></div>
                    </Col>
                </Row>

            </>
        )
    }
}
