<template>
  <cover-view
    class="ticket_wrapper" 
    :class="{ ticket_wrapper_abstracted: showAbstract }"
    @click="changeAbstractVisibility"
  >
    <cover-view class="ticket_reminder" @click="changeAbstractVisibility">{{reminder}}</cover-view>
    <cover-view class="ticket_placename" @click="changeAbstractVisibility">
      {{cityInfo.name_chn || '-'}}
    </cover-view>
    <cover-view v-if="showAbstract" class="ticket_abstract">
      {{ abstractContent || '-' }}
    </cover-view>
    {{showAbstract ? abstractContent: ''}}
  </cover-view>
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
  overflow: hidden;
  text-overflow:ellipsis;
  transition: max-height ease-out 0.2s; 
}
.ticket_wrapper {
  background: $general-bright-button-blue;
  transition: max-height ease-out 0.2s; 
  border-radius: 1rem;
  padding: 1rem;
  max-height: 10vh;
  max-width: 50vw;
  transition: ease .2s;
  color: transparent;
  .ticket_reminder {
    font-size: 1rem;
    color: #fff;
    margin-bottom: 10rpx;
  }
  .ticket_placename {
    font-size: 1.4rem;
    color: #fff;
    margin-bottom: 10rpx;
  }
  .ticket_abstract {
    // transition: max-height ease-out 0.2s; 
    max-height: max-content;
    font-size: 1rem;
    word-break: break-all;
    word-wrap:break-word;
    white-space:pre-line;
    color: #fff;
    line-height: 1.6;
    overflow:hidden;
    text-overflow: ellipsis;
    white-space:nowrap;
  }
}

</style>