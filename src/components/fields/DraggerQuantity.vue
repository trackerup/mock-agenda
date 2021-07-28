<template>
  <div class="mdl-layout mdl-alignment-center-center qnt">
      <div class="mdl-layout-item mdl-size-30">
        <span class="mdl-caption orange"> {{ $t('Quantidade:') }} </span>
      </div>
      <div class="mdl-layout-item mdl-size-70">
        <range-slider
            class="slider"
            min="01"
            max="50"
            step="01"
            v-model="sliderValue">
        </range-slider>
      </div>
    </div>
</template>

<script>
import RangeSlider from 'vue-range-slider'

export default {
  name: 'DraggerQuantity',
  props: {
    model: {
      type: Number,
      required: true,
      default: 1
    }
  },
  data () {
    return {
      sliderValue: this.model,
      dialog: false
    }
  },
  components: {
    RangeSlider
  },
  mounted () {
    let b = ('0' + this.sliderValue).slice(-2)
    let a = document.getElementsByClassName('range-slider-knob')
    if (a[0] != undefined) {
      a[0].innerHTML = b
    }
  },
  watch: {
    model (value) {
      this.sliderValue = value
    },
    sliderValue () {
      this.$emit('changedSliderValue', this.sliderValue)

      let b = ('0' + this.sliderValue).slice(-2)
      let a = document.getElementsByClassName('range-slider-knob')
      if (a[0] != undefined) {
        a[0].innerHTML = b
      }
    }
  }
}
</script>

<style type="scss">
  @import 'vue-range-slider/dist/vue-range-slider.css';
.qnt{
  margin-top: 50px;
}
.slider {
  /* overwrite slider styles */
  width: 100%;
}
.range-slider-knob{
  color: #FFF;
  font-size: 12px;
  background-color: rgba(0, 0, 0, 0) !important;
  border: none !important;
  box-shadow: none;
  width:4px;
  height: 0px;
  bottom: 15px !important;
  padding-bottom: 50px;
  top: unset !important;
  position: relative;
  text-align:center;
}
.range-slider-knob:before{
  display: block;
  content: '';
  color:#FFF;
  background-image: url('../../assets/shared/pin.svg');
  background-repeat: no-repeat;
  background-size: 40px 60px;
  height: 60px;
  width: 40px;
  margin-top: -5px;
  margin-left: -12px;
  position: absolute;
  z-index: -1;
}
.range-slider-rail{
  background-color: rgba(151, 201, 59, 0.3) !important;
  height: 1px;
}
.range-slider-fill{
  background-color: #99c750;
  height: 1px;;
}
</style>
