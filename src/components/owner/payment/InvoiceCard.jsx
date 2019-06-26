import React, { Component } from 'react'
import { Row, Col } from 'antd'
import './payment.css'
import { withRouter } from 'react-router-dom'

class InvoiceCard extends Component {


    // allows the user to click on a specific invoice to see the details and the route that was walked.

    handleClick = () => {
        this.props.history.push(`/${this.props.ownerWalker}/paths/${this.props.invoice.id}`)
    }

    render() {

        const cardImg = { backgroundImage: `url(${this.props.invoice.dogImg})` }

        return (
            <>
                <div className="invoiceCardDiv" onClick={this.handleClick}>

                    <Row type="flex" justify="start">
                        <Col>
                            <div className="invoiceBackgroundImg" style={cardImg}></div>
                        </Col>
                        <Row>

                            <Col span={24} offset={3}>
                                <h2>{this.props.invoice.dogName}</h2>
                                <h3>{this.props.invoice.date}</h3>
                                <h3>Walker Name: {this.props.invoice.walkerFirstName} {this.props.invoice.walkerLastName}</h3>
                                <h4>${parseFloat(this.props.invoice.ammount).toFixed(2)}</h4>
                            </Col>
                        </Row>
                    </Row>

                </div>
            </>
        )
    }
}

export default withRouter(InvoiceCard)