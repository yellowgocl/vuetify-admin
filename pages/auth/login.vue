<template>
  <v-container class="fill-height pa-0" fluid>
      <div class="bg">
        <v-img class='bg' 
          src='/images/bg-0.jpg' 
          gradient='to top, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.5)'  height='100vh' width='100vw'></v-img>
      </div>
        <v-row align='center' justify='center'>
          <v-col cols="10" sm="8" md='6'>
            <v-card active-class='card' raised>
              <v-toolbar color="primary" dark flat >
                <v-toolbar-title>请登入</v-toolbar-title>
              </v-toolbar>
              <v-spacer></v-spacer>
              <v-card-text>
                <v-form @submit.prevent="validate" id='form' ref="form" v-model="valid" :lazy-validation="lazy">
                  <v-text-field
                    v-model="name"
                    :counter="10"
                    :rules="nameRules"
                    clearable
                    label="用户名"
                    prepend-icon='person'
                    required
                  ></v-text-field>
                  <v-text-field
                    v-model="password"
                    :counter="20"
                    :type="showPassword ? 'text' : 'password'"
                    :rules="passwordRules"
                    prepend-icon='lock'
                    :append-icon='showPassword ? "visibility": "visibility_off"'
                    @click:append='showPassword  = !showPassword'
                    label="密码"
                    clearable
                    required
                  ></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn :loading='loading' type='submit' form='form' color="primary px-4 mr-2 mb-2">确定</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
      </v-row>
      <v-snackbar color='error' v-model="snackbar" >
            {{ tipsText }}
            <v-btn color="white" fab large icon @click="snackbar=false" ><v-icon dark>cancel</v-icon></v-btn>
        </v-snackbar>
    </v-container>
</template>

<script>
export default {
  layout: 'clean',
  data() {
    return {
      tipsText: '',
      snackbar: false,
      loading: false,
      showPassword: false,
      valid: true,
      lazy: false,
      name: '',
      password: '',
      nameRules: [
        v => !!v || 'Name is required',
        v => (v && v.length <= 10) || 'Name must be less than 10 characters',
      ],
      passwordRules: [
        v => !!v || 'Password is required',
        v => (v && v.length <= 20) || 'Password must be less than 20 characters',
      ],
    }
  },
  mounted() {
    // this.$api.logout()
    console.info(this.$auth.$storage.getLocalStorage('redirectUrl'))
  },
  methods: {
    validate () {
      if (this.loading) {
        return
      }
      this.loading = true
      let flag = this.$refs.form.validate()
      if (flag) {
        this.$api.login({ data: { account: this.name, password: this.password } }).then(res => {
          // this.$auth.$storage.setUniversal('auth', res.authorization, false)
          // this.$storage.setItem('auth', res.authorization)
          let redirectUrl = this.$auth.$storage.getUniversal('redirectUrl') || '/'
          this.$router.replace({ path: redirectUrl })
          this.$auth.$storage.setUniversal('redirectUrl', null)
          this.loading = false

        }, rej => {
          this.loading = false
          this.snackbar = true
          this.tipsText = rej.message
          console.error(rej)
        })
        // this.$api.post(this.$api.urls.LOGIN, { data: { account: this.name, password: this.password } }).then(res => {
        //   this.$storage.setItem('auth', res.authorization)
        //   this.$router.replace({ path: '/' })
        //   this.loading = false
        // }, rej => {
        //   this.loading = false
        //   this.snackbar = true
        //   this.tipsText = ref.message
        // })
      }
    },
  }
}
</script>

<style scoped>
.bg{
  position: fixed;
  top:0;
}

</style>
