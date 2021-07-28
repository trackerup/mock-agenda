<template>
  <div class="content-component component-signature">
    <div class="mdl-grid">
      <div class="container-button col">
        <button class="button" @click="start" :class="{ 'inative': isActive }">
          <i class="material-icons">check</i>
          <span>{{ $t('Colher') }}</span>
        </button>
        <button class="button" @click="save" :class="{ 'inative': !isActive }">
          <i class="material-icons">check</i>
          <span>{{ $t('Salvar') }}</span>
        </button>
      </div>
      <div class="container-button col">
        <button class="button" @click="clear">
          <i class="material-icons">close</i>
          <span>{{ $t('Limpar') }}</span>
        </button>
      </div>
      <div class="ajsute-layout-legado"></div>
    </div>
    <div class="scroll-ativo" :class="{ 'inative': isActive }"></div>
    <div id="canvas">
      <canvas id="newSignature" class="signature"></canvas>
    </div>
  </div>
</template>
<script>
import { empty } from '../../utils'

export default {
  name: 'MySignaturePad',
  props: {
    value: {
      type: String,
      required: false,
      default: ''
    }
  },
  data () {
    return {
      isActive: false,
      mousePressed: false,
      canvas: null,
      context: null,

      pixels: [],
      xyLast: {},
      calculate: false,
      xyAddLast: {},
      cpixels: [],
      disableSave: true
    }
  },
  mounted () {
    this.$forceUpdate()
    this.canvas = document.getElementById('newSignature')
    this.context = this.canvas.getContext('2d')
    this.context.canvas.width = window.innerWidth - 52
    this.context.canvas.height = 265
    this.context.fillStyle = '#fff'

    if (empty(!this.value)) {
      var img = new Image()
      img.onload = function () {
        this.context.drawImage(img, 0, 0)
        // Or at whatever offset you like
      }.bind(this)
      img.src = this.value
    }
  },
  methods: {
    start () {
      this.isActive = true
      this.signatureCapture()
    },
    signatureCapture () {
      this.context.fillStyle = '#fff'
      this.context.strokeStyle = '#000'
      this.context.lineWidth = 2
      this.context.lineCap = 'round'

      this.canvas.addEventListener('touchstart', this.on_mousedown, false)
      this.canvas.addEventListener('mousedown', this.on_mousedown, false)
    },
    on_mousedown (e) {
      if (e.cancelable) {
        e.preventDefault()
      }
      e.stopPropagation()

      this.canvas.addEventListener('mouseup', this.on_mouseup, false)
      this.canvas.addEventListener('mousemove', this.on_mousemove, false)
      this.canvas.addEventListener('touchend', this.on_mouseup, false)
      this.canvas.addEventListener('touchmove', this.on_mousemove, false)

      document.body.addEventListener('mouseup', this.on_mouseup, false)
      document.body.addEventListener('touchend', this.on_mouseup, false)

      var xy = this.get_coords(e)
      this.context.beginPath()
      this.pixels.push('moveStart')
      this.context.moveTo(xy.x, xy.y)
      this.pixels.push(xy.x, xy.y)
      this.xyLast = xy
    },
    on_mousemove (e, finish) {
      if (e.cancelable) {
        e.preventDefault()
      }
      e.stopPropagation()
      var xy = this.get_coords(e)
      var xyAdd = {
        x: (this.xyLast.x + xy.x) / 2,
        y: (this.xyLast.y + xy.y) / 2
      }

      if (this.calculate) {
        var xLast = (this.xyAddLast.x + this.xyLast.x + xyAdd.x) / 3
        var yLast = (this.xyAddLast.y + this.xyLast.y + xyAdd.y) / 3
        this.pixels.push(xLast, yLast)
      } else {
        this.calculate = true
      }

      this.context.quadraticCurveTo(this.xyLast.x, this.xyLast.y, xyAdd.x, xyAdd.y)
      this.pixels.push(xyAdd.x, xyAdd.y)
      this.context.stroke()
      this.context.beginPath()
      this.context.moveTo(xyAdd.x, xyAdd.y)
      this.xyAddLast = xyAdd
      this.xyLast = xy
    },
    on_mouseup (e) {
      this.remove_event_listeners()
      this.disableSave = false
      this.context.stroke()
      this.pixels.push('e')
      this.calculate = false
      this.$emit('input', this.canvas.toDataURL('image/jpeg', 1.0))
    },
    get_coords (e) {
      var x, y

      if (e.changedTouches && e.changedTouches[0]) {
        var bounds = this.canvas.getBoundingClientRect()
        x = e.changedTouches[0].pageX - bounds.left
        y = e.changedTouches[0].pageY - bounds.top
      } else if (e.layerX || e.layerX == 0) {
        x = e.layerX
        y = e.layerY
      } else if (e.offsetX || e.offsetX == 0) {
        x = e.offsetX
        y = e.offsetY
      }
      return {x: x, y: y}
    },
    remove_event_listeners () {
      this.canvas.removeEventListener('mousemove', this.on_mousemove, false)
      this.canvas.removeEventListener('mouseup', this.on_mouseup, false)
      this.canvas.removeEventListener('touchmove', this.on_mousemove, false)
      this.canvas.removeEventListener('touchend', this.on_mouseup, false)

      document.body.removeEventListener('mouseup', this.on_mouseup, false)
      document.body.removeEventListener('touchend', this.on_mouseup, false)
    },
    save () {
      // save canvas image as data url (png format by default)
      var dataUrl = this.canvas.toDataURL('image/png', 1.0)
      if (dataUrl) {
        this.$emit('input', dataUrl)
      }
      this.isActive = false
    },
    clear () {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
      this.$emit('input', '')
    },
    onBegin () {
      this.$refs.signaturePad.resizeCanvas()
      document.querySelector('#card-content').style.overflowY = 'hidden'
    },
    onEnd () {
      document.querySelector('#card-content').style.overflowY = 'scroll'
      const {isEmpty, data} = this.$refs.signaturePad.saveSignature()
      if (!isEmpty) {
        this.$emit('input', data)
      }
    }
  },
  beforeDestroy () {
    if (this.isActive) {
      var dataUrl = this.canvas.toDataURL('image/png', 1.0)
      this.$emit('input', dataUrl)
    }
  }
}
</script>
<style lang="scss" scoped>
 .content-component {
  box-sizing: border-box;
  position: relative;
}
.inative {
  display: none;
}
.component-signature .mdl-grid {
  margin: 0;
  width: 100%;
  position: relative;
}
.container-button {
  z-index: 99;
  .button {
    outline: none;
  }
}
.ajsute-layout-legado {
  z-index: 98;
  box-sizing: border-box;
  display: block;
  height: 20px;
  position: absolute;
  bottom: 0;
  left: 0;
  border: solid #939598 1px;
  border-bottom: none;
  width: 100%;
}

.is-invalid .signature {
  border-color: #f00 !important;
}

.scroll-ativo {
  position: absolute;
  width: 100%;
  bottom: 0;
  height: 246px;
}

.signature {
  -webkit-border-radius: 0 0 15px 15px;
  -moz-border-radius: 0 0 15px 15px;
  border-radius: 0 0 15px 15px;
  border: solid #939598 1px;
  border-top:none;
}
</style>
