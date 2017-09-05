import Vue from 'vue'
import Router from 'vue-router'
import modelMain from '@/components/m-maintain/modelMain'
import model from '@/components/m-maintain/model_maintain'
import methods from '@/components/m-maintain/model_methods'
import constant from '@/components/m-maintain/model_constant'
import setMain from '@/components/m-maintain/model_setmain'
import basic from '@/components/m-maintain/model_basic'
import modelMain2 from '@/components/m-maintain/modelMain2'

Vue.use(Router)

export default [
  {
    path: '/modelMain/:if/:id',
    name: 'modelMain',
    component: modelMain,
    children: [
      {
        path: '/modelMain/:if/:id',
        name: 'model',
        component: model
      },
      {
        path: '/model',
        name: 'model1',
        component: model
      },
      {
        path: '/methods',
        name: 'methods',
        component: methods
      },
      {
        path: '/constant',
        name: 'constant',
        component: constant
      },
      {
        path: '/basic',
        name: 'basic',
        component: basic
      }
    ]
  },
  {
    path: '/setMain',
    name: 'setMain',
    component: setMain
  },
  {
    path: '/setMain/:type/:id',
    name: 'setMain1',
    component: setMain
  },
  {
    path: '/modelM/:id',
    name: 'modelM',
    component: modelMain2,
    children: [
      {
        path: '/modelM/:id',
        name: 'model2',
        component: model
      },
      {
        path: '/model/:id',
        name: 'model3',
        component: model
      },
      {
        path: '/methods/:id',
        name: 'methods1',
        component: methods
      },
      {
        path: '/constant/:id',
        name: 'constant1',
        component: constant
      },
      {
        path: '/basic/:id',
        name: 'basic1',
        component: basic
      }
    ]
  }
]
