<template>
<div class="wrapper">
  <nuxt class="container" />
</div>
</template>

<script>
  import AppNav from '~/components/AppNav.vue'
  export default {
    components: {
      AppNav
    }
  }
</script>

<style lang="scss" scoped>
.wrapper {
}
.container
{
  max-width: 1280px;
  min-height: 90vh;
  margin: auto;
  padding-bottom: 20px;
  @media (max-width: 1000px) {
    max-width: 960px;
  }
}
</style>

