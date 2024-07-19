<template>
  <view class="choosing_wrap">
    <view class="choosing_mask" @click="closeWindow"></view>
    <view class="choosing_window">
      <view class="close_window_icon" @click="closeWindow">X</view>
      <view class="choosing_title">
        <view class="choosing_title_text">选择城市</view>
        <view class="choosing_title_redo" @click="moveBack">👈🏻</view>
      </view>
      <!-- dome or foreign selector -->
      <view class="choosing_content_original" :class="{'choosing_content_display': !selectionStep.domeOrFore}">
        <view class="choosing_option_item_original" v-for="(option, index) in options" :key="index" @click="handleItemSelected(option)">{{ option.name_chn }}</view>
      </view>
      <!-- province or country selector -->
      <view class="choosing_content" v-if="selectionStep.domeOrFore" :class="{'choosing_content_display': selectionStep.domeOrFore && !selectionStep.countryOrProvince}">
        <view class="choosing_option_item_group" v-for="(letter_group) in countryOrProvinceOptions" :key="letter_group.letter" >
          <view class="choosing_option_item_wrap">
            <view class="choosing_option_item_group_title">{{ letter_group.letter }}</view>
            <view class="choosing_option_item" v-for="(option) in letter_group.options" :key="option.name_chn" @click="handleItemSelected(option)" :class="{
              'choosing_option_item_selected': isCurrentCountryOrProvinceHasSelectedCity(option.name_chn),
              'choosing_option_item_major': isCurrentCityMajor(option)
              }">
              <view class="choosing_option_item_chn">{{ isCurrentCityMajor(option) ? '★ ': ''}}{{ option.name_chn }}</view>
              <view class="choosing_option_confirm" v-show="isCurrentCountryOrProvinceHasSelectedCity(option.name_chn)">へ</view>
            </view>
          </view>
        </view>
      </view>
      <!-- city selector -->
      <!-- <view class="choosing_content choosing_content_display"  v-if="selectionStep.domeOrFore && selectionStep.countryOrProvince">
        <view class="choosing_option_item_group_mixed" v-for="(letterOrOption, key) in cityOptionsMixedWithLetterGroup" :key="`${key}-letter-or-option`" >
          <view class="choosing_option_item" v-if="letterOrOption.type === 'option'" @click="(letterOrOption) => {handleItemSelected(letterOrOption.option)}" :class="{
            'choosing_option_item_selected': isCurrentCitySelected(letterOrOption.option),
            'choosing_option_item_major': isCurrentCityMajor(letterOrOption.option)
          }">
            <view class="choosing_option_item_chn">{{ isCurrentCityMajor(letterOrOption.option) ? '★ ': ''}}{{ letterOrOption.option.name_chn }}</view>
            <view class="choosing_option_confirm" v-show="isCurrentCitySelected(letterOrOption.option)">へ</view>
          </view>
          <view class="choosing_option_item" v-else>{{ letterOrOption.letter }}</view>
        </view>
      </view> -->
      <view class="choosing_content choosing_content_display"  v-if="selectionStep.domeOrFore && selectionStep.countryOrProvince">
        <view class="choosing_option_item_group" v-for="(letter_group) in cityOptions" :key="letter_group.letter" >
          <view class="choosing_option_item_wrap">
            <view class="choosing_option_item_group_title">{{ letter_group.letter }}</view>
            <!-- <view class="choosing_option_item_group_title">{{ letter_group.letter }}</view> -->
            <view class="choosing_option_item" v-for="(option) in letter_group.options" :key="option.name_chn" @click="handleItemSelected(option)" :class="{
              'choosing_option_item_selected': isCurrentCitySelected(option),
              'choosing_option_item_major': isCurrentCityMajor(option)
            }">
              <view class="choosing_option_item_chn">{{ isCurrentCityMajor(option) ? '★ ': ''}}{{ option.name_chn }}</view>
              <view class="choosing_option_confirm" v-show="isCurrentCitySelected(option)">へ</view>
            </view>
          </view>
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
import Vue from 'vue';
import { firstNameToPinyinMapping } from '@/utils/common';
export default Vue.extend({
  name: 'ChoosingCity',
  props: {
    structuredCityData: {
      type: Object,
      default: {
        domestic: {},
        foreign: {},
      }
    }
  },
  data() {
    return {
      selectionStep: {
        domeOrFore: '',
        countryOrProvince: '',
      },
      options: [
        {
          name_chn: '国内城市',
          key_of_data: 'domestic',
        },
        {
          name_chn: '国外城市',
          key_of_data: 'foreign',
        },
      ],
      optionsByLetter: [{letter: 'A', options: []}, {letter: 'B', options: []}, {letter: 'C', options: []}, {letter: 'D', options: []}, {letter: 'E', options: []}, {letter: 'F', options: []}, {letter: 'G', options: []}, {letter: 'H', options: []}, {letter: 'I', options: []}, {letter: 'J', options: []}, {letter: 'K', options: []}, {letter: 'L', options: []}, {letter: 'M', options: []}, {letter: 'N', options: []}, {letter: 'O', options: []}, {letter: 'P', options: []}, {letter: 'Q', options: []}, {letter: 'R', options: []}, {letter: 'S', options: []}, {letter: 'T', options: []}, {letter: 'U', options: []}, {letter: 'V', options: []}, {letter: 'W', options: []}, {letter: 'X', options: []}, {letter: 'Y', options: []}, {letter: 'Z', options: []}],
      selectedCities: [],
    }
  },
  created() {
  },
  computed: {
    countryOrProvinceOptions() {
      const deepClonedOptionsByLetter = JSON.parse(JSON.stringify(this.optionsByLetter));
      if (!this.selectionStep.domeOrFore) {
        return deepClonedOptionsByLetter;
      }
      const upperAdmins = Object.keys(this.structuredCityData[this.selectionStep.domeOrFore]).map(key => {
        return {
          name_chn: key,
          key_of_data: key,
        }
      });
      upperAdmins.forEach(admin => {
        const firstLetter = firstNameToPinyinMapping(admin.name_chn)[0].toUpperCase();
        deepClonedOptionsByLetter.find(letter => letter.letter === firstLetter).options.push(admin);
      });
      return this.washedGroupedOptions(deepClonedOptionsByLetter);
    },
    cityOptions() {
      const deepClonedOptionsByLetter = JSON.parse(JSON.stringify(this.optionsByLetter));
      if (!this.selectionStep.countryOrProvince || !this.selectionStep.domeOrFore) {
        return deepClonedOptionsByLetter;
      }
      const cities = this.structuredCityData[this.selectionStep.domeOrFore][this.selectionStep.countryOrProvince]
      cities.forEach(city => {
        const firstLetter = firstNameToPinyinMapping(city.name_chn)[0].toUpperCase();
        deepClonedOptionsByLetter.find(letter => letter.letter === firstLetter).options.push(city);
      });
      return this.washedGroupedOptions(deepClonedOptionsByLetter);
    },
    cityOptionsMixedWithLetterGroup() {
      const res = this.cityOptions.reduce((acc, letter) => {
        if (letter.options.length > 0) {
          acc.push({ type: 'letter', letter: letter.letter });
          acc.push(...letter.options.map(option => ({ type: 'option', option })));
        }
        return acc;
      }, []);

      console.log('res', res)

      return res;
    }
  },
  methods: {
    init() {
    },
    washedGroupedOptions(optionsByLetter) {
      const removedOptions = optionsByLetter.filter(letter => letter.options.length > 0);

      // 排序选项
      removedOptions.forEach(letter => {
        letter.options.sort((a, b) => {
          const firstCharPinyinA = firstNameToPinyinMapping(a.name_chn).toUpperCase();
          const firstCharPinyinB = firstNameToPinyinMapping(b.name_chn).toUpperCase();
          return firstCharPinyinA.localeCompare(firstCharPinyinB);
        });
      });

      // 获取经纬度方向字母
      const getLongLetter = longitude => (longitude >= 0 ? 'E' : 'W');
      const getLatLetter = latitude => (latitude >= 0 ? 'N' : 'S');

      // 处理重复名称并附加经纬度信息
      const nameCountMap = new Map();

      removedOptions.forEach(letter => {
        letter.options.forEach(option => {
          const name = option.name_chn;
          if (!nameCountMap.has(name)) {
            nameCountMap.set(name, 0);
          }
          nameCountMap.set(name, nameCountMap.get(name) + 1);
        });
      });

      removedOptions.forEach(letter => {
        const uniqueSet = new Set();
        letter.options = letter.options.filter(option => {
          const name = option.name_chn;
          if (nameCountMap.get(name) > 1) {
            option.name_chn = `${name}(${Math.abs(option.longitude).toFixed(0)}°${getLongLetter(option.longitude)}, ${Math.abs(option.latitude).toFixed(0)}°${getLatLetter(option.latitude)})`;
          }
          if (uniqueSet.has(option.name_chn)) {
            return false; // 移除重复项
          }
          uniqueSet.add(option.name_chn);
          return true;
        });
      });

      return removedOptions;
    },
    closeWindow() {
      this.$emit('closeWindow');
    },
    moveBack() {
      if (this.selectionStep.countryOrProvince) {
        this.selectionStep.countryOrProvince = '';
        return;
      }
      if (this.selectionStep.domeOrFore) {
        this.selectionStep.domeOrFore = '';
        return;
      }
      return;
    },
    handleItemSelected(option) {
      console.log('option new', option)
      if (!this.selectionStep.domeOrFore) {
        this.selectionStep.domeOrFore = option.key_of_data;
        return;
      }
      if (!this.selectionStep.countryOrProvince) {
        this.selectionStep.countryOrProvince = option.key_of_data;
        return;
      }
      // if above ifs are not executed, then the option is the final selection
      // if option already in selectedCities, then remove it
      if (this.selectedCities.includes(option)) {
        this.selectedCities = this.selectedCities.filter(city => city !== option);
        this.$emit('selectedCitiesChanged', this.selectedCities);
        return;
      }
      this.selectedCities.push(option);
      this.$emit('selectedCitiesChanged', this.selectedCities);
      return;
    },
    handleItemConfirmed() {
      this.closeWindow();
    },
    isCurrentCitySelected(city) {
      return this.selectedCities.includes(city);
    },
    isCurrentCityMajor(city) {
      return city.is_major === '1';
    },
    isCurrentCountryOrProvinceHasSelectedCity(countryOrProvinceName) {
      return this.selectedCities.some(city => city.upper_admin_name === countryOrProvinceName);
    },
  }
})
</script>

