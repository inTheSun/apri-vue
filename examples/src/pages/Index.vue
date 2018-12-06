<template>
  <page>
    <div class="index">
      <p>This is the <b>index</b> page</p>
      <p>random number: {{random}}</p>
      <p>
        <router-link to="/">go to index page</router-link>
      </p>
      <p>
        <router-link to="list">go to list page</router-link>
      </p>
    </div>
  </page>
</template>

<script>
console.log("index init");

import Page from "../components/Page.vue";

export default {
  components: { Page },
  data() {
    return {
      random: Math.random().toFixed(4)
    };
  },
  created(){
        console.log("index created");
    },
  activated() {
    console.log("index activated");
  },
  deactivated() {
    console.log("index deactivated");
  },
  destroyed() {
    console.log("index destroyed");
  }
};
</script>
