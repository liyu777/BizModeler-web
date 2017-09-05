import attributeVindicate from '@/components/ly-components/attributeVindicate'
import modelList from '@/components/ly-components/modelList'
import classDefine from '@/components/ly-components/classDefine'

export default [
  {
    path: '/',
    name: 'attributeVindicate',
    component: attributeVindicate
  },
  {
    path: '/attributeVindicate/:id/:classid',
    name: 'attributeVindicate1',
    component: attributeVindicate
  },
  {
    path: '/modelList',
    name: 'modelList',
    component: modelList
  },
  {
    path: '/classDefine/:rout/:id',
    name: 'classDefine',
    component: classDefine
  }
]
