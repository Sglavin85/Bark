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

    //on mount this gets all invoices that match the walkers user Id and fiters out the resolved invoices. then does the math to compute the total that is owed to them

    componentDidMount() {
        API.getInvoicesByWalkerId(this.props.user.uid)
            .then(invoices => {
                const invoiceArray = Object.values(invoices)
                const parsedInvoices = invoiceArray.filter(invoice => !invoice.resolved)
                var totalCost = 0.00
                parsedInvoices.forEach(invoice => {
                    var ammount = parseFloat(invoice.ammount)
                    totalCost = (totalCost + ammount)
                });
                this.setState({ invoices: parsedInvoices, total: totalCost.toFixed(2), user: this.props.user })
            })
    }

    //function to notionally remove money from the application to the users personal account however all this does is change the value of thier account to 0 and update the component to reflect the 0 value

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

    calcTotal() {
        var currentTotal = parseFloat(this.state.user.account)
        var pendingTotal = parseFloat(this.state.total)
        var total = (currentTotal + pendingTotal)

        return parseFloat(total).toFixed(2)
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
                                            return <InvoiceCard key={invoice.id} ownerWalker="walkers" invoice={invoice} />
                                        })}
                                    </Col>
                                </Row>
                            </Col>

                            <Col>

                                <h1>Summary</h1>
                                <Row type="flex" justify="start">
                                    <Col span={24}>
                                        <h3>CURRENT TOTAL: ${parseFloat(this.state.user.account).toFixed(2)}</h3>
                                        <h3>PENDING PAYMENTS: ${this.state.total}</h3>
                                    </Col></Row>
                                <div className="firstHR"></div>
                                <Row type="flex" justify="start">
                                    <Col >
                                        <h2>TOTAL: ${this.calcTotal()}</h2>

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
