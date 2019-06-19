import React, { Component } from 'react'
import { Row, Col, Modal, Button } from 'antd'
import '../../../maps/map.css'
import L from 'leaflet'

export default class PathModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            userFence: this.props.fence[0].fence,
            path: this.props.invoice.path,

        }

        this.fenceRender = L.polygon(this.state.userFence, { lineCap: 'circle', color: '#324759', fillRule: "nonzero", })
        this.pathRender = L.polyline(this.state.path, { lineCap: 'circle', color: '#324759' })

    }
    componentDidMount() {
        // create map
        this.map = L.map('pathMap', { drawControl: true })
            .setView([this.props.lat, this.props.long], 14)
        // add tiles to map
        L.tileLayer("https://api.mapbox.com/styles/v1/sglavin85/cjwwh144ha2rx1cnz8qgmjfe6/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1Ijoic2dsYXZpbjg1IiwiYSI6ImNqd3dhdWh1OTBldWg0OWxna2VuZmVxMDIifQ.ME2N9N5umfgKgVu7vnC2cQ", {
            maxZoom: 18,
            id: 'mapbox.streets'
        }).addTo(this.map);
        this.fenceRender.addTo(this.map)
        this.pathRender.addTo(this.map)

    }

    render() {
        return (
            <Modal
                visible={this.props.vis}
                width={600}
                mask={true}
                maskClosable={true}
                centered={true}
                onCancel={this.props.goBack}
                footer={[
                    <Row key={1} type="flex" justify="center">
                        <Col>
                            <Button type="primary" onClick={this.props.goBack}>
                                Go Back</Button>
                        </Col>
                    </Row>

                ]}>
                <Row type="flex" justify="center">
                    <Col>
                        <h1>{this.props.invoice.dogName}'s Walk</h1>
                        <div id="pathMap"></div>
                    </Col>
                </Row>
            </Modal>
        )
    }
}
