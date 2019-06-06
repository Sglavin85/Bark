import React, { Component } from 'react'
import { withRouter } from 'react-router'
import OwnerViews from './views/OwnerViews'
import WalkerViews from './views/WalkerViews'
import NavBar from './components/nav/NavBar'
import Footer from './components/footer/Footer'
// import API from './modules/dbCalls'

class Wag extends Component {
  state = {
    userLoggedIn: false,
    userisOwner: false
  }

  // login = (username, password, userType) => {
  //   API.loginUser(username, password).then(user => {
  //     if (user.length === 0) {
  //       alert("username and password do not match");
  //     } else {
  //       sessionStorage.setItem("activeUser", user[0].id);
  //       sessionStorage.setItem("userType", userType)
  //       if (userType === "Owner") {
  //         this.setState({ userisOwner: true })
  //       }
  //     }
  //   });
  // };

  render() {
    return (
      <div>
        <NavBar loggedIn={this.state.userLoggedIn} />
        {this.state.userisOwner ? (<OwnerViews userLoggedIn={this.state.userLoggedIn} />) : (<WalkerViews userLoggedIn={this.state.userLoggedIn} />)}
        <Footer />
      </div>
    )
  }
}

export default withRouter(Wag)