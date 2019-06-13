import React, { Component } from 'react'
import { withRouter } from 'react-router'
import NavBar from './components/nav/NavBar'
import Foot from './components/footer/Footer'
import { Layout } from 'antd'
import { Route } from 'react-router-dom'
import AuthViews from './views/AuthViews';
import WalkerViews from './views/WalkerViews';
import OwnerViews from './views/OwnerViews'



const { Header, Content, Footer } = Layout

class Wag extends Component {


  state = {
    userIsOwner: sessionStorage.getItem('accountType') === 'owners',
    user: JSON.parse(sessionStorage.getItem('user'))
  }


  login = (user, accountType) => {
    this.setState({ userLoggedIn: true, user: user })
    if (accountType === "owners") {
      this.setState({ userIsOwner: true })
      this.props.history.push(`/owners/home`)
    } else {
      this.props.history.push(`/walkers/home`)
    }
  }

  logout = () => {
    sessionStorage.removeItem("user")
    this.setState({
      userLoggedIn: false,
      userIsOwner: false,
      user: null
    })
    this.props.history.push(`auth/login`)
  }


  render() {
    return (
      <Layout className="layout">
        <div id="topStrip"></div>
        <Header>
          <NavBar logout={this.logout} user={this.state.user} userIsOwner={this.state.userIsOwner} />
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
            return <OwnerViews {...props} user={this.state.user} userLoggedIn={this.props.userLoggedIn} />
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