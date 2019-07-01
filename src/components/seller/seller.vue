<template>
<!-- 商家组件 -->
  <div class="seller" ref="seller">
    <div class="seller-content">
      <div class="overview">
        <h1 class="title">{{seller.name}}</h1>
        <div class="desc border-1px">
          <star :size="36" :score="seller.score" class="star"></star>
          <span class="text">[{{seller.ratingCount}}]</span>
          <span class="text">月售{{seller.sellCount}}单</span>
        </div>
        <ul class="remark">
          <li class="block">
            <h2>起送价</h2>
            <div class="content">
              <span class="stress">{{seller.minPrice}}</span>元
            </div>
          </li>
          <li class="block">
            <h2>商家配送</h2>
            <div class="content">
              <span class="stress">{{seller.deliverPrice}}</span>元
            </div>
          </li>
          <li class="block">
            <h2>平均配送时间</h2>
            <div class="content">
              <span class="stress">{{seller.deliveryTime}}</span>分钟
            </div>
          </li>
        </ul>
        <div class="favorite" @click="toggleFavorite">
          <span class="icon-favorite" :class="{'active':favorite}"></span>
          <span class="text">{{favoriteText}}</span>
        </div>
      </div>
<!-- 公告活动 -->
    <split></split>
    <div class="bulletin">
      <h1 class="title">公告与活动</h1>
      <div class="content-wrapper border-1px">
        <p class="content">{{seller.bulletin}}</p>
      </div>
        <!-- 优惠活动 -->
      <ul v-if="seller.supports" class="support">
        <li class="support-item border-1px" v-for="(item, index) in seller.supports" :key="index">
          <!-- 这里获取数据是异步操作，这里要进行v-if,否则取得的是undefined -->
          <span class="icon" :class="classMap[seller.supports[index].type]"></span>
          <span class="text">{{seller.supports[index].description}}</span>
        </li>
      </ul>
    </div>
<!-- 商家实景 -->
    <split></split>
    <div class="pics">
      <h1 class="title">商家实景</h1>
      <div class="pic-wrapper" ref="picWrapper">
        <ul class="pic-list" ref="picList">
          <li class="pic-item" v-for="(pic, index) in seller.pics" :key="index">
            <img :src="pic" width="120" height="90"/>
          </li>
        </ul>
      </div>
    </div>
<!-- 商家信息 -->
    <split></split>
    <div class="info">
      <h1 class="title border-1px">商家信息</h1>
      <ul>
        <li class="info-item border-1px" v-for="(info, index) in seller.infos" :key="index">{{info}}</li>
      </ul>
    </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import star from '../star/star'
import split from '../split/split'
import BScroll from 'better-scroll'
import { saveToLocal, loadFromLocal } from '../../common/js/store'

