import Vue from 'vue'
import Router from 'vue-router'
import _ from 'lodash'
import route1 from './index1.js'
import route2 from './index2.js'
import route3 from './index3.js'
import route4 from './index4.js'
import route5 from './index5.js'

var route = _.concat(route1, route2, route3, route4, route5)
Vue.use(Router)

export default new Router({
  routes: route
})
