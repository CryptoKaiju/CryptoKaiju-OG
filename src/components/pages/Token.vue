<template>
  <div class="container">
    <h2>&nbsp;</h2>

    <div class="row mt-5" v-if="!filteredKaiju($route.params.tokenId) || filteredKaiju($route.params.tokenId).length === 0">
      <div class="col text-center">
        <code>Token not found :(</code>
      </div>
    </div>

    <div class="row text-center mt-5" v-else>
      <div class="card-deck mx-auto">
        <div class="mb-5" v-for="card in filteredKaiju($route.params.tokenId)" :key="card.nfcId">
          <card :cdata="card" class="m-2"></card>
        </div>
      </div>
    </div>

  </div>
</template>

<script>

  import { mapGetters, mapState } from 'vuex';
  import Card from '../widgets/Card';

  export default {
    name: 'token',
    components: {Card},
    computed: {
      ...mapState(['kaijus'])
    },
    methods: {
      filteredKaiju: function (id) {
        if (!this.kaijus) return;

        return _.filter(this.kaijus, (k) => k && k.tokenId.toString(10) === id);
      }
    },
  };
</script>

<style lang="scss" scoped>

</style>
