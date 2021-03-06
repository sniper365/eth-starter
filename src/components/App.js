import React, { Component } from 'react'
import Navbar from './Navbar'
import './App.css'
import Web3 from 'web3'
import DaiToken from '../abis/DaiToken'
import AlexxToken from '../abis/AlexxToken'
import TokenFarm from '../abis/TokenFarm'
import Main from './Main'

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '0x0',
      daiToken: {},
      alexxToken: {},
      tokenFarm: {},
      daiTokenBalance: '0',
      alexxTokenBalance: '0',
      stakingBalance: '0',
      loading: true
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3;

    const accounts = await web3.eth.getAccounts();
    this.setState({account: accounts[0]});

    const networkId = await web3.eth.net.getId();
    this.loadDaiToken(web3, networkId);
    this.loadAlexxToken(web3, networkId);
    this.loadTokenFarm(web3, networkId);

    this.setState({ loading: false })
    
  }

  async loadDaiToken(web3, networkId) {
    const daiTokenData = DaiToken.networks[networkId];
    if(daiTokenData) {
      const daiToken = new web3.eth.Contract(DaiToken.abi, daiTokenData.address);
      this.setState({ daiToken });
      let daiTokenBalance = await daiToken.methods.balanceOf(this.state.account).call();
      this.setState({ daiTokenBalance: daiTokenBalance.toString() });
    }
    else {
      window.alert('DaiToken contract not deployed to detected network');
    }
  }

  async loadAlexxToken(web3, networkId) {
    console.log(web3);
    const alexxTokenData = AlexxToken.networks[networkId];
    if(alexxTokenData) {
      const alexxToken = new web3.eth.Contract(AlexxToken.abi, alexxTokenData.address);
      this.setState({ alexxToken });
      let alexxTokenBalance = await alexxToken.methods.balanceOf(this.state.account).call();
      this.setState({ alexxTokenBalance: alexxTokenBalance.toString() });
    }
    else {
      window.alert('AlexxToken contract not deployed to detected network');
    }
  }

  async loadTokenFarm(web3, networkId) {
    const tokenFarmData = TokenFarm.networks[networkId];
    if(tokenFarmData) {
      const tokenFarm = new web3.eth.Contract(TokenFarm.abi, tokenFarmData.address);
      this.setState({ tokenFarm });
      let stakingBalance = await tokenFarm.methods.stakingBalance(this.state.account).call();
      this.setState({ stakingBalance: stakingBalance.toString() });
    }
    else {
      window.alert('TokenFarm contract not deployed to detected network');
    }
  }

  async loadWeb3() {
    if(window.ethereum){
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    }
    else if(window.web3){
      window.web3 = new Web3(window.web3.currentProvider);
    }
    else{
      window.alert("Non ehtereum browser detected, install metamask");
    }
  }

  stakeTokens = (amount) => {
    this.setState({ loading: true })
    this.state.daiToken.methods.approve(this.state.tokenFarm._address, amount).send({ from: this.state.account }).on('transactionHash', (hash) => {
      this.state.tokenFarm.methods.stakeTokens(amount).send({ from: this.state.account }).on('transactionHash', (hash) => {
        this.setState({ loading: false })
      })
    })
  }

  unstakeTokens = (amount) => {
    this.setState({ loading: true })
    this.state.tokenFarm.methods.unstakeTokens().send({ from: this.state.account }).on('transactionHash', (hash) => {
      this.setState({ loading: false })
    })
  }

  render() {
    let content = this.state.loading ? 
      <h1 id="loader">Loading...</h1> : 
      <Main 
        daiTokenBalance={this.state.daiTokenBalance}
        alexxTokenBalance={this.state.alexxTokenBalance}
        stakingBalance={this.state.stakingBalance}
        stakeTokens={this.stakeTokens}
        unstakeTokens={this.unstakeTokens}
      />;

    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '600px' }}>
              <div className="content mr-auto ml-auto">
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                >
                </a>

                { content }

              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
