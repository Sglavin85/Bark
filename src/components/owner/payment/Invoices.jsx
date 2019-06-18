import React, { Component } from 'react'
import { Row, Col, Button } from 'antd'
import InvoiceCard from './InvoiceCard'

export default class Invoices extends Component {


    render() {
        return (
            <div className="CartContainer">
                <Row type="flex" justify="space-between">
                    <Col>
                        <h1>Pending Invoices</h1>
                        <Row type="flex" justify="start">
                            <Col>
                                {this.props.invoices.map(invoice => {
                                    return <InvoiceCard invoice={invoice} />
                                })}
                            </Col>
                        </Row>
                    </Col>
                    <Col>
                        <h2>Summary</h2>
                        <h4>Total: {this.props.total}</h4>
                        <h4>Fees: $2</h4>
                        <h3>TOTAL: {this.props.total + 2}</h3>
                    </Col>
                </Row>
                <Row type="flex" justify="start">
                    <Col>
                        <Button type="primary" onClick={() => { this.props.changeStep(1) }} >Continue</Button>
                    </Col>
                </Row>
            </div>
        )
    }
}
