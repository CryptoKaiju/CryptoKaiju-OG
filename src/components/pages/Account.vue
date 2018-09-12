<template>
  <div class="container">

    <hr/>

    <div class="row">
      <div class="col-lg-12">
        <h3>Your Kaijus <clickable-address :eth-address="account"></clickable-address></h3>
      </div>
    </div>

    <hr/>

    <div class="row">
      <div class="col-lg-12">
        {{accountKaijus}}
      </div>
    </div>
  </div>
</template>

<script>

  import {mapGetters, mapState} from 'vuex'
  import * as _ from 'lodash'
  import * as moment from 'moment'
  import Web3 from 'web3'
  import * as actions from '../../store/actions'
  import ClickableAddress from "../widgets/ClickableAddress";


  export default {
    name: 'account',
    components: {ClickableAddress},
    computed: {
      ...mapState(['account', 'accountKaijus'])
    },
    mounted() {

    },
    methods: {
    },
    created () {

      const loadData = function () {
        this.$store.dispatch(actions.LOAD_ACCOUNT_KAIJUS, {account: this.account})
      }.bind(this);

      this.$store.watch(
        () => this.$store.state.account,
        () => loadData()
      );

      if (this.$store.state.account) {
        loadData();
      }
    },
  }
</script>

<style lang="scss" scoped>


</style>
