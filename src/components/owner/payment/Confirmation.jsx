import React, { Component } from 'react'
import { Row, Col } from 'antd'
import API from '../../../modules/API'
import '../owner.css'


export default class Confirmation extends Component {
    state = {
        confirmationNumber: ''
    }

    //on componentDidMount the function below runs and then posts the results to all the invoices that have been paid for for future reference. Then the confirmation number is displayed to the user for their records.


    componentDidMount() {
        var confirmation = this.confirmationNumber()
        this.setState({ confirmationNumber: confirmation }, () => {
            this.props.invoices.forEach(invoice => {
                const confirmationAppend = { confirmationNumber: this.state.confirmationNumber }
                API.editInvoice(invoice.id, confirmationAppend)

            })
        })
    }

    //Creates a random confirmation 20 character number from the array below using math.floor and math.random

    confirmationNumber = () => {
        const confirmationNumberArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
        var number = ""
        for (var i = 0; i < 20; i++) {
            var char = confirmationNumberArray[Math.floor(Math.random() * confirmationNumberArray.length)]
            number = `${number}${char}`
        }
        return number
    }



    render() {
        return (
            <>
                <Row type="flex" justify="center">
                    <Col>
                        <h1>Confirmation Number</h1><br />
                        <h2>Please keep for your records</h2>
                    </Col>
                </Row>
                <Row type="flex" justify="center">
                    <Col>
                        <h1>{this.state.confirmationNumber}</h1>
                    </Col>
                </Row>
            </>
        )
    }
}
