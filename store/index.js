export const state = () => {
    redirectUrl: null
}

export const mutations = {
    setRedirectUrl: (state, value) => {
        state.redirectUrl = value
    }
}