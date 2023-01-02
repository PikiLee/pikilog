<script setup lang="ts">
import type { DocSideBarConfig } from "@/types/doc";
import { useMediaQuery } from "@vueuse/core"

defineProps<{
  config: DocSideBarConfig;
}>();

const isPhone = useMediaQuery('(max-width: 700px)')
</script>

<template>
  <div class="container" v-if="!isPhone">
    <ul class="sticky">
      <DocSideBarSection :config="config" :level="0" />
    </ul>
  </div>
</template>

<style scoped lang="scss">
  .container {

    .sticky {
      position: sticky;
      margin: 0;
      top: $app-header-height * 1.2;
    }
  }
</style>
