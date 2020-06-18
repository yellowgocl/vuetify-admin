<template>
    <div>
        <v-snackbar :color='snackbarColor' v-model="snackbar" >
            {{ tipsText }}
            <v-btn color="white" fab large icon @click="snackbar=false" ><v-icon dark>cancel</v-icon></v-btn>
        </v-snackbar>
        <v-dialog scrollable persistent v-model='dialog' width="80%" transition='dialog-transition'>
            <v-card>
                <v-toolbar dark color="primary">
                    <v-toolbar-title>{{modalTitle}}</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-toolbar-items>
                        <v-btn icon dark @click="onCloseDialog(true)">
                            <v-icon>close</v-icon>
                        </v-btn>
                        <v-btn icon dark @click="onCloseDialog(false)">
                            <v-icon>done</v-icon>
                        </v-btn>
                    </v-toolbar-items>
                </v-toolbar>
                <v-sheet
                    elevation="12"
                    class="pa-6 pa-md-12"
                    >
                    <v-row class='mb-6'>
                        <v-col cols='12' sm="5">
                            <v-img class='border-tips' :height='250' :src='editItem.icon'></v-img>
                        </v-col>
                        <v-col align-self='end' cols="12" sm="7">
                            <v-card-title>{{editItem.name}}</v-card-title>
                            <v-card-text>
                                <div class='grey--text'>最近一次更新:{{editItem.updateDate}}</div>
                                <div class='grey--text mb-0'>最近更新自: <strong class='info--text text--darken-0 font-weight-bold'>{{editItem.updateBy}}</strong></div>
                            </v-card-text>
                            <v-file-input 
                                ref='file'
                                hidden
                                v-model="bannerFile" 
                                label="上传分类题图" 
                                accept="image/*">
                            </v-file-input>
                        </v-col>
                    </v-row>
                    <v-form @submit.prevent="validate" id='form' ref="form" v-model="valid" :lazy-validation="lazy">
                        <v-text-field class='mb-4' :rules='nameRules' hint='必填' :persistent-hint='true' v-model="editItem.name" label="分类名" ></v-text-field>
                        <v-text-field v-if='false' class='mb-4' type="number" v-model="editItem.orderNum" label="排序号" ></v-text-field>
                        <v-row class='px-3'>
                            <v-select v-model='editItem.type' :items="typeItems"  item-text='name' item-value='id' label="类型" ></v-select>
                            <v-spacer></v-spacer>
                            <v-switch :true-value="1" :false-value="0" v-model="editItem.status" inset :label="`启用状态: ${!!editItem.status ? '启用' : '禁用'}`"></v-switch>
                        </v-row>
                    </v-form>
                </v-sheet>
                <!-- <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn dark text @click="dialog = false">取消</v-btn>
                    <v-btn dark text @click="dialog = false">保存</v-btn>
                </v-card-actions> -->
            </v-card>
        </v-dialog>
        <v-card min-height='75vh' class='pb-6 mb-6 category-container'>
            <v-btn
                @click.stop='openEdit(null, false)'
                color="secondary"
                fixed
                fab
                large
                dark
                bottom
                right
                :loading='loading'
                class="fab"
            >
                <v-icon>add</v-icon>
            </v-btn>
            <!-- <v-toolbar color='accent' :dark="true">
                <v-toolbar-title>素材分类管理</v-toolbar-title>
                <v-spacer></v-spacer>                    
            </v-toolbar> -->
            <v-card-title class='head grey darken-4' :class='{"pa-1":$vuetify.breakpoint.xsOnly}'>
                <v-col :class='{"subtitle-2":$vuetify.breakpoint.smAndDown}' cols=4 sm='3'>分类管理</v-col>
                <v-spacer></v-spacer>
                <v-switch
                    class="video-mode-switch ma-0 pa-0"
                    hide-details
                    v-model="isEditMode"
                    inset
                    :loading='loading'
                    :disabled='!inited'
                    :label="`${isEditMode ? '排序模式' : '编辑模式'}`"
                    ></v-switch>
            </v-card-title>
            <v-card-text>
                 <v-treeview @update:open='onOpenHandle' open-all v-if='items && items.length > 0' :open.sync='openItems' open-on-click v-model='selection' :selection-type='selectionType' return-object :selectable='selectable' :activatable='false' hoverable shaped :items="items">  
                    <template v-slot:label='{item}'>
                        <draggable :disabled='loading || !isEditMode' :list="resouceItems" group="node" :id="item.id" :data-parent-id="item.parentId" @end='onDragEnd(item, $event)'>
                            <v-row no-gutters justify='space-around' align='center'>
                            <v-col><div class='item-label'>{{item.name}}</div></v-col>
                            <v-spacer v-if='isEditMode'></v-spacer>
                            <v-scroll-x-transition hide-on-leave >
                                <v-btn class='pa-1' small :loading='loading' fab icon color='info' v-if='isEditMode'>
                                    <v-icon>menu</v-icon>
                                </v-btn>
                            </v-scroll-x-transition>
                            </v-row>
                        </draggable>
                    </template>
                    <template v-slot:append='{item}' v-if='!isEditMode'>
                        <v-scroll-x-transition hide-on-leave>
                        <component @input='onOpenItemOption' :value='isOpenOption(item.id)' open-on-hover direction='left'  :is='$vuetify.breakpoint.xsOnly ? "v-speed-dial" : "v-row"' >
                            <template v-slot:activator>
                                <v-btn
                                    class='mr-n2 pa-1'
                                    @click.stop="onOpenItemOption(item.id)"
                                    color="blue darken-2"
                                    dark
                                    small
                                    fab
                                    icon >
                                <v-icon v-if="isOpenOption(item.id)">close</v-icon>
                                <v-icon v-else>more_vert</v-icon>
                                </v-btn>
                            </template>
                            <v-row no-gutters class='flex-nowrap mr-1 pa-1 accent' style='border-radius:4rem;'>
                                <v-btn @click.stop='openEdit(item, true)' fab icon small color="info">
                                    <v-icon small  >edit</v-icon>
                                </v-btn>
                                <v-btn @click.stop='openEdit(item, false)' fab icon small color="primary">
                                    <v-icon small  >add</v-icon>
                                </v-btn>
                                <v-btn @click.stop="deleteCategory(item)" fab icon small color="error">
                                    <v-icon small >delete</v-icon>
                                </v-btn>
                            </v-row>
                        </component>
                        </v-scroll-x-transition>
                        
                    </template>
                </v-treeview>
                <no-data v-else ></no-data>
            </v-card-text>
            <!-- <v-row v-else align-self='center' no-gutters align='center' justify='center'>
                <v-col align-self='center' cols='4 text-center'>
                    <v-img src='/images/no-data-0.png'></v-img>
                    <p class='mt-8 text-center title text--white'>暂时没有数据</p>
                    <v-btn color='primary' large dark @click.stop='openEdit(null, false)' class="mx-2"> 马上添加</v-btn>
                </v-col>
            </v-row>  -->
        </v-card>
    </div>
