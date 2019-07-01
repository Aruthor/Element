<template>
<!-- 食物内容区域 -->
<div class="goods">
  <!-- 左边菜单 -->
  <div class="menu-wrapper" ref="menuWrapper">
    <ul>
       <li v-for="(item, index) in goods" class="menu-item" :key="index" :class="{'current':currentIndex===index}" @click="selectMenu(index , $event)">
        <span class="text border-1px">
          <span v-show="item.type> 0" class="icon" :class="classMap[item.type]"></span>
          {{item.name}}
        </span>
      </li>
    </ul>
  </div>
  <!-- 右边内容 -->
  <div class="foods-wrapper" ref="foodsWrapper">
    <ul>
      <li v-for="(item ,index) in goods" class="food-list food-list-hook" :key="index">
        <h1 class="title">{{item.name}}</h1>
        <ul>
          <li @click="selectFood(food, $event)" v-for="(food, index) in item.foods" class="food-item border-1px" :key="index">
            <div class="icon">
              <img :src="food.icon" width="57" height="57">
            </div>
            <div class="content">
              <h2 class="name">{{food.name}}</h2>
              <p class="desc">{{food.description}}</p>
              <div class="extra">
                <span class="count">月售{{food.sellCount}}份</span>
                <span>好评率{{food.rating}}%</span>
              </div>
              <div class="price">
                <span class="now">￥{{food.price}}</span>
                <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
              </div>
              <div class="cartcontroll-wrap">
                <!-- 购物车数量组件 -->
                <cartcontroll :food="food"></cartcontroll>
              </div>
            </div>
          </li>
        </ul>
      </li>
    </ul>
  </div>
  <!-- 购物车组件 -->
  <shopcart ref="shopcart" :selectFoods="selectFoods" :delivery-price="seller.deliverPrice" :min-price="seller.minPrice"></shopcart>
  <!-- 商品详情页组件 -->
  <food :food="selectedFood" ref="food"></food>
</div>

</template>
<script type="text/ecmascript-6">
// 这里创建BScroll时是定义未使用，会报错，必须使用,这里要采用ref，在头部看
import BScroll from 'better-scroll'
import shopcart from '../shopcart/shopcart'
import cartcontroll from '../cartcontroll/cartcontroll'
import Bus from '../../common/js/EventBus.js'
import food from '../food/food'

const ERR_OK = 0
export default {
  data () {
    return {
      goods: [],
      listHeight: [],
      scrolly: 0,
      selectedFood: {}
    }
  },
  props: {
    seller: {
      type: Object
    }
  },
  created () {
    this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
    this.$http.get('/api/goods').then((res) => {
      res = res.body
      if (res.errno === ERR_OK) {
        this.goods = res.data
        // dom更新了 操作dom时一定要在$nextTick里面
        this.$nextTick(() => {
          this._inirScroll()
          this._calculateHeight()
        })
      }
    })
    Bus.$on('cart.add', (el) => { // 进行触发
      this.$nextTick(() => {
        this.$refs.shopcart.drop(el)
      })
    })
  },
  methods: {
    _inirScroll () { // 链级滚动
      this.menuScroll = new BScroll(this.$refs.menuWrapper, {
        click: true // 设置点击
      })
      this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
        click: true,
        probeType: 3// 跟踪事件源
      })
      this.foodsScroll.on('scroll', (pos) => {
        this.scrolly = Math.abs(Math.round(pos.y))
      })
    },
    _calculateHeight () { // 记录每层占的屏幕高度
      let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook')
      let height = 0
      this.listHeight.push(height) // 初始化位置
      for (let i = 0; i < foodList.length; i++) {
        let item = foodList[i]
        height += item.clientHeight
        this.listHeight.push(height)
      }
    },
    selectMenu (index, event) { // 菜单栏触发food栏
     // better-scroll 可以监听到此事件，浏览器原生不能监听到  防止pc端出现两次点击
      if (!event._constructed) return
      let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook')
      let el = foodList[index]
      this.foodsScroll.scrollToElement(el, 300)// 菜单栏触发food栏
    },
    selectFood (food, event) {
      if (!event._constructed) return
      this.selectedFood = food
      this.$refs.food.show()
    }
  },
  components: {// 定义局部组件
    shopcart,
    cartcontroll,
    food
  },
  computed: {
    currentIndex () { // 计算属性，时时获得当前高度
      for (let i = 0; i < this.listHeight.length; i++) {
        let height1 = this.listHeight[i] // 当前内容高度
        let height2 = this.listHeight[i + 1] // 下一个内容高度
        if (!height2 || (this.scrolly >= height1 && this.scrolly < height2)) return i
      }
      return 0
    },
    selectFoods () { // 计算添加数量
      let foods = []
      this.goods.forEach((good) => { // 从seller页传入的获取goods，然后从goods中获取goods页面中内容存为good
        good.foods.forEach((food) => { // 将good中的数组进行遍历，然后添加列表中的food
          if (food.count) foods.push(food) // 判断当前数量，如果不等0，则添加到数组上
        })
      })
      return foods
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../../common/scss/_mixins';

.goods{
  display: flex;
  position: absolute;
  top: 174px;
  bottom: 46px;
  width: 100%;
  overflow: hidden;
  .menu-wrapper{
    flex: 0 0 80px;
    width: 80px;
    background: #f3f5f7;
    .menu-item{
      display: table;
      height: 54px;
      width: 56px;
      line-height: 14px;
      padding: 0 12px;
      &.current{
        position: relative;
        z-index: 10;
        font-weight: 700;
        margin-top: -1px;
        background: #fff;
        .text{
          @include border-none();
        }
      }
      .icon{
        display: inline-block;
        vertical-align: top;
        width: 12px;
        height: 12px;
        margin-right: 2px;
        background-size: 12px 12px;
        background-repeat: no-repeat;
        &.decrease{
          @include bg-image('decrease_3');
        }
        &.discount{
          @include bg-image('discount_3');
        }
        &.guarantee{
          @include bg-image('guarantee_3');
        }
        &.invoice{
          @include bg-image('invoice_3');
        }
        &.special{
          @include bg-image('special_3');
        }
      }
      .text{
        display: table-cell;
        width: 56px;
        font-size: 12px;
        vertical-align: middle;
        @include border-1px(rgba(7, 17, 27, .1));
      }
    }
  }
  .foods-wrapper{
    flex: 1;
    .title{
      padding-left: 14px;
      height: 26px;
      line-height: 26px;
      border-left: 2px solid #d9dde1;
      font-size: 12px;
      color: rgb(147, 153, 159);
      background: #f3f5f7;
    }
    .food-item{
      display: flex;
      margin: 18px;
      padding-bottom: 18px;
      @include border-1px(rgba(7, 17, 27, .1));
      &:last-child{
        @include border-none;
        margin-bottom: 0;
      }
      .icon{
        flex: 0 0 57px;
        margin-right: 10px;
      }
      .content{
        flex: 1;
        .name{
          margin: 2px 0 8px 0;
          height: 14px;
          line-height: 14px;
          font-size: 14px;
          color: rgb(7, 17, 27);
        }
        .desc,.extra{
          line-height: 10px;
          font-size: 10px;
          color: rgb(147, 153, 159);
        }
        .desc{
          margin-bottom: 8px;
          line-height: 12px;
        }
        .extra{
          .count{
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
        .cartcontroll-wrap{
          position: absolute;
          right: 0;
          bottom: 12px;
        }
      }
    }
  }
}
</style>
