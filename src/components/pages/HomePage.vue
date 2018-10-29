<template>
  <div class="container">


    <div class="row">
      <div class="col-sm-5">
        <h1 class="display-4 text-left">CryptoKaiju</h1>
        <h2>Collectible Vinyl Toys</h2>
        <p>Powered by the Ethereum Blockchain</p>
        <img src="../../../static/RoughCutout-500x670.png" class="ml-5" style="max-height: 200px"/>
      </div>
      <div class="col-sm-7 mt-5">
        <form class="form text-right">
          <div class="form-group">
            <label for="kId" class="sr-only">ID</label>
            <input type="text"
                   class="form-control form-control-lg"
                   id="kId"
                   v-model="searchData.kId"
                   placeholder="Token ID or NFC ID"/>
          </div>
          <button type="button" class="btn btn-primary btn-lg" v-on:click="searchByKId">
            Search
          </button>
        </form>
      </div>
    </div>
    <div class="row">
      <div class="col mt-5" v-if="searchResult">

        <div class="card">
          <div class="row no-gutters">
            <div class="col-auto pr-5">
              <img :src="searchResult.ipfsData.image" class="img-fluid" style="max-width: 200px"/>
            </div>
            <div class="col">
              <div class="card-block px-2 pt-2">
                <h2 class="card-title">{{searchResult.ipfsData.name}}</h2>
                <p class="card-text">{{searchResult.ipfsData.description}}</p>
                <ul class="list-group mt-4">
                  <li class="list-group-item"><span class="small">Token ID:</span> {{searchResult.tokenId}}</li>
                  <li class="list-group-item"><span class="small">NFC ID:</span> {{searchResult.nfcId}}</li>
                  <li class="list-group-item"><span class="small">DOB:</span> {{searchResult.dob}}</li>
                </ul>
              </div>
            </div>
          </div>
          <div class="card-footer w-100 text-muted small">
            {{searchResult}}
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>

  import { mapGetters, mapState } from 'vuex';
  import * as actions from '../../store/actions';
  import * as _ from 'lodash';
  import Web3 from 'web3';

  export default {
    name: 'home',
    components: {},
    data () {
      return {
        searchData: {
          kId: null
        }
      };
    },
    computed: {
      ...mapState(['currentUsdPrice', 'totalSupply', 'searchResult']),
    },
    methods: {
      searchByTokenId: function () {
        if (this.searchData.kId) {
          this.$store.dispatch(actions.FIND_KAIJUS_BY_TOKEN_ID, this.searchData.kId);
        }
      },
      searchByNfcID: function () {
        if (this.searchData.kId) {
          this.$store.dispatch(actions.FIND_KAIJUS_BY_NFC_ID, this.searchData.kId);
        }
      },
      searchByKId: function () {
        if (Number.isInteger(this.searchData.kId)) {
          this.searchByNfcID();
        } else {
          this.searchByTokenId();
        }
      }
    },
  };
</script>

<style lang="scss" scoped>

  body > .container {
    padding: 60px 60px 0;
  }

  h1 {
    font-size: 50px;
    color: #ffffff;
    text-align: center;
    font-weight: 700;
    font-style: normal;
  }
</style>
