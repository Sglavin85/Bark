import React, { Component } from 'react'
import { Row, Col, Button } from 'antd'
import InvoiceCard from './InvoiceCard'
import '../owner.css'

export default class Invoices extends Component {

    state = {
        hasInvoices: false
    }

    componentDidMount() {
        if (this.props.invoices.length === 0) {
            this.setState({ hasInvoices: true })
        }
    }
    calcFees = () => {
        var calculatedFees = parseInt(this.props.invoices.length * 2)
        return calculatedFees
    }

    render() {
        return (
            <>
                {this.state.hasInvoices ?
                    <div className="CartContainer">
                        <Row type="flex" justify="center">
                            <Col span={16}>
                                <div className="seperator"></div>
                                <Row type="flex" justify="space-between">
                                    <Col>
                                        <h1>Pending Invoices</h1>
                                        <Row type="flex" justify="start">
                                            <Col>
                                                {this.props.invoices.map(invoice => {
                                                    return <InvoiceCard key={invoice.id} invoice={invoice} />
                                                })}
                                            </Col>
                                        </Row>
                                    </Col>

                                    <Col>
                                        <h1>Summary</h1>
                                        <Row type="flex" justify="start">
                                            <Col span={24}>
                                                <h3>Total: ${this.props.total}</h3>
                                                <h3>Fees: ${this.calcFees()}</h3>
                                            </Col>
                                        </Row>
                                        <div className="firstHR"></div>
                                        <Row type="flex" justify="start">
                                            <Col >
                                                <h2>TOTAL: ${this.props.total + this.calcFees()}</h2>
                                            </Col>
                                        </Row>

                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <Row type="flex" justify="center">
                            <Col>
                                <Button type="primary" onClick={() => { this.props.changeStep(1) }} >Continue</Button>
                            </Col>
                        </Row>

                    </div>
                    : <h1>You Have No Pending Invoices</h1>}
            </>
        )
    }
}
