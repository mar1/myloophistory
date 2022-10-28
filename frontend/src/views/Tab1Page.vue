<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title><img src="/assets/logo.png" id="logo" class="breath"></ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">

    
    <ion-card id="mainCard">
    <ion-card-header>
      <ion-card-title><b style="font-size: 130%;">MyLoopStory</b><br>is a dynamic video NFT-based decentralized social network</ion-card-title>
      <ion-card-subtitle>Build your Loop with 3 seconds of video, follow your frens & make new ones.</ion-card-subtitle>
      <ion-card-subtitle><b>Record you life as an NFT and enjoy forever your full ownership over it !</b></ion-card-subtitle>
    </ion-card-header>
    <ion-card-content>
    </ion-card-content>
    </ion-card>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle } from '@ionic/vue';

export default  defineComponent({
  name: 'Tab1Page',
  components: { IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle },
});
</script>

<style>
@import '../../public/assets/style.css';
</style>
