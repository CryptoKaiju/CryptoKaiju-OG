<template>
  <div class="container">
    <div class="row">
      <div class="col-sm-5">
        <h1 class="display-4 text-left mb-4 text-primary">CryptoKaiju</h1>
        <h2>Collectible Vinyl Toys</h2>
        <p><em>Powered by the Ethereum Blockchain</em></p>
        <p class="mt-5" v-if="totalSupply">There are currently <span class="badge badge-primary pl-2 pr-2 ml-2 mr-2">{{ totalSupply }}</span> kaijus in existence</p>
      </div>
      <div class="col-sm-7 mt-5">
        <b-form @submit="searchByKId" novalidate class="">
          <div class="form-group">
            <input type="text"
                   class="form-control form-control-lg w-75"
                   id="kId"
                   v-model="searchData.kId"
                   placeholder="Token ID or NFC ID"/>
          </div>
          <b-button type="submit" variant="primary" class="btn-lg">
            Search
          </b-button>
        </b-form>
      </div>
    </div>
    <div class="row">
      <div class="col mt-5" v-if="searchResult">
        <div class="d-flex justify-content-center">
          <div class="card shadow-sm p-5">
            <div class="row no-gutters">
              <div class="col-auto pr-4">
                <img :src="searchResult.ipfsData.image" class="img-fluid mt-5 ml-3" style="max-width: 175px"/>
              </div>
              <div class="col mb-4">
                <div class="card-block px-2 pt-2 text-center">
                  <h2 class="card-title">
                    <strong>{{searchResult.ipfsData.name}}</strong>
                    <span class="badge badge-primary float-right ml-5">#{{searchResult.tokenId}}</span>
                  </h2>
                  <p class="card-text">{{searchResult.ipfsData.description}}</p>
                  <p class="card-text" v-if="transfers && findTx(searchResult.tokenId)">
                    <clickable-transaction :transaction="findTx(searchResult.tokenId).transactionHash"></clickable-transaction>
                  </p>
                  <div class="text-left">
                    <div class="row mb-2">
                      <div class="col">
                        <span class="small">Birth date</span><br/><code>{{new Date(searchResult.dob * 1000).toDateString()}}</code>
                      </div>
                    </div>
                    <div class="row mb-2">
                      <div class="col">
                        <span class="small">Gender</span><br/><code>{{searchResult.ipfsData.attributes.gender|capitalize}}</code>
                      </div>
                      <div class="col">
                        <span class="small">Colour</span><br/><code>{{searchResult.ipfsData.attributes.colour|capitalize}}</code>
                      </div>
                    </div>
                    <div class="row mb-2">
                      <div class="col">
                        <span class="small">Class</span><br/><code>{{searchResult.ipfsData.attributes.class|capitalize}}</code>
                      </div>
                      <div class="col">
                        <span class="small">Skill</span><br/><code>{{searchResult.ipfsData.attributes.skill|capitalize}}</code>
                      </div>
                    </div>
                    <div class="row mb-2">
                      <div class="col">
                        <span class="small">Batch</span><br/><code>{{searchResult.ipfsData.attributes.batch|capitalize}}</code>
                      </div>
                      <div class="col">
                        <span class="small">Tag</span><br/><code>{{searchResult.ipfsData.attributes.nfc}}</code>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!--<div class="card-footer w-100 text-muted small">-->
            <!--{{searchResult}}-->
            <!--</div>-->
          </div>
        </div>

      </div>
      <div class="col mt-5 text-center" v-if="!searchResult && notFound">
        <code>Not found!</code>
      </div>
    </div>
  </div>

</template>

<script>

  import { mapGetters, mapState } from 'vuex';
  import * as actions from '../../store/actions';
  import ClickableTransaction from '../widgets/ClickableTransaction';

  export default {
    name: 'home',
    components: {ClickableTransaction},
    data () {
      return {
        searchData: {
          kId: null
        }
      };
    },
    computed: {
      ...mapState(['notFound', 'totalSupply', 'searchResult', 'transfers']),
      ...mapGetters(['findTx'])
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
      searchByKId: function (evt) {
        evt.preventDefault();

        function isInt (value) {
          let x = parseFloat(value);
          return !isNaN(value) && (x | 0) === x;
        }

        if (this.searchData.kId && isInt(this.searchData.kId)) {
          console.log(`TOK ${this.searchData.kId}`);
          this.$store.dispatch(actions.FIND_KAIJUS_BY_TOKEN_ID, this.searchData.kId);
        } else {
          console.log(`TAG ${this.searchData.kId}`);
          this.$store.dispatch(actions.FIND_KAIJUS_BY_NFC_ID, this.searchData.kId);
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

  .card {
    min-width: 600px;
  }

  /* mobile only */
  @media screen and (max-width: 767px) {
    .card {
      min-width: 200px;
    }
  }

</style>
