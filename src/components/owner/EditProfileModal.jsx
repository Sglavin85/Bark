import React, { Component } from 'react'
import { Form, Input, Button, Row, Col, Select, Modal } from 'antd';
import '../../auth/auth.css'
import API from '../../modules/API'
import * as firebase from 'firebase/app';
import 'firebase/storage';
import mapCalls from '../../maps/APIcalls'


const { Option } = Select;


export default class Register extends Component {
    state = {
        email: "",
        firstName: "",
        lastName: "",
        address: "",
        city: "",
        state: "",
        zip: ""
    }

    //allows a user to edit their own information that they provided when they registered. the entire user object is passed in and is used to set state which is then used to pass the entire object up to the database upon submit.

    componentDidMount = () => {
        this.setState({
            firstName: this.props.user.firstName,
            lastName: this.props.user.lastName,
            address: this.props.user.address,
            city: this.props.user.city,
            state: this.props.user.state,
            zip: this.props.user.zip,
        })
    }


    handleFieldChange = (e) => {
        const stateToChange = {};
        stateToChange[e.target.id] = e.target.value;
        this.setState(stateToChange);
    }

    handleStateChoice = (evt) => {
        this.setState({ state: evt })
    }

    //on submit it looks to see if the image has changed, if it has then it sends the new image to firebase storage and waits for the url to combage  which it then appends the record to reflect the images new URL. If the address is changed the an geocode request is made to mapquest to retriev the latittude and longitude of the new address provides by the user and those values are added to the obj. Finally the new record is pushed to the database and then updated so that the changes are seen by the user after they hit the submit button and the modal closes.

    handleEditSubmit = async (user) => {
        if (!!this.state.image) {
            const storageRef = firebase.storage().ref('profiles');
            const ref = storageRef.child(`${Date.now()}`);

            await ref.put(user.image)
                .then(data => data.ref.getDownloadURL())
                .then(async (url) => {
                    user.image = url
                })
        }
        if (this.props.user.address !== this.state.address) {
            mapCalls.getUserAddress(this.state)
                .then(async (location) => {
                    const currentAddress = location.results[0].locations[0].latLng
                    user.lat = currentAddress.lat
                    user.long = currentAddress.lng
                    await API.editUserProfile(this.props.user.uid, user)
                    await this.props.update()
                })
        } else {

            await API.editUserProfile(this.props.user.uid, user)
            await this.props.update()
        }


    }

    render() {
        return (
            <Modal
                visible={this.props.vis}
                width={600}
                mask={true}
                maskClosable={true}
                centered={true}
                onCancel={() => this.props.cancel("editModalVis")}
                footer={[
                    <Row key={1} type="flex" justify="center">
                        <Col>
                            <Button type="primary" onClick={() => this.handleEditSubmit(this.state)}>
                                Submit</Button>
                            <Button type="secondary" onClick={() => this.props.cancel("editModalVis")}>
                                Cancel</Button>
                        </Col>
                    </Row>

                ]}>
                <Row type="flex" justify="center">
                    <Col span={14}>        <h1 className="login">Edit Profile</h1>
                        <Row type="flex" justify="center">
                            <Col span={24} offset={3}>
                                <Form className="register-form" layout="vertical" labelCol={{ span: 12 }} wrapperCol={{ span: 24 }} >
                                    <Form.Item label="Upload a picture: ">
                                        <Input id="picture" type="file" onChange={(e) => this.setState({ image: e.target.files[0] })} />
                                    </Form.Item>
                                    <Form.Item label="First Name: ">
                                        <Input value={this.state.firstName} id="firstName" onChange={this.handleFieldChange} />
                                    </Form.Item>
                                    <Form.Item label="Last Name: ">
                                        <Input value={this.state.lastName} id="lastName" onChange={this.handleFieldChange} />
                                    </Form.Item>
                                    <Form.Item label="Address: ">
                                        <Input value={this.state.address} id="address" onChange={this.handleFieldChange} />
                                    </Form.Item>
                                    <Form.Item label="City: ">
                                        <Input value={this.state.city} id="city" onChange={this.handleFieldChange} />
                                    </Form.Item>
                                    <Form.Item label="State: ">
                                        <Select defaultValue={this.state.state} id="state" onChange={this.handleStateChoice}>
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
                                        <Input value={this.state.zip} id="zip" onChange={this.handleFieldChange} />
                                    </Form.Item>
                                </Form>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Modal>
        );
    }
}