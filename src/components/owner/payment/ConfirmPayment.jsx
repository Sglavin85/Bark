import React, { Component } from 'react'
import { Row, Col, Button } from 'antd'
import API from '../../../modules/API'
import '../owner.css'



export default class ConfirmPayment extends Component {


    resolve = () => {
        this.props.invoices.forEach(invoice => {
            const obj = { resolved: true }
            API.editInvoice(invoice.id, obj)
            API.getWalker(invoice.walkerId)
                .then(walker => {
                    const total = walker.account + invoice.ammount
                    const newTotal = { account: total }
                    API.editWalkerProfile(walker.uid, newTotal)
                })
        })
        this.props.changeStep(2)
    }
    render() {
        return (
            <>
                <Row type="flex" justify="center">
                    <Col>
                        <h2>Summary</h2>
                        <h4>Total: ${this.props.total}</h4>
                        <h4>Fees: $2</h4>
                        <div className="Line"></div>
                        <h3>TOTAL: {this.props.total + 2}</h3>
                    </Col>
                </Row>
                <Row type="flex" justify="center">
                    <Col>
                        <Button.Group>
                            <Button type="primary" onClick={() => { this.props.changeStep(0) }}>Go Back</Button>
                            <Button type="primary" onClick={this.resolve}>Pay Now</Button>
                        </Button.Group>
                    </Col>
                </Row>
            </>


        )
    }
}
