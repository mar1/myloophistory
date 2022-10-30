<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title><img src="/assets/logo.png" id="logo" class="breath"></ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
                <ion-card>
    <ion-card-header>
      <ion-card-title style="font-weight: bolder;">YOUR LOOPSTORY</ion-card-title>
    </ion-card-header>
    <ion-card-content>
      <MyLoopPlayer/>
    </ion-card-content>
    </ion-card>

    </ion-content>
  </ion-page>
</template>

<script lang="ts">
/* eslint-disable */
import { defineComponent } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue';
import { ClientCtrl, ConfigCtrl, AccountCtrl, ModalCtrl, BlockCtrl, FeeCtrl } from '@web3modal/core'
import { chains, providers } from '@web3modal/ethereum'
import '@web3modal/ui'
import MyLoopPlayer from '@/components/MyLoopPlayer.vue';



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
  components: { IonHeader, IonToolbar, IonTitle, IonContent, IonPage, MyLoopPlayer },
  data() {
    return {
      isConnected: false,
      walletAddress: "",
    }
  },
  mounted() {
            document.getElementById('tab-button-myloop')!.style.display = "block"
            document.getElementById('tab-button-add')!.style.display = "block"
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
