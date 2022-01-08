<template>
  <view
    class="ticket_wrapper" 
    :class="{ ticket_wrapper_abstracted: showAbstract }"
    @click="changeAbstractVisibility"
  >
    <view class="ticket_reminder" @click="changeAbstractVisibility">{{reminder}}</view>
    <view class="ticket_placename" @click="changeAbstractVisibility">
      {{cityInfo.name_chn}}
    </view>
    <view v-if="showAbstract" class="ticket_abstract">
      {{ abstractContent }}
    </view>
  </view>
</template>

<script>
  /**
   * @description 
   * @event {Function} click 
   */
  export default {
    name: 'Ticket',
    props: {
      cityInfo: {
        type: Object,
        default: {},
      },
      reminder: {
        type: String,
        default: '',
      },
      showAbstract: {
        type: Boolean,
        default: false,
      },
      anmtCtrl: {
        type: Object,
        default: {},
      },
    },
    data() {
      return {
      }
    },
    computed: {
      abstractContent() {
        if (this.anmtCtrl.answerCorrectAnimationStep1) {
          return '';
        }
        return this.cityInfo.abs_chn;
      }
    },
    created() {
    },
    methods: {
      changeAbstractVisibility() {
        this.$emit('changeAbstractVisibility', this.cityInfo)
      }
    }
  }
</script>

<style scoped lang="scss">

.ticket_wrapper_abstracted {
  // height: 20vh;
  // width: 50vw;
  height: max-content;
  width: max-content;
  overflow-y: scroll;
  transition: max-height ease-out 0.2s; 
}
.ticket_wrapper {
  background: $general-bright-button-background;
  background: $general-bright-button-blue;
  transition: max-height ease-out 0.2s; 
  border-radius: 1rem;
  padding: 1rem;
  max-height: 16vh;
  max-width: 50vw;
  transition: ease .2s;
  .ticket_reminder {
    font-size: 1rem;
  }
  .ticket_placename {
    font-size: 1.4rem;
  }
  .ticket_abstract {
    // transition: max-height ease-out 0.2s; 
    font-size: 1rem;
    height: max-content;
    word-break: break-all;
    word-wrap:break-word;
    white-space:pre-line;
    overflow-y: scroll;
  }
}

</style>