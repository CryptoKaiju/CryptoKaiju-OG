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

      <div>
        <b-badge class="mt-2">BADGE</b-badge>
      </div>

      <div class="help" v-if="isFlippable">
        <img src="/static/flip.svg" alt>Flip
      </div>
    </figure>

    <figure
      class="card__back text-center"
      style="padding-top:50px"
      @click="flip"
    >
      <h4></h4>
      <hr>
      <p class="descr">
        Your donation goes to
        <strong>
          GOD
        </strong>
      </p>

        Yellow
    </figure>
  </div>
</template>

<script>
/* global web3:true */

import { mapGetters, mapState } from "vuex";
import router from "../../router";
import * as actions from "../../store/actions";

export default {
  name: "card",
  computed: {
    isFlippable: function() {
      return true;
    }
  },
  props: {
    cdata: {
      type: Object
    }
  },

  data() {
    return {
      transfer: false,
      share: false,
      transferRecipient: "",
      isFlipped: false,
      transfered: false,
      transferPending: false
    };
  },

  methods: {
    flip: function(event) {
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
  width: 18rem;
  max-width: 18rem;
  min-height: 22rem;
  margin-right: 1rem;
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
  }
  .creator {
    font-size: 0.9rem;
  }
  .descr {
    margin-top: 0.5rem;
    font-size: 0.875rem;
    color: $gray;
  }

  // .badge {
  //   display: flex;
  //   align-items: center;
  //   margin-right: -$p_h;
  //   padding: 0.5rem;
  //   background: $black;
  //   color: $white;
  //   white-space: nowrap;
  //   font-weight: bold;

  //   img {
  //     width: 0.875rem;
  //     margin-right: 0.25rem;
  //   }
  // }

  .help {
    position: absolute;
    bottom: 0;
    right: 0;
    display: flex;
    flex: 0;
    align-items: center;
    margin: 0 -#{$p_h/2} -#{$p_v/2} 0;

    font-size: 0.75rem;
    opacity: 0.2;

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

  // Card transfer side
  &__transfer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    padding: $p_v $p_h;
    background: #f5f5f5;

    cursor: default;
  }

  .transferButton {
    background: #000000;
    font-family: Helvetica;
    line-height: normal;
    text-align: center;
    color: #ffffff;
    font-size: 16px;
    padding: 15px;
    border: 1px solid black;
  }

  .cancelButton {
    background: white;
    color: black;
    font-family: Helvetica;
    line-height: normal;
    font-size: 16px;
    padding: 15px;
    border: 1px solid black;
  }
}
</style>
