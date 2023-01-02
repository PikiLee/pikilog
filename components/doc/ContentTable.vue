<script setup lang="ts">
import type { Heading } from "@/types/doc";
import { useMediaQuery } from "@vueuse/core"

interface Props {
  headings: Heading[];
}
defineProps<Props>();

const isPad = useMediaQuery('(max-width: 1200px)')
</script>

<template>
  <div class="content-table" v-if="!isPad">
    <div class="sticky">
      <header class="title">Table of Contents</header>
      <ul class="list">
        <li :class="[heading.tag, 'item']" v-for="heading in headings" :key="heading.slug">
          <NuxtLink :to="`#${heading.slug}`">{{ heading.title }}</NuxtLink>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped lang="scss">
.content-table {
  color: $text-white-dark-1;

  .sticky {
    position: sticky;
    top: $app-header-height * 1.2;

    .title {
      font-size: 1.5rem;
      font-weight: 600;
      color: $text-white;
    }

    .list {
      top: 0;
      left: 0;
      position: sticky;
      $base-padding-left: 1rem;
      $base-font-size: 1.3rem;

      .item {
        margin-bottom: 0.3em;
      }

      @for $i from 1 through 6 {
        .h#{$i} {
          font-size: $base-font-size - (0.2rem * ($i - 1));
          padding-left: $base-padding-left * ($i - 1);
        }
      }
    }
  }
}
</style>
