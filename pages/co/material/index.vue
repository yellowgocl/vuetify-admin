<template>
<v-container fluid class="co-material">
    <v-card min-height='75vh' class='pb-2' :class='{"mb-12":$vuetify.breakpoint.smAndDown}'>
        <v-card-title class='head grey darken-4' :class='{"pa-1":$vuetify.breakpoint.xsOnly}'>
            <v-col :class='{"subtitle-2":$vuetify.breakpoint.smAndDown}' cols=4 sm='3'>素材管理</v-col>
            <v-col cols=8 sm='9' :class='{"py-1": $vuetify.breakpoint.smAndDown}'>
                <v-form @submit.prevent="onSearch">
                    <v-text-field
                        solo
                        flat
                        hide-details
                        v-model="search"
                        :append-icon="search?'':'search'"
                        label="输入关键字搜索素材"
                        clearable
                        :dense='$vuetify.breakpoint.xsOnly'
                        single-line
                    ></v-text-field>
                    <button type='submit' hidden form='form'></button>
                </v-form>
            </v-col>
        </v-card-title>
        <v-card-text :class='{"px-2":$vuetify.breakpoint.xsOnly}'>
            <v-row align='center' align-contennt='space-around'>
            <v-col cols=12 sm='6'>
                <v-select
                    v-model="selectedCategoies"
                    :items="categories"
                    attach
                    solo-inverted
                    flat
                    chips
                    item-value='id'
                    item-text='name'
                    hide-details
                    placeholder='选择分类(可多选)'
                    multiple
                    clearable
                    @change='onSearch'
                ></v-select>
            </v-col>
            <v-col cols=12 sm='6'>
                <v-select
                    v-model="selectedTags"
                    :items="tags"
                    attach
                    solo-inverted
                    flat
                    chips
                    item-value='value'
                    item-text='value'
                    hide-details
                    placeholder='选择标签(可多选)'
                    multiple
                    clearable
                    @change='onSearch'
                ></v-select>
            </v-col>
            </v-row>
        </v-card-text>
        <v-card-text :class='{"pa-0":$vuetify.breakpoint.xsOnly, "mt-n12": $vuetify.breakpoint.xsOnly }'>
            <v-data-table
                v-if='items && items.length > 0'
                :headers="headers"
                :items="items"
                :options.sync="options"
                :loading="loading"
                :server-items-length="total"
                no-data-text='暂无数据'
                disable-sort
                hide-default-footer>
                <template v-slot:item.updateDate="{ item }">
                    <span>{{(item.updateDate || item.createDate)|dateFormat}}</span>
                </template>
                <template v-slot:item.createBy="{ item }">
                    <span>{{item.createSysUser ? item.createSysUser.name : item.createBy}}</span>
                </template>
                <template v-slot:item.shareCount="{ item }">
                    <span :class='getColor(item.shareCount)'>{{ item.shareCount }}</span>
                    <!-- <v-chip small class='share-count-value' :color="getColor(item.shareCount)" dark>{{ item.shareCount }}</v-chip> -->
                </template>
                <template v-slot:item.actions="{ item }">
                    <template v-if='item.loading'>
                        <v-progress-circular size='24' indeterminate color="primary"></v-progress-circular>
                    </template>
                    <template v-else>
                        <v-row justify="space-between" class='actions flex-nowrap my-1 mr-n2 pa-1 accent' :class='{"mb-4": $vuetify.breakpoint.xsOnly}'>
                            <nuxt-link :class="{ 'mr-4': $vuetify.breakpoint.xsOnly }" :to='`/co/material/${item.id}`'><v-btn fab small color='info' icon><v-icon >edit</v-icon></v-btn></nuxt-link>
                            <v-btn fab small color='pink' @click.stop="deleteItem(item)" icon><v-icon color='pink' >delete</v-icon></v-btn>
                        </v-row>
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
            <no-data v-else ></no-data>
            <v-row v-if='items && items.length > 0' align='stretch'><v-spacer></v-spacer><v-col style='flex-grow: 0'><v-pagination @input='onChangePagination' v-model="page" :length="paginationCount"></v-pagination></v-col></v-row>
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
import noData from '~/components/NoData'
export default {
    components: { noData },
    data() {
        return {
            selectedCategoies: [],
            selectedTags: [],
            snackbarMode: 0,
            snackbar: false,
            tipsText: '',
            page: 1,
            total: 0,
            search: '',
            loading: false,
            options: { page: 1, itemsPerPage: 10 },
            categories: [],
            tags: [],
            items: [],
            headerProps: { 'disable-sort': true, },
            headers: [
                { text: '状态', align: 'd-none', width: '3rem', sortable: false, value: 'status' },
                { text: '排序号', align: 'center', width: '5rem', sortable: false, value: 'orderNum' },
                { text: '素材名', align: 'd-none', sortable: false, value: 'title' },
                { text: '创建人', align: 'd-none', sortable: false, value: 'createBy' },
                // { text: '浏览量', align: 'd-none', sortable: true, value: 'browseCount' },                
                { text: '修改日期', align: 'd-none', sortable: false, value: 'updateDate' },
                { text: '累计分享', align: 'center', sortable: false, value: 'shareCount' },
                { text: '操作项', align: "d-none", width:'7rem' ,value: 'actions', sortable: false },
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
        this.$nextTick(() => this.fetchList({ pageNo: this.options.page }))
        this.$api.getCategoryList().then(res => {
            res = res.data
            this.categories = res.content;
        });
        this.$api.fetchTagList().then(res => {
            res = res.data
            this.tags = res.content;
        });
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
            this.fetchList({ 
                pageNo: this.options.page, 
                categoryIds: this.selectedCategoies,
                tags: this.selectedTags
            })
        },
        onChangePagination(e) {
            this.fetchList({ pageNo: e }).then(res => {
                this.$vuetify.goTo(0)
            })
        },
        fetchList(params) {
            if (this.loading) {
                return Promise.reject({
                    code: -302,
                    message: '正在记载，请稍后'
                })
            }
            this.loading = true
            this.$nuxt.$loading.start()
            return this.$api.fetchAcrhiveList(assign({ pageSize: this.options.itemsPerPage, keywords: this.search }, params)).then(res => {
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
                return res
            }, rej => {
                this.loading = false
                this.$nuxt.$loading.finish()
                return rej
            })
        },
        getColor (count) {
            if (count > 400) return 'red--text'
            else if (count > 200) return 'orange--text'
            else return 'green--text'
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
.co-material /deep/ .actions {
    border-radius: 3rem;
}
.co-material /deep/ .head {
    position: sticky; top:0; z-index:1;
}
.co-material /deep/ a:any-link{
    text-decoration: none !important;
}
/* .co-material /deep/ .fab {
    bottom: 3rem;
    right: 2rem;
} */
.co-material .share-count-value {
    min-width: 3rem;
    text-align: center;
}
.co-material .share-count-value /deep/ .v-chip__content {
    flex: 1;
    justify-content: center
}
</style>
