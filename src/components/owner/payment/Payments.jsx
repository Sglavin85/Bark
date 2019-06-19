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
        totalCost: '',
        invoiceReturn: false
    }

    componentDidMount() {
        API.getInvoicesByOwnerId(this.props.user.uid)
            .then(invoices => {
                const invoiceArray = Object.values(invoices)
                const parsedInvoices = invoiceArray.filter(invoice => !invoice.resolved)
                var totalCost = 0
                parsedInvoices.forEach(invoice => {
                    totalCost = totalCost + invoice.ammount
                });
                this.setState({ invoices: parsedInvoices, total: totalCost })
            })
    }

    changeStep = (stepNum) => {
        this.setState({ step: stepNum })
    }

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
                {this.checkStep(0) ? <Invoices invoices={this.state.invoices} total={this.state.total} changeStep={this.changeStep} /> : null}
                {this.checkStep(1) ? <ConfirmPayment invoices={this.state.invoices} total={this.state.total} changeStep={this.changeStep} /> : null}
                {this.checkStep(2) ? <Confirmation /> : null}
            </>
        )
    }
}
