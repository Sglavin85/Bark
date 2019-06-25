import React, { Component } from 'react'
import { withRouter } from 'react-router'
import NavBar from './components/nav/NavBar'
import Foot from './components/footer/Footer'
import { Layout } from 'antd'
import { Route } from 'react-router-dom'
import AuthViews from './views/AuthViews';
import WalkerViews from './views/WalkerViews';
import OwnerViews from './views/OwnerViews'
import API from './modules/API';



const { Header, Content, Footer } = Layout

class Wag extends Component {


  state = {
    userIsOwner: sessionStorage.getItem('accountType') === 'owners',
    user: JSON.parse(sessionStorage.getItem('user')),
    logo: 'logoLogout',
    isDogBeingWalked: false,
    dogs: [],
    dogBeingWalked: {}
  }


  login = (user, accountType) => {
    this.setState({ userLoggedIn: true, user: user, logo: 'logoLogin' })
    if (accountType === "owners") {
      this.setState({ userIsOwner: true })
      this.props.history.push(`/owners/home`)
      API.getUserDogs(user).then(userDogs => {
        const dogArray = Object.values(userDogs)
        this.setState({ dogs: dogArray })
      })
    } else {
      this.props.history.push(`/walkers/home`)
    }
  }

  changeNavBar = (dog) => {

    this.setState({ dogBeingWalked: dog }, () => {
      console.log(this.state.dogBeingWalked)
      this.setState({ isDogBeingWalked: true })
    })
  }

  hideNavBar = () => {
    this.setState({ isDogBeingWalked: false })
  }


  logout = () => {
    sessionStorage.removeItem("user")
    this.setState({
      userLoggedIn: false,
      userIsOwner: false,
      user: null,
      logo: 'logoLogout'
    })
    this.props.history.push(`auth/login`)
  }


  render() {
    return (
      <Layout className="layout">
        <div id="topStrip"></div>
        <Header>
          <NavBar logout={this.logout} isDogBeingWalked={this.state.isDogBeingWalked} logo={this.state.logo} dogBeingWalked={this.state.dogBeingWalked} user={this.state.user} userIsOwner={this.state.userIsOwner} />
        </Header>
        <Content>
          <Route path="/auth" render={(props) => {
            return <AuthViews {...props}
              loginState={this.props.loginState}
              login={this.login}
            />
          }}
          />

          <Route path="/owners" render={(props) => {
            return <OwnerViews {...props} changeNavBar={this.changeNavBar} hideNavBar={this.hideNavBar} user={this.state.user} dogs={this.state.dogs} userLoggedIn={this.props.userLoggedIn} />
          }}
          />

          <Route path="/walkers" render={(props) => {
            return <WalkerViews {...props} user={this.state.user} userLoggedIn={this.props.userLoggedIn} />
          }}
          />


        </Content>
        <Footer>
          <Foot />
        </Footer>
      </Layout>
    )
  }
}

export default withRouter(Wag)