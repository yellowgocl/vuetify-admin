<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
    >
    <v-list-item>
        <v-row>
          <v-col cols='4'>
            <v-avatar color="primary" tile :size='68'>
              <span class="white--text headline">AD</span>
            </v-avatar>
          </v-col>
          <v-col>
              <v-list-item-content>
              <v-list-item-title class="title">
                Hello
              </v-list-item-title>
              <v-list-item-subtitle>
                admin
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-col>
        </v-row>
      </v-list-item>

      <v-divider></v-divider>
      <v-list dense shaped>
        <template v-for="item in items">
          <v-list-group sub-group v-if='item.children' :key='item.id' v-model='item.model' value="true" :prepend-icon='item.icon' >
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title>
                  {{ item.text }}
                </v-list-item-title>
              </v-list-item-content>
            </template>
            <!-- <v-list-item-group v-model="model"> -->
            <v-list-item
              v-for="(child, i) in item.children"
              :to='child.url'
              :key="i"
              link>
              <v-list-item-action v-if="child.icon">
                <v-icon dense>{{ child.icon }}</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  {{ child.text }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <!-- </v-list-item-group> -->
          </v-list-group>
          <v-list-item v-else :key="item.id" link >
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>
                {{ item.text }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar :clipped-left="clipped" collapse-on-scroll fixed app :prominent='prominent'>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <!-- <v-btn icon @click.stop="miniVariant = !miniVariant">
        <v-icon>mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>
      </v-btn>
      <v-btn icon @click.stop="fixed = !fixed">
        <v-icon>mdi-minus</v-icon>
      </v-btn> -->
      <v-toolbar-title v-text="title" />
      <v-spacer />
    </v-app-bar>
    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
    <v-footer :fixed="fixed" app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
import { reduce, filter } from 'lodash'
export default {
  middleware: 'auth',
  mounted(){
    if (!this.$storage.getItem('auth')) {
      this.$api.post(this.$api.urls.IS_SIGN_IN).then(res => {
        console.info(res)
      })
    }
    this.$api.get(this.$api.urls.GET_DRAWER_MENU).then(res => {
        this.rootId = res.rootId
        // this.items = res.items
        this.items = reduce(res.items, (r, v, k) => {
            if (v.parentId == res.rootId) {
                v.children = filter(res.items, { parentId: v.id })
                r.push(v)
            }
            return r
        }, [])
        console.info(this.items)
        // let part = partition(this.items, { id: rootId })
        // this.rootItems = part[0]
        // this.subItems = part[1]
    })
  },
  data() {
    return {
      clipped: false,
      drawer: true,
      fixed: false,
      items: [
        {
          icon: 'mdi-apps',
          title: 'Welcome',
          to: '/'
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Inspire',
          to: '/inspire'
        }
      ],
      miniVariant: false,
      prominent: false,
      title: '智伴微商城管理后台'
    }
  }
}
</script>
