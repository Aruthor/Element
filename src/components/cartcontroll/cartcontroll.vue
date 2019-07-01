<template>
<!-- 购物车商品数量组件 -->
    <div class="cartcontroll">
      <transition name="move">
            <div class="cart-decrease " v-show="food.count>0" @click.stop.prevent="decereaseCart">
                <span class="inner icon-remove_circle_outline"></span>
            </div>
      </transition>
      <div class="cart-count" v-show="food.count>0">{{food.count}}</div>
      <div class="cart-add icon-add_circle" @click.stop.prevent="addCart"></div>
    </div>
</template>

<script type="text/ecmascript-6">
import Vue from 'vue'
import Bus from '../../common/js/EventBus.js'

export default {
  data () {
    return {
    }
  },
  props: {
    food: {
        type: Object
    }
  },
  created () {
  },
  methods: {
    addCart (event) { // 累加
    // better-scroll 可以监听到此事件，浏览器原生不能监听到  防止pc端出现两次点击
        if (!event._constructed) return
    // 当前数量
        (!this.food.count) ? Vue.set(this.food, 'count', 1) : this.food.count++
        Bus.$emit('cart.add', event.target)
    },
    decereaseCart (event) { // 递减
        if (!event._constructed) return
        (!this.food.count) ? Vue.set(this.food, 'count', 0) : this.food.count--
    }
  }
 }
</script>

<style lang="scss" scoped>
.cartcontroll {
    font-size: 0;
    .cart-decrease {
        display: inline-block;
        padding: 6px;
        .inner {
            display: inline-block;
            line-height: 24px;
            font-size: 24px;
            color: rgb(0, 160, 220);
        }
        &.move-enter-active, &.move-leave-active {
            transition: all .5s;
            transform: translate3d(0, 0, 0);
            .inner{
                transition: all .5s;
                transform: rotate(0deg);
            }
        }
        &.move-enter, &.move-leave-active {
            opacity: 0;
            transform: translate3d(24px, 0, 0);
            .inner{
                transform: rotate(180deg);
            }
        }
    }
    .cart-count {
        display: inline-block;
        vertical-align: top;
        width: 12px;
        padding-top: 6px;
        line-height: 24px;
        text-align: center;
        font-size: 10px;
        color: rgb(147, 153, 159);
    }
    .cart-add {
        display: inline-block;
        line-height: 24px;
        font-size: 24px;
        padding: 6px;
        color: rgb(0, 160, 220);
    }
}
</style>
