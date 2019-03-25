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

    <!--{{kaijus}}-->

    <div class="row text-center pt-3" v-if="kaijus">
      <div class="card-deck mx-auto">
        <social-sharing :url="'https://cryptokaiju.io/token/' + kaijus.tokenId"
                        title="CryptoKaiju - Ethereum Powered Vinyl Kaiju Toys | Non Fungible Sofubi"
                        :description="kaijus.ipfsData.name + ' - ' + kaijus.ipfsData.description"
                        quote="CryptoKaiju are Adding Even More Fun to Non Fungible Tokens With our Range of Highly Collectible Soft Vinyl Kaiju Toys. Each is Individual & Backed by an ERC-721 Token. Find out More & Shop Online Today"
                        hashtags="cryptokaiju,bitcoin,ethereum,erc721,sofubi,vinyltoys"
                        twitter-user="cryptokaijuio"
                        v-cloak inline-template>
          <div>
            <network network="facebook">
              <i class="fa fa-fw fa-facebook hand-pointer"></i>
            </network>
            <network network="linkedin">
              <i class="fa fa-fw fa-linkedin hand-pointer"></i>
            </network>
            <network network="pinterest">
              <i class="fa fa-fw fa-pinterest hand-pointer"></i>
            </network>
            <network network="reddit">
              <i class="fa fa-fw fa-reddit hand-pointer"></i>
            </network>
            <network network="twitter">
              <i class="fa fa-fw fa-twitter hand-pointer"></i>
            </network>
            <network network="weibo">
              <i class="fa fa-weibo hand-pointer"></i>
            </network>
          </div>
        </social-sharing>
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
