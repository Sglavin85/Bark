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
            <Menu onClick={this.handleClick}
                selectedKeys={[this.state.current]}
                mode="horizontal">
                <Menu.Item key="/walkers/home">
                    <Link className="nav-link" to="/walkers/home">Home</Link>
                </Menu.Item>
                <Menu.Item key="/walkers/profile">
                    <Link className="nav-link" to="/walkers/profile">My Profile</Link>
                </Menu.Item>
                {/* <Menu.Item key="/walkers/calendar">
                    <Link className="nav-link" to="/walkers/calendar">My Calendar</Link>
                </Menu.Item> */}
                <Menu.Item key="/walkers/dogs/*">
                    <Link className="nav-link" to="/walkers/dogs/all">Dogs</Link>
                </Menu.Item>
                <Menu.Item key="/walkers/account">
                    <Link className="nav-link" to="/walkers/account">Account</Link>
                </Menu.Item>
                <Menu.Item key="/auth/logOut">
                    <Link className="nav-link" to="/auth/login" onClick={this.props.logout}>Logout</Link>
                </Menu.Item>
            </Menu>
        )
    }
}

export default withRouter(OwnerLinks)