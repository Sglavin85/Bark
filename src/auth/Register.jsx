import React, { Component } from 'react'
import { Form, Input, Button, Radio, Row, Col, DatePicker, Select } from 'antd';
import './auth.css'
import { Link } from 'react-router-dom'
import { registerUser } from './userManager'
import moment from 'moment'
import mapCalls from '../maps/APIcalls'
import * as firebase from 'firebase/app';
import 'firebase/storage';

const { Option } = Select;


export default class Register extends Component {
    state = {
        accountType: "owners",
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        birthday: "",
        address: "",
        city: "",
        state: "",
        zip: "",
        image: ""
    }

    handleAccountType = (e) => {
        this.setState({ accountType: e.target.value })
    }

    handleFieldChange = (e) => {
        const stateToChange = {};
        stateToChange[e.target.id] = e.target.value;
        this.setState(stateToChange);
    }

    handleDateChange = (evt) => {
        const date = evt.format("MM DD YYYY")
        this.setState({ birthday: date })
    }

    handleStateChoice = (evt) => {
        this.setState({ state: evt })
    }



    submit = async (evt) => {
        evt.preventDefault()
        const accountType = this.state.accountType
        if (!!this.state.image) {
            const storageRef = firebase.storage().ref('profiles');
            const ref = storageRef.child(`${Date.now()}`);
            await ref.put(this.state.image)
                .then(data => data.ref.getDownloadURL())
                .then((url) => {
                    this.setState({ image: url }, () => {
                        mapCalls.getUserAddress(this.state)
                            .then(location => {
                                const currentAddress = location.results[0].locations[0].latLng
                                this.setState({ lat: currentAddress.lat, long: currentAddress.lng }, () => {
                                    registerUser(this.state, accountType)
                                        .then(newUser => {
                                            this.props.login(newUser, accountType)
                                            this.props.history.push(`/${accountType}/home`)
                                        })
                                })
                            })
                    })
                })
        }
    }

    // type="password"
    render() {
        return (
            <Row type="flex" justify="center" >
                <Col span={8}>        <h1 className="login">Register</h1>
                    <Row type="flex" justify="center" className="selectButtons">
                        <Col>
                            <Radio.Group onChange={this.handleAccountType} defaultValue="owners">
                                <Radio.Button value="owners">OWNER</Radio.Button>
                                <Radio.Button value="walkers">WALKER</Radio.Button>
                            </Radio.Group>
                        </Col>
                    </Row>
                    <Row type="flex" justify="center">
                        <Col span={24} offset={3}>
                            <Form className="register-form" layout="vertical" labelCol={{ span: 4 }} wrapperCol={{ span: 16 }} >

                                <Form.Item label="Upload a picture of you: ">
                                    <Input id="picture" type="file" onChange={(e) => this.setState({ image: e.target.files[0] })} />
                                </Form.Item>
                                <Form.Item label="E-Mail: ">
                                    <Input id="email" onChange={this.handleFieldChange} />
                                </Form.Item>
                                <Form.Item label="Password: ">
                                    <Input id="password" onChange={this.handleFieldChange} />
                                </Form.Item>
                                <Form.Item label="First Name: ">
                                    <Input id="firstName" onChange={this.handleFieldChange} />
                                </Form.Item>
                                <Form.Item label="Last Name: ">
                                    <Input id="lastName" onChange={this.handleFieldChange} />
                                </Form.Item>

                                <Form.Item label="Address: ">
                                    <Input id="address" onChange={this.handleFieldChange} />
                                </Form.Item>
                                <Form.Item label="City: ">
                                    <Input id="city" onChange={this.handleFieldChange} />
                                </Form.Item>
                                <Form.Item label="State: ">
                                    <Select id="state" onChange={this.handleStateChoice}>
                                        <Option value="AL">Alabama</Option>
                                        <Option value="AK">Alaska</Option>
                                        <Option value="AZ">Arizona</Option>
                                        <Option value="AR">Arkansas</Option>
                                        <Option value="CA">California</Option>
                                        <Option value="CO">Colorado</Option>
                                        <Option value="CT">Connecticut</Option>
                                        <Option value="DE">Delaware</Option>
                                        <Option value="DC">District Of Columbia</Option>
                                        <Option value="FL">Florida</Option>
                                        <Option value="GA">Georgia</Option>
                                        <Option value="HI">Hawaii</Option>
                                        <Option value="ID">Idaho</Option>
                                        <Option value="IL">Illinois</Option>
                                        <Option value="IN">Indiana</Option>
                                        <Option value="IA">Iowa</Option>
                                        <Option value="KS">Kansas</Option>
                                        <Option value="KY">Kentucky</Option>
                                        <Option value="LA">Louisiana</Option>
                                        <Option value="ME">Maine</Option>
                                        <Option value="MD">Maryland</Option>
                                        <Option value="MA">Massachusetts</Option>
                                        <Option value="MI">Michigan</Option>
                                        <Option value="MN">Minnesota</Option>
                                        <Option value="MS">Mississippi</Option>
                                        <Option value="MO">Missouri</Option>
                                        <Option value="MT">Montana</Option>
                                        <Option value="NE">Nebraska</Option>
                                        <Option value="NV">Nevada</Option>
                                        <Option value="NH">New Hampshire</Option>
                                        <Option value="NJ">New Jersey</Option>
                                        <Option value="NM">New Mexico</Option>
                                        <Option value="NY">New York</Option>
                                        <Option value="NC">North Carolina</Option>
                                        <Option value="ND">North Dakota</Option>
                                        <Option value="OH">Ohio</Option>
                                        <Option value="OK">Oklahoma</Option>
                                        <Option value="OR">Oregon</Option>
                                        <Option value="PA">Pennsylvania</Option>
                                        <Option value="RI">Rhode Island</Option>
                                        <Option value="SC">South Carolina</Option>
                                        <Option value="SD">South Dakota</Option>
                                        <Option value="TN">Tennessee</Option>
                                        <Option value="TX">Texas</Option>
                                        <Option value="UT">Utah</Option>
                                        <Option value="VT">Vermont</Option>
                                        <Option value="VA">Virginia</Option>
                                        <Option value="WA">Washington</Option>
                                        <Option value="WV">West Virginia</Option>
                                        <Option value="WI">Wisconsin</Option>
                                        <Option value="WY">Wyoming</Option>
                                    </Select>
                                </Form.Item>
                                <Form.Item label="Zip: ">
                                    <Input id="zip" onChange={this.handleFieldChange} />
                                </Form.Item>
                                <Form.Item label="Birthday: ">
                                    <DatePicker defaultValue={moment().subtract(18, "years")} className="birthday" onChange={this.handleDateChange} />
                                </Form.Item>
                                <Row type="flex" justify="center" className="selectButtons">
                                    <Col span={24} offset={6}>
                                        <Form.Item>

                                            <Row type="flex" justify="center" className="selectButtons">
                                                <Col>
                                                    <Button type="primary" onClick={this.submit} className="register-form-button">
                                                        Register</Button>
                                                </Col>
                                            </Row>
                                            <Row type="flex" justify="center" align="middle" className="selectButtons">
                                                <Col offset={3}>
                                                    <span className="register">Go back to </span>


                                                    <Link className="reg-link" to="/auth/login">Log-In</Link>
                                                </Col>
                                            </Row>
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Form>
                        </Col>
                    </Row>
                </Col>
            </Row>

        );
    }
}