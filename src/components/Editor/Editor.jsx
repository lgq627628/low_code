import { computed, defineComponent, ref } from 'vue'
import RenderComp from './render-comp.jsx'
import PreviewComp from './preview-comp.jsx'
import registerConfig from './register.jsx'
import { useDrag } from './useDrag.js'
import { useFocus } from './useFocus.js'
import { useMove } from './useMove.js'
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

    // 左侧物料拖拽功能
    const { ondragstart, ondragend } = useDrag(mainRef, editorData)

    // 选中渲染元素
    const { onMainMousedown, onBlockMousedown, focusData } = useFocus(editorData, e => {
      const { onDocumentMousedown } = useMove(focusData)
      onDocumentMousedown(e)
    })
    
    return () => (
      <div class="editor">
        <div class="editor__left">
          {
            registerConfig.componentList.map(comp => {
              return <PreviewComp comp={comp} draggable ondragstart={e => ondragstart(e, comp)} ondragend={ondragend}></PreviewComp>
            })
          }
        </div>
        <div class="editor__mid">
          <div class="editor__top">上</div>
          <div class="editor__wrap">
            <div class="editor__main" ref={mainRef} style={mainStyle.value} onMousedown={onMainMousedown}>
              {
                editorData.value.blocks.map(block => {
                  return <RenderComp block={block} ref={blockRef} class={block.focus ? 'render-comp--focus' : ''} onMousedown={e => onBlockMousedown(e, block)}></RenderComp>
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