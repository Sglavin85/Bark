import React, { Component } from 'react'
import { Form, Icon, Input, Button, Radio, Row, Col } from 'antd';
import './auth.css'
import { Link } from 'react-router-dom'


export default class Login extends Component {



    render() {
        return (
            <Row type="flex" justify="center" align="middle">
                <Col>        <h1 className="login">LOG-IN</h1>
                    <Row type="flex" justify="center" className="selectButtons">
                        <Col>
                            <Radio.Group onChange="" defaultValue="owner">
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
                            />
                        </Form.Item>
                        <Form.Item>
                            <Input
                                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                type="password"
                                placeholder="Password"
                            />
                        </Form.Item>
                        <Form.Item>
                            <Row type="flex" justify="center" className="selectButtons">
                                <Col>
                                    <Button type="primary" className="login-form-button">
                                        Log in</Button>
                                </Col>
                            </Row>
                            <Row type="flex" justify="center" align="middle" className="selectButtons">
                                <Col offset={6}>
                                    <span className="register">Not a member? </span>


                                    <Link className="reg-link" to="/register">Register Now</Link>
                                </Col>
                            </Row>
                        </Form.Item>
                    </Form>
                </Col >
            </Row >
        );
    }
}


