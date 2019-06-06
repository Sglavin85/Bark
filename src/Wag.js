import React, { Component } from 'react'
import { withRouter } from 'react-router'
import OwnerViews from './views/OwnerViews'
import WalkerViews from './views/WalkerViews'
import NavBar from './components/nav/NavBar'
import Foot from './components/footer/Footer'
import { Layout } from 'antd'
// import API from './modules/dbCalls'

const { Header, Content, Footer } = Layout

class Wag extends Component {


  state = {
    userLoggedIn: true,
    userIsOwner: true
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
      <Layout className="layout">
        <Header>
          <NavBar userLoggedIn={this.state.userLoggedIn} userIsOwner={this.state.userIsOwner} />
        </Header>
        <Content>
          {this.state.userIsOwner ? (<OwnerViews userLoggedIn={this.state.userLoggedIn} />) : (<WalkerViews userLoggedIn={this.state.userLoggedIn} />)}
        </Content>
        <Footer>
          <Foot />
        </Footer>
      </Layout>
    )
  }
}

export default withRouter(Wag)