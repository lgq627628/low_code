import { computed, defineComponent, onMounted, ref } from 'vue'
import ResizeWrap from './resize-wrap'
import registerConfig from './register'
export default defineComponent({
    props: {
        block: { type: Object }
    },
    setup(props) {
        // const { block } = props 因为 props 是响应式的，你不能使用 ES6 解构，因为它会消除 prop 的响应性，好大一个坑
        const comp = registerConfig.componentMap[props.block.key]
        const RenderComp = comp.render()
        const style = computed(() => ({
            top: `${props.block.top}px`,
            left: `${props.block.left}px`
        }))
        const blockStyle = computed(() => ({
            width: `${props.block.width || ''}px`,
            height: `${props.block.height || ''}px`
        }))

        const renderCompRef = ref(null)
        onMounted(() => {
            const { offsetWidth, offsetHeight } = renderCompRef.value;
            if (props.block.needCenterAfterDrag) { // 拖拽之后让元素居中，最好通过派发事件的方式修改 props
                props.block.left = props.block.left - offsetWidth / 2
                props.block.top = props.block.top - offsetHeight / 2
                props.block.needCenterAfterDrag = false
            }
            props.block.width = offsetWidth // 方便后面计算辅助线用
            props.block.height = offsetHeight
        })
        return () => <div class="render-comp" ref={renderCompRef} style={style.value}>
            <RenderComp style={blockStyle.value}></RenderComp>
            { props.block.focus ? <ResizeWrap block={props.block}></ResizeWrap> : '' }
        </div>
    }
})
