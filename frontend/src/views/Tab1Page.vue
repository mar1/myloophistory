<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title><img src="/assets/logo.png" id="logo" class="breath"></ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>

    
    <ion-card id="mainCard">
    <ion-card-header>
      <ion-card-title><b style="font-size: 130%;">MyLoopStory</b><br>is a dynamic video NFT-based decentralized social network</ion-card-title>
      <ion-card-subtitle>Build your Loop with 3 seconds of video days after days, follow your frens & make new ones.</ion-card-subtitle>
      <ion-card-subtitle><b>Record you life as an NFT and enjoy forever your full ownership over it !</b></ion-card-subtitle>
    </ion-card-header>
    <ion-card-content>
     <!-- <ion-button fill="outline" id="cta" href="/tabs/mint">Create my LoopStory</ion-button> -->
    <div id="notConnectedContainer" v-if="!isConnected" class="ion-justify-content-center">
    <ion-button fill="outline" id="cta" v-on:click="connectW()">Connect wallet</ion-button>
    <w3m-modal></w3m-modal>
      </div> 
      <div id="connectedContainer" v-if="isConnected">
            <ion-button fill="outline" id="cta" v-if="isConnected && !isOwner" v-on:click="mintLoop()">Mint my LoopStory</ion-button>
            <!--<ion-button fill="outline" id="cta" v-if="isConnected && isOwner" href="/tabs/add">Add a loop to my story</ion-button>-->
        </div>
    </ion-card-content>
    </ion-card>
        <ion-grid>
    <ion-row id="explain">
      <ion-col><span class="nb">1</span><br>Mint your unique LoopStory</ion-col>
      <ion-col><span class="nb">2</span><br>Add a short video each day to your Loop</ion-col>
      <ion-col><span class="nb">3</span><br>Share your beautiful life with your frens</ion-col>
    </ion-row>
  </ion-grid>
    <div>
    <VideoPlayer />
    </div>
    </ion-content>

  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle } from '@ionic/vue';
import { ClientCtrl, ConfigCtrl, AccountCtrl, ModalCtrl, SignerCtrl, ContractCtrl, TransactionCtrl, ProviderCtrl, BlockCtrl, FeeCtrl } from '@web3modal/core'
import { chains, providers } from '@web3modal/ethereum'
import '@web3modal/ui'
import VideoPlayer from '@/components/VideoPlayer.vue';
import { ethers } from "ethers";
import contractABI from '../../public/assets/ABI.json'

ConfigCtrl.setConfig({
  projectId: process.env.VUE_APP_WALLETCONNECT_KEY as string,
})

// Configure ethereum client
ClientCtrl.setEthereumClient({
  appName: 'MyLoopStory',
  autoConnect: true,
  chains: [chains.polygonMumbai],
  providers: [providers.walletConnectProvider({ projectId: process.env.VUE_APP_WALLETCONNECT_KEY as string })]
})


export default  defineComponent({
  name: 'Tab1Page',
  components: { IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, VideoPlayer },
  data() {
    return {
      isConnected: new Boolean,
      isModalOpen: false,
      walletAddress: "",
      signer: {},
      isOwner: new Boolean,
    }
  },
    mounted: async function()  {
    const account = AccountCtrl.get()

      AccountCtrl.watch(account => {
          if (account.isConnected == true) {
            
            this.isConnected = true
            this.walletAddress = account.address as string
            this.checkOwned()
          }
          else {
            console.log('not connected')
            this.isConnected = false
          }
      })

    let signerOptions = {
      chainId: 80001
    }

    SignerCtrl.watch(signer => {
      if (signer) {
        this.signer = signer
      }
    }, signerOptions)

  },
  methods: {

    async checkOwned() {
        const readConfig = await {
        functionName: "balanceOf",
        chainId: 80001,
        args: [this.walletAddress],
        address: "0xF7CC2849D4470D090abE5c81Cdb17d74956f7561",
        abi: contractABI,
      }
      let owned:any = await ContractCtrl.read(readConfig)
      let ownedN:number = owned.toNumber() as any
      try {
        if (ownedN as any > 0) {
                    document.getElementById('tab-button-myloop')!.style.display = "block"
                    document.getElementById('tab-button-add')!.style.display = "block"
              }
        } catch (error) {
          let errorMessage = "Failed to do something exceptional";
          if (error instanceof Error) {
            errorMessage = error.message;
          }
          console.log(errorMessage);
        }
    },

    async connectW() {
     ModalCtrl.subscribe(state => {
        if (state.open == true) {
          document.getElementById('header')!.style.display = "none"
          this.isModalOpen = true
        }
        else if (state.open == false) {
          document.getElementById('header')!.style.display = "block"
          this.isModalOpen = false
        }
      })
      await ModalCtrl.open()
    },

    async mintLoop() {
    const signer = await SignerCtrl.fetch({chainId: 80001})

      const callOverrides = {
        gasLimit: 500000,
        value: ethers.utils.parseUnits('10000000000000000', 'wei')
      }
      const mintConfig = await {
        functionName: "mint",
        chainId: 80001,
        args: [this.walletAddress],
        signer: signer,
        overrides: callOverrides,
        address: "0xF7CC2849D4470D090abE5c81Cdb17d74956f7561",
        abi: contractABI
      }

      const write = await ContractCtrl.write(mintConfig)
      await console.log(write)

      const waitConfig = await {
        confirmations: 2,
        hash: await write.hash,
        chainId: 80001,
      }
      const transaction = await TransactionCtrl.wait(waitConfig)
      if (transaction.status == 1) {
        alert('Mint Successfull!')
        window.location.reload()
      }
      else {
        alert('There was a problem during the mint')
      }
    },
  }
});
</script>

<style>
@import '../../public/assets/style.css';
</style>
