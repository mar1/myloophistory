<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title><img src="/assets/logo.png" id="logo" class="breath"></ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
          <ion-card>
    <ion-card-header>
      <ion-card-title id="legend">Click on the <b style="font-size: 150%; color: #15B7B9;">∞</b> symbol to start recording your Loop</ion-card-title>
    </ion-card-header>
    <ion-card-content>
      <VideoRecord/>
          <p class="disclaimer"><b>All data uploaded to MyLoopStory is available to anyone who requests it using the correct CID.</b><br><u>Users should not store any sensitive information.</u></p>
    </ion-card-content>
    </ion-card>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
/* eslint-disable */
import { defineComponent } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonModal } from '@ionic/vue';
import VideoRecord from '@/components/VideoRecord.vue';

export default defineComponent({
  name: 'Tab3Page',
  components: { IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonModal, VideoRecord },
    data() {
    return {
      isConnected: new Boolean,
      isModalOpen: false,
      walletAddress: "",
      signer: {},
      isOwner: new Boolean,
    }
  },
 mounted: async function() {
    let lMyLoop = document.getElementById('tab-button-myloop')
    lMyLoop!.style.display = "block"
      //document.getElementById('tab-button-myloop')!.style.display = "block"
      document.getElementById('tab-button-add')!.style.display = "block"
    
  },
});
</script>

<style>
@import '../../public/assets/style.css';
</style>