</template>

<script>
import draggable from 'vuedraggable'
import noData from '~/components/NoData'
import { map, groupBy, assign, indexOf, chain, concat, omit, find, toNumber, findIndex } from 'lodash' 
export default {
    components: { draggable, noData },
    data() {
        return {
            snackbarMode: 0,
            snackbar: false,
            tipsText: '',
            openOptionId: null,
            bannerFile: null,
            typeItems: [{ id: 0, name: '分类' }],
            nameRules: [
                v => !!v || '分类名不能为空',
                v => (v && v.length <= 30) || '长度不能超过30个字符',
            ],
            valid: false,
            lazy: false,
            dialog: false,
            items: [],
            openItems: [],
            resouceItems: [],
            selectable: false,
            selection: [],
            selectionType: 'leaf',
            openAll: false,
            modalTitle: '',
            isEdit: false,
            editItem: {},
            inited: false,
            isEditMode: false,
            loading: false
        }
    },
    watch: {
        bannerFile(n, o) {
            if (!!n) {
                this.$api.fileUpload([n]).then(res => {
                    this.$set(this.editItem, 'icon', res.data)
                })
            }
        },
        resouceItems(n, o) {
            // console.info(n)
            this.updateList(n, !this.inited)
        }
    },
    computed: {
        snackbarColor() {
            return this.snackbarMode == 0 ? 'error' : 'info'
        }
    },
    mounted() {
        this.fetchList()
    },
    methods: {
        onDragEnd(item, evt) {
            let pid = toNumber(item.parentId || 0);
            let toPid = toNumber(evt.to.dataset.parentId || 0)
            let tid = toNumber(evt.to.id)
            let p = find(this.resouceItems, ['id', pid])
            let toP = find(this.resouceItems, ['id', toPid])
            let pContainer = p ? p.children : this.items
            let toPContainer = toP ? toP.children : this.items
            let isChangeParent = !(pid == toPid)
            let oldIndex = findIndex(pContainer, (o) => o.id == item.id)
            let newIndex = findIndex(toPContainer, (o) => o.id == tid)
            let asc = oldIndex < newIndex
            if  (item.id == toPid) {
                this.snackbar = true;
                this.tipsText = '不能把父分类并入其子集内。'
            } else if (!isChangeParent) {
                //同层互换位置
                toPContainer.splice(newIndex, 0, toPContainer.splice(oldIndex, 1)[0]);
                this.orderByCategory(item, tid, asc)
            } else {
                item.parentId = toP ? toP.id : 0
                pContainer.splice(oldIndex, 1)
                toPContainer.splice(newIndex, 0, item)
                this.orderByCategory(item, tid, asc, true)
            }
            this.resouceItems = concat(this.resouceItems, [])
        },
        onOpenHandle(e) {
            // console.info(e)
        },
        isOpenOption(id) {
            return this.openOptionId == id
        },
        onOpenItemOption(id) {
            if (this.isOpenOption(id)) {
                this.openOptionId = null
            } else {
                this.openOptionId = id
            }
        },
        onClickDialogOutside() {
            return false
        },
        onCloseDialog(isCancel) {
            // this.editItem = {}
            if (isCancel) {
                this.dialog = false
                return
            }
            this.validate().then(flag => {
                this.fetchList()
                this.dialog = false
            })
        },
        openEdit(item, isEdit) {
            item = item || {}
            this.modalTitle = isEdit ? '编辑分类' : '新增分类';
            this.editItem = isEdit ? assign({}, item) : { parentId: item.id || null, status: 1, type: 0 }
            this.bannerFile = null
            this.isEdit = isEdit
            this.dialog = true
            this.openOptionId = null
            this.$nextTick(() => this.$refs.form.resetValidation())
        },
        updateList(items) {
            // items = concat(items, [])
            // this.items = []
            let temp = chain(items).map(o => {
                o.parentId = o.parentId || null
                return o
            }).groupBy('parentId')
            .value()
            let result = this.items
            map(items, (v, k) => {
                if (!this.inited) {
                    let children = temp[v.id]
                    this.$set(v, 'children', [])
                    if (!!children) {
                        this.$set(v, 'children', children)
                    }
                } else {
                    if (v.children) {
                        this.$set(v, 'children', v.children)
                    }
                }
                if (!v.parentId && !find(result, ['id', v.id])) {
                    result.push(v)
                }
            })
            if (!this.inited) {
                this.inited = true
            }
            this.items = result
        },
        orderByCategory(source, tid, asc = true, mod = false) {
            let result = this.$api.orderByCategory(source.id, tid, asc)
            this.loading = true
            if (mod) {
                // source.parentId = parent.id
                result = this.$api.modCategory(source).then((res) => {
                    return this.$api.orderByCategory(source.id, tid, asc)
                }, rej => {
                    this.loading = false
                    return rej
                })
            }
            return result.then(res => {
                this.loading = false
                return res
            }, rej => {
                this.loading = false
                return rej
            })
        },
        fetchList() {
            this.items = []
            this.loading = true
            this.inited = false
            this.$api.getCategoryList().then(res => {
                this.resouceItems = res.data.content
                this.openItems = concat(this.resouceItems, [])
                this.loading = false
                // this.updateList(res.content)
            }, rej => {
                this.loading = false
            })
        },
        validate() {
            let flag = this.$refs.form.validate()
            if (flag) {
                this.loading = true
                let req = this.isEdit ? this.$api.modCategory : this.$api.addCategory 
                // this.editItem.mockStatusCode = 400
                this.editItem = omit(this.editItem, ['children'])
                return req.call(this, this.editItem).then(res => {
                    this.loading = false
                    return res
                }, rej => {
                    this.loading = false
                    this.snackbar = true;
                    this.tipsText = rej.message
                    return Promise.reject(rej)
                })
            } else {
                return Promise.reject(flag)
            }
        },
        deleteCategory(item) {
            // this.resouceItems.splice(indexOf(this.resouceItems, item), 1)
            let flag = confirm('是否确认删除选中分类？')
            this.loading = true
            this.openOptionId = null
            flag && this.$api.delCategory(item.id).then(res => {
                this.tipsText = '删除分类成功'
                this.snackbarMode = 1
                this.loading = false
                this.snackbar = true
                let parent = find(this.resouceItems, ['id', item.parentId])
                parent && parent.children.splice(indexOf(parent.children, item), 1)
                // this.$nextTick(() => this.updateList(this.resouceItems))
            }, rej => {
                this.tipsText = rej.messaage
                this.snackbarMode = 0
                this.loading = false
                this.snackbar = true
                return Promise.reject(rej)
            })
        },
    }
}
</script>

<style scoped>
.category-container /deep/ .head {
    position: sticky; top:0; z-index:4;
}
.border-tips {
  border: 1px dashed var(--v-accent-base);
  background-color: transparent !important;
}
</style>
