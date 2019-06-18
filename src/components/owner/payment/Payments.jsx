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
        totalCost: ''
    }

    componentDidMount() {
        API.getInvoicesByOwnerId(this.props.user.uid)
            .then(invoices => {
                const parsedInvoices = invoices.filter(invoice => !invoice.resolved)
                var totalCost
                parsedInvoices.forEach(invoice => {
                    totalCost = totalCost + invoice.ammount
                });
                this.setState({ invoices: parsedInvoices, total: totalCost })
            })
    }

    changeStep(step) {
        this.setState({ step: step })
    }

    checkStep(step) {
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
                                <Step title="1. Pending Invoices" description="Please resolve your invoiced below" />
                                <Step title="2. Finalize Transaction" description="Confirm Payment" />
                                <Step title="3. Confirmation Number" description="Save for your Records" />
                            </Steps>
                        </Col>
                    </Row>
                </div>
                {this.checkStep(0) ? <Invoices invoices={this.state.invoices} total={this.state.total} changeStep={this.state.step} /> : null}
                {this.checkStep(1) ? <ConfirmPayment invoices={this.state.invoices} total={this.state.total} changeStep={this.state.step} /> : null}
                {this.checkStep(3) ? <Confirmation /> : null}
            </>
        )
    }
}
