<template>
  <div id="dashboard">
    <div class="row">
      <div class="col-lg-12">
        <h3>Hello World</h3>
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
      return {}
    },
    computed: {
      ...mapState(['currentUsdPrice']),
    },
    methods: {},
  }
</script>

<style lang="scss" scoped>

</style>
