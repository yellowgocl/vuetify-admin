<template>
  <v-container class="co-material-id">
    <v-toolbar dark class="header-title">
      <v-toolbar-title>编辑素材</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn color="secondary" icon dark>
          <v-icon>close</v-icon>
        </v-btn>
        <v-btn color="primary" icon dark>
          <v-icon>done</v-icon>
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-card class="pt-8">
      <v-card-text>
        <v-row align="center" no-gutters>
          <v-col>
            <div class="headline">素材预览</div>
          </v-col>
          <v-switch
            class="video-mode-switch ma-0 pa-0"
            hide-details
            v-model="isVideoMode"
            inset
            :label="`${isVideoMode ? '视频模式' : '图片模式'}`"
          ></v-switch>
        </v-row>
        <v-row class="mb-1 mt-4">
          <v-col
            cols="6"
            sm="3"
            md="2"
            lg="2"
            v-for="(pic, index) in data.pics"
            :key="pic"
          >
            <v-card color="accent" class="pa-1 relative">
              <v-btn
                @click.stop="deletePic(index)"
                class="mt-2"
                absolute
                right
                x-small
                fab
                ><v-icon small dense>close</v-icon></v-btn
              >
              <v-img ripple :height="imageHeight" :src="pic"></v-img>
            </v-card>
          </v-col>
        </v-row>
        <v-row no-gutters align="center">
          <v-file-input
            class="file-input my-4 mr-4"
            placeholder="点击上传素材"
            :counter="fileInputRestrict"
            multiple
            hide-details
            solo-inverted
            rounded
            v-model="bannerFile"
            prepend-icon="insert_photo"
            accept="image/*"
          >
            <template v-slot:selection="{ text }">
              <v-chip small label color="primary">
                {{ text }}
              </v-chip>
            </template>
          </v-file-input>
          <v-chip
            outlined
            dark
            tile
            :color="fileInputRestrict == 0 ? 'pink' : 'info'"
            >{{ fileInputRestrict }}/9</v-chip
          >
        </v-row>
        <v-divider></v-divider>
        <v-row no-gutters class="mt-6">
          <v-col cols="12" sm="6" md="8">
            <div class="headline mb-4 mt-6">信息编辑</div>
          </v-col>
          <v-spacer></v-spacer>
          <v-switch
            :true-value="1"
            :false-value="0"
            v-model="data.status"
            inset
            :label="`启用状态: ${!!data.status ? '启用' : '禁用'}`"
          ></v-switch>
        </v-row>
        <v-form
          @submit.prevent="validate"
          id="form"
          ref="form"
          v-model="valid"
          :lazy-validation="lazy"
        >
          <v-text-field
            class="mb-4"
            :rules="nameRules"
            hint="必填"
            :persistent-hint="true"
            v-model="data.title"
            label="分类名"
          ></v-text-field>
          <v-select
            item-text="name"
            item-value="id"
            label="选择所属分类"
          ></v-select>
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
                readonly
                hint="只读"
                :persistent-hint="true"
                class="mr-0 "
                type="number"
                v-model="data.orderNum"
                label="排序号"
              ></v-text-field
            ></v-col>
          </v-row>
          <div class="headline mb-4 mt-8">标签管理</div>
          <div>
            <v-chip
              v-for="(tag, index) in data.tags"
              :key="tag"
              class="ma-2"
              close
              color="teal"
              text-color="white"
              close-icon="delete"
              @click:close="deleteTag(index)"
            >
              {{ tag }}
            </v-chip>
            <v-chip class="ma-2" color="accent" text-color="white">
              <v-avatar left>
                <v-icon>add</v-icon>
              </v-avatar>
              加一个标签
            </v-chip>
          </div>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="secondary" x-large text
          >&nbsp;&nbsp;取消编辑&nbsp;&nbsp;</v-btn
        >
        <v-btn color="primary mx-4" x-large
          >&nbsp;&nbsp;&nbsp;&nbsp;确定保存&nbsp;&nbsp;&nbsp;&nbsp;</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
import { map, concat } from 'lodash'
export default {
  data() {
    return {
      isVideoMode: false,
      nameRules: [
        v => !!v || "分类名不能为空",
        v => (v && v.length <= 30) || "长度不能超过30个字符"
      ],
      valid: false,
      lazy: false,
      data: {},
      bannerFile: []
    };
  },
  computed: {
    imageHeight() {
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          return "6rem";
        case "sm":
          return "8rem";
        case "md":
          return "8rem";
        case "lg":
          return "9rem";
      }
    },
    fileInputRestrict() {
      let len = !!this.data && !!this.data.pics ? this.data.pics.length : 9;
      return this.isVideoMode ? 1 : 9 - len;
    }
  },
  mounted() {
    // console.info(this.$route)
    let id = this.$route.params.id;
    this.fetchData(id);
  },
  watch: {
    bannerFile(n, o) {
      if (!!n) {
        this.$api.fileUpload(n).then(res => {
          this.data.pics = concat(this.data.pics, res)
          consoled.info(res)
        });
      }
    }
  },
  methods: {
    fetchData(id) {
      if (!!id) {
        this.$api.getArchive(id).then(res => {
          this.data = res;
        });
      }
    },
    onUpload(index) {
      let fileInput = this.$refs["file-input" + index];
      fileInput[0].$el.click();
    },
    deleteTag(index) {
      let flag = confirm("是否确认删除标签?");
      this.data.tags.splice(index, 1);
    },
    deletePic(index) {
      let flag = confirm("是否确认删除图片?");
      this.data.pics.splice(index, 1);
    }
  }
};
</script>

<style scoped>
/* .co-material-id /deep/ .header-title {
    position: sticky;
    top: 0;
    z-index: 5;
} */
.file-input {
  bottom: 0;
  left: 0;
}
.video-mode-switch {
  align-items: center;
}
</style>
