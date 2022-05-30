<template>
  <view class="popup_big_wrap"
    :class="{
      fade_in_popup:  anmtCtrl.answerCorrectAnimationStep2,
      fade_out_popup:  anmtCtrl.answerCorrectAnimationStep1,
    }"
  >
    <view class="popup_wrap"
      :class="{
        roll_left_item: !anmtCtrl.answerCorrectAnimationStep2,
      }"
    >
      <pop-up-item
        v-for="(item, key) in twolines[0]"
        :key="key"
        :lineText="item"
        :cityInfo="cityInfo"
      />
    </view>
    <view class="popup_wrap"
      :class="{
        roll_left_item_2: !anmtCtrl.answerCorrectAnimationStep2,
      }"
    >
      <pop-up-item
        v-for="(item, key) in twolines[1]"
        :key="key"
        :lineText="item"
        :cityInfo="cityInfo"
      />
    </view>
  </view>
</template>

<script>
/**
 * @description 
 * @event {Function} click 
 */
import Vue from 'vue';
import store from '@/store/index.js';
import PopUpItem from './pop-up-item.vue';

export default Vue.extend({
  name: 'PopUpAbstracts',
  components: {
    PopUpItem,
  },
  props: {
    cityInfo: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
    }
  },
  computed: {
    twolines() {
      if (!this.cityInfo || !this.cityInfo.separated_abs_chn) {
        return [[], []];
      }
      const lineLength = this.cityInfo.separated_abs_chn.length;
      let list = this.cityInfo.separated_abs_chn
        .sort(() => Math.random() - 0.5)
        .filter(i => i !== '' && i !== ' ')
      const res = [
        list.slice(0, Math.floor(lineLength / 2)),
        list.slice(Math.floor(lineLength / 2), lineLength),
      ]
      return res;
    },
    anmtCtrl() {
      return store.state.anmtCtrl;
    },
  },
  created() {
  },
  methods: {
    init() {
    }
  }
})
</script>

<style scoped lang="scss">

@keyframes rollleft {
  from { margin-left: 0vw; }
  to { margin-left: -500vw; }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeOut {
  from { opacity: 1; }
  to { opacity: 0; }
}

.popup_big_wrap {
  position: fixed;
  left: 100vw;
  top: 30vh;
  // max-width: 300vw;
  .popup_wrap {
    display: flex;
    flex-wrap: nowrap;
    max-width: 300vw;
  }
  .roll_left_item {
    animation: rollleft 30s infinite linear;
  }
  .roll_left_item_2 {
    animation: rollleft 25s infinite linear;
  }
}
.fade_in_popup {
  opacity: 0;
  animation: fadeIn .3s forwards; 
  animation-delay: .4s;
}
.fade_out_popup {
  animation: fadeOut .3s forwards; 
}
</style>