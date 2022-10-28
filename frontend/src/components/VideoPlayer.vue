<template>
<div>
    <video id="myVideo" class="video-js vjs-default-skin"></video>
</div>
</template>

<script>

    /* eslint-disable */
    import 'video.js/dist/video-js.css'
    import 'videojs-record/dist/css/videojs.record.css'
    import videojs from 'video.js'
    import 'webrtc-adapter'
    import RecordRTC from 'recordrtc'

    export default {
        data() {
            return {
                player: '',
                options: {
                    controls: false,
                    audio: false,
                    autoplay: true,
                    loop: true,
                    fluid: false,
                    bigPlayButton: false,
                    muted: true,
                    controlBar: {
                        volumePanel: false,
                        fullScreenToggle: false,
                    },
                    sources: [
                    {
                        src:
                        './video.mp4',
                        type: 'video/mp4'
                    }
                    ],
                    plugins: {

                    },
                    videoDevices: [],
                }
            };
        },
        mounted() {
            /* eslint-disable no-console */
   

            this.player = videojs('#myVideo', this.options, () => {
                // print version information at startup
                var msg = 'Using video.js ' + videojs.VERSION +
                    ' with videojs-record ' + videojs.getPluginVersion('record') +
                    ' and recordrtc ' + RecordRTC.version;
                videojs.log(msg);
            });

            // device is ready
            this.player.on('ready', () => {
               var promise = this.player.play();

            if (promise !== undefined) {
                promise.then(function() {
                // Autoplay started!
                }).catch(function(error) {
                // Autoplay was prevented.
                });
            }
            });

            // user clicked the record button and started recording
            this.player.on('startRecord', () => {
                console.log('started recording!');
            });

            // user completed recording and stream is available
            this.player.on('finishRecord', () => {
                // the blob object contains the recorded data that
                // can be downloaded by the user, stored on server etc.
                console.log('finished recording: ', this.player.recordedData);
               let lPostVideo = window.document.getElementById('postVideo')
               lPostVideo.style.display = "inline-flex"
               this.player.exitFullscreen();
            //var url  = window.URL.createObjectURL(this.player.recordedData);
            //window.location.assign(url);
            });

            // error handling
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

    }
    }
</script>

<style>

.video-js {
 text-align: center;
 margin: 1rem auto;
 border: 1px solid white;
 max-height: 460px;
 max-width: 74vw;
 margin-top: 15px;
}

</style>