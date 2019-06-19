import React, { Component } from 'react'
import { Card, Modal, Button, Row, Col } from 'antd'
import API from '../../../modules/API'
import './payment.css'

export default class InvoiceCard extends Component {

    componentDidMount() {
        API.getFence(this.props.invoice.ownerId)
            .then(fence => this.setState({ ownerFence: fence }))
        API.getOwner(this.invoice.ownerId)
            .then(owner => this.setState({ owner: owner }))

    }


    render() {

        const cardImg = { backgroundImage: `url(${this.props.invoice.dogImg})` }

        return (
            <>
                <div className="invoiceCardDiv" onClick={this.handleClick}>

                    <Row type="flex" justify="start">
                        <Col>
                            <div className="invoiceBackgroundImg" style={cardImg}></div>
                        </Col>
                        <Row>

                            <Col span={24} offset={3}>
                                <h2>{this.props.invoice.dogName}</h2>
                                <h3>{this.props.invoice.date}</h3>
                                <h3>Walker Name: {this.props.invoice.walkerFirstName} {this.props.invoice.walkerLastName}</h3>
                                <h4>${this.props.invoice.ammount}</h4>
                            </Col>
                        </Row>
                    </Row>

                </div>
            </>
        )
    }
}
