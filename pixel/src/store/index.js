import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    status: '',
    token: localStorage.getItem('token') || '',
    user: localStorage.getItem('username') || {}
  },
  mutations: {
    auth_request(state) {
      state.status = 'loading'
    },
    auth_success(state, data) {
      state.status = 'success'
      state.user = data.username
      state.token = data.token
    },
    auth_error(state) {
      state.status = 'error'
    },
    logout(state) {
      state.status = ''
      state.token = ''
    },
  },
  actions: {
    login({ commit }, user) {
    return new Promise((resolve, reject) => {
      commit('auth_request')
      axios({ url: 'http://localhost:3000/login', data: user, method: 'POST' })
        .then(resp => {
          const data = {
            token: resp.data.token,
            username: resp.data.username
          }
          localStorage.setItem('token', data.token)
          localStorage.setItem('username', data.username)
          // Add the following line:
          axios.defaults.headers.common['Authorization'] = 'bearer ' + data.token
          commit('auth_success', data)
          resolve(resp)
        })
        .catch(err => {
          commit('auth_error')
          localStorage.removeItem('token')
          reject(err)
        })
    })
    },
    register({ commit }, user) {
      return new Promise((resolve, reject) => {
        commit('auth_request')
        axios({ url: 'http://localhost:3000/users', data: user, method: 'POST' })
          .then(resp => {
            const data = {
              token: resp.data.token,
              username: resp.data.username
            }
            localStorage.setItem('token', data.token)
            localStorage.setItem('username', data.username)
            // Add the following line:
            axios.defaults.headers.common['Authorization'] = 'bearer ' + data.token
            commit('auth_success', data)
            resolve(resp)
          })
          .catch(err => {
            commit('auth_error', err)
            localStorage.removeItem('token')
            reject(err)
          })
      })
    },
    logout({ commit }) {
      return new Promise((resolve) => {
        commit('logout')
        localStorage.removeItem('token')
        localStorage.removeItem('username')
        delete axios.defaults.headers.common['Authorization']
        resolve()
      })
    }
  },
  getters: {
    isLoggedIn: state => !!state.token,
    authStatus: state => state.status,
    username: state => state.user
  }
})
