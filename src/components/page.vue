<template>
  <nav>
    <ul class="pager">
      <li :class="{previous:true, disabled: prev_disable }"><a v-on:click.stop="prev"><span aria-hidden="true">&larr;</span> 上一页</a></li>
      <span>第{{page}}页</span>
      <li :class="{next:true, disabled: next_disable }"><a v-on:click.stop="next">下一页 <span aria-hidden="true">&rarr;</span></a></li>
    </ul>
  </nav>
</template>
<style lang="stylus">
.pager li
  cursor: pointer
</style>
<script>
export default {
  props: {
    page: Number,
    count: Number,
    prev: Function,
    next: Function
  },
  computed: {
    prev_disable() {
      return this.page == 1
    },
    next_disable() {
      return this.page * 30 > this.count
    }
  },
}
</script>
