import { computed, defineComponent, onMounted, ref } from 'vue'
import registerConfig from './register'
export default defineComponent({
    props: {
        block: { type: Object }
    },
    setup(props) {
        const { block } = props
        const comp = registerConfig.componentMap[block.key]
        const RenderComp = comp.render()
        const style = computed(() => ({
            top: `${block.top}px`,
            left: `${block.left}px`
        }))

        const renderCompRef = ref(null)
        onMounted(() => {
            const { offsetWidth, offsetHeight } = renderCompRef.value;
            if (block.needCenterAfterDrag) { // 拖拽之后让元素居中，最好通过派发事件的方式修改 props
                block.left = block.left - offsetWidth / 2
                block.top = block.top - offsetHeight / 2
                block.needCenterAfterDrag = false
            }
            block.width = offsetWidth // 方便后面计算辅助线用
            block.height = offsetHeight
        })
        return () => <div class="render-comp" ref={renderCompRef} style={style.value}>
            <RenderComp></RenderComp>
        </div>
    }
})
