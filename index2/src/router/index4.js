import methodChoice from '@/components/m-cmpns/method-choice'
import methodClassify from '@/components/m-cmpns/method-classify'

export default [
  {
    path: '/methodClassify',
    name: 'methodClassify',
    component: methodClassify
  },
  {
    path: '/methodChoice/:type/:id',
    name: 'methodChoice',
    component: methodChoice
  }
]
