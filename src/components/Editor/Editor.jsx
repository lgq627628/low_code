import { computed, defineComponent, ref } from 'vue'
import RenderComp from './render-comp.jsx'
import PreviewComp from './preview-comp.jsx'
import registerConfig from './register.jsx'
import { useDrag } from './useDrag.js'
import { useFocus } from './useFocus.js'
import { useMove } from './useMove.js'
import { useOperate } from './useOperate.js'
import './Editor.scss'
import deepcopy from 'deepcopy'

export default defineComponent({
  props: {
    modelValue: { type: Object }
  },
  emits: ['update:modelValue'],
  components: {
    RenderComp
  },
  setup(props, ctx) {
    const editorData = computed({
      get() {
        return props.modelValue
      },
      set(newVal) {
        ctx.emit('update:modelValue', deepcopy(newVal))
      }
    })
    const editorDataUtils = {
      updateBlocks: (blocks) => {
        editorData.value = { ...editorData.value, blocks }
      },
      clearAllFocusBlock: () => {
        editorData.value.blocks.forEach((block) => {
          block.focus = false;
        });
      }
    }
    const mainRef = ref(null)
    const mainStyle = computed(() => ({
      width: editorData.value.container.width + 'px',
      height: editorData.value.container.height + 'px'
    }))

    let blockRef = ref(null)

    // 左侧物料拖拽功能
    const { ondragstart, ondragend } = useDrag(mainRef, editorData, editorDataUtils)

    // 选中渲染元素
    const { onMainMousedown, onBlockMousedown, focusData, lastFocusBlock } = useFocus(editorData, editorDataUtils, e => {
      onDocumentMousedown(e)
    })

    // 拖拽渲染元素
    const { onDocumentMousedown, helpLine } = useMove(focusData, lastFocusBlock, editorData, editorDataUtils)
    
    const btns = [{
      label: '撤销',
      handle: () => commandMap.undo()
    }, {
      label: '重做',
      handle: () => commandMap.redo()
    }, {
      label: '删除',
      handle: () => commandMap.delete()
    }, {
      label: '置顶',
      handle: () => commandMap.placeTop()
    }, {
      label: '置底',
      handle: () => commandMap.placeBottom()
    }, {
      label: '回放',
      handle: () => commandMap.playback()
    }, {
      label: '清空',
      handle: () => commandMap.clear()
    }]
    const { commandMap } = useOperate(editorData, editorDataUtils, focusData)

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
          <div class="editor__top">
            {
              btns.map(btn => {
                return <ElButton onClick={btn.handle}>{btn.label}</ElButton>
              })
            }
          </div>
          <div class="editor__wrap">
            <div class="editor__main" ref={mainRef} style={mainStyle.value} onMousedown={onMainMousedown}>
              {
                editorData.value.blocks.map((block, i) => {
                  return <RenderComp key={block} block={block} ref={blockRef} class={block.focus ? 'render-comp--focus' : ''} onMousedown={e => onBlockMousedown(e, block, i)}></RenderComp>
                })
              }
              { helpLine.x ? <div class="help-line-x" style={ { top: helpLine.x + 'px' } }></div> : ''}
              { helpLine.y ? <div class="help-line-y" style={ { left: helpLine.y + 'px' } }></div> : '' }
            </div>
          </div>
        </div>
        <div class="editor__right">》</div>
      </div>
    )
  }
})