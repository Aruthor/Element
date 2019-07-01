<template>
<!-- 商品评价选择组件 -->
  <div class="ratingselect">
      <div class="rating-type">
          <span @click="select(2,$event)" class="block positive" :class="{'active':selectType===2}">{{desc.all}}<span class="count">{{ratings.length}}</span></span>
          <span @click="select(0,$event)" class="block positive" :class="{'active':selectType===0}">{{desc.positive}}<span class="count">{{positives.length}}</span></span>
          <span @click="select(1,$event)" class="block negative" :class="{'active':selectType===1}">{{desc.negative}}<span class="count">{{negatives.length}}</span></span>
      </div>
      <div @click="toggleContent" class="switch" :class="{'on':onlyContent}">
          <span class="icon-check_circle"></span>
          <span class="text">只看有内容的评价</span>
      </div>
  </div>
</template>

<script type="text/ecmascript-6">
import Bus from '../../common/js/EventBus.js'
// 定义常量
const POSITIVE = 0
const NEGATIVE = 1
const ALL = 2
export default {
    props: {
        ratings: {
            type: Array,
            default () {
                return []
            }
        },
        selectType: {
            type: Number,
            default: ALL
        },
        onlyContent: {
            type: Boolean,
            default: false
        },
        desc: {
            type: Object,
            default () {
                return {
                    all: '全部',
                    positive: '满意',
                    negative: '不满意'
                }
            }
        }
    },
    methods: {
        toggleContent (event) { // 勾选
            if (!event._constructed) return
            this.onlyContent2 = !this.onlyContent2
            Bus.$emit('content.toggle', this.onlyContent2)
        },
        select (type, event) { // 选择
            if (!event._constructed) return
            this.selectType2 = type
            Bus.$emit('ratingtype.select', type)
        }
    },
    data () {
        return {
            selectType2: this.selectType,
            onlyContent2: this.onlyContent
        }
    },
    computed: {
     positives () {
        return this.ratings.filter((rating) => {
            return rating.rateType === POSITIVE
        })
     },
     negatives () {
        return this.ratings.filter((rating) => {
            return rating.rateType === NEGATIVE
        })
     }
    }
 }
</script>

<style lang="scss" scoped>
@import '../../common/scss/_icon.css';
@import '../../common/scss/_mixins.scss';
.ratingselect{
    .rating-type{
        padding: 18px 0;
        margin: 0 18px;
        @include border-1px(rgba(7,17,27,0.1));
        font-size: 0;
        .block{
            display: inline-block;
            padding: 8px 12px;
            border-radius: 1px;
            margin-right: 8px;
            color: rgb(77, 86, 93);
            font-size: 12px;
            &.active{
                color: #fff;
            }
            &.positive{
                background: rgba(0,160,220, $alpha: 0.2);
                &.active{
                    background: rgb(0,160,220);
                }
            }
            &.negative{
                background: rgba(77, 86, 93, $alpha: 0.2);
                &.active{
                    background: rgb(77, 86, 93);
                }
            }
            .count{
                font-size: 8px;
                line-height: 16px;
                margin-left: 2px;
            }
        }
    }
    .switch{
        padding: 12px 18px;
        line-height: 24px;
        border-bottom: 1px solid rgba(7, 17, 27, 0.1);
        color: rgb(147, 153, 159);
        font-size: 0;
        &.on{
            .icon-check_circle{
                color: #07923f;
            }
        }
        .icon-check_circle{
            display: inline-block;
            vertical-align: top;
            font-size: 24px;
            margin-right: 4px;
        }
        .text{
            font-size: 12px;
        }
    }
}
</style>
