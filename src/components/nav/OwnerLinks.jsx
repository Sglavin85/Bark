import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Menu } from 'antd'
import './navbar.css'
import { withRouter } from 'react-router-dom'

class OwnerLinks extends Component {
    state = {
        current: this.props.location.pathname,
    };

    handleClick = e => {
        this.setState({
            current: e.key,
        });
    };



    render() {

        return (
            <Menu onClick={this.handleClick} selectedKeys={[this.state.current]} mode="horizontal">
                <Menu.Item key="/owners/home">
                    <Link className="nav-link" to="/owners/home">Home</Link>
                </Menu.Item>
                <Menu.Item key="/owners/dogs">
                    <Link className="nav-link" to="/owners/dogs">My Dogs</Link>
                </Menu.Item>
                <Menu.Item key="/owners/routes">
                    <Link className="nav-link" to="/owners/routes">My Routes</Link>
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
