<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="home" href="/tabs/home">
          <ion-icon :icon="home" />
          <ion-label>Home</ion-label>
        </ion-tab-button>
          
        <ion-tab-button id="tab2" tab="myloop" href="/tabs/myloop">
          <ion-icon :icon="camera" />
          <ion-label>My Story</ion-label>
        </ion-tab-button>
        
        <ion-tab-button id="tab3" tab="add" href="/tabs/add">
          <ion-icon :icon="add" />
          <ion-label>Add Loop</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IonTabBar, IonTabButton, IonTabs, IonLabel, IonIcon, IonPage, IonRouterOutlet } from '@ionic/vue';
import { home, camera, add } from 'ionicons/icons';

export default defineComponent({
  name: 'TabsPage',
  components: { IonLabel, IonTabs, IonTabBar, IonTabButton, IonIcon, IonPage, IonRouterOutlet },
  setup() {
    return {
      home,
      add,
      camera,
    }
  },

});
</script>

<style>
@import '../../public/assets/style.css';
</style>