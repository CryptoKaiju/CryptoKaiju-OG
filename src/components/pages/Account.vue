<template>
  <div class="container">

    <h2>My Kaijus <span class="badge badge-primary">{{accountKaijus.length}}</span></h2>
    <p>
      <clickable-address :eth-address="account"></clickable-address>
    </p>

    <div class="card-columns">
      <div class="card shadow-sm" v-for="searchResult in accountKaijus">
        <img :src="searchResult.ipfsData.image" class="card-img-top"/>
        <div class="card-body">
          <h2 class="card-title p-2">
            <span class="badge badge-secondary">#{{searchResult.tokenId}}</span>
            {{searchResult.ipfsData.name}}
          </h2>
          <p class="card-text p-2">{{searchResult.ipfsData.description}}</p>
          <div class="row">
            <div class="col">
              <span class="small">Tag</span><br/><code>{{searchResult.nfcId}}</code>
            </div>
            <div class="col">
              <span class="small">Birth date</span><br/><code>{{searchResult.dob}}</code>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <span class="small">Gender</span><br/><code>{{searchResult.ipfsData.attributes.gender|capitalize}}</code>
            </div>
            <div class="col">
              <span class="small">Colour</span><br/><code>{{searchResult.ipfsData.attributes.colour|capitalize}}</code>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <span class="small">Nature</span><br/><code>{{searchResult.ipfsData.attributes.nature|capitalize}}</code>
            </div>
            <div class="col">
              <span class="small">Skill</span><br/><code>{{searchResult.ipfsData.attributes.skill|capitalize}}</code>
            </div>
          </div>
        </div>

        <!--<div class="card-footer w-100 text-muted small">-->
        <!--{{searchResult}}-->
        <!--</div>-->
      </div>
    </div>
  </div>
</template>

<script>

  import { mapGetters, mapState } from 'vuex';
  import * as _ from 'lodash';
  import * as moment from 'moment';
  import Web3 from 'web3';
  import * as actions from '../../store/actions';
  import ClickableAddress from '../widgets/ClickableAddress';

  export default {
    name: 'account',
    components: {ClickableAddress},
    computed: {
      ...mapState(['account', 'accountKaijus'])
    },
    mounted () {},
    methods: {},
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
    },
  };
</script>

<style lang="scss" scoped>
  .card-body {
    padding-top: 0 !important;
  }

</style>