<style scoped lang="scss">

$modal-window-height: 75vh;
$modal-window-width: 90vw;
$modal-window-top-distance: calc(50vh - #{$modal-window-height} / 2);
$modal-window-left-distance: calc(50vw - #{$modal-window-width} / 2);

.choosing_mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9;
}

.choosing_window {
  position: fixed;
  width: $modal-window-width;
  height: $modal-window-height;
  left: $modal-window-left-distance;
  top: $modal-window-top-distance;
  background-color: #000;
  border: 2px solid #fff;
  border-radius: 10px;
  color: #fff;
  padding: 20px;
  box-sizing: border-box;
  z-index: 10;
  .close_window_icon {
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
  }
  .choosing_title {
    font-size: 1.5rem;
    text-align: center;
    line-height: 3rem;
    display: flex;
    justify-content: center;
    align-items: center;
    .choosing_title_redo {
      margin-left: 10px;
    }
  }
  .choosing_content_original {
    pointer-events: none;
    opacity: 0;
    position: absolute;
    top: calc(3rem + 20px);
    left: 20px;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    height: calc(75vh - 40px - 3rem);
    width: calc(90vw - 40px);
    overflow-y: scroll;
    .choosing_option_item_original {
      width: fit-content;
      max-width: 90%;
      white-space: pre-wrap;
      padding: 5px 10px;
      margin-bottom: 5px;
      font-size: 1.5rem;
      background: #ffffff33;
      border-radius: 0.5rem;
      text-align: left;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      margin: 0 5px;
    }
  }
  .choosing_content {
    pointer-events: none;
    opacity: 0;
    position: absolute;
    top: calc(3rem + 20px);
    left: 20px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    width: calc(90vw - 40px);
    max-height: calc(75vh - 40px - 3rem);
    overflow-y: scroll;
    .choosing_option_item {
      width: fit-content;
      // max-width: 90%;
      white-space: nowrap;
      padding: 2px 5px;
      margin: 3px 0;
      background: #ffffff33;
      border-radius: 0.5rem;
      text-align: left;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      .choosing_option_item_eng {
        color: #ffffffcc;
        font-size: 0.8rem;
        margin-left: 2px;
      }
      .choosing_option_confirm {
        margin-left: 2px;
        font-size: 0.8rem;
        color: #00ff80;
        // upside down invert
        transform: scaleY(-1);
      }
    }
    .choosing_option_item_major {
      color: #feffc2;
    }
    .choosing_option_item_selected {
      box-shadow: 0 0 5px #c7ffe344 inset;
      background: #52ffa844;
      color: #52ffa8;
    }
  }
  .choosing_content_display {
    pointer-events: auto;
    opacity: 1;
  }
}

.choosing_option_item_group {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-bottom: 16px;
  .choosing_option_item_group_title {
    text-align: center;
    color: #ffffff88;
    margin-right: 10px;
    height: 1.5rem;
    line-height: 1.5rem;
    box-sizing: border-box;
    width: 1.5rem;
    border: 1px solid #ffffff88;
    border-radius: 0.5rem;
  }
  .choosing_option_item_wrap {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    align-items: center;
    .choosing_option_item {
      margin-right: 10px;
    }
  }
}

.choosing_option_item_group_mixed {
  display: flex;
}
</style>