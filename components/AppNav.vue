<template>
  <div class="nav-bar">
    <div class="nav-top">
      <AppLogo />
      <div class="space"></div>
    </div>
  </div>
</template>

<script>
import AppLogo from "~/components/AppLogo"
export default {
  components: {
    AppLogo
  },
  data: function () {
    return {
      isOpen: false
    }
  },
  computed: {
    isLogin () {
      return this.$store.state.profile && this.$store.state.profile.token
    },
    isLottery () {
      return this.$route.path.search('lottery') !== -1
    },
    username () {
      if (!this.isLogin) {
        return ''
      }
      return this.$store.state.profile.name
    },
    menuItems () {
      let items = [
        { name: 'log', label: 'LOGS', url: '/logs'},
        { name: 'fair', label: 'FAIR', url: '/fairness'}
      ]
      return items
    }
  },
  methods: {
    triggerMenu() {
      this.isOpen = !this.isOpen
    },    
    isActive (name) {
      let curPath = this.$nuxt.$route.path
      let path = curPath.split('/').filter((x) => {
        return x !== 'index.html'
      })
      if (path.length > 2) {
        return name === path[2]
      } else {
        return name === 'home'
      }
      return false
    },
    activeNavCls (name) {
      return this.isActive(name) ? 'active' : ''
    },
    onProfile () {
      this.$router.push(`/${this.$i18n.locale}/profile`)
    },
    onSignup () {
      this.$router.push(`/${this.$i18n.locale}/signup`)
    },
    onLogin () {
      this.$router.push(`/${this.$i18n.locale}/login`)
    }
  }
}
</script>


<style scoped lang="scss">
.nav-bar {
  min-height: 60px;
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  padding: 0 20px;
  flex-direction: row;
  align-items: center;
  // justify-content: center;
  @media (max-width: 1000px) {
    max-width: 960px;
  }
}
.nav-top {
  display: flex;
  min-height: 60px;
  justify-content: center;
  align-items: center;
  width: 100%;
}
.nav-menu-trigger
{
  display: none;
  height: 40px;
  width: 40px;
  align-items: flex-end;
  justify-content: flex-end;
  position: relative;
  margin-right: -8px;
}
.nav-menu-trigger > .line
{
  position: absolute;
  width: 22px;
  height: 2px;
  top: 12px;
  left: 10px;
  background: rgba(221, 127, 91, 1);
  display: block;
  transform-origin: 10px;
  content: "";
}
.nav-menu-trigger > .line-2
{
  top: 18px;
}
.nav-menu-trigger > .line-3
{
  top: 24px;
}
.space {
  flex: 1;
}
.nav-menu {
  display: flex;
  justify-self: flex-end;
  flex-direction: row;
}
.nav-menu-inner {
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}
.nav-menu-item.active {
  opacity: 1;
  .link {
    color: #3377E8;
  }
}
.nav-menu-item {
  display: flex;
  flex-direction: row;
  text-align: left;
  margin-right: 40px;
  align-items: center;
  height: 40px;
  .link {
    text-decoration: none;
    display: flex;
    align-items: center;
    color: white;
  }
}
.login-button {
  margin-right: 20px;
}

@media (max-width: 736px)
{
  .nav-bar {
    flex-direction: column;
  }
  .nav-menu-trigger
  {
    display: flex;
  }
  .nav-menu-trigger > .line
  {
    transition: transform 0.2s ease;
  }
  .nav-menu-trigger.open > .line-1
  {
    transform: rotateZ(45deg) translateY(3px) translateX(1px);
  }
  .nav-menu-trigger.open > .line-2
  {
    transform: rotateZ(-45deg) translateY(-2px);
  }
  .nav-menu-trigger.open > .line-3
  {
    transform: rotateZ(-45deg) translateX(4px) translateY(-6px);
  }
  .nav-menu
  {
    flex-direction: column;
    width: 100%;
    .nav-menu-inner
    {
      overflow: hidden;
      height: 0;
      flex-direction: column;
      transition: all 0.2s ease;
      button {
        margin: 2px 10px 20px 10px;
      }
    }
  }
  .nav-menu.open
  {
    padding: 5px 0 10px 0;
    .nav-menu-inner
    {
      border-bottom: 1px solid rgba(255,255,255,0.1);
      height: auto;
    }
  }
  .nav-menu-item {
    justify-content: center;
    margin: 0 0 4px 0;
  }
}
</style>

