<template>
  <div class="container">
    <div class="row">
      <div class="col-sm-5">
        <h1 class="display-4 text-left mb-4 text-primary">CryptoKaiju</h1>
        <h2>Collectible Vinyl Toys</h2>
        <p><em>Powered by the Ethereum Blockchain</em></p>
        <p class="mt-5" v-if="totalSupply">There are currently <span class="badge badge-primary pl-2 pr-2 ml-2 mr-2">{{ totalSupply }}</span> kaiju in existence</p>
      </div>

      <div class="col-sm-7 mt-5">
          <div class="form-group">
            <input type="text"
                   class="form-control form-control-lg w-75"
                   id="kId"
                   v-model="searchData.kId"
                   placeholder="Name, Token ID or NFC ID"/>
          </div>
          <b-button type="button" variant="primary" class="btn-lg">
            Search
          </b-button>
      </div>
    </div>

    <div class="row text-center mt-5" v-if="kaijus && kaijus.length > 0">
      <div class="card-deck">
        <div v-if="searchResult">
          <card :cdata="searchResult" class="m-2"></card>
        </div>
        <div v-else class="mb-5" v-for="card in filteredKaiju()" :key="card.tokenId">
          <card :cdata="card" class="m-2"></card>
        </div>
      </div>
    </div>

  </div>

</template>

<script>

  import { mapGetters, mapState } from 'vuex';
  import * as actions from '../../store/actions';
  import ClickableTransaction from '../widgets/ClickableTransaction';
  import Card from '../widgets/Card';

  export default {
    name: 'home',
    components: {Card, ClickableTransaction},
    data () {
      return {
        searchData: {
          kId: null
        }
      };
    },
    computed: {
      ...mapState(['notFound', 'totalSupply', 'searchResult', 'transfers', 'kaijus']),
      ...mapGetters(['findTx'])
    },
    methods: {
      filteredKaiju: function () {
        if (!this.kaijus) return;

        if (this.searchData && this.searchData.kId) {
          console.log(this.searchData.kId);
          return _.filter(this.kaijus, (k) => {
            if (k && k.ipfsData) {
              return k.ipfsData.name.toLowerCase().includes(this.searchData.kId.toLowerCase()) ||
                k.tokenId.toString(10).includes(this.searchData.kId) ||
                k.nfcId.toLowerCase().includes(this.searchData.kId.toLowerCase());
            }
          });
        }

        return this.kaijus;
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

  /* mobile only */
  @media screen and (max-width: 767px) {
    .card {
      min-width: 200px;
    }
  }

</style>
