import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Menu, Button } from 'antd'
import './navbar.css'
import { withRouter } from 'react-router-dom'

class OwnerLinks extends Component {
    state = {
        current: "/owners/home",
    };

    handleClick = e => {
        this.setState({
            current: e.key,
        });
    };



    render() {

        return (
            <Menu onClick={this.handleClick} selectedKeys={[this.state.current]} mode="horizontal">
                {this.props.isDogBeingWalked ? <Menu.Item key="/owners/walks">
                    <Button type="primary" onClick={() => { this.props.history.push(`/owners/walks/${this.props.dog.id}`) }} ghost>Watch {this.props.dog.name}'s Walk</Button>
                </Menu.Item> : null}
                <Menu.Item key="/owners/home">
                    <Link className="nav-link" to="/owners/home">Home</Link>
                </Menu.Item>
                <Menu.Item key="/owners/dogs">
                    <Link className="nav-link" to="/owners/dogs">My Dogs</Link>
                </Menu.Item>
                <Menu.Item key="/owners/profile">
                    <Link className="nav-link" to="/owners/profile">My Profile</Link>
                </Menu.Item>
                <Menu.Item key="/owners/routes">
                    <Link className="nav-link" to="/owners/routes">My Fence</Link>
                </Menu.Item>
                <Menu.Item key="/owners/walkers">
                    <Link className="nav-link" to="/owners/walkers/all">Walkers</Link>
                </Menu.Item>
                <Menu.Item key="/owners/account">
                    <Link className="nav-link" to="/owners/account">Account</Link>
                </Menu.Item>
                <Menu.Item key="/auth/login">
                    <Link className="nav-link" to="/auth/login" onClick={this.props.logout}>Logout</Link>
                </Menu.Item>
            </Menu>
        )
    }
}

export default withRouter(OwnerLinks)
