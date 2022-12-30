<script setup lang="ts">
import type { DocSideBarConfig } from "@/types/doc";

const props = defineProps<{
  config: DocSideBarConfig;
  level: number;
}>();

const fontSize = computed(() => {
  const fontSize = Math.max(0, 2 - props.level * 0.5);
  return `${fontSize}rem`;
});

// left padding starts from level 2
const leftPadding = computed(() => `${1 * Math.max(0, props.level - 1)}em`)
</script>
<template>
  <li class="list" v-if="'items' in config">
    <header>
      {{ config.text }}
    </header>
    <ul>
      <DocSideBarSection
        :config="item"
        :level="level + 1"
        v-for="item in config.items"
        :key="item.text"
      />
    </ul>
    <div class="separator" v-if="level !== 0"></div>
  </li>
  <li v-else class="item">
    <a :href="config.link">{{ config.text }}</a>
  </li>
</template>

<style scoped lang="scss">
$font-weight: 600;

.list {
  margin-top: v-bind("level === 0 ? 0 : '1em'");
  font-weight: $font-weight;
  font-size: v-bind("fontSize");

  .separator {
    height: 1px;
    background-color: green;
    margin-top: 1em;
  }
}

.item {
  font-weight: $font-weight;
  font-size: v-bind("fontSize");
  margin-top: 0.5em;
  padding-left: v-bind("leftPadding");
}


</style>
