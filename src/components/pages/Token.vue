<template>
  <div class="container">
    <h2>&nbsp;</h2>

    <div class="row mt-5">
      <div class="col text-center">
        <code v-if="loading">Looking for Kaijus...</code>
      </div>
    </div>

    <div class="row text-center">
      <div class="card-deck mx-auto">
        <card :cdata="kaijus" class="m-2"></card>
      </div>
    </div>

  </div>
</template>

<script>

  import {mapGetters, mapState} from 'vuex';
  import Card from '../widgets/Card';
  import cryptoKaijusApiService from '../../servcies/CryptoKaijusApiService';

  export default {
    name: 'token',
    components: {Card},
    data() {
      return {
        loading: false,
        kaijus: null,
      };
    },
    created() {
      this.loading = true;
      cryptoKaijusApiService.getTokenDetails(this.$store.state.currentNetworkId, this.$route.params.tokenId)
        .then((result) => {
          this.kaijus = result;
        })
        .finally(() => {
          this.loading = false;
        });
    }
  };
</script>

<style lang="scss" scoped>

</style>
