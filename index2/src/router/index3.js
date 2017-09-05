import MethodManage from '@/components/method-manage/method-manage'
import MethodDefine from '@/components/method-manage/method-define'
import FModel from '@/components/method-manage/F-model'
import MethodModel from '@/components/method-manage/method-model'

export default [
  {
    path: '/method-manage',
    name: 'MethodManage',
    component: MethodManage
  },
  {
    path: '/method-define',
    name: 'MethodDefine',
    component: MethodDefine
  },
  {
    path: '/F-model',
    name: 'FModel',
    component: FModel
  },
  {
    path: '/method-model',
    name: 'MethodModel',
    component: MethodModel
  }
]
