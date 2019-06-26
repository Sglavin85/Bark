import React, { Component } from 'react'
import { Row, Col, Button } from 'antd'
import API from '../../../modules/API'
import '../owner.css'



export default class ConfirmPayment extends Component {

    //function that edits the invoices and changes a boolean value from false to true to indicate that these reciepts have been resolved. The reciepts are maintained in the database for future reference. Then it moves the appropriate ammount of "money" from the invoice into the appropriate walkers account. and moves the user to the next step

    resolve = () => {
        this.props.invoices.forEach(invoice => {
            const obj = { resolved: true }
            API.editInvoice(invoice.id, obj)
            API.getWalker(invoice.walkerId)
                .then(walker => {
                    var currentAccount = 0.00
                    if (!!walker.account) {
                        currentAccount = walker.account
                    }
                    const total = currentAccount + parseFloat(invoice.ammount)
                    const newTotal = { account: total }
                    API.editWalkerProfile(walker.uid, newTotal)
                })
        })
        this.props.changeStep(2)
    }

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
                <Row type="flex" justify="center">
                    <Col>
                        <h2>Summary</h2>
                        <h4>Total: ${this.props.total}</h4>
                        <h4>Fees: ${this.calcFees()}</h4>
                        <div className="Line"></div>
                        <h3>TOTAL: {this.calcTotal()}</h3>
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
