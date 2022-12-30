<script setup lang="ts">
import type { DocSideBarConfig } from "@/types/doc";

defineProps<{
  config: DocSideBarConfig;
}>();
</script>

<template>
  <div class="container">
    <ul class="sticky">
      <DocSideBarSection :config="config" :level="0"/>
    </ul>
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
    margin:0;
    top: $app-header-height * 1.2;
  }
}
</style>
