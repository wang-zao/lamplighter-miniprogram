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