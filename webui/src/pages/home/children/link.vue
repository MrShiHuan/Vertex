<template>
  <div>
    <div class="radius-div">
      <div style="margin: 20px auto; padding: 20px 0;">
        <el-form style="padding-left: 32px; color: #000; text-align: left;" label-width="160px" label-position="left" size="mini">
          <el-form-item label="下载器">
            <span>{{ this.torrentInfo.clientAlias }}</span>
          </el-form-item>
          <el-form-item label="操作种子">
            <span>{{ this.torrentInfo.name }}</span>
          </el-form-item>
          <el-form-item label="种子hash">
            <span>{{ this.hash }}</span>
          </el-form-item>
          <el-form-item label="种子大小">
            <span>{{ $formatSize(this.torrentInfo.size) }}</span>
          </el-form-item>
          <el-form-item label="保存路径">
            <span>{{ this.torrentInfo.savePath }}</span>
          </el-form-item>
          <el-form-item label="选择链接规则">
            <el-select v-model="linkRule" style="width: 200px" placeholder="选择链接规则">
              <el-option v-for="rule of linkRuleList" :key="rule.id" :label="rule.alias" :value="rule.id">{{rule.alias}}</el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="分类">
            <el-select v-model="type" style="width: 200px" placeholder="分类">
              <el-option label="电影" value="movie"></el-option>
              <el-option label="剧集" value="series"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="媒体库文件夹">
            <el-input v-model="libraryPath" type="input" style="width: 200px;" placeholder="媒体库文件夹"></el-input>
          </el-form-item>
          <el-form-item label="影视剧名">
            <el-input v-model="mediaName" type="input" style="width: 200px;" placeholder="影视剧名"></el-input>
          </el-form-item>
          <el-form-item size="small">
            <el-button type="primary" @click="startLink">执行</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      linkRuleList: [],
      torrentInfo: {},
      hash: '',
      libraryPath: '',
      mediaName: '',
      type: '',
      linkRule: ''
    };
  },
  methods: {
    async getTorrentInfo () {
      const res = await this.$axiosGet('/api/torrent/info?hash=' + this.hash);
      this.torrentInfo = res?.data;
    },
    async listLinkRule () {
      const res = await this.$axiosGet('/api/linkRule/list');
      this.linkRuleList = res ? res.data.sort((a, b) => a.alias > b.alias ? 1 : -1) : [];
    },
    async startLink () {
      const res = await this.$axiosPost('/api/torrent/link', {
        hash: this.hash,
        type: this.type,
        mediaName: this.mediaName,
        linkRule: this.linkRule,
        client: this.torrentInfo.client,
        libraryPath: this.libraryPath,
        savePath: this.torrentInfo.savePath
      });
      this.linkRuleList = res ? res.data.sort((a, b) => a.alias > b.alias ? 1 : -1) : [];
      if (!res) {
        return;
      }
      await this.$messageBox(res);
    }
  },
  async mounted () {
    this.hash = this.$route.query.hash;
    if (!this.hash) {
      await this.$message.error('当前页面需要从种子聚合页进入!');
      return;
    }
    await this.getTorrentInfo();
    await this.listLinkRule();
  }
};
</script>

<style scoped>
.el-form-item {
  margin: 12px 0;
  margin-bottom: 0;
}
</style>
