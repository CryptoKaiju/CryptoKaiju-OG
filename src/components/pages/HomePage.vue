<template>
  <div class="container">

    <div class="">
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
              <input type="text"
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
          <h2>Supply <span class="badge badge-primary">{{totalSupply}}</span></h2>
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
          tokenId: null,
          nfcId: null
        }
      };
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
  };
</script>

<style lang="scss" scoped>

  body > .container {
    padding: 60px 60px 0;
  }
  
</style>
