<template>
  <div
    v-if="cdata && cdata.ipfsData"
    :class="['card', {'card--flippable': isFlippable}, {'card--flipped': isFlipped}]"
  >
    <figure class="card__front" @click="flip" v-if="!transfer && !share">
      <figcaption>
        <div class="col text-left">
          <p class="creator badge badge-primary">#{{ cdata.tokenId.toString() }}</p>
        </div>
        <div class="col text-right">
          <img :src="cdata.ipfsData.image" class="" style="max-width: 35px"/>
        </div>
      </figcaption>

      <figcaption>
        <div class="card__meta">
          <h4 class="title">{{ cdata.ipfsData.name }}</h4>
        </div>
      </figcaption>

      <div v-if="cdata">
        <p class="descr">{{ cdata.ipfsData.description }}</p>
      </div>

      <div class="help" v-if="isFlippable">
        <img src="/static/flip.svg" alt>Flip
      </div>
    </figure>

    <figure
      class="card__back text-center"
      @click="flip"
    >
      <div class="text-left">
        <div class="row mb-2">
          <div class="col">
            <span class="small">Birth date</span><br/><code>{{new Date(cdata.dob * 1000).toDateString()}}</code>
          </div>
          <div class="col">
            <span class="small">Owner</span><br/><code><clickable-address :eth-address="cdata.owner"></clickable-address></code>
          </div>
        </div>
        <div class="row mb-2">
          <div class="col">
            <span class="small">Tag</span><br/><code>{{cdata.ipfsData.attributes.nfc}}</code>
          </div>
        </div>
        <div class="row mb-2">
          <div class="col">
            <span class="small">Gender</span><br/><code>{{cdata.ipfsData.attributes.gender|capitalize}}</code>
          </div>
          <div class="col">
            <span class="small">Colour/Style</span><br/><code>{{cdata.ipfsData.attributes.colour|capitalize}}</code>
          </div>
        </div>
        <div class="row mb-2">
          <div class="col">
            <span class="small">Class</span><br/><code>{{cdata.ipfsData.attributes.class|capitalize}}</code>
          </div>
          <div class="col">
            <span class="small">Skill</span><br/><code>{{cdata.ipfsData.attributes.skill|capitalize}}</code>
          </div>
        </div>
        <div class="row mb-2">
          <div class="col">
            <span class="small">Batch</span><br/><code>{{cdata.ipfsData.attributes.batch|capitalize}}</code>
          </div>
        </div>
        <div class="row mb-2">
          <div class="col text-center">
            <router-link :to="{ name: 'token', params: { tokenId: cdata.tokenId }}" class="btn-link text-info">
              More details
            </router-link>
          </div>
        </div>
      </div>
    </figure>
  </div>
</template>

<script>
  /* global web3:true */

  import { mapGetters, mapState } from 'vuex';
  import router from '../../router';
  import * as actions from '../../store/actions';
  import ClickableAddress from './ClickableAddress';

  export default {
    name: 'card',
    components: {ClickableAddress},
    computed: {
      ...mapGetters(['findTx']),
      isFlippable: function () {
        return true;
      }
    },
    props: {
      cdata: {
        type: Object
      }
    },
    data () {
      return {
        transfer: false,
        share: false,
        transferRecipient: '',
        isFlipped: false,
        transfered: false,
        transferPending: false
      };
    },
    methods: {
      flip: function (event) {
        this.isFlipped = !this.isFlipped;
      }
    }
  };
</script>

<style lang="scss" scoped>
  $body-bg: #f5f5f5;
  $body-color: #1f2760;
  $primary: #ff005c;
  $secondary: #fff0f2;
  $gray: #707070;
  $black: #040505;
  $white: #f5f5f5;

  $border-radius-base: 50;

  .c-blue {
    color: $body-color;
  }

  // Layout
  $maxWidth: 58rem;

  //bootstrap overides
  $enable-rounded: false;

  // Card
  .card {
    $p_v: 1rem;
    $p_h: 1.5rem;

    position: relative;
    display: flex;
    flex-shrink: 0;
    flex-grow: 1;
    width: 22rem;
    height: 22rem;
    padding: $p_v $p_h;

    box-shadow: 0 0.25rem 1rem rgba($black, 0.1);
    background: $white;
    border-radius: 0;
    border: 0;
    border-bottom-color: transparent;
    cursor: pointer;

    transition: all 0.2s ease-in-out;

    &:hover {
      box-shadow: 0 0.25rem 1.5rem rgba($black, 0.2);
      border-bottom: none;
    }

    &:not(.card--flippable):hover {
      transform: translateY(-2px);
    }

    &--flippable {
      cursor: e-resize;
      cursor: alias;
      transition: all 1s cubic-bezier(0.4, 0, 0.2, 1);
      transform-style: preserve-3d;

      // Flip effect
      &.card--flipped {
        transform: rotateY(-180deg);
        transform-style: preserve-3d;
      }
    }

    &__front,
    &__back {
      transform-style: preserve-3d;
      backface-visibility: hidden;
    }

    figure {
      display: block;
      width: 100%;
    }

    &__image {
      flex: 1;
      margin: -#{$p_v} -#{$p_h} $p_v;

      img {
        display: block;
        width: 100%;
        max-width: 100%;
        height: 100%;
        min-height: 12rem;
        object-fit: cover;
        object-position: center;
      }

      .img--placeholder {
        opacity: 0.1;
        display: flex;
        justify-content: center;
        text-align: center;
      }
    }

    figcaption {
      display: flex;
    }

    &__meta {
      flex: 1;
    }

    &__value {
      flex: 0;
    }

    // Content
    .title {
      font-size: 1.2rem;
      margin-top: 1rem;
    }

    .creator {
      font-size: 0.9rem;
    }

    .descr {
      margin-top: 2rem;
      font-size: 0.875rem;
      color: $gray;
    }

    .help {
      position: absolute;
      bottom: 0;
      right: 0;
      display: flex;
      flex: 0;
      align-items: center;
      margin: 0 -#{$p_h/2} -#{$p_v/2} 0;

      font-size: 0.75rem;
      opacity: 0.5;

      &:hover {
        opacity: 0.4;
      }

      img {
        width: 0.875rem;
        margin-right: 0.25rem;
      }
    }

    // Card back side
    &__back {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      padding: $p_v $p_h;
      background: $secondary;
      transform: rotateY(180deg);

      cursor: w-resize;
    }
  }
</style>