export default {
  props: {
    seller: {
      type: Object
    }
  },
  data () {
    return {
      favorite: (() => {
        return loadFromLocal(this.seller.id, 'favorite', false)
      })()
    }
  },
  components: {
    star,
    split
  },
  created () {
    this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
  },
  computed: {
    favoriteText () {
      return this.favorite ? '已收藏' : '收藏'
    }
  },
  mounted () {
    // 页面整体滚动
    this.scroll = new BScroll(this.$refs.seller, {
      click: true
    })
   // 商家图片横向滚动
    if (this.seller.pics) {
      let picWidth = 120
      let margin = 6
      let width = (picWidth + margin) * this.seller.pics.length - margin
      this.$refs.picList.style.width = width + 'px'
      this.$nextTick(() => {
        this.picscroll = new BScroll(this.$refs.picWrapper, {
          scrollX: true,
          eventPassthrough: 'vertical'
        })
      })
    }
  },
  methods: {
    toggleFavorite (event) {
      if (!event._constructed) return
      this.favorite = !this.favorite
      saveToLocal(this.seller.id, 'favorite', this.favorite)
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import '../../common/scss/_mixins.scss';
.seller{
  position: absolute;
  top: 174px;
  bottom: 0;
  left: 0;
  width: 100%;
  overflow: hidden;
  .overview{
    position: relative;
    padding: 18px;
    .title{
      font-size: 14px;
      margin-bottom:8px ;
      color: rgb(7 , 17 , 27);
      line-height: 14px;
    }
    .desc{
      padding-bottom: 18px;
      @include border-1px(rgba(7,17,27,0.1));
      font-size: 0;
      .star{
        display: inline-block;
        vertical-align: top;
        margin-right: 8px;
      }
      .text{
        line-height: 18px;
        display: inline-block;
        margin-right: 12px;
        vertical-align: top;
        font-size: 10px;
        color: rgb(77, 85, 93);
      }
    }
    .remark{
      display: flex;
      padding-top: 18px;
      .block{
        flex: 1;
        text-align: center;
        border-right: 1px solid rgba(7, 17, 27, 0.1);
        &:last-child{
          @include border-none()
        }
        h2{
          font-size: 10px;
          margin-bottom: 4px;
          line-height: 10px;
          color: rgb(147, 153, 159);
        }
        .content{
          line-height: 24px;
          font-size: 10px;
          color: rgb(7, 17, 27);
          .stress{
            font-size: 24px;
          }
        }
      }
    }
    .favorite{
      position: absolute;
      width: 50px;
      right: 5px;
      top: 18px;
      text-align: center;
      .icon-favorite{
        display: block;
        line-height: 24px;
        font-size: 24px;
        color: #d4d6d9;
        margin-bottom: 4px;
        &.active{
          color: rgb(240, 20, 20);
        }
      }
      .text{
        font-size: 10px;
        line-height: 10px;
        color: rgb(77, 85, 93);
      }
    }
  }
  .bulletin{
    padding: 18px 18px 0 18px;
    .title{
      margin-bottom: 8px;
      line-height: 14px;
      color: rgb(7, 17, 27);
      font-size: 14px;
    }
    .content-wrapper{
      padding: 0 12px 16px 12px;
      @include border-1px(rgba(7,17 ,27,0.1));
      .content{
        font-size: 12px;
        font-weight: 200;
        color: rgb(240,20,20);
        line-height: 24px;
      }
    }
    .support{
      .support-item{
        padding: 16px 12px;
        font-size: 0;
        @include border-1px(rgba(7,17,27,0.1));
        font-size: 0;
        &:last-child {
          @include border-none();
        }
      }
      .icon{
        display: inline-block;
        width: 12px;
        height: 12px;
        margin-right: 4px;
        background-size: 12px;
        background-repeat: no-repeat;
        vertical-align: top;
        &.decrease{
          @include bg-image('decrease_4');
        }
        &.discount{
          @include bg-image('discount_4');
        }
        &.guarantee{
          @include bg-image('guarantee_4');
        }
        &.invoice{
          @include bg-image('invoice_4');
        }
        &.special{
          @include bg-image('special_4');
        }
      }
      .text{
        line-height: 16px;
        font-size: 12px;
        color: rgb(7, 17, 27);
        vertical-align: top;
      }
    }
  }
  .pics{
    padding: 18px;
    .title{
      font-size: 14px;
      margin-bottom:12px ;
      color: rgb(7 , 17 , 27);
      line-height: 14px;
    }
    .pic-wrapper{
      position: relative;
      width: 100%;
      overflow: hidden;
      white-space:nowrap;
      .pic-list{
        font-size: 0;
        .pic-item{
          display: inline-block;
          margin-right: 6px;
          width: 120px;
          height: 90px;
          &:last-child{
            margin: 0;
          }
        }
      }
    }
  }
  .info{
    padding: 18px 18px 0 18px;
    color: rgb(7, 17, 27);
    .title{
      @include border-1px(rgba(7,17,27,0.1));
      font-size: 14px;
      padding-bottom:8px ;
      line-height: 14px;
    }
    .info-item{
      padding: 16px 12px;
      line-height: 16px;
      @include border-1px(rgba(7,17,27,0.1));
      font-size: 12px;
      &:last-child{
        @include border-none()
      }
    }
  }
}
</style>
