<script setup lang="ts">
import type { Heading } from "@/types/doc";

interface Props {
  headings: Heading[];
}
defineProps<Props>();
</script>

<template>
  <div class="content-table">
    <ul class="list">
      <li
        :class="[heading.tag]"
        v-for="heading in headings"
        :key="heading.slug"
      >
        <a :href="`#${heading.slug}`">{{ heading.title }}</a>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
.content-table {
  .list {
    top: 0;
    left: 0;
    position: sticky;
    .h1 {
      font-size: 2rem;
    }
    .h2 {
      font-size: 1.5rem;
      padding-left: 1rem;
    }

    .h3 {
      font-size: 1rem;
      padding-left: 2rem;
    }
  }
}
</style>
