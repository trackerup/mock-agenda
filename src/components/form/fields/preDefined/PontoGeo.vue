<template>
  <div class="inputPredefinedPontogeo">
    <label v-html="texto"></label>
    <div class="pontoGeoValue">
      <img :src="componentValue" v-if="!errorImage"/>
      <img src="@/assets/shared/baseline_warning_black_18dp.png" v-else/>
      <p>{{ textValue }}</p>
    </div>
  </div>
</template>
<script>
export default {
  name: 'PontoGeo',
  props: {
    texto: {
      type: String,
      required: false
    },
    value: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      componentValue: this.value,
      textValue: '',
      errorImage: false
    }
  },
  watch: {
    value: {
      handler: async function (valor) {
        this.componentValue = valor
        await this.handleValue()
      },
      immediate: true,
      deep: true
    }
  },
  async beforeMount () {
    this.handleValue()
  },
  mounted () {
    this.$emit('input', this.componentValue)
  },
  methods: {
    async handleValue () {
      try {
        this.textValue = ''
        if (typeof (this.componentValue.lat) != 'number' || typeof (this.componentValue.lng) != 'number') {
          return false
        }
        let comma = false
        if (this.componentValue.lat) {
          this.textValue += this.componentValue.lat
          comma = true
        }

        if (this.componentValue.lng) {
          if (comma) {
            this.textValue += ', '
          }
          this.textValue += this.componentValue.lng
          comma = true
        }

        if (this.componentValue.endereco) {
          if (comma) {
            this.textValue += ', '
          }
          this.textValue += this.componentValue.endereco
          comma = true
        } else {
          comma = false
        }
        await this.imageExists(this.componentValue, this, this.setImage)
      } catch (e) {
        this.componentValue = '-'
      }
    },
    getValue () {
      this.$emit('input', this.componentValue)
      return this.componentValue
    },
    setImage (value) {
      this.componentValue = value
    },
    imageExists (data, that, callback) {
      let value = 'http://maps.googleapis.com/maps/api/staticmap?' +
          'size=300x169' +
          '&maptype=roadmap' +
          '&markers=color:red%7Clabel:.%7C' + data.lat + ',' + data.lng +
          '&key=AIzaSyBD1aOJIDLTR81Cwv_B_aI8am_R7aCujLA'
      let img = new Image()
      img.onload = function () {
        callback(value)
      }
      img.onerror = function () {
        that.setErrorImage()
      }
      img.src = value
      return img
    },
    setErrorImage: function () {
      this.errorImage = true
    }
  }
}
</script>

<style scoped>
  .pontoGeoValue {
    text-align: center;
  }
</style>
