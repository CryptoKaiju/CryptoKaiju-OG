<template>
  <div class="container">
    <h2>&nbsp;</h2>

    <div class="row">
      <div class="col">
        <h3>Colours</h3>
        <pie-chart :donut="true" :data="colourStats" :colors="['green', 'purple']"></pie-chart>
      </div>
      <div class="col">
        <h3>Gender</h3>
        <pie-chart :donut="true" :data="genderStats" :colors="['lightblue', '#fff0f2', 'purple']"></pie-chart>
      </div>
    </div>

    <div class="row mt-5">
      <div class="col">
        <h3>Class</h3>
        <pie-chart :donut="true" :data="classStats"></pie-chart>
      </div>
      <div class="col">
        <h3>Skill</h3>
        <pie-chart :donut="true" :data="skillStats"></pie-chart>
      </div>
    </div>



  </div>
</template>

<script>

  import { mapGetters, mapState } from 'vuex';

  export default {
    name: 'traits',
    data () {
      return {
        colours: ['#1f2760', '#ff005c', '#fff0f2', '#707070', ' #040505']
      };
    },
    components: {},
    computed: {
      ...mapState(['kaijus']),
      colourStats: function (id) {
        if (!this.kaijus) return;

        return _.chain(this.kaijus).filter((k) => k).map((k) => k.ipfsData.attributes.colour).countBy().value();
      },
      classStats: function (id) {
        if (!this.kaijus) return;

        return _.chain(this.kaijus).filter((k) => k).map((k) => k.ipfsData.attributes.class).countBy().value();
      },
      genderStats: function (id) {
        if (!this.kaijus) return;

        return _.chain(this.kaijus).filter((k) => k).map((k) => k.ipfsData.attributes.gender).countBy().value();
      },
      skillStats: function (id) {
        if (!this.kaijus) return;

        return _.chain(this.kaijus).filter((k) => k).map((k) => k.ipfsData.attributes.skill).countBy().value();
      }
    }
  };
</script>

<style lang="scss" scoped>

</style>
