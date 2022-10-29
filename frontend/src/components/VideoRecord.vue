<template>
<div>
    <video id="myLoop" class="video-js vjs-default-skin" playsinline></video>
<div id="postVideo">
<p class="option"><a @click="download()" id="dl" target="_blank">1) DOWNLOAD</a></p>
<p class="option"><a @click="upload(this.player.recordedData)" id="dl" target="_blank">2) UPLOAD</a></p>
<p class="option"><a @click="pushLoopToIPFS()" id="sign" target="_blank">3) SIGN TXN</a></p>
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
    let chainId = parseInt(process.env.VUE_APP_CHAIN_ID)
    var front = false;
    export default {
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
            console.log(this.walletAddress)
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
               lPostVideo.style.display = "inline-flex"
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
        download() {
            this.player.record().saveAs({'video': 'my-video-file-name.webm'});
        },
    async upload(file) {
    const client = new NFTStorage({ token: process.env.VUE_APP_NFT_STORAGE_KEY })
    //let videoFile = fs.readFileSync(file);
    //const videoFile = new File([ someBinaryImageData ], file, { type: 'video/mp4' })
    const metadata = await client.storeBlob(file)
    this.loopToPush = metadata
    await alert('upload completed')
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
    },


    }
    }
</script>

<style>
#myLoop {
      margin-top: 10vh;
}

#postVideo {
  display: none;
  margin-top: 2rem;
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
}
</style>