<template>
<!-- 商品详情页 -->
  <transition name="move" >
    <div class="food" v-show="showFlag" ref="food">
        <div class="food-content">
            <!-- 图片 -->
            <div class="image-header">
                <img :src="food.image" alt=""/>
                <div class="back" @click="hide">
                    <i class="icon-arrow_lift"></i>
                </div>
            </div>
            <!-- 内容 -->
            <div class="content">
                <h1 class="title">{{food.name}}</h1>
                <div class="detail">
                    <span class="sell-count">月售{{food.sellCount}}份</span>
                    <span class="rating">好评率{{food.rating}}%</span>
                </div>
                <div class="price">
                    <span class="now">￥{{food.price}}</span>
                    <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                </div>
                <!-- 加入购物车 -->
                <div class="cartcontrol-wrapper" >
                    <cartcontrol :food="food"></cartcontrol>
                </div>
                <transition name="fade">
                    <div class="buy" v-show="!food.count || food.count === 0" @click.stop.prevent="addFirst">加入购物车</div>
                </transition>
            </div>
            <!-- 商品详情 -->
            <split v-show="food.info"></split>
            <div class="info" v-show="food.info">
                <h1 class="title">商品信息</h1>
                <div class="text">{{food.info}}</div>
            </div>
            <!-- 商品评价 -->
            <split></split>
            <div class="rating">
                <h1 class="title">商品评价</h1>
                <ratingselect :select-type="selectType" :only-content="onlyContent" :desc="desc" :ratings="food.ratings"></ratingselect>
                <div class="rating-wrapper">
                    <ul v-show="food.ratings && food.ratings.length">
                        <li v-show="needShow(rating.rateType, rating.text)" v-for="(rating, index) in food.ratings" :key="index" class="rating-item border-1px">
                            <div class="user">
                                <span class="name">{{rating.username}}</span>
                                <img class="avatar" width="12" height="12" alt="" :src="rating.avatar"/>
                            </div>
                            <div class="time">{{rating.rateTime | formatDate }}</div>
                            <p class="text">
                                <span :class="{'icon-thumb_up':rating.rateType === 0, 'icon-thumb_down':rating.rateType === 1}">
                                    <span>{{rating.text}}</span>
                                </span>
                            </p>
                        </li>
                    </ul>
                    <div class="no-rating" v-show="!food.ratings || !food.ratings.lenhth">暂无评价</div>
                </div>
            </div>
        </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import Vue from 'vue'
import BScroll from 'better-scroll'
import Bus from '../../common/js/EventBus.js'
import cartcontrol from '../cartcontroll/cartcontroll'
import split from '../split/split'
import ratingselect from '../ratingselect/ratingselect'
import {formatDate} from '@/common/js/date'

const POSITIVE = 0
const NEGATIVE = 1
const ALL = 2
export default {
  data () {
    return {
      showFlag: false,
      selectType: ALL,
      onlyContent: true,
      desc: {
        all: '全部',
        positive: '推荐',
        negative: '吐槽'
      }
    }
  },
  props: {
    food: {
      type: Object
    }
  },
  methods: {
    show () { // 显示列表
        this.showFlag = true
        this.selectType = ALL
        this.onlyContent = true
        this.$nextTick(() => {
            if (!this.scroll) {
                this.scroll = new BScroll(this.$refs.food, {
                    click: true
                })
            } else {
                this.scroll.refresh()
            }
        })
    },
    hide () { // 因此列表
        this.showFlag = false
    },
    addFirst (event) { // 购物车添加
        if (!event._constructed) return
        Bus.$emit('cart.add', event.target)
        Vue.set(this.food, 'count', 1)
    },
    needShow (type, text) { // 评价内容显示
        if (this.onlyContent && !text) {
            return false
        }
        if (this.selectType === ALL) {
            return true
        } else {
            return type === this.selectType
        }
    }
  },
  components: {
    cartcontrol,
    split,
    ratingselect
  },
  created () {
    Bus.$on('ratingtype.select', selectType => {
        this.selectType = selectType
        this.$nextTick(() => {
            this.scroll.refresh()
        })
    })

    Bus.$on('content.toggle', onlyContent => {
        this.onlyContent = onlyContent
        this.$nextTick(() => {
            this.scroll.refresh()
        })
    })
  },
  filters: {
    formatDate (time) {
            let date = new Date(parseInt(time)) // 输出结果需要转换为数字格式
            return formatDate(date, 'yyyy-MM-dd hh:mm')
        }
  }
}
</script>

