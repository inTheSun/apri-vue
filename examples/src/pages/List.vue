<template>
  <page>
    <div class="list">
      <p>This is the <b>list</b> page</p>
      <p>random number: {{random}}</p>
      <p v-for="n in 30" :key="n">
        <router-link :to="'list/'+n">go to detail page(id: {{n}})</router-link>
      </p>
    </div>
  </page>
</template>

<script>
console.log("list init");
  import Page from '../components/Page.vue'

  export default {
    components: {Page},
    data() {
      return {
        random: Math.random().toFixed(4)
      }
    },
    created(){
        console.log("list created");
    },
    activated() {
      console.log('list activated')
    },
    deactivated() {
      console.log('list deactivated')
    },
    destroyed() {
      console.log('list destroyed')
    }
  }
</script>
