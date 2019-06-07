import React, { Component } from 'react'
import logo from '../../images/logo_transparent.png'
import OwnerLinks from './OwnerLinks'
import WalkerLinks from './WalkerLinks'
import './navbar.css'

export default class NavBar extends Component {

    state = {
        logo: "logoLogout"
    }

    // componentDidMount() {
    //     if (this.props.userLoggedIn === true) {
    //         this.setState({ logo: null })
    //     }
    // }
    // componentWillUpdate() {
    //     if (this.props.userLoggedIn === true) {
    //         this.setState({ logo: null })
    //     }
    // }

    render() {
        return (
            <>

                <nav>
                    <div id="topNav">
                        <div id="logoContainer" className={this.state.logo}>
                            <img src={logo} alt="logo" className="nav-logo" />
                        </div>
                        {this.props.userLoggedIn ? (<div id="linksContainer">
                            {this.props.userIsOwner ? <OwnerLinks /> : <WalkerLinks />}
                        </div>) : null}
                    </div>
                </nav>
            </>
        )
    }
}
