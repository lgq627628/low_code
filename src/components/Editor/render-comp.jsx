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
            if (block.needCenterAfterDrag) { // 最好通过派发事件的方式修改 props
                const { offsetWidth, offsetHeight } = renderCompRef.value;
                block.left = block.left - offsetWidth / 2
                block.top = block.top - offsetHeight / 2
                block.needCenterAfterDrag = false
            }
        })
        return () => <div class="render-comp" ref={renderCompRef} style={style.value}>
            <RenderComp></RenderComp>
        </div>
    }
})