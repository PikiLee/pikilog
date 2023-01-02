<script setup lang="ts">
import { useDark } from "@vueuse/core";
import { ElSwitch } from "element-plus"

const isDark = useDark()
</script>
<template>
  <div class="header">
    <div></div>
    <NuxtLink to="/" class="icon-area">
      <figure class="figure">
        <div class="icon-wrapper">
          <img class="icon" src="/images/icon.jpg" alt="icon" />
        </div>
        <caption class="title">
          Piki's Blog
        </caption>
      </figure>
    </NuxtLink>
    <div>
      <ElSwitch v-model="isDark" style="--el-switch-on-color: gray; --el-switch-off-color: black" />
    </div>
  </div>
</template>

<style scoped lang="scss">
html {

  .header {
    position: sticky;
    height: $app-header-height;
    background-color: $bg-home-card-light;
    top: 0;
    display: grid;
    grid-template-columns: 1fr minmax(15rem, 1fr) 4fr;
    align-items: center;
    margin-bottom: 4rem;
    box-shadow: rgba(50, 50, 93, 0.25) 0px 6px 12px -2px,
      rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;


    .icon-area {
      .figure {
        display: grid;
        grid-template-columns: 1fr 2fr;
        place-items: center;
        font-size: 1.3rem;
        font-weight: 700;
        margin: 0;

        .icon-wrapper {
          $icon-size: $app-header-height * 0.7;
          width: $icon-size;
          height: $icon-size;
          overflow: hidden;
          border-radius: 50%;
          background-color: $bg-home-card-light;
          border-radius: 50%;
          box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px,
            rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px,
            rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;

          .icon {
            width: 100%;
            height: 100%;
          }
        }

        .title {
          justify-self: flex-start;
        }
      }
    }
  }

  &.dark {
    .header {
      background-color: $bg-home-card-dark;
    }
  }
}
</style>
