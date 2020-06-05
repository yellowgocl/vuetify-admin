<template>
  <v-container
    ref='viewport'
    class="co-material-id overflow-y-auto"
    :class="{ blur: dialog }"
    v-scroll="onScroll"
  >
    <v-toolbar dark class="header-title">
      <v-toolbar-title>编辑素材</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items v-if="!dialog">
        <v-switch
          class="video-mode-switch ma-0 pa-0"
          hide-details
          v-model="isVideoMode"
          inset
          :label="`${isVideoMode ? '视频模式' : '图片模式'}`"
        ></v-switch>
        <!-- <v-btn @click.stop='exit(true)' :loading='blockLoading' :disabled='blockLoading' color="secondary" icon dark>
          <v-icon>close</v-icon>
        </v-btn>
        <v-btn @click.stop='validate' :loading='blockLoading' :disabled='blockLoading || !hasModify' color="primary" icon dark>
          <v-icon>done</v-icon>
        </v-btn> -->
      </v-toolbar-items>
    </v-toolbar>
    <v-card flat class="py-6">
      <v-card-text>
        <v-row align="center" no-gutters>
          <v-col>
            <div class="subtitle-1 info--text">素材预览</div>
          </v-col>
          <!-- <v-switch
            class="video-mode-switch ma-0 pa-0"
            hide-details
            v-model="isVideoMode"
            inset
            :label="`${isVideoMode ? '视频模式' : '图片模式'}`"
          ></v-switch> -->
          <v-btn
            @click.stop="dragMode = !dragMode"
            v-if="!isVideoMode"
            color="secondary"
            :outlined="!dragMode"
            small
            >{{ dragMode ? "完成编辑" : "编辑排序" }}</v-btn
          >
        </v-row>

        <v-row class="mb-1 mt-4" ref="mediaContainer">
          <template v-if="!isVideoMode">
            <v-col
              cols="6"
              sm="3"
              md="2"
              lg="2"
              v-for="(pic, index) in data.pics"
              :key="pic"
            >
              <v-card color="accent" class="pa-1 relative ">
                <v-btn
                  @click.stop="deletePic(index)"
                  class="mt-n4 mr-n6"
                  absolute
                  right
                  color="accent"
                  x-small
                  fab
                  ><v-icon small dense>close</v-icon></v-btn
                >
                <v-img
                  :class="{ 'drag-mode': dragMode }"
                  :lazy-src="pic"
                  aspect-ratio="1"
                  :src="pic"
                >
                  <template v-slot:placeholder>
                    <v-row
                      class="fill-height ma-0"
                      align="center"
                      justify="center"
                    >
                      <v-progress-circular
                        indeterminate
                        color="grey darken-2"
                      ></v-progress-circular>
                    </v-row> </template
                ></v-img>
              </v-card>
            </v-col>
          </template>
          <template v-else>
            <v-col cols="12">
              <v-card
                color="accent"
                class="pa-1 relative"
                v-for="item in data.videos"
                :key="item"
              >
                <v-btn
                  @click.stop="deletePic(index)"
                  class="mt-4 mr-1"
                  absolute
                  right
                  color="accent"
                  x-small
                  fab
                  ><v-icon small dense>close</v-icon></v-btn
                >
                <video-player
                  class="video-player-box"
                  ref="videoPlayer"
                  :options="playerOptions"
                  :playsinline="true"
                >
                </video-player>
              </v-card>
            </v-col>
          </template>
        </v-row>
        <v-row class="flex-nowrap  my-4" no-gutters align="center">
          <v-file-input
            v-if="!uploading"
            class="file-input mr-4"
            :placeholder="
              fileInputRestrict == 0 ? '已达到上传数量限制' : '点击上传素材'
            "
            :disabled="blockLoading || fileInputRestrict <= 0"
            :counter="fileInputRestrict"
            :rules="fileInputRule"
            multiple
            hide-details
            solo-inverted
            rounded
            v-model="bannerFile"
            prepend-icon="insert_photo"
            :accept="fileAccept"
          >
            <template v-slot:selection="{ text }">
              <v-chip small label color="primary">
                {{ text }}
              </v-chip>
            </template>
          </v-file-input>
          <v-progress-linear
            class="mr-4"
            v-else
            v-model="uploadProgress"
            color="info"
            height="3rem"
            rounded
          ></v-progress-linear>
          <!-- <v-progress-circular v-if='blockLoading' size='24' indeterminate color="primary"></v-progress-circular> -->
          <v-btn
            v-if="uploading"
            @click.stop="onCancelUpload"
            fab
            small
            text
            color="secondary"
            ><v-icon dense>cancel</v-icon></v-btn
          >
          <v-chip
            v-else
            outlined
            dark
            tile
            :color="fileInputRestrict == 0 ? 'pink' : 'info'"
            >{{ fileInputRestrict }}/{{ isVideoMode ? 1 : 9 }}</v-chip
          >
        </v-row>
        <v-divider></v-divider>
        <v-row no-gutters class="mt-6">
          <v-col cols="12" sm="6" md="8">
            <div class="subtitle-1 info--text mb-4 mt-4">信息编辑</div>
          </v-col>
          <v-spacer></v-spacer>
          <v-col align-self="end"
            ><v-switch
              :true-value="1"
              :false-value="0"
              v-model="data.status"
              inset
              :label="`状态: ${!!data.status ? '启用' : '禁用'}`"
            ></v-switch
          ></v-col>
        </v-row>
        <v-form
          @submit.prevent
          id="form"
          ref="form"
          v-model="valid"
          :lazy-validation="lazy"
        >
          <v-autocomplete
            v-model="data.categoryIds"
            item-text="name"
            item-value="id"
            multiple
            chips
            :rules="[v => {
              return !!v && v.length > 0  || '不能为空'
            }]"
            :items="categories"
            label="指定所属分类"
          ></v-autocomplete>
          <v-text-field
            class="mb-4"
            :rules="nameRules"
            hint="必填"
            :persistent-hint="true"
            v-model="data.title"
            label="素材名"
          ></v-text-field>
          <v-textarea
            v-model="data.content"
            label="素材文字内容"
            auto-grow
            outlined
            counter
            rows="3"
            :rules="[
              v => !!v || '不能为空',
              v => (v && v.length <= 1500) || '长度不能超过1500个字符'
            ]"
            row-height="25"
          ></v-textarea>
          <!-- <v-select
            item-text="name"
            item-value="id"
            label="选择所属分类"
          ></v-select> -->
          <v-row no-gutters>
            <v-col shrink cols="12" sm="6" md="3"
              ><v-text-field
                readonly
                hint="只读"
                :persistent-hint="true"
                class="mr-0 mr-sm-6"
                type="number"
                v-model="data.browseCount"
                label="预设浏览量"
              ></v-text-field
            ></v-col>
            <v-col shrink cols="12" sm="6" md="3"
              ><v-text-field
                readonly
                hint="只读"
                :persistent-hint="true"
                class="mr-0 mr-sm-0 mr-md-6"
                type="number"
                v-model="data.downloadCount"
                label="预设下载量"
              ></v-text-field
            ></v-col>
            <v-col shrink cols="12" sm="6" md="3"
              ><v-text-field
                readonly
                hint="只读"
                :persistent-hint="true"
                class="mr-0 mr-sm-6"
                type="number"
                v-model="data.shareCount"
                label="预设分享量"
              ></v-text-field
            ></v-col>
            <v-col shrink cols="12" sm="6" md="3"
              ><v-text-field
                :persistent-hint="true"
                class="mr-0 "
                type="number"
                v-model="data.orderNum"
                label="排序号"
              ></v-text-field
            ></v-col>
          </v-row>
          <div class="subtitle-1 info--text mb-4 mt-8">标签管理</div>
          <div>
            <v-chip
              v-for="(tag, index) in data.tags"
              :key="tag.value"
              class="ma-2"
              close
              color="teal"
              text-color="white"
              close-icon="delete"
              @click:close="deleteTag(index)"
            >
              {{ tag }}
            </v-chip>
            <v-chip
              ripple
              @click.stop="dialog = true"
              class="ma-2"
              color="accent"
              text-color="white"
            >
              <v-avatar left>
                <v-icon>add</v-icon>
              </v-avatar>
              添加标签
            </v-chip>
          </div>
        </v-form>
      </v-card-text>
      <v-card-actions class='actions ghost' v-if='!isScrollToBottom'>
        <v-btn
          disabled
          color="secondary"
          :x-large='!$vuetify.breakpoint.xsOnly'
          :small='$vuetify.breakpoint.xsOnly'
          text
          ></v-btn
        >
      </v-card-actions>
      <v-card-actions class='actions' :class='actionsClass'>
        <v-spacer></v-spacer>
        <v-btn
          @click.stop="exit(true)"
          :loading="blockLoading"
          :disabled="blockLoading"
          color="secondary"
          :x-large='!$vuetify.breakpoint.xsOnly'
          
          text
          >&nbsp;&nbsp;取消编辑&nbsp;&nbsp;</v-btn
        >
        <div>
          <v-btn
            class="mx-4"
            type='submit'
            form='form'
            @click.stop="validate"
            :loading="blockLoading"
            :disabled="blockLoading || !hasModify"
            color="primary"
            :x-large='!$vuetify.breakpoint.xsOnly'
            >&nbsp;&nbsp;&nbsp;&nbsp;确定保存&nbsp;&nbsp;&nbsp;&nbsp;</v-btn
          >
        </div>
      </v-card-actions>
    </v-card>
    <v-dialog
      :persistent="submitTagLoading"
      :fullscreen="$vuetify.breakpoint.xsOnly"
      v-model="dialog"
      width="80%"
      transition="dialog-transition"
    >
      <v-card class="pb-6">
        <v-toolbar class="dialog-title" dark color="primary">
          <v-toolbar-title>选取标签</v-toolbar-title>
          <v-btn icon>
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="mt-4">
          <v-row>
            <v-col cols="12" sm="10">
              <v-form @submit.prevent="submitTag" id="tagForm" ref="tagForm">
                <v-text-field
                  autofocus
                  required
                  hide-details
                  :disabled="submitTagLoading"
                  :loading="submitTagLoading"
                  class="mb-1"
                  v-model="tagValue"
                  label="填写分类"
                ></v-text-field>
              </v-form>
            </v-col>
            <v-col align-self="end" cols="12" sm="2">
              <v-btn
                color="info"
                block
                outlined
                @click.stop="submitTag"
                :disabled="submitTagLoading"
                :loading="submitTagLoading"
                >添加</v-btn
              >
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-text>
          <div class="subtitle-1 mb-2">已选择</div>
          <v-card min-height="5rem" color="accent" class="pa-4">
            <v-chip
              @click:close="deleteSelectedTag(tag, index)"
              close
              color="primary"
              class="ma-2"
              v-for="(tag, index) in selectTags"
              :key="tag.value"
              >{{ tag.value }}</v-chip
            >
          </v-card>
          <div class="subtitle-1 mt-6">热门标签</div>
          <v-card min-height="5rem" color="accent" class="pa-4">
            <v-chip
              @click.stop="addToSelectedTag(tag, index)"
              ripple
              class="ma-2"
              color="info"
              v-for="(tag, index) in displayTags"
              :key="tag.value"
              >{{ tag.value }}</v-chip
            >
          </v-card>
        </v-card-text>
        <v-divider class="my-6"></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            :disabled="submitTagLoading"
            :loading="submitTagLoading"
            @click.stop="cancelSelectTag"
            color="secondary"
            x-large
            text
            >&nbsp;&nbsp;取消&nbsp;&nbsp;</v-btn
          >
          <v-btn
            :disabled="submitTagLoading"
            :loading="submitTagLoading"
            @click.stop="confirmSelectTag"
            color="primary mx-4"
            x-large
            >&nbsp;&nbsp;&nbsp;&nbsp;确定&nbsp;&nbsp;&nbsp;&nbsp;</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar color="error" v-model="snackbar">
      {{ tipsText }}
      <v-btn color="white" fab large icon @click="snackbar = false"
        ><v-icon dark>cancel</v-icon></v-btn
      >
    </v-snackbar>
    <!-- <v-btn
      right
      fixed
      bottom
      fab
      :loading="blockLoading"
      :disabled="blockLoading || !hasModify"
      class='mr-4 mb-12'
      color="primary"
      x-large
        ><v-icon>done</v-icon></v-btn
      > -->
  </v-container>