<style lang="scss" scoped>
@import '../../common/scss/_icon.css';
@import '../../common/scss/_mixins.scss';
.food {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 48px;
  z-index: 30;
  width: 100%;
  background: #fff;
  &.move-enter-active, &.move-leave-active{
    transition: all 0.2s linear;
    transform: translate3d(0,0,0);
  }
  &.move-enter, &.move-leave-active{
    transform: translate3d(100%,0,0);
  }
  .food-content{
    .image-header{
        position: relative;
        width: 100%;
        height: 0%;
        padding-top: 100%;
        img{
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        }
        .back{
            position: absolute;
            top: 10px;
            left: 0;
            .icon-arrow_lift{
                display: block;
                padding: 10px;
                font-size:20px;
                color: #fff;
            }
        }
    }
    .content{
        padding: 18px;
        position: relative;
        .title{
            line-height:14px;
            margin-bottom: 8px;
            font-size: 14px;
            font-weight: 700;
            color: rgb(7, 17, 27)
        }
        .detail{
            margin-bottom: 18px;
            height: 10px;
            line-height: 10px;
            font-size: 0;
            .sell-count,.rating{
                font-size: 10px;
                color: rgb(147, 153, 159);
            }
            .sell-count{
                margin-right: 12px;
            }
        }
        .price{
            font-weight: 700;
            line-height: 24px;
            .now{
                margin-right: 8px;
                font-size: 14px;
                color: rgb(240, 20, 20);
            }
            .old{
                text-decoration: line-through;
                font-size: 10px;
                color: rgb(147, 153, 159);
            }
        }
        .cartcontrol-wrapper{
            position: absolute;
            right: 12px;
            bottom: 12px;
        }
        .buy{
            position: absolute;
            right: 18px;
            bottom: 18px;
            z-index: 10;
            height: 24px;
            line-height: 24px;
            padding: 0 12px;
            box-sizing: border-box;
            font-size: 10px;
            border-radius: 12px;
            background: rgb(0, 160, 220);
            color: #fff;
            &.fade-enter-active, &.fide-leave-active{
                transition: opacity .5s;
            }
            &.fade-enter,&.fide-leave-active{
                opacity: 0;
            }
        }
    }
    .info{
        padding: 18px;
        .title{
            line-height: 14px;
            margin-bottom: 6px;
            font-size: 14px;
            color:rgb(7, 17, 27);
        }
        .text{
            color: rgb(77, 85, 93);
            line-height: 24px;
            padding: 0 8px;
            font-size: 12px;
        }
    }
    .rating{
        padding-top: 18px;
        .title{
            line-height: 14px;
            margin-left: 18px;
            font-size: 14px;
            color:rgb(7, 17, 27);
        }
        .rating-wrapper{
            padding: 0 18px;
            .rating-item{
                position: relative;
                padding: 16px 0;
               @include border-1px(rgba(7,17,27,0.1));
                .user{
                    position: absolute;
                    right: 0;
                    margin-right: 6px;
                    top: 16px;
                    line-height: 12px;
                    font-size: 0;
                    .name{
                        display: inline-block;
                        font-size: 10px;
                        margin-right: 6px;
                        vertical-align: top;
                        color: rgb(147, 153, 159);
                    }
                    .avatar{
                        border-radius: 50%;
                    }
                }
                .time{
                    line-height: 12px;
                    font-size: 10px;
                    color: rgb(147, 153, 159);
                    margin-bottom: 6px;
                }
                .text{
                    line-height: 16px;
                    font-size: 12px;
                    color: rgb(7, 17, 27);
                    .icon-thumb_up,.icon-thumb_down{
                        line-height: 16x;
                        margin-right: 4px;
                    }
                    .icon-thumb_up{
                        color: rgb(0, 160, 220)
                    }
                    .icon-thumb_down{
                        color: rgb(147, 153, 159);
                    }
                }
            }
        }
    }
  }
}
</style>
