import React, { Component } from 'react'
import { Row, Col, Button } from 'antd'
import InvoiceCard from '../owner/payment/InvoiceCard'
import API from '../../modules/API'
import '../owner/owner.css'

export default class Invoices extends Component {
    constructor(props) {
        super(props)
        this.state = {
            invoices: [],
            total: '',
            user: this.props.user
        }
    }

    componentDidMount() {
        API.getInvoicesByWalkerId(this.props.user.uid)
            .then(invoices => {
                const invoiceArray = Object.values(invoices)
                const parsedInvoices = invoiceArray.filter(invoice => !invoice.resolved)
                var totalCost = 0
                parsedInvoices.forEach(invoice => {
                    totalCost = totalCost + invoice.ammount
                });
                this.setState({ invoices: parsedInvoices, total: totalCost, user: this.props.user })
            })
    }

    handleClick = () => {
        const walkerUpdateObj = { account: 0 }
        API.editWalkerProfile(this.props.user.uid, walkerUpdateObj)
            .then(API.getWalker(this.props.user.uid)
                .then(user => {
                    const parsedUser = JSON.stringify(user)
                    sessionStorage.setItem('user', parsedUser)
                    this.setState({ user: user })
                }))

    }



    render() {
        return (
            <div className="CartContainer">
                <Row type="flex" justify="center">
                    <Col span={16}>
                        <div className="seperator"></div>
                        <Row type="flex" justify="space-between">
                            <Col>
                                <h1>Pending Invoices</h1>
                                <Row type="flex" justify="start">
                                    <Col>
                                        {this.state.invoices.map(invoice => {
                                            return <InvoiceCard key={invoice.id} invoice={invoice} />
                                        })}
                                    </Col>
                                </Row>
                            </Col>

                            <Col>

                                <h1>Summary</h1>
                                <Row type="flex" justify="start">
                                    <Col span={24}>
                                        <h3>CURRENT TOTAL: ${this.state.user.account}</h3>
                                        <h3>PENDING PAYMENTS: ${this.state.total}</h3>
                                    </Col></Row>
                                <div className="firstHR"></div>
                                <Row type="flex" justify="start">
                                    <Col >
                                        <h2>TOTAL: ${this.state.total + this.props.user.account}</h2>

                                    </Col></Row>
                            </Col>
                        </Row>
                    </Col></Row>
                <Row type="flex" justify="center">
                    <Col>
                        <Button type="primary" onClick={this.handleClick} >Get Paid</Button>
                    </Col>
                </Row>
            </div>
        )
    }
}
