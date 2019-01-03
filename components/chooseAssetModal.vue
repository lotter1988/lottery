<template>
    <no-ssr>
      <modal name="choose-assets-modal" class="choose-assets-modal" :width="modalWidth" :height="modalHeight" :pivotX="modalPivotX" :pivotY="modalPivotY">
        <div class="modal-inner">
          <div class="top"><strong>CHOOSE A COIN</strong></div>
          <div class="assets">
            <a class="asset-item" :key="asset.assetId" v-for="asset in assets" @click="choose(asset)">
              <img :src="asset.icon_url"/>
              <span>{{asset.symbol}}</span>
            </a>
          </div>
        </div>
      </modal>
    </no-ssr>
</template>


<script>
import _ from 'lodash'
export default {
  props: {
    assets: {}
  },
  data () {
    return {}
  },
  computed: {
    modalWidth () {
      if (!process.server) {
        if (window.innerWidth > 736) {
          return '420px'
        } else {
          return window.innerWidth + 'px'
        }
      }
      return '100%'
    },
    modalHeight () {
      if (!process.server) {
        if (window.innerWidth > 736) {
          return 'auto'
        } else {
          return 'auto'
        }
      }
      return 'auto'
    },
    modalPivotX () {
      if (!process.server) {
        if (window.innerWidth <= 736) {
          return 0
        }
      }
      return 0.5
    },
    modalPivotY () {
      if (!process.server) {
        if (window.innerWidth <= 736) {
          return 0.5
        }
      }
      return 0.5
    }
  },
  methods: {
    choose (asset) {
      this.$emit('onChoose', asset)
    },
    show () {
      this.$modal.show('choose-assets-modal');
    },
    hide () {
      this.$modal.hide('choose-assets-modal');
    }
  }
}
</script>

<style lang="scss" scoped>
  .assets {

  }
  .modal-inner {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .top {
    padding: 10px 0;
    text-align: center;
    width: 100%;
  }
  .assets {
    flex-grow: 1;
    padding: 0 10px 10px 10px;
    overflow: auto;
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: center;
    align-content: flex-start;
    .asset-item {
      margin-bottom: 0px;
      // height: 80px;
      width: 80px;
      padding: 20px;
      // display: flex;
      // flex-direction: column;
      // justify-content: center;
      // align-items: center;
      text-align: center;
      flex: 0;
      img {
        width: 40px;
        height: 40px;
        margin-bottom: 0px;
        border-radius: 99em;
      }
      span {
        color: #ddd;
        text-align: center;
        font-size: 12px;
      }
    }
    .asset-item:hover {
      background: rgba(0,0,0,0.2);
      border-radius: 8px;
    }
  }
@media (max-width: 736px) {
  .assets {
    padding-left: 0;
    padding-right: 0;
    .asset-item {
      padding: 16px;
    }
  }
}
</style>
