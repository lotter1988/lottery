
export const state = () => ({
  locales: ['en', 'zh'],
  locale: 'en',
  defaultAsset: {}
})
  
export const mutations = {
  SET_LANG(state, locale) {
    if (state.locales.indexOf(locale) !== -1) {
      state.locale = locale
    }
  },
  SET_DEFAULT_ASSET(state, defaultAsset) {
    state.defaultAsset = defaultAsset
  }
}