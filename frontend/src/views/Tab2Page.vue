<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title><img src="/assets/logo.png" id="logo" class="breath"></ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
    <div id="notConnectedContainer" v-if="!isConnected" class="ion-justify-content-center">
<ion-button fill="outline" id="cta" v-on:click="connectW()">Connect wallet</ion-button>
<w3m-modal></w3m-modal>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue';
import { ClientCtrl, ConfigCtrl, AccountCtrl, ModalCtrl, BlockCtrl, FeeCtrl } from '@web3modal/core'
import { chains, providers } from '@web3modal/ethereum'
import '@web3modal/ui'



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


export default defineComponent({
  name: 'Tab2Page',
  components: { IonHeader, IonToolbar, IonTitle, IonContent, IonPage },
  data() {
    return {
      isConnected: false,
      walletAddress: "",
    }
  },
  mounted() {
const account = AccountCtrl.get()
 if (account.isConnected == true) {
  console.log(account)
  this.isConnected = true
  this.walletAddress = account.address as string
  console.log(this.walletAddress)
 }

  },
  methods: {
    async connectW() {
      
      await ModalCtrl.open()
    }
  }
});
</script>

<style>
@import '../../public/assets/style.css';
</style>
