import Vue from 'vue'
import App from './App.vue'

import { defineCustomElements } from '@carto/airship-components';

Vue.config.productionTip = false;
Vue.config.ignoredElements = [/as-\w+/];

defineCustomElements(window);

new Vue({
  render: h => h(App)
}).$mount('#app');
