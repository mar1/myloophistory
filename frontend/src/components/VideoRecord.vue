<template>
<div id="recordContainer">
    <video id="myLoop" class="video-js vjs-default-skin" playsinline></video>
<div id="postVideo">
<ion-button fill="outline" class="cta" expand="block" id="open-modal">Validate this Loop</ion-button>
    <ion-modal ref="modal" trigger="open-modal">
  <ion-content class="ion-padding">
    <div id="modalContainer">
    <ion-button fill="outline" id="btn1" class="cta" expand="block" @click="upload(this.player.recordedData)">Upload to IPFS forever</ion-button>
    <p style="text-align: center">OR</p>
    <ion-button fill="outline" @click="download()" class="cta" expand="block">Download this video</ion-button>
    </div>
      <ion-button @click="cancel()" expand="block" color="danger">Cancel</ion-button>
  </ion-content>
    </ion-modal>

<!--
<p class="option"><a @click="download()" id="dl" target="_blank">1) DOWNLOAD</a></p>
<p class="option"><a @click="upload(this.player.recordedData)" id="dl" target="_blank">2) UPLOAD</a></p>
<p class="option"><a @click="pushLoopToIPFS()" id="sign" target="_blank">3) SIGN TXN</a></p>
-->
</div>
</div>
</template>

<script>

    /* eslint-disable */
    import 'video.js/dist/video-js.css'
    import 'videojs-record/dist/css/videojs.record.css'
    import videojs from 'video.js'
    import 'webrtc-adapter'
    import RecordRTC from 'recordrtc'
    import Record from 'videojs-record/dist/videojs.record.js'
    import { NFTStorage, File, Blob } from 'nft.storage'
    import { ClientCtrl, ConfigCtrl, AccountCtrl, ModalCtrl, SignerCtrl, ContractCtrl, TransactionCtrl, ProviderCtrl, BlockCtrl, FeeCtrl } from '@web3modal/core'
    import { chains, providers } from '@web3modal/ethereum'
    import '@web3modal/ui'
    import { ethers } from "ethers";
    import contractABI from '../../public/assets/ABI.json'
    import { OverlayEventDetail } from '@ionic/core/components';
    import { modalController } from "@ionic/vue";
    import { defineComponent } from 'vue';
    import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonModal } from '@ionic/vue';


    let chainId = parseInt(process.env.VUE_APP_CHAIN_ID)
    var front = false;
    export default defineComponent({
  name: 'VideoRecord',
  components: { IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonModal },
        data() {
            return {
                player: '',
                options: {
                    controls: true,
                    autoplay: false,
                    fluid: false,
                    loop: false,
                    width: 320,
                    height: 240,
                    bigPlayButton: true,
                    controlBar: {
                        volumePanel: false,
                        fullScreenToggle: false,
                    },
                    plugins: {
                        record: {
                            audio: false,
                            video: true,
                            video: {facingMode: 'environment'},
                            maxLength: 3,
                            debug: true
                        }
                    },
                    videoDevices: [],
                },
            };
        },
           mounted: async function()  {
                const account = AccountCtrl.get()

      AccountCtrl.watch(account => {
          if (account.isConnected == true) {
            
            this.isConnected = true
            this.walletAddress = account.address
            this.checkOwned()
          }
          else {
            console.log('not connected')
            this.isConnected = false
          }
      })

    let signerOptions = {
      chainId: chainId
    }

    SignerCtrl.watch(signer => {
      if (signer) {
        this.signer = signer
      }
    }, signerOptions)


            this.player = videojs('#myLoop', this.options, () => {
                // print version information at startup
                var msg = 'Using video.js ' + videojs.VERSION +
                    ' with videojs-record ' + videojs.getPluginVersion('record') +
                    ' and recordrtc ' + RecordRTC.version;
                videojs.log(msg);
            });

            this.player.on('deviceReady', () => {
               this.player.requestFullscreen();
            });

            this.player.on('startRecord', () => {
                console.log('started recording!');
            });

            this.player.on('finishRecord', () => {
                console.log('finished recording: ', this.player.recordedData);
               let lPostVideo = window.document.getElementById('postVideo')
               lPostVideo.style.display = "flex"
               this.player.exitFullscreen();
            });

            this.player.on('error', (element, error) => {
                console.warn(error);
            });

            this.player.on('deviceError', () => {
                console.error('device error:', this.player.deviceErrorCode);
            });
        },
        beforeDestroy() { 
            if (this.player) {
                this.player.dispose();
            }
    
        },

    methods: {
              cancel() {
        this.$refs.modal.$el.dismiss(null, 'cancel');
      },

        download() {
            this.player.record().saveAs({'video': 'my-video-file-name.webm'});
        },
    async upload(file) {
    document.getElementById('btn1').setAttribute('disabled', true);
    const client = new NFTStorage({ token: process.env.VUE_APP_NFT_STORAGE_KEY })
    const metadata = await client.storeBlob(file)
    this.loopToPush = metadata
    await alert('Upload completed, please validate the transaction')
    await this.pushLoopToIPFS()
    },

    async findTokenId() {
        const account = await AccountCtrl.get()
        const signer = await SignerCtrl.fetch({chainId: chainId})
        const readConfig = await {
        functionName: "walletOfOwner",
        chainId: chainId,
        args: [account.address],
        address: process.env.VUE_APP_CONTRACT_ADDRESS,
        abi: contractABI
        }
      let owned = await ContractCtrl.read(readConfig)
      return await [owned[0].toNumber(), account.address]
    },

    async pushLoopToIPFS() {
        let dataToPush = await this.findTokenId()
        const signer = await SignerCtrl.fetch({chainId: chainId})

      const callOverrides = {
        gasLimit: 500000,
      }

      const pushConfig = await {
        functionName: "addLoop",
        chainId: chainId,
        args: await [dataToPush[0], this.loopToPush],
        signer: signer,
        overrides: callOverrides,
        address: process.env.VUE_APP_CONTRACT_ADDRESS,
        abi: contractABI
      }

      const write = await ContractCtrl.write(pushConfig)

      const waitConfig = await {
        confirmations: 2,
        hash: await write?.hash,
        chainId: chainId,
      }
      const transaction = await TransactionCtrl.wait(waitConfig)
      if (transaction.status == 1) {
        alert('Loop successfully added')
        window.location.reload()
      }
      else {
        alert('There was a problem during the process')
        document.getElementById('btn1').setAttribute('disabled', false);
      }
    },


    }
    })
</script>

<style>
#myLoop {
  margin-top: 2vh;
}

#recordContainer {
    padding-bottom: 2rem;
}

#postVideo {
  display: none;
  text-align: center;
  margin: 2rem auto 0;
  align-items: center;
  justify-content: center;
}

.option {
  margin: 0 2rem;
}

.video-js {
 text-align: center;
 margin: 0 auto;
 width: 80vw;
height: 30vh;
border: 1px solid white;
}

.vjs-control-bar {
    background-color: transparent !important;
}

.vjs-control-text {
    display: none !important;
}
.vjs-record .vjs-device-button.vjs-control {
    line-height: 2rem !important;
}
.vjs-icon-video-perm::before {
  content: "∞" !important;
  padding-bottom: 50px !important;
  color: #15B7B9;
  font-weight: bolder;
}

#modalContainer {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    height: 80vh;
}


</style>