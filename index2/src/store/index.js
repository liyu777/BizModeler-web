import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    modelMainLeftTreeCurrSelectId: '',
    methodsChoiceId: '',
    methodsChoiceName: '',
    edmCodeName: '',
    methodType: '',
    classId: '',
    showType: '',
    treeEdmcEdmdId: '',
    classSelectId: '',
    classSelectName: ''
  },
  mutations: {
    modelMainLeftTreeCurrSelect (state, id) {
      state.modelMainLeftTreeCurrSelectId = id
    },
    methodsChoice (state, id) {
      state.methodsChoiceId = id
    },
    methodsChoiceN (state, name) {
      state.methodsChoiceName = name
    },
    edmCode (state, name) {
      state.edmCodeName = name
    },
    addMethod (state, type) {
      state.methodType = type
    },
    editProperty (state, id) {
      state.classId = id
    },
    showType (state, id) {
      state.showType = id
    },
    treeEdmcEdmdId (state, id) {
      state.treeEdmcEdmdId = id
    },
    classSelectId (state, id) {
      state.classSelectId = id
    },
    classSelectName (state, name) {
      state.classSelectName = name
    }
  },
  actions: {
    modelMainLeftTreeCurrSelect (context, id) {
      context.commit('modelMainLeftTreeCurrSelect', id)
    },
    methodsChoice (context, id) {
      context.commit('methodsChoice', id)
    },
    methodsChoiceN (context, name) {
      context.commit('methodsChoiceN', name)
    },
    edmCode (context, name) {
      context.commit('edmCode', name)
    },
    addMethod (context, type) {
      context.commit('addMethod', type)
    },
    editProperty (context, id) {
      context.commit('editProperty', id)
    },
    showType (context, id) {
      context.commit('showType', id)
    },
    treeEdmcEdmdId (context, id) {
      context.commit('treeEdmcEdmdId', id)
    },
    classSelectId (context, id) {
      context.commit('classSelectId', id)
    },
    classSelectName (context, name) {
      context.commit('classSelectName', name)
    }

  }
})
