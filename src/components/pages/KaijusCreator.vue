<template>
  <div class="container">
    <h1>Kaiju Foundry</h1>

    <div class="row mt-5">
      <div class="col ml-3 mr-3">
        <form>

          <div class="form-group row" v-if="formData.errors.length">
            <div class="col-sm-4">
              <b>Please correct the following error(s):</b>
              <ul>
                <li v-for="error in formData.errors">{{ error }}</li>
              </ul>
            </div>
          </div>

          <div class="form-group row">
            <label for="recipient"
                   class="col-sm-2 col-form-label">
              Recipient
            </label>
            <div class="col-sm-10">
              <input type="text"
                     class="form-control"
                     id="recipient"
                     v-model="formData.recipient"
                     placeholder="0x0abc"/>
            </div>
          </div>

          <div class="form-group row">
            <label for="name"
                   class="col-sm-2 col-form-label">
              Name
            </label>
            <div class="col-sm-10">
              <input type="text"
                     class="form-control"
                     id="name"
                     v-model="formData.name"/>
            </div>
          </div>

          <div class="form-group row">
            <label for="description"
                   class="col-sm-2 col-form-label">
              Description
            </label>
            <div class="col-sm-10">
              <input type="text"
                     class="form-control"
                     id="description"
                     v-model="formData.description"/>
            </div>
          </div>

          <div class="form-group row">
            <label for="nfcId"
                   class="col-sm-2 col-form-label">
              NFC ID
            </label>
            <div class="col-sm-10">
              <input type="text"
                     class="form-control"
                     id="nfcId"
                     maxlength="32"
                     v-model="formData.nfcId"/>
            </div>
          </div>

          <div class="form-group row">
            <label for="dob"
                   class="col-sm-2 col-form-label">
              Birth Date
            </label>
            <div class="col-sm-10">
              <input type="date"
                     class="form-control"
                     id="dob"
                     v-model="formData.dob"/>
            </div>
          </div>

          <div class="form-group row">
            <label for="gender"
                   class="col-sm-2 col-form-label">
              Gender
            </label>
            <div class="col-sm-10">
              <select class="form-control"
                      id="gender"
                      v-model="formData.gender">
                <option v-for="gender in formLookupData.gender" :value="gender">{{gender.name}}</option>
              </select>
            </div>
          </div>

          <div class="form-group row">
            <label for="colour"
                   class="col-sm-2 col-form-label">
              Colour
            </label>
            <div class="col-sm-10">
              <select class="form-control"
                      id="colour"
                      v-model="formData.colour">
                <option v-for="colour in formLookupData.colour" :value="colour">{{colour.name}}</option>
              </select>
            </div>
          </div>

          <div class="form-group row">
            <label for="gender"
                   class="col-sm-2 col-form-label">
              Batch
            </label>
            <div class="col-sm-10">
              <select class="form-control"
                      id="batch"
                      v-model="formData.batch">
                <option v-for="batch in formLookupData.batch" :value="batch">{{batch}}</option>
              </select>
            </div>
          </div>

          <div class="form-group row">
            <label for="gender"
                   class="col-sm-2 col-form-label">
              Class
            </label>
            <div class="col-sm-10">
              <select class="form-control"
                      id="nature"
                      v-model="formData.kclass">
                <option v-for="kclass in formLookupData.kclass" :value="kclass">{{kclass}}</option>
              </select>
            </div>
          </div>

          <div class="form-group row">
            <label for="gender"
                   class="col-sm-2 col-form-label">
              Skill
            </label>
            <div class="col-sm-10">
              <select class="form-control"
                      id="skill"
                      v-model="formData.skill">
                <option v-for="skill in formLookupData.skills" :value="skill">{{skill}}</option>
              </select>
            </div>
          </div>

          <button type="button" class="btn btn-primary" v-on:click="giveBirth">Kaiju Birth</button>

          <div class="row">
            <div class="col mt-5" v-if="response.ipfsHash">
              <code>IPFS Metadata: <a target="_blank" :href="'https://ipfs.infura.io/ipfs/' + response.ipfsHash">{{response.ipfsHash}}</a></code>
            </div>
            <div class="col mt-5" v-if="uploadedKaijusHashs">
              <clickable-transaction :transaction="uploadedKaijusHashs"></clickable-transaction>
            </div>
          </div>
        </form>

        <div class="row mt-5">
          <div class="col-sm-10">
            <code>{{generateIpfsData()}}</code>
          </div>
          <div class="col-sm-2">
            <img v-if="formData.colour" :src="'https://ipfs.infura.io/ipfs/' + formData.colour.hash"
                 class=""
                 style="max-height: 150px"/>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>

  import {mapGetters, mapState} from 'vuex';
  import * as _ from 'lodash';
  import * as moment from 'moment';
  import IPFS from 'ipfs-api';
  import Web3 from 'web3';
  import * as actions from '../../store/actions';
  import ClickableTransaction from '../widgets/ClickableTransaction';

  const ipfs = IPFS('ipfs.infura.io', '5001', {protocol: 'https'});

  export default {
    name: 'creator',
    components: {ClickableTransaction},
    data() {
      return {
        formLookupData: {
          gender: [
            {name: 'Male', id: 'M'},
            {name: 'Female', id: 'F'},
            {name: 'Asexual', id: 'A'}
          ],
          colour: [
            {
              name: 'Purple',
              hash: 'QmYSFTEeFFQ37qShWdW7S9odUmh3DaEF2SczuzG2uoGBAU',
              uri: 'https://ipfs.infura.io/ipfs/QmYSFTEeFFQ37qShWdW7S9odUmh3DaEF2SczuzG2uoGBAU'
            },
            {
              name: 'Green',
              hash: 'QmatreSMcd9GLLEX2xDpnjHDzY1EaxpSptZi2gbZzEN54a',
              uri: 'https://ipfs.infura.io/ipfs/QmatreSMcd9GLLEX2xDpnjHDzY1EaxpSptZi2gbZzEN54a'
            },
            {
              name: 'Gray ETH',
              hash: 'QmNtsy1B2LqW6H2RBeYPAFZhiFCGg327QZLaFmx1KdzFvy',
              uri: 'https://ipfs.infura.io/ipfs/QmNtsy1B2LqW6H2RBeYPAFZhiFCGg327QZLaFmx1KdzFvy'
            },
            {
              name: 'Orange BTC',
              hash: 'QmNgaX5Djp48JXdSj6yWz6WmAmGqnBDMoqHpDR4UA4NHVv',
              uri: 'https://ipfs.infura.io/ipfs/QmNgaX5Djp48JXdSj6yWz6WmAmGqnBDMoqHpDR4UA4NHVv'
            },
          ],
          kclass: [
            'Leader',
            'Determined',
            'Mutant',
            'Cute',
            'Explorer',
            'Creative',
            'Sporty',
            'Arrogant',
            'Kind',
            'Sneaky',
            'Firey',
            'Warrior',
            'Adventurer',
            'Gross',
            'Hero',
            'Joker',
            'Prankster',
            'Intelligent',
            'Mythical',
            'Wizard',
            'Genius',
            'Doctor',
            'Witch',
            'Sophisticated',
            'Omnipotent',
            'Rare AF',
          ],
          skills: [
            'Influential',
            'Cryptography Expert',
            'Hungry',
            'Lover',
            'Dancer',
            'Fluffy',
            'Writer',
            'Musician',
            'Liar',
            'Comedy',
            'Retired',
            'Technical',
            'Designer',
            'Fighter',
            'Fashionable',
            'Chubby',
            'Thief',
            'Magic',
            'Engineer',
            'Scavenger',
            'Communicator',
            'Entrepreneurial',
            'Analytical',
            'Tomfoolery',
            'Plumber',
            'Witty',
            'Flatulent',
            'Slimy',
            'Speedy',
            'Janitor',
            'Actor',
            'Gentleman',
            'Hodler',
            'Actress',
            'Psychic',
            'Collector',
            'Inquisitive',
            'Ambitious',
            'Brave',
            'Frugal',
            'Charming',
            'Frank',
            'Gregarious',
            'Philosophical',
            'Sailor',
            'Rascal',
          ],
          batch: ['Jaiantokoin', 'Genesis']
        },
        formData: {
          errors: [],
          dob: moment().format('YYYY-MM-DD'),
        },
        response: {
          ipfsHash: null
        }
      };
    },
    computed: {
      ...mapState(['account', 'uploadedKaijusHashs'])
    },
    mounted() {
      this.$nextTick(function () {
        this.formData.recipient = this.account;
      });
    },
    methods: {
      giveBirth: function () {
        this.checkForm();
        if (this.formData.errors.length === 0) {

          let ipfsData = this.generateIpfsData();
          let recipient = this.formData.recipient;
          let nfcId = this.formData.nfcId;

          let buffer = Buffer.from(JSON.stringify(ipfsData));
          ipfs.add(buffer)
            .then(function (response) {
              console.log(response);
              this.response.ipfsHash = response[0].hash;
              this.$store.dispatch(actions.BIRTH_KAIJUS, {
                recipient,
                nfcId,
                tokenURI: response[0].hash,
                ipfsData,
              });
            }.bind(this))
            .catch((error) => console.error(error));
        }
      },
      checkForm: function () {
        this.formData.errors = [];

        if (!this.formData.name) {
          this.formData.errors.push('Name is required.');
        }
        if (!this.formData.recipient) {
          this.formData.errors.push('Recipient is required.');
        } else if (!Web3.utils.isAddress(this.formData.recipient)) {
          this.formData.errors.push('Recipient not valid address.');
        }
        if (!this.formData.description) {
          this.formData.errors.push('Description is required.');
        }
        if (!this.formData.colour) {
          this.formData.errors.push('Colour is required.');
        }
        if (!this.formData.dob) {
          this.formData.errors.push('DOB is required.');
        }
        if (!this.formData.gender) {
          this.formData.errors.push('Gender is required.');
        }
        if (!this.formData.batch) {
          this.formData.errors.push('Batch is required.');
        }
        if (!this.formData.kclass) {
          this.formData.errors.push('Class is required.');
        }
        if (!this.formData.skill) {
          this.formData.errors.push('Skill is required.');
        }
      },
      generateIpfsData: function () {
        return {
          name: _.get(this.formData, 'name'),
          description: _.get(this.formData, 'description'),
          image: _.get(this.formData, 'colour.uri'),
          attributes: {
            dob: _.get(this.formData, 'dob'),
            nfc: _.get(this.formData, 'nfcId'),
            colour: _.lowerCase(_.get(this.formData, 'colour.name')),
            gender: _.lowerCase(_.get(this.formData, 'gender.name')),
            batch: _.lowerCase(_.get(this.formData, 'batch')),
            class: _.lowerCase(_.get(this.formData, 'kclass')),
            skill: _.lowerCase(_.get(this.formData, 'skill'))
          },
          external_uri: 'https://cryptokaiju.io',
        };
      }
    },
  };
</script>

<style lang="scss" scoped>

</style>
