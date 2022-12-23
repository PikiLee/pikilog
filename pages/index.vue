<script setup lang="ts">
import appConfig from "@/plog.config"

const cardList = appConfig.home
</script>
<template>
  <div class="container">
    <HomeCard :card="card"  v-for="card in cardList" :key="card.link"></HomeCard>
  </div>
</template>

<style scoped lang="scss">

.container {
  width: min(30rem, 100%);
  margin: auto;
  display: grid;
  grid-template-columns: 1fr;
  row-gap: 2rem;
}
</style>
