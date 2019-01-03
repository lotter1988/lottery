import axios from 'axios'
import md5 from "js-md5"
const API_BASE = "https://api.mixin.bet/lottery"

export default {
  data() {
    return {
      deviceId: '',
      deviceName: '',
      deviceVersion: '',
      MD5_SALT: 'lottery'
    }
  },
  mounted() {
    this.getDeviceId()
    this.getBrowserInfo()
  },
  methods: {
    getDeviceId() {
      if (!process.server && this.deviceId.length === 0) {
        setTimeout(() => {
          let Fingerprint2 = require('fingerprintjs2')
          new Fingerprint2().get((result, components) => {
            this.deviceId = result.toUpperCase() // a hash, representing your device fingerprint
          }, 100)
        })
      }
    },
    getBrowserInfo() {
      if (!process.server && this.deviceName.length === 0) {
        var nVer = navigator.appVersion;
        var nAgt = navigator.userAgent;
        var browserName = navigator.appName;
        var fullVersion = '' + parseFloat(navigator.appVersion);
        var nameOffset, verOffset;

        // In Opera, the true version is after "Opera" or after "Version"
        if ((verOffset = nAgt.indexOf("Opera")) !== -1) {
          browserName = "Opera";
          fullVersion = nAgt.substring(verOffset + 6);
          if ((verOffset = nAgt.indexOf("Version")) !== -1)
            fullVersion = nAgt.substring(verOffset + 8);
        }
        // In MSIE, the true version is after "MSIE" in userAgent
        else if ((verOffset = nAgt.indexOf("MSIE")) !== -1) {
          browserName = "Microsoft Internet Explorer";
          fullVersion = nAgt.substring(verOffset + 5);
        }
        // In Chrome, the true version is after "Chrome"
        else if ((verOffset = nAgt.indexOf("Chrome")) !== -1) {
          browserName = "Chrome";
          fullVersion = nAgt.substring(verOffset + 7);
        }
        // In Safari, the true version is after "Safari" or after "Version"
        else if ((verOffset = nAgt.indexOf("Safari")) !== -1) {
          browserName = "Safari";
          fullVersion = nAgt.substring(verOffset + 7);
          if ((verOffset = nAgt.indexOf("Version")) !== -1)
            fullVersion = nAgt.substring(verOffset + 8);
        }
        // In Firefox, the true version is after "Firefox"
        else if ((verOffset = nAgt.indexOf("Firefox")) !== -1) {
          browserName = "Firefox";
          fullVersion = nAgt.substring(verOffset + 8);
        }
        // In most other browsers, "name/version" is at the end of userAgent
        else if ((nameOffset = nAgt.lastIndexOf(' ') + 1) < (verOffset = nAgt.lastIndexOf('/'))) {
          browserName = nAgt.substring(nameOffset, verOffset);
          fullVersion = nAgt.substring(verOffset + 1);
          if (browserName.toLowerCase() === browserName.toUpperCase()) {
            browserName = navigator.appName;
          }
        }
        this.deviceName = `Mixin Portal (${browserName} ${navigator.platform})`
        this.deviceVersion = fullVersion
      }
    },
    formNormalResponse(method, url, fields, cfg = {}) {
      this.getDeviceId()
      this.getBrowserInfo()
      let payload = Object.assign({}, fields)
      var config = {
        method: method,
        url: url,
        headers: {},
        timeout: 10000,
        withCredentials: true
      }
      if (method === 'get' || method === 'delete') {
        config.params = fields
      } else {
        config.data = payload
      }
      config = Object.assign({}, config, cfg)
      return new Promise((resolve, reject) => {
        axios.request(config)
          .then((resp) => {
            if (resp.data) {
              let data = resp.data
              resolve(data)
            } else {
              console.error('Incorrect response format.', resp)
            }
          }).catch((err) => {
            window.dd = err
            if (err.status === 401) {
              this.$router.push({ name: 'login-page', params: {} })
              return
            }
            reject(err)
          })
      })
    },
    getActiveLotteries() {
      const url = `${API_BASE}/games/active`
      return this.formNormalResponse('get', url, {})
    },
    getAssetGames(assetId) {
      const url = `${API_BASE}/games?asset=${assetId}`
      return this.formNormalResponse('get', url, {})
    },
    getTraceIdRecord(traceId) {
      const url = `${API_BASE}/game?trace_id=${traceId}`
      return this.formNormalResponse('get', url, {})
    },
    getLottery(id) {
      const url = `${API_BASE}/game/${id}`
      return this.formNormalResponse('get', url, {})
    }
  }
}