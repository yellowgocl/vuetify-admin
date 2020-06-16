export const state = () => {
}

export const mutations = {
}

export const actions = {
    async nuxtServerInit ({ commit, state }, { req, app }) {
      console.info(app.$axios.proxy)
    //   let auth = null
    //   if (req.headers.cookie) {
    //     // cookie found
    //     try {
    //         console.info(state)
    //       // check data user login with cookie

    //       const data = await app.$axios.get('https://dev-hypoxia.zhibankeji.com/auth/v1/sys/user')
    //       // server return the data is cookie valid loggedIn is true
    //       auth = data // set the data auth
    //     } catch (err) {
    //       // No valid cookie found
    //       auth = null
    //     }
    //   }
    //   commit('SET_AUTH', auth) // set state auth
    },
  }