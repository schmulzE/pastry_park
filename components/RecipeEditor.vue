<template>
  <div
  class="editor"
  v-if="editor"
  >
    <div v-if="text" class="bg-gray-300 p-4 flex justify-center text-2xl uppercase italic font-semibold text-[#4b371c]">
      {{ text }}
    <div>
    </div>
  </div>

    <editor-content 
      class="editor_content outline-none text-left p-1 border-0" v-model="contents" :editor="editor"
    />
  </div>
</template>

<script setup lang="ts">
import {useEditor, EditorContent} from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'


const props = defineProps({
  payload: {
    type: Array,
    required: false,
  },
  text: {
    type: String,
    required: false,
  },
  callbackFn: {
    type: Function,
    required: false,
  }
})


let contents = props.payload!.map(ingredient => `<p>${ingredient}</p>`).join('');

const editor = useEditor({
  extensions: [StarterKit],
  content: contents,
  onUpdate: () => {
    const html = editor.value?.getHTML()
    props.callbackFn!(html)
  }
})

onMounted(()=> {
  editor.value?.commands.focus()
})

onBeforeUnmount(() => {
  editor.value?.destroy();
})


</script>

<style >
.editor{

  /* background-color: #fff; */
  /* border: 1px solid lightgrey; */
  border-radius: 0.75rem;
  color: #0d0d0d;
  display: flex;
  flex-direction: column;
  height: 800px;
  outline: none;
  overflow-y: auto;
  /* max-height: 26rem; */
  /* max-height: 18rem; */
}
.editor_header {
  align-items: center;
  background: transparent;
  border-bottom: 1px solid lightgrey;
  border-top-left-radius: 0.25rem;
  border-top-right-radius: 0.25rem;
  display: flex;
  flex: 0 0 auto;
  flex-wrap: wrap;
  padding: 0.25rem;
}

.editor_content{
  flex: 1 1 auto;
  overflow-x: hidden;
  overflow-y: hidden;
  padding: 1rem 1rem;
  outline: none;
  -webkit-overflow-scrolling: touch;
  /* height: 8rem; */
}

/* .editor_content::-webkit-scrollbar-track{
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3) !important;
  background: #f5f5f5 !important;
} */

.editor_footer{
  align-items: center;
}
.editor_status {
  align-items: center;
  border-radius: 5px;
  display: flex;
}
.editor_status::before{
  background: rgba(#0d0d0d, 0.5);
  border-radius: 50%;
  content: "";
  display: inline-block;
  flex: 0 0 auto;
  height: 0.5rem;
}

.editor_status--connecting::before {
  background: #616161;
}
.editor_status--connected::before {
  background: #b9f18d;
}

.editor_name button{
  background: none;
  border: none;
  border-radius: 0.4rem;
  color: #0d0d0d;
  font: inherit;
  font-size: 12px;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
}

.editor_name button::hover {
  background-color: #0d0d0d;
  color: #fff;
}

.ProseMirror:focus{
  border: 0 !important;
  outline: none !important;
}

.ProseMirror > * + * {
  margin-top: 0.75rem;
}

.ProseMirror ul, ol {
  padding: 0 1rem !important;
}

.ProseMirror ul {
  display: block;
  list-style-type: disc;
  margin-block-start: 1em;
  margin-block-end: 1em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  padding-inline-start: 40px;
}
.ProseMirror ol {
  display: block;
  list-style-type: decimal;
  margin-block-start: 1em;
  margin-block-end: 1em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  padding-inline-start: 40px;
}
.ProseMirror p {
  display: block;
  margin-block-start: 1em;
  margin-block-end: 1em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  font-size: 16px;
}
.ProseMirror h1 {
  display: block;
  margin-block-start: 0.67em;
  margin-block-end: 0.67em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  font-size: 2em;
  font-weight: bold;
}
.ProseMirror h2 {
  display: block;
  margin-block-start: 0.83em;
  margin-block-end: 0.83em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  font-size: 1.5em;
  font-weight: bold;
}
.ProseMirror h3 {
  display: block;
  margin-block-start: 0.75em;
  margin-block-end: 0.75em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  font-size: 1.5em;
  font-weight: bold;
}
.ProseMirror code {
  background-color: rgba(#616161, 0.1);
  color: #616161;
}
.ProseMirror pre {
  background-color: #0d0d0d;
  color: #fff;
  padding: 0.75rem 1rem;
  font-family: "JetBrainMono", monospace;
}
.ProseMirror h1, h2, h3, h4, h5, h6 {
  line-height: 1.1;
}
.ProseMirror img {
  max-width: 50%;
  height: auto;
}
</style>