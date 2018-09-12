<template>
  <div class="container">

    <hr/>

    <div class="row">
      <div class="col-sm-12">
          Total Supply : {{totalSupply}}
      </div>
    </div>

    <hr />

    <div class="row">
      <div class="col-sm-12">
        <form>
          <div class="form-group row">
            <label for="tokenId"
                   class="col-sm-1 col-form-label">
              Token ID
            </label>
            <div class="col-sm-4">
              <input type="number"
                     class="form-control"
                     id="tokenId"
                     v-model="searchData.tokenId"/>
            </div>
            <button type="button" class="btn btn-primary col-sm-1"
                    v-on:click="searchByTokenId">Search
            </button>
          </div>

          <div class="form-group row">
            <label for="nfcId"
                   class="col-sm-1 col-form-label">
              NFC ID
            </label>
            <div class="col-sm-4">
              <input type="text"
                     class="form-control"
                     id="nfcId"
                     v-model="searchData.nfcId"/>
            </div>
            <button type="button" class="btn btn-primary col-sm-1"
                    v-on:click="searchByNfcID">Search
            </button>
          </div>
        </form>
      </div>
    </div>

    <hr/>

    <div class="row" v-if="searchResult">
      <div class="col-sm-12">
        <h5>Results</h5>
      </div>
    </div>

    <div class="row" v-if="searchResult">
      <div class="col-sm-12">
        {{searchResult}}
      </div>
    </div>


  </div>
</template>

<script>

  import {mapGetters, mapState} from 'vuex'
  import * as actions from '../../store/actions'
  import * as _ from 'lodash'
  import Web3 from 'web3'


  export default {
    name: 'home',
    components: {},
    data() {
      return {
        searchData: {
          tokenId: null,
          nfcId: null
        }
      }
    },
    computed: {
      ...mapState(['currentUsdPrice', 'totalSupply', 'searchResult']),
    },
    methods: {
      searchByTokenId: function () {
        if (this.searchData.tokenId) {
          this.$store.dispatch(actions.FIND_KAIJUS_BY_TOKEN_ID, this.searchData.tokenId);
        }
      },
      searchByNfcID: function () {
        if (this.searchData.nfcId) {
          this.$store.dispatch(actions.FIND_KAIJUS_BY_NFC_ID, this.searchData.nfcId);
        }
      }
    },
  }
</script>

<style lang="scss" scoped>

  body > .container {
    padding: 60px 60px 0;
  }
</style>
