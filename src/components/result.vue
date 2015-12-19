<template>

  <div class="results">
    <div class="result" v-for="i in data">
      <div class="title">
        <a href="{{i.loc}}">{{{i.title | color}}}</a>
      </div>
      <div class="link">{{i.loc}}</div>
      <div class="description">
        {{{i.text | color}}}
      </div>
      <div class="extra">
      </div>
    </div>
  </div>

</template>
<style lang="stylus">
div.results
  background: #FEFEFE
  padding: 25px
  .result
    margin-bottom: 10px
  .title
    font-size: 18px
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-text-overflow: ellipsis;
    white-space: nowrap;
  .link
    color: rgb(0, 102, 33)
    font-size: 14px
  .description
    font-size: 13px
    color: rgb(84, 84, 84)
    word-wrap: break-word
    max-height: 70px
    overflow: hidden
</style>
<script>
export default {
  props: {
    data: Array,
    keyword: String
  },
  filters: {
    color(val) {
      let rendered_html = val;
      let keywords = this.keyword.trim().split(' ').filter(function(e){
        return e && e.length > 0
      })
      keywords.forEach(function(k){
        let reg = new RegExp(`(${k})`, 'ig')
        rendered_html = rendered_html.replace(reg, '<span class="highlight">$1</span>')
      })
      return rendered_html
    }
  },
}
</script>
