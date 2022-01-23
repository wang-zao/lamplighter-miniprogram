<template>
  <cover-view
    class="guide_wrapper"
  >
    <cover-view>
      <cover-view
      >
        <cover-view class="box_line box_line_top_margin box_line_allblack">
        </cover-view>
        <cover-view class="box_line box_line_top">
          <cover-view class="box_line_column box_line_column_side"></cover-view>
          <cover-view class="box_line_column box_line_column_mid"
            :class="{
              'box_unit_empty': currentStep === 0,
              'box_unit_full': currentStep === 1,
            }"
          ></cover-view>
          <cover-view class="box_line_column box_line_column_side"></cover-view>
        </cover-view>
        <cover-view class="box_line box_line_mid box_line_allblack">
          <cover-view class=" box_line_column_mid_through">
            <cover-view v-if="currentStep === 0" class="guide_content guide_content_top">
              <cover-view class="guide_text" :class="{ guide_text_easein: anmtCtrl.step1.line1 }">点灯人</cover-view>
              <cover-view class="guide_text" :class="{ guide_text_easein: anmtCtrl.step1.line2 }">从当前站到下一站</cover-view>
              <cover-view class="guide_text" :class="{ guide_text_easein: anmtCtrl.step1.line3 }">要往哪个方向走？</cover-view>
              <cover-view
                class="guide_button"
                @click="nextStep" :class="{ guide_text_easein: anmtCtrl.step1.line4 }"
              >下一步</cover-view>
            </cover-view>
            <cover-view v-else class="guide_content guide_content_bottom">
              <cover-view class="guide_text" :class="{ guide_text_easein: anmtCtrl.step2.line1 }">长按屏幕并释放，操纵罗盘</cover-view>
              <cover-view class="guide_text" :class="{ guide_text_easein: anmtCtrl.step2.line2 }">依靠方向感点亮 🌏 吧</cover-view>
              <cover-view
                class="guide_button"
                @click="letsStart" :class="{ guide_text_easein: anmtCtrl.step2.line3 }"
              >开始</cover-view>
            </cover-view>
          </cover-view>
        </cover-view>
      </cover-view>
      <cover-view class="box_line box_line_bottom">
        <cover-view class="box_line_column box_line_column_side"></cover-view>
        <cover-view class="box_line_column box_line_column_mid"
          :class="{
            'box_unit_empty': currentStep === 1,
            'box_unit_full': currentStep === 0,
          }"
        ></cover-view>
        <cover-view class="box_line_column box_line_column_side"></cover-view>
      </cover-view>
      <cover-view class="box_line box_line_bottom_margin box_line_allblack">
      </cover-view>
    </cover-view>
  </cover-view>
</template>

<script>
/**
 * @description 
 * @event {Function} click 
 */
import { EventBus } from '@/utils/eventBus';
export default {
  name: 'GuidePage',
  props: {
    // anyprops: {
    //   type: String,
    //   default: '',
    // },
  },
  data() {
    return {
      currentStep: 0,
      anmtCtrl: {
        duration: 800,
        step1: {
          line1: false,
          line2: false,
          line3: false,
          line4: false,
        },
        step2: {
          line1: false,
          line2: false,
          line3: false,
        }
      }
    }
  },
  created() {
    this.animateFirstStep();
    // this.autoClick();
  },
  methods: {
    init() {
    },
    animateFirstStep() {
      this.anmtCtrl.step1.line1 = true;
      setTimeout(() => {
        this.anmtCtrl.step1.line2 = true;
        setTimeout(() => {
          this.anmtCtrl.step1.line3 = true;
          setTimeout(() => {
            this.anmtCtrl.step1.line4 = true;
          }, this.anmtCtrl.duration);
        }, this.anmtCtrl.duration);
      }, this.anmtCtrl.duration);
    },
    animateSecondStep() {
      this.anmtCtrl.step2.line1 = true;
      setTimeout(() => {
        this.anmtCtrl.step2.line2 = true;
        setTimeout(() => {
          this.anmtCtrl.step2.line3 = true;
        }, this.anmtCtrl.duration);
      }, this.anmtCtrl.duration);
    },
    autoClick() {
      setTimeout(() => {
        this.nextStep()
        setTimeout(() => {
          this.letsStart()
        }, 4000)
      }, 4000)
    },
    nextStep() {
      this.currentStep = 1;
      this.animateSecondStep();
    },
    letsStart() {
      EventBus.$emit('startGameCountDown');
    },
  }
}
</script>

<style scoped lang="scss">

$col-side-width: 3vw;
$col-mid-width: 94vw;
$row-top-margin-height: 10vh;
$row-top-height: 20vh;
$row-mid-height: 38vh;
$row-bottom-height: 24vh;
$row-bottom-margin-height: 8vh;

$guide-bg-color-mask: #00000099;

@keyframes guide-page-fadein {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}


.guide_wrapper {
  color: #fff;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  .box_line {
    width: 100vw;
    // height: 33vh;
    display: flex;
    align-items: center;
    .box_line_column {
      height: 100%;
      background: $guide-bg-color-mask;
    }
    .box_line_column_side {
      width: $col-side-width;
    }
    .box_line_column_mid {
      width: $col-mid-width;
    }
    .box_line_column_mid_through {
      width: 100vw;
    }
    .box_unit_empty {
      background: transparent;
    }
    // .box_unit_full {
    //   background: $guide-bg-color-mask;
    // }
    .guide_content {
      display: flex;
      flex-direction: column;
      align-items: center;
      height: $row-mid-height;
      .guide_text {
        font-size: 1rem;
        line-height: 2rem;
        opacity: 0;
      }
      .guide_button {
        margin: 1rem 0;
        font-size: 1rem;
        background: #ffffff44;
        border-radius: 1.5rem;
        padding: 1rem 2rem;
        width: min-content;
        opacity: 0;
      }
      .guide_text_easein {
        animation: guide-page-fadein 0.4s ease-in-out forwards;
      }
    }
    .guide_content_top {
      justify-content: flex-end;
    }
    .guide_content_bottom {
      justify-content: center;
    }
  }
  .box_line_allblack {
    background: $guide-bg-color-mask;
  }
  .box_line_top_margin {
    height: $row-top-margin-height;
  }
  .box_line_top {
    height: $row-top-height;
  }
  .box_line_mid {
    height: $row-mid-height;
    text-align: center;
  }
  .box_line_bottom {
    height: $row-bottom-height;
  }
  .box_line_bottom_margin {
    height: $row-bottom-margin-height;
  }
}
</style>