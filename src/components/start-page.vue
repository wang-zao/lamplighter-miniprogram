<template>
  <cover-view class="start_wrapper" >
    <cover-view class="start_reminder">{{currentTip}}</cover-view>
    <cover-view v-if="showingNumbers" class="start_count_down">{{countDownTime}}</cover-view>
    <cover-view v-else class="start_count_down">起飞！</cover-view>
  </cover-view>
</template>

<script>
  /**
   * @description 
   * @event {Function} click 
   */
  import {
    TIPS_OF_PLAYING,
  } from '@/utils/texts';

  export default {
    name: 'StartPage',
    props: {
    },
    data() {
      return {
        countDownTime: 3,
        showingNumbers: true,
        currentTip: '加载中...',
      }
    },
    created() {
      this.getRandomTips();
    },
    mounted() {
    },
    methods: {
      onClick(direction) {
      },
      getRandomTips() {
        const randomIdx = Math.floor(Math.random() * TIPS_OF_PLAYING.length);
        this.currentTip = TIPS_OF_PLAYING[randomIdx];
      },
      startTimeLoop() {
        const clock = setInterval(() => {
          if (this.countDownTime > 1) {
            this.countDownTime -= 1;
          } else if (this.countDownTime <= 1) {
            this.showingNumbers = false;
            clearInterval(clock);
          }
        }, 1000);
      }
    }
  }
</script>

<style scoped lang="scss">

.start_wrapper {
  position: fixed;
  top: 0;
  left: 0;
  background: $dark-mode-mask;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  .start_count_down {
    color: #fff;
    text-align: center;
    font-size: 2rem;
  }
  .start_reminder {
    color: #fff;
    font-size: 1rem;
    margin-bottom: 5rem;
    max-width: 80vw;
    white-space: pre-wrap;
    text-align: center;
  }
}
</style>