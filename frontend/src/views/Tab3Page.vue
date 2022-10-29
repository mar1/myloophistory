<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title><img src="/assets/logo.png" id="logo" class="breath"></ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <VideoRecord/>
      
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue';
import VideoRecord from '@/components/VideoRecord.vue';

export default defineComponent({
  name: 'Tab3Page',
  components: { IonHeader, IonToolbar, IonTitle, IonContent, IonPage, VideoRecord },
 mounted: async function() {
    let lMyLoop = document.getElementById('tab-button-myloop')
    lMyLoop!.style.display = "block"
      //document.getElementById('tab-button-myloop')!.style.display = "block"
      document.getElementById('tab-button-add')!.style.display = "block"
  }
});
</script>

<style>
@import '../../public/assets/style.css';
</style>
