<script setup lang="ts">
import dayjs from "dayjs/esm"
import relativeTime from 'dayjs/esm/plugin/relativeTime'
import type { HomeCard } from "@/types/home";
dayjs.extend(relativeTime)


defineProps<{
  card: HomeCard
}>();

function getFormatedTime(time: string) {
  const timeObj = dayjs(time)
  const now = dayjs()

  if (timeObj.diff(now, "day") < 7) return timeObj.fromNow()
  return timeObj.format("YYYY-MM-DD")
}

</script>
<template>
  <a :href="card.link">
    <div class="card">
      <div class="cover-container">
        <img class="img" :src="card.cover" alt="" />
      </div>
      <header class="title">{{ card.text }}</header>
      <time class="time" :datetime="dayjs(card.createdAt).format()">{{ getFormatedTime(card.createdAt) }}</time>
    </div>
  </a>
</template>

<style scoped lang="scss">
html {

.card {
  $intro-padding-left: 1rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  grid-template-rows: minmax(5rem, auto) minmax(3rem, auto);
  width: min(90%, 40rem);
  margin: auto;
  background-color: $bg-home-card-light;
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
    align-self: center;
    padding: $intro-padding-left;
    display: grid;
    align-items: center;
  }
}
 &.dark {
  .card {
    background-color: $bg-home-card-dark;
  }
 }
}
</style>
