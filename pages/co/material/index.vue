<template>
<v-container class="co-material">
    <v-card >
        <v-card-title>
            <v-col cols=12 md='3'>素材管理</v-col>
            
            <v-col cols=12 md='9'>
            <v-form @submit.prevent="onSearch">
            <v-text-field
                solo-inverted
                flat
                hide-details
                v-model="search"
                append-icon="search"
                label="输入关键字搜索素材"
                single-line
            ></v-text-field>
            <button type='submit' hidden form='form'></button>
            </v-form>
            </v-col>
        </v-card-title>
        <v-card-text>
            <v-data-table
                v-if='items && items.length > 0'
                :headers="headers"
                :items="items"
                :options.sync="options"
                :loading="loading"
                :server-items-length="total"
                hide-default-footer
                class="" >
                <template v-slot:item.createDate="{ item }">
                    <span>{{item.createDate|dateFormat}}</span>
                </template>
                <template v-slot:item.updateDate="{ item }">
                    <span>{{(item.updateDate || item.createDate)|dateFormat}}</span>
                </template>
                <template v-slot:item.createBy="{ item }">
                    <span>{{item.createSysUser ? item.createSysUser.name : item.createBy}}</span>
                </template>
                <template v-slot:item.shareCount="{ item }">
                    <v-chip small class='share-count-value' :color="getColor(item.shareCount)" dark>{{ item.shareCount }}</v-chip>
                </template>
                <template v-slot:item.actions="{ item }">
                    <template v-if='item.loading'>
                        <v-progress-circular size='24' indeterminate color="primary"></v-progress-circular>
                    </template>
                    <template v-else>
                        <div style='min-width: 4rem;'>
                        <nuxt-link :to='`/co/material/${item.id}`'><v-btn class="mx-1" fab :small='!$vuetify.breakpoint.xsOnly' color='info' icon><v-icon :small='!$vuetify.breakpoint.xsOnly'>edit</v-icon></v-btn></nuxt-link>
                        <v-btn fab :small='!$vuetify.breakpoint.xsOnly' color='pink' @click.stop="deleteItem(item)" icon><v-icon color='pink' :small='!$vuetify.breakpoint.xsOnly' >delete</v-icon></v-btn>
                        </div>
                    </template>
                </template>
                <template v-slot:item.status="{item}">
                    <v-switch class='mr-n3' :disabled='item.loading' @change='onEnabled(item)' :true-value='1' :false-value='0' v-model="item.status" inset></v-switch>
                    <!--  :label="`${!!item.status ? '启用' : '禁用'}`" -->
                </template>
                <template v-slot:expanded-item="{ headers, item }">
                    <v-container no-gutters class='py-0'>
                    <v-row no-gutters align='center'>
                        <span class="grey--text mr-2">标签: </span>
                        <v-chip
                            v-for="(tag) in item.tags"
                            :key="tag.value"
                            class="ma-2"
                            dense
                            small
                            color="teal"
                            text-color="white"
                            >
                            {{ tag }}
                            </v-chip>
                        
                    </v-row>
                    </v-container>
                </template>
            </v-data-table>
            <v-row align='stretch'><v-spacer></v-spacer><v-col style='flex-grow: 0'><v-pagination @input='onChangePagination' v-model="page" :length="paginationCount"></v-pagination></v-col></v-row>
        </v-card-text>
    </v-card>
    <v-btn
        nuxt
        to='/co/material/new'
        color="secondary"
        fixed
        fab
        large
        dark
        bottom
        right
        class="fab"
      >
        <v-icon>add</v-icon>
      </v-btn>
      <v-snackbar :color='snackbarColor' v-model="snackbar" >
            {{ tipsText }}
            <v-btn color="white" fab large icon @click="snackbar=false" ><v-icon dark>cancel</v-icon></v-btn>
        </v-snackbar>
    </v-container>
</template>

