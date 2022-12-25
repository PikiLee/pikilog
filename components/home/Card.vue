<script setup lang="ts">
import type { HomeCard } from "@/types/home";
defineProps<{
    card: HomeCard
}>();

</script>
<template>
  <a :href="card.link">
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
    $intro-padding-left: 1rem;
    display: grid;
    color: $text-white;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    grid-template-rows: minmax(5rem, auto) minmax(3rem, auto);
    width: min(90%, 30rem);
    margin: auto;
    background-color: $bg-home-card;
    border-radius: 0.2em;
    overflow: hidden;
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
            padding: $intro-padding-left;
            display: grid;
            align-items: center;
        }

        .time {
            font-size: 0.7rem;
            color: $text-white-dark-1;
            align-self: center;
            padding: $intro-padding-left;
            display: grid;
            align-items: center;
        }
    }
</style>
