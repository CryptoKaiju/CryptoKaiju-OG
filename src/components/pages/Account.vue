<template>
  <div class="container">

    <h2>My Kaijus</h2>
    <p>
      <clickable-address :eth-address="account"></clickable-address>
    </p>

    <div class="row" v-for="account in accountKaijus">
      <div class="col">
        <h5>Results</h5>

        <div class="row">
          <div class="col-sm-4">
            Token ID: {{account.tokenId}}
          </div>
          <div class="col-sm-4">
            NFC ID: {{account.nfcId}}
          </div>
          <div class="col-sm-4">
            DOB: {{account.dob}}
          </div>
        </div>
        <div class="row" v-if="account.ipfsData">
          <div class="col-sm-4">
            Name: {{account.ipfsData.name}}
          </div>
          <div class="col-sm-4">
            Description: {{account.ipfsData.description}}
          </div>
          <div class="col-sm-4">
            Attributes: {{account.ipfsData.attributes}}
          </div>
        </div>
        <div class="row" v-if="account.ipfsData">
          <div class="col">
            <img :src="account.ipfsData.image"
                 class="img-thumbnail"
                 style="max-height: 200px"/>
          </div>
        </div>
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
    mounted () {

    },
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


</style>