<script>
import { unionWith, merge, toNumber, assign, pick, keys, unset, isNaN } from 'lodash'
export default {
    data() {
        return {
            snackbarMode: 0,
            snackbar: false,
            tipsText: '',
            page: 1,
            total: 0,
            search: '',
            loading: false,
            options: { page: 1, itemsPerPage: 10 },
            items: [],
            headers: [
                { text: '状态', align: 'center', sortable: true, value: 'status' },
                { text: '素材名', align: 'start', sortable: false, value: 'title' },
                { text: '创建人', align: 'start', sortable: true, value: 'createBy' },
                // { text: '浏览量', align: 'center', sortable: true, value: 'browseCount' },
                { text: '创建日期', align: 'center', sortable: true, value: 'createDate' },
                { text: '修改日期', align: 'center', sortable: true, value: 'updateDate' },
                { text: '累计分享', align: 'center', sortable: true, value: 'shareCount' },
                { text: '操作项', align: "center" ,value: 'actions', sortable: false },
                // { text: '', value: 'data-table-expand' },
            ]
        }
    },
    filters: {
        dateFormat: function(v) {
            return new Date(v).toLocaleDateString()
        }
    },
    mounted() {
        let p = toNumber(this.$route.hash.replace('#', ''));
        this.options.page = (isNaN(p) || !p) ? 1 : p
        this.page = this.options.page
        this.fetchList({ pageNo: this.options.page })
    },
    watch: {
        // options: {
        //     handler(n, o) {
        //         this.fetchList({ pageNo: n.page })
        //     },
        //     deep: true
        // }
    },
    computed: {
        snackbarColor() {
            return this.snackbarMode == 0 ? 'error' : 'info'
        },
        paginationCount() {
            return Math.ceil((this.total/this.options.itemsPerPage))
        }
    },
    methods: {
        reset() {
            this.page = this.options.page = 1
            this.total = 0
        },
        onSearch() {
            this.reset()
            this.fetchList({ pageNo: this.options.page })
        },
        onChangePagination(e) {
            this.fetchList({ pageNo: e })
        },
        fetchList(params) {
            if (this.loading) {
                return
            }
            this.loading = true
            this.$nuxt.$loading.start()
            this.$api.fetchAcrhiveList(assign({ pageSize: this.options.itemsPerPage, keywords: this.search }, params)).then(res => {
                res = res.data
                this.loading = false
                this.total = res.total
                this.items = res.content
                this.$nuxt.$loading.finish()
                history.pushState(
                    {},
                    null,
                    this.$route.path + '#' + encodeURIComponent(params ? params.pageNo : 1)
                )
            }, rej => {
                this.loading = false
                this.$nuxt.$loading.finish()
            })
        },
        getColor (count) {
            if (count > 400) return 'red'
            else if (count > 200) return 'orange'
            else return 'green'
        },
        deleteItem(item) {
            if (item) {
                let params = assign({}, item)
                unset(params, 'loading')
                item.loading = true
                
                // this.items = unionWith(this.items, [item])
                let flag = confirm('是否确认移除?')
                flag && this.$api.delArchive(params.id).then(res => {
                    const index = this.items.indexOf(item)
                    this.items.splice(index, 1)
                    item.loading = false
                    this.snackbar = true
                    this.snackbarMode = 1
                    this.tipsText = '删除成功.'
                    // this.items = unionWith(this.items, [item])
                }, rej => {
                    item.loading = false
                    // item.loading = false
                    this.snackbar = true
                    this.snackbarMode = 0
                    this.tipsText = rej.message
                })
            }
        },
        editItem(item) {
            if (item) {
                this.$router.navigateTo
            }
        },
        onEnabled(item) {
            if (item) {
                let params = assign({}, item)
                unset(params, 'loading')
                item.loading = true
                this.items = unionWith(this.items, [item])
                this.$api.modArchive(params).then(res => {
                    res = res.data
                    item.loading = false
                    this.items = unionWith(this.items, [item])
                }, rej => {
                    item.loading = false
                    item.status = item.status == 0 ? 1 : 0
                    this.items = unionWith(this.items, [item])
                })
            }
        }
    }
}
</script>

<style scoped>
.co-material {
    margin-bottom: 3.5rem;
}
.co-material /deep/ a:any-link{
    text-decoration: none !important;
}
.co-material /deep/ .fab {
    bottom: 3rem;
    right: 2rem;
}
.co-material .share-count-value {
    min-width: 3rem;
    text-align: center;
}
.co-material .share-count-value /deep/ .v-chip__content {
    flex: 1;
    justify-content: center
}
</style>
