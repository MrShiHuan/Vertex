<template>
  <div id="app">
    <div>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  components: {
  },
  data () {
    return {
    };
  },
  methods: {
    async getBackground () {
      const res = await this.$axiosGet('/api/setting/getBackground');
      document.body.style.background = res.data ? `url(${res.data})` : 'url(\'/assets/images/background.jpg\')';
      document.body.style.backgroundPositionX = 'center';
      document.body.style.backgroundPositionY = 'center';
      document.body.style.backgroundSize = 'cover';
    }
  },
  created () {
    this.getBackground();
  }
};
</script>

<style>
@import '/api/setting/getCss.css';

body {
  height: calc(var(--vh, 1vh) * 100);
  background-position-x: center;
  background-size: cover;
}

@font-face{
  font-family: 'consolas';
  src: url('/assets/fonts/consolas.woff');
}

#app {
  font-family: consolas, "Microsoft YaHei","微软雅黑","Hiragino Sans GB","Helvetica Neue",Helvetica,"PingFang SC",Arial,sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-text-size-adjust: 100%;
}

.el-tabs--card>.el-tabs__header {
  border-bottom: none;
}

.el-tabs__item {
  color: #000;
  border-radius: 8px !important;
}

/*
.el-tabs, .radius-div {
  border-radius: 8px;
  background: rgba(255,255,255, 0.3);
  backdrop-filter: blur(4px);
}
*/
.el-table__body td.el-table__cell .el-row:hover{
    background-color: rgba(255,255,255, 0.1) !important;
    backdrop-filter: blur(4px);
    border-radius: 8px;
}

.el-table__body td.el-table__cell .el-row {
  padding: 0 10px;
}

tr.hover-row>td.el-table__cell {
  background-color: rgba(255,255,255, 0.2) !important;
  border-radius: 8px;
}

.el-dialog {
  border-radius: 8px;
}

.el-table__body .el-table__row:hover, .el-table--enable-row-hover .el-table__body tr:hover>td.el-table__cell {
  background-color: transparent !important;
}

.el-table__body td.el-table__cell .cell:hover{
  background-color: transparent !important;
}

.el-textarea__inner {
  font-family: 'consolas';
}

.el-table {
  width: auto;
  color: #000
}

.el-table thead, .el-form-item__label, .el-checkbox__label, .el-table__empty-text {
  color: #000
}

.el-card {
  border: none;
  background-color: transparent;
}

.el-table__expand-icon {
  width: 72px;
  height: 48px;
  padding-left: 0;
  padding-right: 0;
 }

.el-table__expand-column .cell {
  width: 72px;
  height: 48px;
  padding-left: 0;
  padding-right: 0;
}

.el-tabs--card>.el-tabs__header .el-tabs__nav {
  border: none;
}

.el-menu-item {
  color: #000;
}

.el-descriptions__body {
  color: #000;
}

.el-descriptions-item__label.is-bordered-label {
  background: transparent !important;
}

.el-descriptions__body, .el-table, .el-table tr,
.el-table__expanded-cell, .el-table th.el-table__cell,
.el-divider--horizontal, .el-table--border::after,
.el-table--group::after, .el-table::before, .el-table__fixed-right::before,
.el-table__fixed::before, .el-collapse-item__header, .el-collapse-item__wrap,
.el-input__inner, .el-checkbox__inner, .el-textarea__inner, .el-input-group__append, .el-input-group__prepend, .el-tag.el-tag--info {
  background-color: transparent !important;
}

.el-input__inner, .el-checkbox__inner, .el-textarea__inner,
.el-input-group__append, .el-input-group__prepend {
  border: 1px solid #409EFF;
  color: #000;
  font-family: consolas;
}

.el-checkbox__inner::after {
  border: 1px solid #000;
  border-left: 0;
  border-top: 0;
}

.el-select-dropdown__item {
  font-family: consolas;
}

.el-tag.el-tag--info {
  color: #000;
}
.el-input__inner::placeholder {
  color: #409EFF;
}
.el-tag {
  border: none;
}

.el-collapse {
  border-top: none;
  border-bottom: none;
}

.el-table td.el-table__cell, .el-table th.el-table__cell.is-leaf, .el-collapse-item__wrap, .el-collapse-item__header {
  border-bottom: none;
}

*::-webkit-scrollbar-thumb {
  border-radius   : 10px;
  background-color: skyblue;
  background-image: -webkit-linear-gradient(
      45deg,
      rgba(255, 255, 255, 0.2) 25%,
      transparent 25%,
      transparent 50%,
      rgba(255, 255, 255, 0.2) 50%,
      rgba(255, 255, 255, 0.2) 75%,
      transparent 75%,
      transparent
  );
}

*::-webkit-scrollbar {
  width : 7px;
  height: 10px;
}

*::-webkit-scrollbar-track {
  box-shadow   : inset 0 0 5px rgba(0, 0, 0, 0.2);
  background   : #ededed;
  border-radius: 10px;
}
</style>
