<script setup lang="ts">
import type { DocSideBarConfig } from "@/types/doc";

defineProps<{
  config: DocSideBarConfig;
}>();
</script>

<template>
  <div class="container">
    <section v-for="section in config" :key="section.text">
      <header>{{ section.text }}</header>
      <ul>
        <li v-for="item in section.items" :key="item.text">
          <a :href="item.link">{{ item.text }}</a>
        </li>
      </ul>
    </section>
  </div>
</template>

<style scoped></style>
