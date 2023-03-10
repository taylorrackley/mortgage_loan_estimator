import Vue from 'vue';
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';
import App from './App.vue';
import store from './store';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

import './app.scss';

Vue.use(BootstrapVue);
Vue.use(IconsPlugin);

new Vue({
    store,
    render: (h) => h(App),
}).$mount('#app');
