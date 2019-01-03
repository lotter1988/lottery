<template>
  <h1 class="logo" :class="pos">
    <nuxt-link to="/"><img class='lottery-logo' src="~/assets/images/lottery.png" /><span class='seo-title'>{{$t('seo.lottery')}}</span></nuxt-link>
  </h1>
</template>

<script>
export default {
  props: {
    pos: ''
  },
  computed: {
    isLottery () {
      return this.$route.path.search('lottery') !== -1
    }
  }
}
</script>


<style lang="scss">
.logo {
  a {
    display: flex;
    align-items: center;
  }
  .logo-text {
    /* GBI.news: */
    font-size: 1px;
    text-indent: -10000em;
    color: #000000;
    letter-spacing: -0.56px;
    margin-right: 0;
    background: transparent url(~/assets/images/logo.png) center center no-repeat;
    background-size: contain;
    // background-position-x: 32px;
    width: 130px;
    height: 60px;
  }
  .lottery-logo {
    display: flex;
    align-items:center; 
    height: 36px;
  }
  .seo-title{
    font-size: 1px;
    text-indent: -10000em;
    color: #000000;
    letter-spacing: -0.56px;
    margin-right: 0;
  }
  .logo-icon {
    display: block;
    width: 32px;
    height: 32px;
    border-radius: 4px;
    background: transparent url(~/assets/images/logo-icon.png) center center no-repeat;
    background-size: contain;
  }
}
.logo.center {
  a {
    background-position-x: 0;
    margin: 0 auto;
  }
}
</style>

