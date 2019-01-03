<template>
  <div>
    <no-ssr>
      <app-nav></app-nav>
    </no-ssr>
    <div v-show="childPage" class="lottery-container">
      <div class="game-table" v-show="resultReady">
        <div class="pane status-pane">
          <div class="status">{{$t("pages.lottery.result_title")}}</div>
          <div class="status-hint">{{resultContent1}}</div>
          <div class="status-hint">{{resultContent2}}</div>
          <div>
            <img src="@/assets/images/win-bg.png" width="220">
          </div>
          <div class="status-hint">{{resultContent3}}</div>
          <div class="button-wrapper">
            <button class="button alt" @click="onGoBack">{{$t('pages.lottery.back_to_lottery')}}</button>
          </div>
        </div>
      </div>

      <div class="right" v-show="resultReady">
        <div class="history pane">
          <div class="record-header">
            <!-- <div class="record-field record-field-asset">{{$t('pages.lottery.record_header_asset')}}</div> -->
            <div class="record-field record-field-time">{{$t('pages.lottery.record_header_time')}}</div>
            <div class="record-field record-field-result">Mixin ID</div>
            <div
              class="record-field record-field-rewards"
            >{{$t('pages.lottery.record_header_reward')}}</div>
          </div>
          <div class="records">
            <div class="record" v-for="record in records" v-bind:key="record.snapshot_id">
              <!-- <div class="record-icon" :class="record.asset.symbol"></div> -->
              <div class="record-field record-field-time">
                <span class="bet-time">{{recordTimeDisplayed(record)}}</span>
                <span class="bet-date">{{recordDateDisplayed(record)}}</span>
              </div>
              <div class="result record-field record-field-result">
                <span>{{ record.user_id }}</span>
              </div>
              <div class="reward record-field record-field-rewards">
                <span>{{record.status === 4 ? $t("pages.lottery.result_rewrad_winner"):$t("pages.lottery.result_rewrad_loser")}}</span>
                <span v-show="record.status ===4">{{record.reward + " " + asset.symbol}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-show="!childPage" class="lottery-container">
      <div class="game-table">
        <no-ssr>
          <asset-item
            class="switch-item"
            :asset="currentMyAsset"
            borderRadius="4px"
            backgroundImage="linear-gradient(-158deg, #343944 0%, #434853 96%)"
            select="true"
            @click="showChooseAssetModal"
          />
        </no-ssr>
        <div class="pane">
          <div class="pane-title">{{$t('pages.lottery.pane_title_how_many_shares')}}</div>
          <div class="bet-content">
            <div class="bet-entry entry">
              <div class="coin-chooser">
                <div class="coin-chooser-icon" @click="minusShares">
                  <span class="add-minus">-</span>
                </div>
              </div>
              <span class="bet-input entry-input">{{betValue}}</span>
              <div class="coin-chooser">
                <div class="coin-chooser-icon right" @click="addShares">
                  <span class="add-minus">+</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="pane summary-pane">
          <div class="form-hint">{{$t('pages.lottery.current_status_title')}}</div>
          <div class="summary-cols">
            <div class="summary-col">
              <div class="col-title">{{$t('pages.lottery.current_status_avail')}}</div>
              <div class="col-value">{{currentGame.avail_shares}}</div>
            </div>
            <div class="summary-col">
              <div class="col-title">{{$t('pages.lottery.current_status_total')}}</div>
              <div class="col-value">{{currentGame.total_shares}}</div>
            </div>
            <div class="summary-col">
              <div class="col-title">{{$t('pages.lottery.current_status_price')}}</div>
              <div class="col-value">{{currentGame.share_price}} {{currentAsset.symbol}}</div>
            </div>
          </div>
        </div>

        <div v-show="getPaid" class="pane status-pane">
          <div class="status">{{$t('pages.lottery.status_title_result')}}</div>
          <div class="status-hint">{{$t('pages.lottery.status_hint_result')}}</div>
          <div class="button-wrapper">
            <button class="button alt" @click="onGoBack">{{$t('pages.lottery.btn_buy_another')}}</button>
          </div>
        </div>
        <div v-show="!getPaid" class="pane order-pane">
          <div id="scan" :name="$t('pages.lottery.pay_way')">
            <div>
              <div v-show="isMobile">
                <div class="button-wrapper">
                  <button class="button" @click="onMixinPay">{{$t('pages.lottery.btn_mixin_pay')}}</button>
                </div>
              </div>
              <div v-show="!isMobile">
                <div class="qrcode">
                  <no-ssr>
                    <vue-qr :value="paymentUrl" :options="{ width: 180,margin: 0 }"></vue-qr>
                  </no-ssr>
                </div>
                <div class="hint">
                  <p>{{$t('pages.lottery.order_hint', {app: 'Mixin Messenger'})}}</p>
                </div>
              </div>
              <div v-show="!isMobile" class="button-wrapper button-wrapper-paid">
                <button class="button alt" @click="onPaid">{{$t('pages.lottery.btn_paid')}}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="right">
        <div class="history pane">
          <div class="record-header">
            <div class="record-field record-field-time">{{$t('pages.lottery.record_header_time')}}</div>
            <div
              class="record-field record-field-result"
            >{{$t('pages.lottery.record_header_result')}}</div>
            <div
              class="record-field record-field-rewards"
            >{{$t('pages.lottery.record_header_reward')}}</div>
          </div>
          <div class="records">
            <div
              class="record"
              @click="onHistoryClick(record.id,record.status)"
              v-for="record in historyRecords"
              v-bind:key="record.id"
            >
              <div class="record-field record-field-time">
                <span class="bet-time">{{recordTimeDisplayed(record)}}</span>
                <span class="bet-date">{{recordDateDisplayed(record)}}</span>
              </div>
              <div class="result record-field record-field-result">
                <span>{{ record.winner ?record.winner : 'Lottery has not been awarded'}}</span>
              </div>
              <div class="reward record-field record-field-rewards">
                <span>{{record.status === 0 ? $t('pages.lottery.status_reward_continue'):$t('pages.lottery.status_reward_finish')}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <no-ssr>
      <choose-asset-modal ref="chooseAssetModal" :assets="assets" @onChoose="onAssetChoose"></choose-asset-modal>
    </no-ssr>
  </div>
</template>

<script>
import _ from "lodash";
import uuidV4 from "uuid/v4";
import { Base64 } from "js-base64";
import msgpack from "msgpack-lite";
import NoSSR from "vue-no-ssr";
import LotteryHelper from "@/mixins/LotteryHelper";
import moment from "moment";
import { mapGetters, mapActions, mapState } from "vuex";
import AppNav from "~/components/AppNav.vue";
import AssetItem from "~/components/AssetItem.vue";
import chooseAssetModal from "~/components/chooseAssetModal.vue";

const HOUSE_EDGE = 0.02;
let components = {
  "no-ssr": NoSSR,
  "app-nav": AppNav,
  "asset-item": AssetItem,
  chooseAssetModal: chooseAssetModal
};

export default {
  head() {
    return {
      title: this.$t("seo.lottery"),
      meta: [
        { hid: "title", name: "title", content: this.$t("seo.lottery") },
        { hid: "keywords", name: "keywords", content: this.$t("seo.keywords") },
        {
          hid: "twitter:title",
          name: "twitter:title",
          content: this.$t("seo.lottery")
        },
        {
          hid: "og:title",
          name: "og:title",
          property: "og:title",
          content: this.$t("seo.lottery")
        }
      ]
    };
  },

  data() {
    return {
      betValue: 1,
      loading: false,
      historyRecords: [],
      traceId: "",
      getPaid: false,
      betResult: -1,
      isSigned: false,
      token: "",
      resultRecord: null,
      currentAsset: {},
      currentGame: {},
      games: [],
      assets: [],
      timeout: "",

      // child page datas
      childPage: false,
      gameId: null,
      resultReady: false,
      asset: {
        asset_id: null,
        name: null,
        symbol: null
      },
      created_at: "",
      share_price: 0,
      total_shares: 0,
      status: 1,
      winner: null,
      records: []
    };
  },
  components: components,
  mixins: [LotteryHelper],
  computed: {
    isMobile() {
      if (process.browser) {
        let os = this.getOperatingSystem();
        return os === "android" || os === "ios";
      } else {
        return false;
      }
    },
    resultContent1() {
      return this.$t("pages.lottery.result_content1", {
        symbol: this.asset.symbol,
        name: this.asset.name
      });
    },
    resultContent2() {
      const theReward = this.total_shares * this.share_price;
      return this.$t("pages.lottery.result_content2", {
        amount: this.total_shares,
        total: theReward
      });
    },
    resultContent3() {
      return this.$t("pages.lottery.result_content3", { id: this.winner });
    },
    tooMuch() {
      let max = this.getMaxShareValue(this.currentAsset, this.payout);
      return max + this.currentAsset.min < parseFloat(this.betValue);
    },
    hasEnoughAssets() {
      if (this.currentAsset.balance * HOUSE_EDGE >= this.betValue) {
        return true;
      }
      return false;
    },
    processStyle() {
      let lowStyle = {
        "background-image":
          "linear-gradient(-154deg, #E53726 0%, #FF7330 100%)",
        "border-radius": "5px"
      };
      let highStyle = {
        "background-image":
          "linear-gradient(-154deg, #264EE5 0%, #30BAFF 100%)",
        "border-radius": "5px"
      };
      return this.isRollLow ? lowStyle : highStyle;
    },
    payout() {
      return this.calPayout(this.isRollLow ? this.chance + 1 : this.chance);
    },
    paymentUrl() {
      let memo = this.traceId;
      memo = msgpack.encode(memo);
      const betPrice =
        this.betValue *
        (this.getGame(this.currentAsset)
          ? parseFloat(this.getGame(this.currentAsset).share_price)
          : 1);
      let url = this.createPayment({
        symbol: this.currentAsset.symbol,
        recipient: "4257607c-1995-47e2-9420-bd503abff346",
        traceId: this.traceId,
        amount: betPrice,
        memo: memo
      });
      return url;
    },
    currentMyAsset() {
      for (let i = 0; i < this.assets.length; i += 1) {
        if (this.currentAsset.asset_id === this.assets[i].asset_id) {
          return this.assets[i];
        }
      }
      return {};
    }
  },
  created() {
    const { game } = this.$route.query;
    if (game) {
      this.childPage = true;
      this.gameId = game;
      this.getLottery(game)
        .then(resp => {
          this.resultReady = true;
          this.asset = resp.asset;
          this.records = resp.records;
          this.created_at = resp.created_at;
          this.winner = resp.winner;
          this.total_shares = resp.total_shares;
          this.status = resp.status;
          this.share_price = parseFloat(resp.share_price);
        })
        .catch(err => {
          this.childPage = false;
        });
    } else {
      this.childPage = false;
    }
    this.fetchAssets();
    this.traceId = uuidV4();
  },
  beforeDestroy() {
    clearTimeout(this.timeout);
  },
  methods: {
    onHistoryClick(id, status) {
      if (status !== 0) {
        clearTimeout(this.timeout);
        this.childPage = true;
        this.resultReady = false;
        this.getLottery(id)
          .then(resp => {
            this.resultReady = true;
            this.asset = resp.asset;
            this.records = resp.records;
            this.created_at = resp.created_at;
            this.winner = resp.winner;
            this.total_shares = resp.total_shares;
            this.status = resp.status;
            this.share_price = parseFloat(resp.share_price);
          })
          .catch(err => {
            this.childPage = false;
          });
      }
    },
    onAssetChoose(asset) {
      const game = this.getGame(asset);
      this.currentGame = game;
      this.currentAsset = asset;
      this.betValue = 1;
      this.$store.commit("SET_DEFAULT_ASSET", asset.asset_id);
      this.hideChooseAssetModal();
      this.getGameHistory(asset.asset_id);
      this.traceId = uuidV4();
    },
    getGameHistory(asset_id) {
      this.getAssetGames(asset_id)
        .then(res => {
          this.historyRecords = res;
        })
        .catch(err => {
          this.historyRecords = [];
        });
    },
    canMinus(bet) {
      return bet - 1 > 0;
    },
    canAdd(bet) {
      return bet + 1 <= this.getAvaliShareValue(this.currentAsset);
    },
    fetchAssets() {
      this.getActiveLotteries().then(resp => {
        this.games = resp;
        if (resp) {
          let assets = resp.filter(x => !!x.asset).map(x => x.asset);

          assets.sort((a, b) => {
            return a.coinId > b.coinId ? 1 : -1;
          });
          this.assets = assets;
          // filter
          let current = assets[0];
          // get defaults
          for (let i = 0; i < this.assets.length; i += 1) {
            if (this.$store.state.defaultAsset === this.assets[i].asset_id) {
              current = this.assets[i];
            }
          }
          this.currentAsset = current;
          const game = this.getGame(current);
          this.currentGame = game;
          this.getGameHistory(current.asset_id);
        }
      });
    },
    minusShares() {
      if (this.canMinus(this.betValue)) {
        this.betValue -= 1;
      }
    },
    addShares() {
      if (this.canAdd(this.betValue)) {
        this.betValue += 1;
      }
    },
    getOperatingSystem: function() {
      var userAgent = navigator.userAgent || navigator.vendor || window.opera;
      var OSName = "unknown";
      if (/android/i.test(userAgent)) {
        OSName = "android";
      } else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        OSName = "ios";
      } else if (userAgent.indexOf("Win") !== -1) {
        OSName = "windows";
      } else if (userAgent.indexOf("Mac") !== -1) {
        OSName = "macos";
      } else if (userAgent.indexOf("X11") !== -1) {
        OSName = "linux";
      }
      return OSName;
    },
    calPayout(chance) {
      /*
        payout = 
        when chance = 0.95, payout = 1/0.95 * (1 - 0.02) = 1.03
        when chance = 0.05, payout = 1/0.05 * (1 - 0.02) = 19.6
        payout = 1/chance * (1 - houseEdge)
       */
      return (1 / (chance / 100)) * (1 - HOUSE_EDGE);
    },
    onPlayAgain() {
      if (process.browser) {
        window.location.reload();
      }
    },
    onGoBack() {
      if (process.browser) {
        this.$router.push("/");
        window.location = this.$route.path;
      }
    },
    onMixinPay() {
      if (process.browser) {
        window.location.href = this.paymentUrl;
        this.timeout = setTimeout(() => {
          this.checkTraceStatus();
        }, 1000);
      }
    },
    onPaid() {
      if (process.browser) {
        this.timeout = setTimeout(() => {
          this.checkTraceStatus();
        }, 1000);
      }
    },
    showChooseAssetModal() {
      if (this.$refs.chooseAssetModal) {
        this.$refs.chooseAssetModal.show();
      }
    },
    hideChooseAssetModal() {
      if (this.$refs.chooseAssetModal) {
        this.$refs.chooseAssetModal.hide();
      }
    },
    getAssetsBySymbol(symbol) {
      for (let i = 0; i < this.assets.length; i += 1) {
        if (this.assets[i].symbol === symbol) {
          return this.assets[i];
        }
      }
      return null;
    },
    recordDateDisplayed(record) {
      return moment(record.created_at).format("MM.DD");
    },
    recordTimeDisplayed(record) {
      return moment(record.created_at).format("hh:mm:ss");
    },
    getGame(asset) {
      if (!this.games) return null;
      if (typeof asset === "string") {
        return this.games.find(e => e.asset_id === asset);
      } else {
        return this.games.find(e => e.asset_id === asset.asset_id);
      }
    },
    getAvaliShareValue(asset) {
      return this.getGame(asset).avail_shares;
    },
    getMaxShareValue(asset) {
      return this.getGame(asset).total_shares;
    },
    createPayment({
      symbol,
      recipient,
      amount,
      traceId,
      memo = "",
      output = "url"
    }) {
      let base64Memo = ""; //= Base64.encode(memo)
      if (process.browser) {
        base64Memo = btoa(String.fromCharCode.apply(null, memo));
        if (output === "url") {
          base64Memo = encodeURIComponent(base64Memo);
        }
      }
      let asset = this.currentAsset;
      if (asset) {
        if (output === "url") {
          return `mixin://pay?amount=${amount}&asset=${
            asset.asset_id
          }&memo=${base64Memo}&recipient=${recipient}&trace=${traceId}`;
        } else {
          return {
            assetId: asset.asset_id,
            amount: amount + "",
            memo: base64Memo,
            trace: this.traceId
          };
        }
      }
    },
    checkTraceStatus() {
      let again = () => {
        this.timeout = setTimeout(() => {
          this.checkTraceStatus();
        }, 2000);
      };
      if (this.traceId === "") {
        again();
        return;
      }
      this.getTraceIdRecord(this.traceId)
        .then(resp => {
          if (resp) {
            this.fetchAssets();
            this.betValue = 1;
            this.traceId = uuidV4();
            this.getPaid = true;
          } else {
            again();
          }
        })
        .catch(err => {
          again();
        });
    }
  }
};
</script>

<style scoped lang="scss">
@import "~/assets/scss/variables.scss";

.lottery-container {
  padding: 10px 20px;
  display: flex;
}
.notify-bannar {
  background: rgba(204, 44, 74, 1);
  margin: 4px 20px;
  padding: 6px 10px 8px 10px;
  border-radius: 4px;
  // color: rgba(255, 84, 104, 1);
  a {
    color: rgba(204, 44, 74, 1);
    border-bottom: 1px solid;
  }
}
.right {
  @media (max-width: 1000px) {
    flex: 3;
  }
  flex: 4;
  margin-left: 20px;
}
.history {
  padding-top: 0;
  padding-left: 0;
  padding-right: 0;
  .record {
    overflow: hidden;
    position: relative;
    span {
      font-family: "Roboto-Mono-Regular", "Roboto", -apple-system,
        BlinkMacSystemFont, sans-serif;
      color: inherit;
    }
    span:last-child {
      font-family: "Roboto-Bold";
      opacity: 0.4;
    }
  }
  .record,
  .record-header {
    font-size: 14px;
    padding: 4px 10px 6px 10px;
    display: flex;
  }
  .record:nth-child(odd) {
    background: rgba(0, 0, 0, 0.2);
  }
  .record.win {
    .record-field-result > span:last-child {
      color: #fff;
      padding: 1px 4px;
      opacity: 1;
      border-radius: 3px;
      background: $color-success;
    }
  }
  .record.lose {
    .record-field-result > span:last-child {
      color: #fff;
      padding: 1px 4px;
      opacity: 1;
      border-radius: 3px;
      background: #555;
    }
  }
  .record-icon {
    position: absolute;
    background: transparent none center center no-repeat;
    height: 100%;
    top: 0;
    bottom: 0;
    width: 28px;
    margin-left: -20px;
    background-size: contain;
    opacity: 0.3;
  }
  .record-field {
    width: 80px;
    display: flex;
    flex-direction: column;
    flex: 4;
    justify-content: center;
    align-items: center;
  }
  .record-field-time {
    align-items: flex-start;
    flex: initial;
  }
  .record-field-result {
    align-items: flex-start;
    justify-content: center;
    flex: 2;
    a {
      color: inherit;
    }
  }
  .record-field-asset {
    flex: 0;
    flex-basis: 20px;
  }
  .record-field-bet {
    flex: 2;
  }
  .record-field-amount {
    align-items: flex-end;
    flex: initial;
  }
  .record-field-rewards {
    align-items: flex-end;
    flex: initial;
    width: 100px;
  }
  .record-header {
    opacity: 0.7;
    padding: 6px 10px;
    .record-field {
      text-transform: uppercase;
      font-family: "Roboto-Bold";
    }
  }
}
.game-table {
  flex: 2;
  // max-width: 400px;
  // margin: 0 auto;
}
.switch-pane {
  padding: 0;
  display: flex;
  .switch-item {
    padding: 10px;
    font-family: "Roboto-Bold";
    text-transform: uppercase;
    flex: 1;
    text-align: center;
    opacity: 0.8;
  }
  .switch-low {
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
  }
  .switch-high {
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
  }
  .switch-item.active {
    opacity: 1;
  }
  .switch-low.active {
    background: #cc2c4a;
  }
  .switch-high.active {
    background: #2e76d7;
  }
}
.number-slider {
  margin: 0 40px;
  padding: 70px 0 10px 0;
  height: 92px;
  .tooltip {
    position: relative;
    background: rgba(0, 0, 0, 0.8);
    box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.5);
    border-color: rgba(0, 0, 0, 0.8);
    border-radius: 20px;
    padding: 8px 16px;
    white-space: nowrap;
    margin-bottom: 8px;
    .dir {
      opacity: 0.5;
      font-size: 14px;
      color: #ffffff;
      letter-spacing: -0.53px;
      margin-right: 4px;
    }
    em {
      font-size: 22px;
      font-style: normal;
    }
    &::after {
      display: block;
      position: absolute;
      content: " ";
      width: 0;
      height: 0;
      border-color: rgba(0, 0, 0, 0.8) transparent transparent transparent;
      border-width: 10px;
      border-style: solid;
      bottom: 0;
      margin-bottom: -16px;
      left: 50%;
      margin-left: -10px;
    }
  }
}
.bet-content {
}
.coin-chooser {
  position: relative;
  height: 32px;
  .coin-chooser-icon {
    border-radius: 99em;
    width: 32px;
    height: 32px;
    background: transparent;
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      width: 100%;
      height: 100%;
      border-radius: 99em;
      background: transparent;
    }
    .add-minus {
      font-size: 40px;
      font-family: "Roboto-Mono-Regular", "Roboto", -apple-system,
        BlinkMacSystemFont, sans-serif;
    }
  }
  .right {
    position: relative;
    float: right;
  }
  .coin-chooser-select {
    position: absolute;
    font-size: 14px;
    padding-left: 40px;
    color: rgba(255, 255, 255, 0.6);
    height: 32px;
    opacity: 0;
    width: 100%;
  }
}
.bet-entry {
  margin: 10px 0;
  display: flex;
  flex-direction: row;
  .coin-chooser {
    flex: 1;
    width: 32px;
    color: #ffffff;
  }
  .bet-input {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    flex: 1;
  }
  .bet-unit {
    text-align: right;
    display: flex;
    justify-content: center;
    align-items: center;
    text-transform: uppercase;
    opacity: 0.6;
  }
}
.quick-ops {
  margin: 0 -10px -10px -10px;
  display: flex;
  flex-direction: row;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  .quick-op {
    padding: 8px 0;
    flex: 1;
    text-align: center;
    /* 2x: */
    font-size: 14px;
    color: #ffffff;
    letter-spacing: -0.27px;
    text-align: center;
    border-right: 1px solid rgba(255, 255, 255, 0.1);
  }
  .quick-op:last-child {
    border-right: none;
  }
}
.summary-pane {
  padding: 0;
  .summary-cols {
    display: flex;
    flex-direction: row;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    .summary-col {
      flex: 2;
      padding: 10px 10px 10px 10px;
      border-right: 1px solid rgba(255, 255, 255, 0.1);
    }
    .summary-col:last-child {
      flex: 3;
      border-right: none;
    }
    .col-title {
      /* Payout: */
      opacity: 0.5;
      font-size: 14px;
      color: #ffffff;
      letter-spacing: -0.27px;
      text-align: center;
      margin-bottom: 4px;
    }
    .col-value {
      /* 1.24x: */
      font-size: 18px;
      color: #ffffff;
      letter-spacing: -0.23px;
      text-align: center;
      text-shadow: 0 0 4px rgba(0, 0, 0, 0.5);
    }
  }
}
.order-pane,
.status-pane {
  text-align: center;
  .asset-title {
    font-size: 14px;
    margin: 10px 0 10px 0;
  }
  .asset-title {
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
    background: rgba(0, 0, 0, 0.2);
    margin: 0;
    padding: 0px 14px;
    span {
      display: block;
      padding: 6px 0;
      color: rgba(255, 255, 255, 0.5);
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }
  }
  .asset {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    width: 100%;
  }
  .status {
    margin: 10px auto 10px auto;
    font-family: "Roboto-Bold";
    font-size: 20px;
  }
  .status.win {
    color: $color-success;
  }
  .status-hint {
    font-size: 14px;
    opacity: 0.8;
    margin-bottom: 10px;
  }
  .button-wrapper {
    padding: 14px 0;
    .button {
      width: 200px;
    }
  }
  .button-wrapper-paid {
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }
  .empty-hint {
    padding: 20px 0;
    font-weight: normal;
    opacity: 0.6;
    strong {
      text-transform: uppercase;
    }
  }
  .qrcode {
    margin: 10px auto;
    text-align: center;
    display: inline-block;
    padding: 10px;
    background: white;
    border-radius: 8px;
    canvas {
      margin: 0 auto;
      // width: 140px;
      // height: 140px;
      background: white;
    }
  }
  .hint {
    text-align: center;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.6);
    letter-spacing: -0.27px;
    text-align: center;
    line-height: 16px;
    em,
    a {
      color: #fff;
      font-style: normal;
    }
    p {
      margin: 4px 0;
    }
  }
}
.order-pane {
  padding-top: 0;
}
@media (max-width: 736px) {
  .lottery-container {
    flex-direction: column;
    .game-table {
    }
    .right {
      margin: 0;
    }
  }
  .history {
    .record,
    .record-header {
      font-size: 12px;
    }
    .record-icon {
      margin-left: -20px;
    }
    .record-field-time {
      padding-left: 0;
    }
  }
}
</style>

