<template>
    <div id="app" class="position-absolute h-100 w-100">
        <FormInput />
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import FormInput from './components/FormInput.vue';

@Component({
    components: {
        FormInput,
    },
})
export default class App extends Vue {}
</script>

<style lang="scss">
* {
    color: #740505
}

input[type="range"]::-webkit-slider-thumb, input[type="range"]::-webkit-slider-thumb:active {
  width: 25px;
  height: 25px;
  margin-top: -8px;
  border-radius: 50%;
  background-color: #740505
}
button {
    background-color: #740505 !important;
    border: solid #740505 1px !important;
}
// #app {
//   font-family: Avenir, Helvetica, Arial, sans-serif;
//   -webkit-font-smoothing: antialiased;
//   -moz-osx-font-smoothing: grayscale;
//   text-align: center;
//   color: #2c3e50;
//   margin-top: 60px;
// }
</style>
