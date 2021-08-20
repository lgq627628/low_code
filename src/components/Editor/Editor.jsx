import { computed, defineComponent, onMounted, reactive, ref } from 'vue'
import RenderComp from './render-comp.jsx'
import PreviewComp from './preview-comp'
import registerConfig from './register.jsx'
import './Editor.scss'

export default defineComponent({
  props: {
    modelValue: { type: Object }
  },
  components: {
    RenderComp
  },
  setup(props, ctx) {
    const editorData = computed(() => props.modelValue)
    const mainRef = ref(null)
    const mainStyle = computed(() => ({
      width: editorData.value.container.width + 'px',
      height: editorData.value.container.height + 'px'
    }))


    let blockRef = ref(null)

    let curComp = null
    const ondragstart = (e, comp) => {
      curComp = comp
      // e.dataTransfer.setData('curComp', JSON.stringify(comp)) 为什么不用这样存呢，因为 setData 里面放的是字符串，而我们有函数会被忽略掉
      mainRef.value.addEventListener('dragenter', ondragenter)
      mainRef.value.addEventListener('dragleave', ondragleave)
      mainRef.value.addEventListener('dragover', ondragover)
      mainRef.value.addEventListener('drop', ondrop)
    }
    const ondrop = e => {
      e.preventDefault()
      const { offsetX, offsetY } = e
      const block = {
        top: offsetY,
        left: offsetX,
        key: curComp.key,
        needCenterAfterDrag: true
      }
      editorData.value.blocks.push(block)
      curComp = null
    };
    const ondragenter = e => {
      e.dataTransfer.dropEffect = 'move'
    };
    const ondragover = e => {
      e.preventDefault()
    }
    const ondragleave = e => {
      e.dataTransfer.dropEffect = 'none'
    }
    return () => (
      <div class="editor">
        <div class="editor__left">
          {
            registerConfig.componentList.map(comp => {
              return <PreviewComp comp={comp} draggable ondragstart={e => ondragstart(e, comp)}></PreviewComp>
            })
          }
        </div>
        <div class="editor__mid">
          <div class="editor__top">上</div>
          <div class="editor__wrap">
            <div class="editor__main" ref={mainRef} style={mainStyle.value}>
              {
                editorData.value.blocks.map(block => {
                  return <RenderComp block={block} ref={blockRef}></RenderComp>
                })
              }
            </div>
          </div>
        </div>
        <div class="editor__right">》</div>
      </div>
    )
  }
})