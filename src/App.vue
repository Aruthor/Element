<template>
<!-- 主页面 -->
  <div>
    <!-- 头部head插件 -->
    <v-header :seller='seller'></v-header>
    <!-- 导航栏 -->
    <div class="tab">
      <div class="tab-item">
        <router-link :to="{path:'/goods'}">商品</router-link>
      </div>
      <div class="tab-item">
        <router-link :to="{path:'/ratings'}">评价</router-link>
      </div>
      <div class="tab-item">
        <router-link :to="{path:'/seller'}">商家</router-link>
      </div>
    </div>
    <!-- 渲染层 keep-alive是避免多次请求，请求一次后依赖缓存就可访问 -->
    <keep-alive>
      <router-view :seller='seller'></router-view>
    </keep-alive>
  </div>
</template>

<script type="text/ecmascript-6">
import header from './components/header/header'
const ERR_OK = 0

export default {
  data () {
    return {
      seller: {}
    }
  },
  created () { // 此方法依赖v-resource的语法
    this.$http.get('/api/seller').then((res) => {
        res = res.body
        if (res.errno === ERR_OK) {
          this.seller = res.data
          // console.log(this.seller)
        }
    }, (res) => {
      console.log('error to $http.get')
    })
  },
  components: {
    'v-header': header
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scope>
@import './common/scss/_mixins';

.tab {
  display: flex;
  width: 100%;
  height: 40px;
  line-height: 40px;
  @include border-1px(rgba(7, 17, 27, 0.1));

  .tab-item {
    flex: 1;
    text-align: center;

    & > a {
      display: block;
      font-size: 14px;
      color: rgb(77, 85, 93);

      &.active {
        color: rgb(240, 20, 20);
      }
    }
  }
}
</style>
