<template>
  <main class="container">
    <h1>搜索 <small>engadge.com 垂直搜索</small></h1>
    <spinner v-show="disable"></spinner>
    <!-- 搜索框 -->
    <div class="searcher">
      <input type="text" placeholder="输入关键词" name="query" @keyup.enter="search" v-model="keyword">
      <button v-on:click.stop="search">
        <span>搜索</span>
      </button>
    </div>

    <h3>搜索结果<small v-if="searched">(共检索到{{count}}个结果，耗时{{time/1000}}秒)</small></h3>
    <page v-show="searched" :page="page" :count="count" :prev="prev" :next="next"></page>

    <result :data="data" :keyword="keyword"></result>

    <page v-show="searched" :page="page" :count="count" :prev="prev" :next="next"></page>
  </main>
</template>

<script>
'use strict'
import Spinner from './components/spinner.vue'
import Page from './components/page.vue'
import Result from './components/result.vue'
export default {
  data () {
    return {
      disable: false,
      keyword: '',
      searched: false,
      count: 0,
      time: 0,
      page: 1,
      data: []
    }
  },

  methods: {
    search() {
      if (this.keyword.trim().length > 0){
        this.disable = true
        $.get('/s/' + this.keyword + '?page=' + this.page, function (result){
          let {count, time, data} = result
          this.count = count
          this.time = time
          this.data = data
          this.searched = true
          this.disable = false
        }.bind(this))
      }
    },
    prev() {
      if(this.page > 1){
        this.page--
        this.search()
      }
    },
    next() {
      if(this.page*30 <= this.count){
        this.page++
        this.search()
      }
    }
  },

  components: {Spinner, Page, Result}
}


</script>

<style lang="stylus">
body
  background-color: #EFEFEF
  font-family: "Source Han Sans CN","Hiragino Sans GB", "Microsoft YaHei","WenQuanYi Micro Hei"
main
  position: relative
h1, h3
  font-weight: 100
  small
    font-weight: 100
.highlight
  color: #C83333
.searcher
  display: flex
  font-size: 16px
  font-weight: 100
  input
    width: 80%
    padding: 15px
  input[disabled]
    background: #EAEAEA
  button
    width: 20%
    padding: 15px
    border: 0
    background: #3396C5
    color: white
  button[disabled]
    background: darken(#3396C5, 40%)



</style>
