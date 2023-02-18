
![Logo](https://taikai.azureedge.net/XTEDlFhV05ID4o5jEEVgfs4lE7y-KAuxMwhprGCR7h0/rs:fit:800:0:0/aHR0cHM6Ly9zdG9yYWdlLmdvb2dsZWFwaXMuY29tL3RhaWthaS1zdG9yYWdlL2ltYWdlcy80YjkwOGJiMC01N2Q4LTExZWQtOGM3MC03NzdkYzA1YmQ1Zjl0d2l0dGVyX2hlYWRlcl9waG90b18yLnBuZw)


# MyLoopStory

MyLoopStory is a decentralized social network based on dynamic video NFTs.

Each user can mint their own LoopStory and add 3 seconds of video to it regularly. Everything is stored on-chain and on IPFS/Filecoin.

This project was realized in the context of ETHLisbon.


## Features

- Mint a NFT (ERC721 compatible on Mumbai testnet)
- Login through WalletConnect V2
- Record videos directly from the mobile browser
- Add video loop to your NFT
- Backend creating the full video based on IPFS hashes stored on chain
- Consult your video loop
- Cross platform (work on desktop/tablet/mobile)


## Tech Stack

**Client:** Vue.js, Ionic, Video.JS, Web3Modal v2

**Server:** Node, Express, FFMPEG

**Blockchain tool:** Ethers

**Storage:** IPFS, FileCoin, NFT.storage


## Demo

Test front-end deployed version at https://mls-eight.vercel.app/

Test back-end deployed version at https://myloopstory.herokuapp.com:3000/


## Components

This project is composed of 3 distinct parts: 

- A Progressive Web App to mint, capture and add videos to your NFT
- A back-end fetching the data on-chain and generating a full video based on several IPFS hashes
- A smart-contract based on the ERC721 standard


## Lessons Learned

This project has taught me a lot in the last 3 days. It's the 1st time I participate alone to a hackaton but it's also the 1st time I realize a PWA connected to the blockchain.

The IPFS documentation and the NFT.storage documentation were invaluable to me regarding on-chain storage.

Concerning the video generation, I learned to use the ffmpeg tool, extremely powerful if you understand its syntax.

As WalletConnect web3modal v2 is not yet available for Vue.JS, I had to adapt the vanilla JS libraries, which was not easy.

Well, I think the project was a bit too big for a first solo hackaton. I didn't have time to code the social features. So, it's not quite a social video network but a dynamic NFTs project, based on videos.



## Roadmap

- Improve Backend Performance

- Adding social functionalities (social feed + follow/unfollow)

- Adding Lens support

- Make it chain-agnostic



## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`VUE_APP_NFT_STORAGE_KEY`

`VUE_APP_WALLETCONNECT_KEY`

`VUE_APP_CONTRACT_ADDRESS`

`VUE_APP_CHAIN_ID`


## 🚀 About Me
My name is Marin, i'm a web3 full-stack developer, working with my DAOs frens on the first P2E game on Moonbeam Network, called "THE GREAT ESCAPE".
