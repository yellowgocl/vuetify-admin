import LocalScheme from '@nuxtjs/auth/lib/schemes/local'

export default class CustomLocalScheme extends LocalScheme {
    async login(endpoint) {
        if (!this.options.endpoints.login) {
            return
        }
        await this.$auth.reset()
        const { response, result } = await this.$auth.request(endpoint, this.options.endpoints.login, true)
        console.info(response, result)
        if (!response.authorization) {
            return
        }
        if (this.options.tokenRequired) {
            const token = this.options.tokenType
              ? this.options.tokenType + ' ' + response.authorization
              : response.authorization
            this.$auth.setToken(this.name, token)
            this._setToken(token)
          }
      
          // Fetch user if `autoFetchUser` is enabled
          if (this.options.autoFetchUser) {
            await this.fetchUser()
          }
        return response
    }
}