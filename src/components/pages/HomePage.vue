<template>
  <div class="container">

    <div class="jumbotron">
      <h1 class="display-4">Welcome to Crypto-Kaijus</h1>
      <p class="lead">Linking your kaijus to provenance on the Blockchain</p>
      <div class="row">
        <div class="col">
          <form class="form-inline mb-4">
            <div class="form-group mx-sm-3">
              <label for="tokenId" class="sr-only">Token ID</label>
              <input type="number"
                     class="form-control"
                     id="tokenId"
                     v-model="searchData.tokenId"
                     placeholder="Token ID"/>
            </div>
            <button type="button" class="btn btn-primary" v-on:click="searchByTokenId">
              Search
            </button>
          </form>

          <form class="form-inline">
            <div class="form-group mx-sm-3 ">
              <label for="tokenId" class="sr-only">NFC ID</label>
              <input type="number"
                     class="form-control"
                     id="nfcId"
                     v-model="searchData.nfcId"
                     placeholder="NFC ID"/>
            </div>
            <button type="button" class="btn btn-primary" v-on:click="searchByNfcID">
              Search
            </button>
          </form>
        </div>
        <div class="col">
          Total Supply: {{totalSupply}}
        </div>
        <!--<div class="col" v-if="searchResult">-->
        <!--<h5>Results</h5>-->

        <!--<div class="row">-->
        <!--<div class="col-sm-4">-->
        <!--Token ID: {{searchResult.tokenId}}-->
        <!--</div>-->
        <!--<div class="col-sm-4">-->
        <!--NFC ID: {{searchResult.nfcId}}-->
        <!--</div>-->
        <!--<div class="col-sm-4">-->
        <!--DOB: {{searchResult.dob}}-->
        <!--</div>-->
        <!--</div>-->
        <!--<div class="row" v-if="searchResult.ipfsData">-->
        <!--<div class="col-sm-4">-->
        <!--Name: {{searchResult.ipfsData.name}}-->
        <!--</div>-->
        <!--<div class="col-sm-4">-->
        <!--Description: {{searchResult.ipfsData.description}}-->
        <!--</div>-->
        <!--<div class="col-sm-4">-->
        <!--Attributes: {{searchResult.ipfsData.attributes}}-->
        <!--</div>-->
        <!--</div>-->
        <!--<div class="row" v-if="searchResult.ipfsData">-->
        <!--<div class="col-sm-!2">-->
        <!--<img :src="searchResult.ipfsData.image"-->
        <!--class="img-thumbnail"-->
        <!--style="max-height: 200px"/>-->
        <!--</div>-->
        <!--</div>-->

        <!--<hr />-->

        <!--<div class="row">-->
        <!--<div class="col-sm-12">-->
        <!--Raw data: <pre>{{searchResult}}</pre>-->
        <!--</div>-->
        <!--</div>-->
        <!--</div>-->
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

  .jumbotron {
    background-color: #E8F6F3;
  }

</style>
