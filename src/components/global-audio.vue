<template>
  <view></view>
</template>

<script>
/**
 * @description 
 * @event {Function} click 
 */
import Vue from 'vue';
import { EventBus } from '@/utils/eventBus';
export default Vue.extend({
  name: 'GlobalAudio',
  props: {
  },
  data() {
    return {
      audios: {
        audioJumpSuccess: {
          created: false,
          url: 'cloud://northenv-4gh0748xf50343cf.6e6f-northenv-4gh0748xf50343cf-1304769767/audios/jump-success.mp3',
          instance: null,
        },
        audioJumpSuccess0: {
          created: false,
          url: 'cloud://northenv-4gh0748xf50343cf.6e6f-northenv-4gh0748xf50343cf-1304769767/audios/jump-success-0.mp3',
          instance: null,
        },
        audioJumpSuccess1: {
          created: false,
          url: 'cloud://northenv-4gh0748xf50343cf.6e6f-northenv-4gh0748xf50343cf-1304769767/audios/jump-success-1.mp3',
          instance: null,
        },
        audioJumpSuccess2: {
          created: false,
          url: 'cloud://northenv-4gh0748xf50343cf.6e6f-northenv-4gh0748xf50343cf-1304769767/audios/jump-success-2.mp3',
          instance: null,
        },
        audioJumpSuccess3: {
          created: false,
          url: 'cloud://northenv-4gh0748xf50343cf.6e6f-northenv-4gh0748xf50343cf-1304769767/audios/jump-success-3.mp3',
          instance: null,
        },
        audioJumpSuccess4: {
          created: false,
          url: 'cloud://northenv-4gh0748xf50343cf.6e6f-northenv-4gh0748xf50343cf-1304769767/audios/jump-success-4.mp3',
          instance: null,
        },
        audioJumpSuccess5: {
          created: false,
          url: 'cloud://northenv-4gh0748xf50343cf.6e6f-northenv-4gh0748xf50343cf-1304769767/audios/jump-success-5.mp3',
          instance: null,
        },
        audioJumpSuccess6: {
          created: false,
          url: 'cloud://northenv-4gh0748xf50343cf.6e6f-northenv-4gh0748xf50343cf-1304769767/audios/jump-success-6.mp3',
          instance: null,
        },
        audioJumpSuccess7: {
          created: false,
          url: 'cloud://northenv-4gh0748xf50343cf.6e6f-northenv-4gh0748xf50343cf-1304769767/audios/jump-success-7.mp3',
          instance: null,
        },
        audioJumpSuccess8: {
          created: false,
          url: 'cloud://northenv-4gh0748xf50343cf.6e6f-northenv-4gh0748xf50343cf-1304769767/audios/jump-success-8.mp3',
          instance: null,
        },
        audioJumpSuccess9: {
          created: false,
          url: 'cloud://northenv-4gh0748xf50343cf.6e6f-northenv-4gh0748xf50343cf-1304769767/audios/jump-success-9.mp3',
          instance: null,
        },
        audioJumpFail: {
          created: false,
          url: 'cloud://northenv-4gh0748xf50343cf.6e6f-northenv-4gh0748xf50343cf-1304769767/audios/jump-fail.mp3',
          instance: null,
        },
        buttonPress: {
          created: false,
          url: 'cloud://northenv-4gh0748xf50343cf.6e6f-northenv-4gh0748xf50343cf-1304769767/audios/buttonpress.mp3',
          instance: null,
        },
        atmosphere: {
          created: false,
          url: 'cloud://northenv-4gh0748xf50343cf.6e6f-northenv-4gh0748xf50343cf-1304769767/audios/superspacy-atmosphere .mp3',
          instance: null,
        },
      },

    }
  },
  created() {
    this.init();
    this.watchAudioPlayEvent();
  },
  methods: {
    init() {
      this.createAudioInstances('audioJumpSuccess');
      this.createAudioInstances('audioJumpSuccess0');
      this.createAudioInstances('audioJumpSuccess1');
      this.createAudioInstances('audioJumpSuccess2');
      this.createAudioInstances('audioJumpSuccess3');
      this.createAudioInstances('audioJumpSuccess4');
      this.createAudioInstances('audioJumpSuccess5');
      this.createAudioInstances('audioJumpSuccess6');
      this.createAudioInstances('audioJumpSuccess7');
      this.createAudioInstances('audioJumpSuccess8');
      this.createAudioInstances('audioJumpSuccess9');
      this.createAudioInstances('audioJumpFail');
      this.createAudioInstances('buttonPress');
      this.createAudioInstances('atmosphere');
    },
    createAudioInstances(name) {
      if (name in this.audios) {
        this.audios[name].instance = wx.createInnerAudioContext({
          useWebAudioImplement: true,
        });
        this.audios[name].instance.src = this.audios[name].url;
        this.audios[name].created = true;
      }
    },
    playAudio(name) {
      if (name in this.audios) {
        this.audios[name].instance.play();
      }
    },
    watchAudioPlayEvent() {
        EventBus.$on('playAudio', (name) => {
          this.playAudio(name);
        });

    }
  }
})
</script>

<style scoped lang="scss">


</style>