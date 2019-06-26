import React, { Component } from 'react'
import { Steps, Row, Col } from 'antd'
import Invoices from './Invoices'
import ConfirmPayment from './ConfirmPayment'
import Confirmation from './Confirmation'
import './payment.css'
import API from '../../../modules/API'

const { Step } = Steps

export default class Payments extends Component {
    state = {
        step: 0,
        invoices: [],
        total: '',
        invoiceReturn: false,
        areNoInvoices: false
    }

    //this componenet manages the steps for the checkout process for a dog owner. on mount they get all invoices associated with the user ID and then we filter out all the invoices that are resolved. then we iterate over them and calculate out total costs. If their are no invoices we change a boolean to true so that we can conditionally render a message that says their are no invoices that need attention.

    componentDidMount() {
        API.getInvoicesByOwnerId(this.props.user.uid)
            .then(invoices => {
                const invoiceArray = Object.values(invoices)
                const parsedInvoices = invoiceArray.filter(invoice => !invoice.resolved)
                var totalCost = 0.00
                parsedInvoices.forEach(invoice => {
                    totalCost = totalCost + parseFloat(invoice.ammount)

                });
                var parsedTotal = totalCost.toFixed(2)
                this.setState({ invoices: parsedInvoices, total: parsedTotal }, () => {
                    if (this.state.invoices.length === 0) {
                        this.setState({ areNoInvoices: true })
                    }
                })
            })

    }

    //function that changes the steps along the checkout process... is passed to all lower components.

    changeStep = (stepNum) => {
        this.setState({ step: stepNum })
    }

    //allows for the conitionally render multiple things using a ternary operator.

    checkStep = (step) => {
        if (this.state.step === step)
            return true
    }


    render() {
        return (
            <>
                <div className="stepContainer">
                    <Row type="flex" justify="center">
                        <Col span={20}>
                            <Steps current={this.state.step}>
                                <Step title="1. Pending Invoices" description="Click dog to see details" />
                                <Step title="2. Finalize Transaction" description="Confirm Payment" />
                                <Step title="3. Confirmation Number" description="Save for your Records" />
                            </Steps>
                        </Col>
                    </Row>
                </div>
                {this.checkStep(0) ? <Invoices areNoInvoices={this.state.areNoInvoices} invoices={this.state.invoices} total={this.state.total} changeStep={this.changeStep} /> : null}
                {this.checkStep(1) ? <ConfirmPayment invoices={this.state.invoices} total={this.state.total} changeStep={this.changeStep} /> : null}
                {this.checkStep(2) ? <Confirmation invoices={this.state.invoices} /> : null}
            </>
        )
    }
}
