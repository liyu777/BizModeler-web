import list from '@/components/m-cmpns/model_his_list'
import modelDefine from '@/components/m-cmpns/modelDefine'
import modelUpdateHis from '@/components/m-cmpns/modelUpdateHis'
import modelCompare from '@/components/m-cmpns/modelCompare'

export default [
  {
    path: '/',
    name: 'list',
    component: list
  },
  {
    path: '/list',
    name: 'list1',
    component: list
  }, {
    path: '/modelDefine/:id/:code',
    name: 'modelDefine',
    component: modelDefine
  }, {
    path: '/modelUpdateHis',
    name: 'modelUpdateHis',
    component: modelUpdateHis
  }, {
    path: '/modelCompare',
    name: 'modelCompare',
    component: modelCompare
  }
]
