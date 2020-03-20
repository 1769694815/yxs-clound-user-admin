<!--
 * @Author: Donkey
 * @Date: 2020-02-13 12:00:47
 * @LastEditTime: 2020-03-20 09:24:52
 * @LastEditors: Donkey
 * @Description:
 -->
<template>
  <div id="app">
    <router-view :key="this.$route.path" />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>
