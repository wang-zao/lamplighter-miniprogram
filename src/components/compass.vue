<template>
  <view class="compass_wrapper"
  >
    <view class="compass_body_wrapper">
      <view class="compass_item compass_needle">
        <view class="needle_body"
          :class="{
            needle_flashing: showingAddedScore,
          }"
        >
          <image
            :class="compassNeedleClass"
            :src="PICTURES_URL.COMPASS_NEEDLE"
            mode="heightFix"
          />
        </view>
      </view>
      <view class="compass_item compass_plate">
        <image
          class="compass_background"
          :src="PICTURES_URL.COMPASS"
          mode="heightFix" />
      </view>
      <view class="compass_item compass_aircraft">
        <view class="compass_aircraft_wrapper">
          <view 
            class="airplane_wrapper"
              id="airplane"
              :class="{
                airplane_paused: pausingRotation,
                airplane_rotating: !pausingRotation,
              }"
          >
            <image
              class="airplane_background"
            :class="{
              'airplane_launching': pausingRotation,
            }"
              :src="PICTURES_URL.AIRPLANE"
              mode="heightFix"
            />
          </view>
        </view>
      </view>
      <view class="compass_item compass_text">
        <view class="text_degree">{{currentDegree}}°</view>
        <view class="text_degree">{{calc_next_direction_chn(currentDegree)}}</view>
      </view>
      <view class="compass_item compass_score">
        <view :class="scoreTextClass">
          <view class="score_body"
            :class="{
              'score_showing': showingAddedScore,
            }"
          >+{{currentAddingScore}}</view>
        </view>
      </view>
      <view class="compass_item compass_button">
        <view class="button_body" :class="{
            button_body_rotating: !pausingRotation,
          }">
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  /**
   * @description 
   * @event {Function} click 
   */
import store from '@/store/index.js';
import {
  getRotateDegFromMatrix,
  calc_next_direction_chn
} from '@/utils/common';
import {
  PICTURES_URL,
} from '@/utils/constants';
import { EventBus } from '@/utils/eventBus';

  export default {
    name: 'Compass',
    props: {
    },
    data() {
      return {
        currentDegree: 0,
        pausingRotation: true,
        calc_next_direction_chn: calc_next_direction_chn,
        PICTURES_URL: PICTURES_URL,
        showingAddedScore: false,
        currentAddingScore: 0,
        compassNeedleClass: 'needle_img needle_img_0',
        clockId: -1,
      }
    },
    mounted() {
      this.init();
    },
    computed: {
      scoreTextClass() {
        if (this.currentAddingScore >= 10) {
          return 'score_text_4';
        } else if (8 <= this.currentAddingScore && this.currentAddingScore < 10) {
          return 'score_text_3';
        } else if (5 <= this.currentAddingScore && this.currentAddingScore < 8) {
          return 'score_text_2';
        } else {
          return 'score_text_0';
        }
      },
      isIOS() {
        return store.state.systemInfo.system.slice(0,3) === 'iOS';
      },
    },
    methods: {
      init() {
        this.watchStartRotatingCompass();
        this.watchEndRotatingCompass();
        this.watchAddScore();
      },
      startRotating() {
        const f = 100;
        const v = 360 / (2000 / f);
        this.pausingRotation = false;
        if (this.isIOS) {
          // android手机加上下面这段会没法玩
          this.clockId = setInterval(() => {
            this.currentDegree = (this.currentDegree + v) % 360;
          }, f);
        }
      },
      endRotating() {
        this.pausingRotation = true;
        clearInterval(this.clockId);
        let theNode = uni
          .createSelectorQuery()
          .in(this)
          .select("#airplane")
        theNode.fields({
          computedStyle: ['transform']
        },(data)=>{
          this.currentDegree = getRotateDegFromMatrix(data.transform)
          EventBus.$emit('onChooseDirection', this.currentDegree);
        }).exec()
      },
      watchStartRotatingCompass() {
        EventBus.$on('startRotatingCompass', () => {
          this.startRotating();
        });
      },
      watchEndRotatingCompass() {
        EventBus.$on('endRotatingCompass', () => {
          this.endRotating();
        });
      },
      watchAddScore() {
        EventBus.$on('addScore', (payload) => {
          const { score, deg } = payload;
          this.showingAddedScore = false;
          this.compassNeedleClass = `needle_img needle_img_${Math.floor(deg/5) * 5}`;
          this.currentAddingScore = score;
          this.showingAddedScore = true;
          setTimeout(() => {
            this.showingAddedScore = false;
          }, 1000);
        });
      },
    }
  }
