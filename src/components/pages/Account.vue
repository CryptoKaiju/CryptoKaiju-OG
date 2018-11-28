<template>
  <div class="container">

    <h2>My Kaijus <span class="badge badge-primary">{{accountKaijus.length}}</span></h2>
    <p>
      <clickable-address :eth-address="account"></clickable-address>
    </p>

    <div class="row mt-5" v-if="!accountKaijus || accountKaijus.length === 0">
      <div class="col text-center">
        <code>You don't own any kaijus yet...</code>
        <br/>
        <a href="https://cryptokaiju.io/shop/" target="_blank" class="btn btn-primary btn-lg mt-5">Buy now</a>
      </div>
    </div>

    <div class="row mt-5" v-else>
      <div class="col">
        <div class="card-columns">
          <div class="card shadow-sm text-center" v-for="searchResult in accountKaijus">
            <img :src="searchResult.ipfsData.image" class="card-img-top img-fluid"/>
            <div class="card-body">
              <h2 class="card-title">
                <span class="badge badge-secondary">#{{searchResult.tokenId}}</span>
                <strong>{{searchResult.ipfsData.name}}</strong>
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
                </div>
                <div class="row mb-2">
                  <div class="col">
                    <span class="small">Skill</span><br/><code>{{searchResult.ipfsData.attributes.skill|capitalize}}</code>
                  </div>
                </div>
                <div class="row mb-2">
                  <div class="col">
                    <span class="small">Batch</span><br/><code>{{searchResult.ipfsData.attributes.batch|capitalize}}</code>
                  </div>
                </div>
                <div class="row mb-2">
                  <div class="col">
                    <span class="small">Tag</span><br/><code>{{searchResult.ipfsData.attributes.nfc}}</code>
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
    </div>
  </div>
</template>

<script>

  import { mapGetters, mapState } from 'vuex';
  import * as actions from '../../store/actions';
  import ClickableTransaction from '../widgets/ClickableTransaction';
  import ClickableAddress from '../widgets/ClickableAddress';

  export default {
    name: 'account',
    components: {ClickableTransaction, ClickableAddress},
    computed: {
      ...mapState(['account', 'accountKaijus', 'transfers']),
      ...mapGetters(['findTx'])
    },
    created () {
      const loadData = function () {
        this.$store.dispatch(actions.LOAD_ACCOUNT_KAIJUS, {account: this.account});
      }.bind(this);

      this.$store.watch(
        () => this.$store.state.account,
        () => loadData()
      );

      if (this.$store.state.account) {
        loadData();
      }
    }
  };
</script>

<style lang="scss" scoped>
  .card-body {
    padding-top: 0 !important;
  }

  .card-img-top {
    width: 170px;
    height: 250px;
  }
</style>
