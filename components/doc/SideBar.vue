<script setup lang="ts">
import type { DocSideBarConfigItemList } from "@/types/doc";

defineProps<{
  config: DocSideBarConfigItemList;
}>();
</script>

<template>
  <div class="container">
    <div class="sticky">
      <section v-for="section in config" :key="section.text">
        <header class="section-title">{{ section.text }}</header>
        <ul>
          <li class="item" v-for="item in section.items" :key="item.text">
            <a :href="item.link">{{ item.text }}</a>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
  color: $text-white-dark-1;

  @media screen and (max-width: 700px) {
    display: none;
  }
  .sticky {
    position: sticky;
    top: $app-header-height * 1.2;

    .section-title {
      font-size: 2rem;
      font-weight: 700;
      color: $text-white;
    }
    .item {
      font-size: 1.2rem;
      font-weight: 600;
      margin-bottom: 0.3em;
    }
  }
}
</style>
