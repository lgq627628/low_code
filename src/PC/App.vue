<template>
  <Editor v-model="editorData"></Editor>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import Editor from '../components/Editor/Editor.jsx'
import data from './data.json'
export default defineComponent({
  name: 'App',
  components: {
    Editor
  },
  setup() {
    const editorData = ref(data)
    return {
      editorData
    }
  }
})
</script>

<style>
* {
  margin: 0;
  padding: 0;
}
#app {
  height: 100vh;
}
</style>
