<template>
    <div>
        <v-snackbar color='error' v-model="snackbar" >
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
                            <v-img class='grey' :height='250' :src='editItem.icon'></v-img>
                        </v-col>
                        <v-col align-self='end' cols="12" sm="7">
                            <v-card-title>{{editItem.name}}</v-card-title>
                            <v-card-text>
                                <p class='grey--text'>最近一次更新:{{editItem.updateDate}}</p>
                                <p class='grey--text mb-0'>最近更新自: <strong class='info--text text--darken-0 font-weight-bold'>{{editItem.updateBy}}</strong></p>
                            </v-card-text>
                            <v-file-input 
                                v-model="bannerFile" 
                                label="上传分类题图" 
                                accept="image/*">
                            </v-file-input>
                        </v-col>
                    </v-row>
                    <v-form @submit.prevent="validate" id='form' ref="form" v-model="valid" :lazy-validation="lazy">
                        <v-text-field class='mb-4' :rules='nameRules' hint='必填' :persistent-hint='true' v-model="editItem.name" label="分类名" ></v-text-field>
                        <v-text-field class='mb-4' type="number" v-model="editItem.orderNum" label="排序号" ></v-text-field>
                        <v-row class='px-3'>
                            <v-select v-model='editItem.type' :items="typeItems"  item-text='name' item-value='id' label="类型" ></v-select>
                            <v-spacer></v-spacer>
                            <v-switch v-model="editItem.status" inset :label="`启用状态: ${!!editItem.status ? '启用' : '禁用'}`"></v-switch>
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
        <v-card min-height='75vh'>
            <v-toolbar color='accent' :dark="true">
                <v-toolbar-title>素材分类管理</v-toolbar-title>
                <v-spacer></v-spacer>                    
                <v-btn color='primary' fab dark small @click.stop='openEdit(null, false)' class="mx-2">
                    <v-icon dark>add</v-icon>
                </v-btn>
            </v-toolbar>
            <v-card-text>
            <v-treeview v-if='items && items.length > 0' :open.sync='resouceItems' open-on-click v-model='selection' :selection-type='selectionType' return-object :selectable='selectable' activatable hoverable shaped :items="items">
                <template slot="append" slot-scope="{ item }">
                    <v-row>
                        <v-btn @click.stop='openEdit(item, true)' class="mx-2" fab dark small color="info">
                            <v-icon dense small dark>edit</v-icon>
                        </v-btn>
                        <v-btn @click.stop='openEdit(item, false)' class="mx-2" fab dark small color="primary">
                            <v-icon dense small dark>add</v-icon>
                        </v-btn>
                    </v-row>
                </template>
            </v-treeview>
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
import { map, groupBy, assign } from 'lodash' 
export default {
    data() {
        return {
            snackbar: false,
            tipsText: '',
            bannerFile: null,
            typeItems: [{ id: 0, name: '分类' }],
            nameRules: [
                v => !!v || '分类名不能为空',
                v => (v && v.length <= 30) || '长度不能超过30个字符',
            ],
            valid: false,
            lazy: false,
            dialog: false,
            model: true,
            items: [],
            resouceItems: [],
            selectable: false,
            selection: [],
            selectionType: 'leaf',
            openAll: false,
            modalTitle: '',
            isEdit: false,
            editItem: {}
        }
    },
    watch: {
        bannerFile(n, o) {
            if (!!n) {
                this.$api.fileUpload([n]).then(res => {
                    this.$set(this.editItem, 'icon', res)
                })
            }
        }
    },
    computed: {
    },
    mounted() {
        this.fetchList()
    },
    methods: {
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
            this.$nextTick(() => this.$refs.form.resetValidation())
        },
        fetchList() {
            this.items = []
            this.$api.getCategoryList().then(res => {
                this.resouceItems = res.items
                let temp = groupBy(res.items, 'parentId')
                map(res.items, (v, k) => {
                    let children = temp[v.id]
                    if (!!children) {
                        v.children = children
                    }
                    if (v.parentId == res.rootId || !v.parentId) {
                        this.items.push(v)
                    }
                })
            })
        },
        validate() {
            let flag = this.$refs.form.validate()
            if (flag) {
                let req = this.isEdit ? this.$api.modCategory : this.$api.addCategory 
                // this.editItem.mockStatusCode = 400
                return req.call(this, this.editItem).then(res => {
                    return res
                }, rej => {
                    this.snackbar = true;
                    this.tipsText = rej.message
                    return Promise.reject(rej)
                })
            } else {
                return Promise.reject(flag)
            }
        }
    }
}
</script>

<style scoped>

</style>
