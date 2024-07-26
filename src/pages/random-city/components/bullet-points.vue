<template>
  <view class="bullets_wrapper" :class="{
      disappearing: animateData.showDisappearing,
      appearing: animateData.showAppearing,
    }">
    <view class="bullet_point_line bullet_point_line_1" :class="{
      scrolling: animateData.startScrolling,
    }">
      <view class="bullet_point_item" v-for="item in bulletPointOne" :key="item">
        {{ item }}
      </view>
    </view>
    <view class="bullet_point_line bullet_point_line_2" :class="{
      scrolling: animateData.startScrolling,
    }">
      <view class="bullet_point_item" v-for="item in bulletPointTwo" :key="item">
        {{ item }}
      </view>
    </view>
    <view class="bullet_point_line bullet_point_line_3" :class="{
      scrolling: animateData.startScrolling,
    }">
      <view class="bullet_point_item" v-for="item in bulletPointThree" :key="item">
        {{ item }}
      </view>
    </view>
  </view>
</template>

<script>
/**
 * @description 
 * @event {Function} click 
 */
import Vue from 'vue';
import { EventBus } from '@/utils/eventBus';
export default Vue.extend({
  name: 'BulletPoints',
  props: {
    // anyprops: {
    //   type: String,
    //   default: '',
    // },
  },
  data() {
    return {
      bulletPointOne: [],
      bulletPointTwo: [],
      bulletPointThree: [],
      animateData: {
        showDisappearing: false,
        showAppearing: false,
        startScrolling: true,
      }
    }
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.watchGetBulletPoints();
    },
    watchGetBulletPoints() {
      EventBus.$on('updateRandomJumppedCityData', (payload) => {
        console.log('received payload in bullet', payload)
        this.updateBulletPoints(payload);
      });
    },
    updateBulletPoints(payload) {
      try {
          // show disappearing animation before changing data
          this.animateData.showAppearing = false;
          this.animateData.showDisappearing = true;
          setTimeout(() => {
            this.animateData.showDisappearing = false;
            this.animateData.showAppearing = true;
            // reset scrolling to make it scroll again
            this.animateData.startScrolling = false;
            const { wiki_keywords } = payload;
            // divide by '|'
            const wikiKeywordsArr = wiki_keywords.split('|');
            // empty all 3 array first
            this.bulletPointOne = [];
            this.bulletPointTwo = [];
            this.bulletPointThree = [];
            // push to 3 arrays one after one in order until all keywords are pushed
            for (let i = 0; i < wikiKeywordsArr.length; i++) {
              if (i % 3 === 0) {
                this.bulletPointOne.push(wikiKeywordsArr[i]);
              } else if (i % 3 === 1) {
                this.bulletPointTwo.push(wikiKeywordsArr[i]);
              } else {
                this.bulletPointThree.push(wikiKeywordsArr[i]);
              }
            }
            setTimeout(() => {
              this.animateData.startScrolling = true;
            }, 100);
          }, 600);
        } catch (error) {
          this.bulletLengthsOne = [];
          this.bulletLengthsTwo = [];
          this.bulletLengthsThree = [];
        }
    }
  }
})
</script>

<style scoped lang="scss">

@keyframes disappearing {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

@keyframes appearing {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@keyframes scrolling {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-10000vw);
  }
}
.bullets_wrapper {
  position: relative;
}

.bullet_point_line {
  display: flex;
  flex-wrap: nowrap;
  position: absolute;
  left: 55vw;
  opacity: 1;
}

.bullet_point_item {
  padding: 5px 10px;
  border-radius: 5px;
  background: #ffffff55;
  white-space: nowrap;
  margin-right: 10px;
}

.disappearing {
  animation: disappearing .6s forwards;
}

.appearing {
  animation: appearing .6s forwards;
}

.scrolling {
  animation: scrolling 1000s linear forwards;
}

.bullet_point_line_1 {
  top: 0;
}

.bullet_point_line_2 {
  top: 40px;
  animation-duration: 800s;
}

.bullet_point_line_3 {
  top: 80px;
  animation-duration: 900s;
}
</style>