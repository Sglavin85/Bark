import React, { Component } from 'react'
import { Row, Col, Button } from 'antd'
import InvoiceCard from './InvoiceCard'
import '../owner.css'

export default class Invoices extends Component {




    // calculates the ammount of fees that the application charges (currently 2 USD per walk)

    calcFees = () => {
        var calculatedFees = parseInt(this.props.invoices.length * 2)
        return calculatedFees
    }

    //adds the invoice ammount and the total fees to display to the user the total charge that they owe.


    calcTotal = () => {
        var calculatedTotal = (parseFloat(this.props.total) + this.calcFees())
        return calculatedTotal.toFixed(2)
    }

    render() {
        return (
            <>
                {this.props.areNoInvoices ? <h1>You Have No Pending Invoices</h1> :
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
                                                    return <InvoiceCard key={invoice.id} ownerWalker="owners" invoice={invoice} />
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
                                                <h2>TOTAL: ${this.calcTotal()}</h2>
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
                }
            </>
        )
    }
}