</template>

<script>
import {
  map,
  concat,
  find,
  take,
  remove,
  union,
  isEqual,
  assign,
  cloneDeep,
  reduce,
  first
} from "lodash";
import { Utils } from "~/common";
import Sortable from "sortablejs";
import { setTimeout } from "timers";
export default {
  data() {
    return {
      playerOptions: {
        fluid: true,
        muted: true,
        language: "zh-CN"
      },
      gridWidth: 0,
      uploading: false,
      uploadProgress: 0,
      uploadCancelToken: null,
      videoSrc: "",
      reference: {},
      submitTagLoading: false,
      categories: [],
      tipsText: "",
      snackbar: false,
      tagValue: "",
      selectTags: [],
      tags: [],
      displayTags: [],
      dialog: false,
      blockLoading: false,
      isVideoMode: false,
      nameRules: [
        v => !!v || "分类名不能为空",
        v => (v && v.length <= 30) || "长度不能超过30个字符"
      ],
      valid: false,
      lazy: false,
      data: {},
      bannerFile: [],
      hasModify: false,
      sortable: null,
      dragMode: false,
      isScrollToBottom: false,
    };
  },
  computed: {
    // imageHeight() {
    //   switch (this.$vuetify.breakpoint.name) {
    //     case "xs":
    //       return "6rem";
    //     case "sm":
    //       return "8rem";
    //     case "md":
    //       return "8rem";
    //     case "lg":
    //       return "9rem";
    //   }
    // },
    actionsClass() {
      return [!this.isScrollToBottom && "hold", !this.isScrollToBottom && 'grey darken-4', !this.isScrollToBottom ? 'mr-0 pt-4' : 'mr-4']
    },
    isEdit() {
      return !!this.$route.params.id;
    },
    fileInputRule() {
      return [
        v => v.length < this.fileInputRestrict
        //value => !value.length || value.reduce((size, file) => size + file.size, 0) < 2000000 || 'Avatar size should be less than 2 MB!',
      ];
    },
    fileAccept() {
      return this.isVideoMode ? "video/*" : "image/*";
    },
    fileInputRestrict() {
      let arr = this.isVideoMode
        ? this.data.videos || []
        : this.data.pics || [];
      let len = arr.length || 0;
      return this.isVideoMode ? 1 - len : 9 - len;
    }
  },
  mounted() {
    // console.info(this.$route)
    let id = this.$route.params.id;
    this.fetchData(id);
    this.sortable = Sortable.create(this.$refs.mediaContainer, {
      animation: 100,
      disabled: true,
      supportPointer: true,
      onEnd: ({ newIndex, oldIndex, oldDraggableIndex, newDraggableIndex }) => {
        [this.data.pics[oldIndex], this.data.pics[newIndex]] = [
          this.data.pics[newIndex],
          this.data.pics[oldIndex]
        ];
        // console.info([...this.data.pics])
        // this.$set(this.data, 'pics', [])
        setTimeout(
          () => this.$set(this.data, "pics", [...this.data.pics]),
          1000
        );
        // this.data.pics.splice(newIndex, 0, this.data.pics.splice(oldIndex, 1)[0]);
      }
    });
    this.$refs.form.resetValidation()
  },
  watch: {
    dragMode(n, o) {
      this.sortable.disabled = !n;
      this.sortable.option("disabled", !n);
    },
    data: {
      handler(n, o) {
        this.hasModify = !isEqual(this.reference, n);
        // this.reference = Object.assign({}, this.reference)
      },
      deep: true
    },
    bannerFile(n, o) {
      if (!!n && n.length > 0) {
        if (n.length <= this.fileInputRestrict) {
          this.blockLoading = this.uploading = true;
          // if (this.isVideoMode) {
          //   let localUrl = (URL.createObjectURL(n[0]))
          //   // this.$set(this.playerOptions, 'sources', [{ type: n[0].type, src: localUrl }])
          //   // this.playerOptions.sources=[{ src: URL.createObjectURL(n[0]) }]
          // }
          this.$api.fileUpload(n, this.onUploadProgressHandle.bind(this)).then(
            res => {
              res = res.data
              if (!this.isVideoMode) {
                this.$set(this.data, "pics", concat(this.data.pics || [], res));
              } else {
                this.$set(this.data, "videos", concat([], res));
                let sources = reduce(
                  this.data.videos,
                  (r, v, k) => {
                    r[k] = Utils.formatVideoResource(v);
                    return r;
                  },
                  []
                );
                this.$nextTick(() =>
                  this.$set(this.playerOptions, "sources", sources[0])
                );
              }
              this.uploadProgress = 0;
              this.blockLoading = this.uploading = false;
              this.bannerFile = [];
              this.uploadCancelToken = null;
            },
            rej => {
              // this.$set(this.playerOptions, 'sources', map(this.data.videos, (o) => { src: o }))
              this.uploadProgress = 0;
              this.bannerFile = [];
              this.blockLoading = this.uploading = false;
              this.snackbar = true;
              this.tipsText = rej.message;
              this.uploadCancelToken = null;
            }
          );
        } else {
          alert(
            `可上传文件数是${this.fileInputRestrict}个，您当前选择了${n.length}个`
          );
          this.bannerFile = [];
          this.blockLoading = false;
        }
      }
    }
  },
  methods: {
    onScroll(e) {
      if (typeof window === 'undefined') return

      let top = window.pageYOffset || e.target.scrollTop || 0
      let vh = e.target.body.clientHeight
      let ch = window.innerHeight
      this.isScrollToBottom = (top + ch) >= vh - 40
      
      // console.info(total, top + ch, this.$refs.viewport.clientHeight)
    },
    onUploadProgressHandle(progressEvent, cancelToken) {
      this.uploadCancelToken = cancelToken;
      let { loaded, total } = progressEvent;
      this.uploadProgress = Math.ceil((loaded / total) * 100);
    },
    onCancelUpload() {
      if (this.uploadCancelToken) {
        this.uploading = false;
        this.uploadProgress = 0;
        this.uploadCancelToken.cancel({ message: "用户取消上传.", code: 600 });
        this.uploadCancelToken = null;
        this.blockLoading = false;
        this.bannerFile = [];
      }
    },
    fetchData(id) {
      if (!!id) {
        this.blockLoading = true;
        this.$api.getArchive(id).then(
          res => {
            res = res.data
            this.blockLoading = false;
            this.data = res;
            this.$nextTick(() => {
              this.reference = cloneDeep(this.data);
            });
            this.isVideoMode = res.videos && res.videos.length > 0;
            let sources = reduce(
              res.videos,
              (r, v, k) => {
                r[k] = Utils.formatVideoResource(v);
                return r;
              },
              []
            );
            this.$set(this.playerOptions, "sources", sources[0]);
            this.$api.archiveGetCategory(id).then(res => {
              res = res.data
              let temp = assign({}, this.data);
              temp.categoryIds = map(res, n => n.id);
              // this.$set(this.data, 'categoryIds', map(res, (n) => n.id))
              this.reference = cloneDeep(temp);
              this.$nextTick(() =>
                this.$set(this.data, "categoryIds", temp.categoryIds.concat())
              );
            });
          },
          rej => {
            if (rej.code == 404) {
              alert(rej.message);
              let redirectUrl = "/";
              this.$router.replace({ path: redirectUrl });
            }
          }
        );
      } else {
        this.data = {
          videos: [],
          pics: [],
          content: "",
          tags: [],
          title: "",
          categoryIds: []
        };
        this.reference = Object.assign({}, this.data);
      }
      this.$api.fetchTagList().then(res => {
        res = res.data
        this.tags = res.content;
        this.displayTags = take(this.tags, 10);
      });
      this.$api.getCategoryList().then(res => {
        res = res.data
        this.categories = res.content;
      });
    },
    onUpload(index) {
      let fileInput = this.$refs["file-input" + index];
      fileInput[0].$el.click();
    },
    deleteTag(index) {
      let flag = confirm("是否确认删除标签?");
      flag && this.data.tags.splice(index, 1);
    },
    deletePic(index) {
      let flag = confirm(`是否确认删除${this.isVideoMode ? "视频" : "图片"}?`);
      let arr = this.isVideoMode ? this.data.videos : this.data.pics;
      flag && arr.splice(index, 1);
      // this.$set(this.data, this.isVideoMode ? 'videos' : 'pics', arr.concat())
    },
    exit(isCancel = false) {
      if (isCancel) {
        let msg = `是否不保存退出编辑？`;
        let flag = confirm(msg);
        flag && this.$router.go(-1);
      } else {
        let msg = `${this.isEdit ? "修改" : "添加"}成功，点击确定返回列表`;
        alert(msg);
        this.$router.go(-1);
      }
    },
    validate() {
      let flag = this.$refs.form.validate();
      console.info(flag)
      if (flag) {
        let req = this.isEdit ? this.$api.modArchive : this.$api.addArchive;
        // this.editItem.mockStatusCode = 400
        console.info(req)
        return req.call(this, this.data).then(
          res => {
            res = res.data
            this.exit(false);
            return res;
          },
          rej => {
            this.snackbar = true;
            this.tipsText = rej.message;
            return Promise.reject(rej);
          }
        );
      } else {
        return Promise.reject(flag);
      }
    },
    submitTag() {
      if (!this.tagValue || this.tagValue.length == 0) {
        return;
      }
      let temp = find(this.tags, n => n.value == this.tagValue);
      if (!temp) {
        this.submitTagLoading = true;
        this.$api.addTag(this.tagValue).then(
          res => {
            res = res.data
            this.tags.unshift(res);
            this.selectTags.unshift(res);
            this.submitTagLoading = false;
          },
          rej => {
            this.submitTagLoading = false;
            this.snackbar = true;
            this.tipsText = rej.message;
          }
        );
      } else {
        let stemp = find(this.selectTags, n => n.value == this.tagValue);
        if (!stemp) {
          this.selectTags.unshift(temp);
          remove(this.displayTags, temp);
        }
      }
      this.tagValue = "";
    },
    addToSelectedTag(item, index) {
      this.selectTags.push(item);
      this.displayTags.splice(index, 1);
    },
    deleteSelectedTag(item, index) {
      this.displayTags.push(item);
      this.selectTags.splice(index, 1);
    },
    cancelSelectTag() {
      this.dialog = false;
      this.selectTags = [];
    },
    confirmSelectTag() {
      this.dialog = false;
      let temp = map(this.selectTags, n => n.value);
      this.selectTags = [];
      // this.data.tags = union(this.data.tags, temp)
      this.$set(this.data, "tags", union(this.data.tags, temp));
    }
  }
};
</script>

<style scoped>
.co-material-id.blur {
  filter: blur(10px);
  transition: all 0.3s;
}
.co-material-id /deep/ .dialog-title {
  position: sticky;
  top: 0;
  z-index: 5;
}
.file-input {
  bottom: 0;
  left: 0;
}
.video-mode-switch {
  align-items: center;
}
.video-player-box {
  width: 100%;
  height: auto;
}
.actions {
  transition: all 0.3s;
}
.actions.ghost{
  opacity: 0;
}
.actions.hold {
  position: fixed;
  bottom: 36px;
  left: 0;
  right: 0;
  z-index: 2;
}
.drag-mode {
  animation: shake 0.2s ease-out 0s infinite;
}
@keyframes shake {
  0% {
    transform: rotate(-1deg);
    animation-timing-function: ease-in;
  }

  50% {
    transform: rotate(1.5deg);
    animation-timing-function: ease-out;
  }
}
</style>
