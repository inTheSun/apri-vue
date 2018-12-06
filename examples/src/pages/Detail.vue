<template>
  <page>
    <div class="detail">
      <p>This is the <b>detail</b> page, detail id is {{id}}</p>
      <p>random number: {{random}}</p>
      <a href="javascript:void(0)" @click="replaceToNextDetail">replace to next detail</a>
      <br>
      <a href="javascript:void(0)" @click="goToNextDetail">go to next detail</a>
      <br>
      <a href="javascript:void(0)" @click="goToIndex">go to index</a>
    </div>
  </page>
</template>

<script>
console.log("detail init");
  import Page from '../components/Page.vue'

  export default {
    components: {Page},
    data() {
      return {
        id: Number(this.$route.params.id),
        random: Math.random().toFixed(4)
      }
    },
    created(){
        console.log("detail created");
    },
    activated() {
      console.log('detail activated')
    },
    deactivated() {
      console.log('detail deactivated')
    },
    destroyed() {
      console.log('detail destroyed')
    },
    methods: {
      replaceToNextDetail() {
        this.$router.replace(`/list/${this.id >= 30 ? 30 : this.id + 1}`)
      },
      goToNextDetail() {
        this.$router.push(`/list/${this.id >= 30 ? 30 : this.id + 1}`)
      },
      goToIndex() {
        // jump to index
        console.log(this);
        this.$router.push('/')
      }
    }
  }
</script>