</script>

<style scoped lang="scss">

// maxheight of this part: 20vw;
$compass-radius: 20vw;
$aircraft-radius: 10vw;
$needle-radius: 4vw;

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes scale {
  0% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.5); opacity: 0.3; }
  100% { transform: scale(1); opacity: 0.8; }
}

@keyframes launch {
  0% {
    opacity: 1;
    transform: translateY(0);
  }
  50% {
    opacity: 0;
    transform: translateY(-4 * $aircraft-radius);
  }
  51% {
    opacity: 0;
    transform: translateY(4 * $aircraft-radius);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes scoreFade {
  from {
    opacity: 1;
    transform: translateY(0);
   }
  to {
    opacity: 0;
    transform: translateY(-1rem);
  }
}

@keyframes needleFlash {
  0% { opacity: 1; }
  100% { opacity: 1; }
}

.compass_wrapper {
  color: #fff;
  width: 100vw;
  height: 100px;
  display: flex;
  justify-content: center;
  height: 50vh;
}

.compass_body_wrapper {
  position: relative;
  .compass_item {
    position: absolute;
    text-align: center;
  }
  .compass_plate {
    top: 0;
    left: -1 * $compass-radius;
    width: 2 * $compass-radius;
    height: 2 * $compass-radius;
    border-radius: $compass-radius;
    opacity: .6;
    .compass_background {
      width: 2 * $compass-radius;
      height: 2 * $compass-radius;
    }
  }
  .compass_aircraft {
    top: $compass-radius - $aircraft-radius;
    left: -$aircraft-radius;
    width: 2 * $aircraft-radius;
    height: 2 * $aircraft-radius;
    border: solid 0.1px #ffffff01;
    border-radius: $aircraft-radius;
    background: #ffffff01;
    overflow: hidden;
    .compass_aircraft_wrapper {
      border-radius: $aircraft-radius;
      overflow: hidden;
    }
    .airplane_wrapper {
      animation: rotate 2s infinite linear;
      animation-play-state: paused;
      overflow: hidden;
    }
    .airplane_launching {
      animation: launch 1s forwards ease-in-out;
    }
    .airplane_background {
      width: 2 * $aircraft-radius;
      height: 2 * $aircraft-radius;
    }
    .airplane_paused {
      animation-play-state: paused;
    }
    .airplane_rotating {
      animation-play-state: running;
    }
  }
  .compass_text {
    color: #fff;
    top: $compass-radius - 5vw;
    left: -35vw;
    text-align: left;
    width: 30vw;
    height: 10vw;
  }
  .compass_button {
    color: #fff;
    top: $compass-radius - 8vw;
    right: -40vw;
    text-align: right;
    width: 16vw;
    height: 16vw;
    background: #ffffff44;
    border: solid 1px #ffffff;
    border-radius: 8vw;
    display: flex;
    justify-content: center;
    align-items: center;
    .button_body {
      width: 8vw;
      height: 8vw;
      border-radius: 4vw;
      background: #ffffff;
      animation: scale .3s infinite ease-in-out;
      animation-play-state: paused;
    }
    .button_body_rotating {
      animation-play-state: running;
    }
  }
  .compass_score {
    top: -5rem;
    transform: translateX(-50%);
    .score_body {
      font-weight: bolder;
      color: #fff;
      opacity: 0;
    }
    .score_showing {
      animation: scoreFade .3s forwards ease-in-out;
    }
    .score_text_4 {
      font-size: 5rem;
    }
    .score_text_3 {
      font-size: 3rem;
    }
    .score_text_2 {
      font-size: 2rem;
    }
    .score_text_1 {
      font-size: 1rem;
    }
  }
  .compass_needle {
    top: 0;
    left: -1 * $compass-radius;
    width: 2 * $compass-radius;
    height: 2 * $compass-radius;
    border-radius: $compass-radius;
    opacity: .6;
    .needle_body {
      width: 2 * $compass-radius;
      height: 2 * $compass-radius;
      opacity: 0;
    }
    .needle_img {
      width: 2 * $compass-radius;
      height: 2 * $compass-radius;
    }
    .needle_flashing {
      animation: needleFlash 1s forwards linear;
    }
    @for $i from 0 through 72 {
      .needle_img_#{5*$i} {
        transform: rotate(#{5*$i}deg);
      }
    }
  }
}

</style>