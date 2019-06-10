import React, { Component } from 'react'
import { Form, Icon, Input, Button, Radio, Row, Col } from 'antd'
import './auth.css'
import { Link } from 'react-router-dom'
import { login } from '../auth/userManager'

export default class Login extends Component {
    state = {
        accountType: "owners",
        email: "",
        password: "",
    }

    handleAccountType = (e) => {
        this.setState({ accountType: e.target.value })
    }

    handleFieldChange = (e) => {
        const stateToChange = {};
        stateToChange[e.target.id] = e.target.value;
        this.setState(stateToChange);
    }


    submit = (evt) => {
        evt.preventDefault()
        const accountType = this.state.accountType
        login(this.state.email, this.state.password, accountType)
            .then((user) => {
                if (!!user) {
                    this.props.login(user, accountType);
                }
            });
    }

    render() {
        return (
            <Row type="flex" justify="center" align="middle">
                <Col>        <h1 className="login">LOG-IN</h1>
                    <Row type="flex" justify="center" className="selectButtons">
                        <Col>
                            <Radio.Group onChange={this.handleAccountType} defaultValue="owners">
                                <Radio.Button value="owners">OWNER</Radio.Button>
                                <Radio.Button value="walkers">WALKER</Radio.Button>
                            </Radio.Group>
                        </Col>
                    </Row>
                    <Form onSubmit={this.submit} className="login-form" layout="vertical">

                        <Form.Item wrapperCol={{ col: 4 }} className="usernameBox" >
                            <Input
                                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                placeholder="E-Mail"
                                id="email"
                                onChange={this.handleFieldChange}
                            />
                        </Form.Item>
                        <Form.Item>
                            <Input
                                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}

                                id="password"
                                placeholder="Password"
                                onChange={this.handleFieldChange}
                            />
                        </Form.Item>
                        <Form.Item>
                            <Row type="flex" justify="center" className="selectButtons">
                                <Col>
                                    <Button onClick={this.submit} type="primary" className="login-form-button">
                                        Log in</Button>
                                </Col>
                            </Row>
                            <Row type="flex" justify="center" align="middle" className="selectButtons">
                                <Col offset={6}>
                                    <span className="register">Not a member? </span>


                                    <Link className="reg-link" to="/auth/register">Register Now</Link>
                                </Col>
                            </Row>
                        </Form.Item>
                    </Form>
                </Col >
            </Row >
        );
    }
}


