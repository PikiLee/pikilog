<script setup lang="ts">
import type { HomeCard } from "@/types/home";
defineProps<{
    card: HomeCard
}>();

</script>
<template>
  <a :href="card.link" target="_blank">
    <div class="card">
      <div class="cover-container">
        <img class="img" :src="card.cover" alt="" />
      </div>
        <header class="title">{{ card.text }}</header>
        <time class="time">{{ card.createdAt }}</time>
    </div>
  </a>
</template>

<style scoped lang="scss">
.card {
    display: grid;
    color: $text-white;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: 5rem 3rem;
    width: min(100%, 30rem);
    background-color: $bg-home-card;
    border-radius: 0.2em;
    overflow: hidden;
    column-gap: 2rem;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;

    .cover-container {
        align-self: stretch;
        justify-self: stretch;
        grid-row: 1 / 3;
        grid-column: 1;
        

        .img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    }


        .title {
            font-size: 1.5rem;
            align-self: center;
        }

        .time {
            font-size: 0.7rem;
            color: $text-white-dark-1;
            display: block;
            align-self: center;
    }
}
</style>
