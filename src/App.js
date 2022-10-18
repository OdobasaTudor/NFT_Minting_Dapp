import { ethers } from 'ethers';
import { useEffect } from 'react'; 
import { useState } from 'react';
import './App.css';
import contract from './contracts/ContractABI.json';
import gif from './example.gif';

 
function App() {
  const [currentAccount, setCurrentAccount] = useState(null);
  const contractAddress = "0xD7dc24dbAA6B1ae2B7a62984a4DdBCda8238237c";
    const abi = contract;
    const [currentAmmount, setCurrentAmmount] = useState(0);

   const checkWalletIsConnected = async () => { 
     const { ethereum } = window; 

     if (!ethereum) {
      console.log("Make sure you have Metamask installed");
      return;
     } else{
      console.log("Wallet exists.")
     }
     const accounts = await ethereum.request({method: 'eth_accounts'}); 

     if(accounts.length !== 0) {
      const account = accounts[0];
      console.log("Fount an authorized account:", account);
      setCurrentAccount(account);
     } else{
      console.log("No account found");
     }
  }

  const connectWalletHandler = async () => {
      const { ethereum } = window;

      if (!ethereum){
        alert("Please Install Metamask");
      }
       
      try {
        const accounts = await ethereum.request({method: 'eth_requestAccounts'}); // tot din documentatie da nu mi aduc aminte ce face
        console.log("Found account. Address:",accounts[0]);
        setCurrentAccount(accounts[0]);
      }catch(err){
        console.log(err)
      }
   }
   
  const mintNftHandler = async () => 
  {
     try {
      const {ethereum} = window;
      
      if (ethereum){
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();       
        const nftContract = new ethers.Contract(contractAddress, abi, signer);  

        console.log("initialize payment");
        console.log(currentAccount);
        let nftTxn = await nftContract.mint(currentAccount, currentAmmount, {value: ethers.utils.parseEther((currentAmmount*0.01).toString())});

        console.log("Minting.. wait");
        await nftTxn.wait();

              
      } else  {
        console.log("Ethereum object not exists");
      }
     } catch(err){console.log(err);}
  }

  function connectWalletButton() {
    return (
      <button onClick={connectWalletHandler} className='cta-button connect-wallet-button'>
        Connect Wallet
      </button>
    );
  }

  const mintNftButton = () => {
    return (
     <> 
     <h4>Your address:</h4>
     <h4><button onClick={()=>{
      window.open('https://rinkeby.etherscan.io/address/'+currentAccount)
     }} className='ctb-button access-wallet-button'> {currentAccount} </button></h4>
     <h3 > 1 RKR NFT costs 0.01 ETH</h3>
     <button onClick={mintNftHandler} className='cta-button mint-nft-button'>
        Mint NFT
      </button>
      <div>            
      <button onClick={()=>{setCurrentAmmount(currentAmmount+1)}} >+</button>  
      <div> {currentAmmount}  </div>
      <button onClick={()=>{
        if (currentAmmount>0)
        setCurrentAmmount(currentAmmount-1)}} >-</button>         
      </div>
      </>
    )
  }

  useEffect(() => {
    checkWalletIsConnected();
  }, [])

  
  return (
   <div className='d-flex flex-direction-column' style={{
       backgroundColor:'#b0aeae',
   }}>
    <div className='main-app'>
      <img  src={gif} style={{width:'250px',height:'250px', borderRadius:'50%'}} class="center"></img> 

      <h1>Rockers NFT</h1>
      <div>
      {currentAccount ? mintNftButton() : connectWalletButton()}
      </div>    
    <div> 
   
   
     
    <button onClick={()=>{window.open('https://testnets.opensea.io/collection/rockers-nft')
     }} className='ctc-button market-wallet-button' style={{margin:'0.5rem'}}>
        MarketPlace
      </button> 
    <h4 >
      Please make sure you are connected to the right network Ryinkeby Mainnet and the correct address. 
    </h4>
    <h4>
    Please note: Once you make the purchase, you cannot undo this action.
    </h4>
    </div>
    </div>
    </div>  
  )
}

export default App;