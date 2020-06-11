<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
    >
      <v-container
        fluid
        no-gutters
        class="flex-column flex-nowrap align-start align-content-start justify-start fill-height pa-0 ma-0"
      >
        <v-col>
          <v-list-item class="accent" v-if='auth.loggedIn'>
            <v-row>
              <v-col cols="4">
                <v-avatar color="primary" tile :size="68">
                  <span class="white--text headline">{{ account }}</span>
                </v-avatar>
              </v-col>
              <v-col>
                <v-list-item-content>
                  <v-list-item-title class="title">
                    Hello
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    {{ auth.user.name }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-col>
              <v-divider></v-divider>
            </v-row>
          </v-list-item>
          <v-list class="mb-auto" style="flex: 1" dense shaped>
            <template v-for="item in items">
              <v-list-group
                sub-group
                v-if="item.children"
                :key="item.id"
                v-model="item.model"
                value="true"
                :prepend-icon="item.icon"
              >
                <template v-slot:activator>
                  <v-list-item-content>
                    <v-list-item-title>
                      {{ item.name }}
                    </v-list-item-title>
                  </v-list-item-content>
                </template>
                <!-- <v-list-item-group v-model="model"> -->
                <v-list-item
                  v-for="child in item.children"
                  :to="child.url"
                  :key="child.id"
                  link
                >
                  <v-list-item-action v-if="child.icon">
                    <v-icon dense>{{ child.icon }}</v-icon>
                  </v-list-item-action>
                  <v-list-item-content>
                    <v-list-item-title>
                      {{ child.name }}
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <!-- </v-list-item-group> -->
              </v-list-group>
              <v-list-item v-else :key="item.id" link>
                <v-list-item-action>
                  <v-icon>{{ item.icon }}</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title>
                    {{ item.name }}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
          </v-list></v-col
        >

        <v-col
          @click.stop="logout"
          class="align-self-end flex-grow-0 flex-shrink-0"
          ><v-btn color="secondary" tile x-large text block>登出</v-btn></v-col
        >
      </v-container>
      <!-- <v-spacer></v-spacer>
      <v-btn >登出</v-btn> -->
    </v-navigation-drawer>
    <v-app-bar
      :clipped-left="clipped"
      collapse-on-scroll
      fixed
      app
      :prominent="prominent"
    >
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
    <v-footer :fixed="fixed" app v-if="$vuetify.breakpoint.mdAndUp">
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
import { reduce, filter, isNull, isUndefined } from "lodash";
import { mapState } from "vuex";
export default {
  mounted() {
    this.$api.post(this.$api.urls.GET_DRAWER_MENU).then(res => {
      res = res.data;
      this.rootId = res.rootId || undefined;
      // this.items = res.items
      this.items = reduce(
        res,
        (r, v, k) => {
          v.model = true
          if (
            isUndefined(v.parentId) ||
            isNull(v.parentId) ||
            v.parentId == res.rootId
          ) {
            v.children = filter(res, { parentId: v.id });
            r.push(v);
          }
          return r;
        },
        []
      );
      // console.info(this.items)
      // let part = partition(this.items, { id: rootId })
      // this.rootItems = part[0]
      // this.subItems = part[1]
    });
  },
  methods: {
    logout() {
      this.$api.logout();
    }
  },
  computed: {
    ...mapState(["auth"]),
    account() {
      return this.auth.user.account.substr(0, 2).toUpperCase();
    }
  },
  data() {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items: [],
      miniVariant: false,
      prominent: false,
      title: "智伴微商城管理后台"
    };
  }
};
</script>
