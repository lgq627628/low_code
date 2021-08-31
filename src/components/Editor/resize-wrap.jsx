import { defineComponent } from 'vue';

export default defineComponent({
    props: {
        block: { type: Object }
    },
    setup(props) {
        let state
        const onMousedown = (e, direction) => {
            e.stopPropagation()
            state = {
                startX: e.clientX,
                startY: e.clientY,
                top: props.block.top,
                left: props.block.left,
                width: props.block.width,
                height: props.block.height,
                direction
            }
            document.addEventListener('mousemove', onMousemove)
            document.addEventListener('mouseup', onMouseup)
        }
        const onMousemove = e => {
            const { clientX, clientY } = e
            let deltaX = clientX - state.startX
            let deltaY = clientY - state.startY
            if (state.direction.h) {
                props.block.width = state.width + deltaX
            }
            if (state.direction.v) {
                props.block.height = state.height + deltaY
            }
        }
        const onMouseup = e => {
            document.removeEventListener('mousemove', onMousemove)
            document.removeEventListener('mouseup', onMouseup)
        }
        return () => <div class="resize-wrap">
            {/* <div class="square resize-wrap-left-top" onMousedown={e => onMousedown(e, { v: true, h: true })}></div>
            <div class="square resize-wrap-left-bottom" onMousedown={e => onMousedown(e, { v: true, h: true })}></div>
            <div class="square resize-wrap-right-top" onMousedown={e => onMousedown(e, { v: true, h: true })}></div> */}
            <div class="square resize-wrap-right-bottom" onMousedown={e => onMousedown(e, { v: true, h: true })}></div>
            <div class="square resize-wrap-right-mid" onMousedown={e => onMousedown(e, { v: false, h: true })}></div>
            <div class="square resize-wrap-bottom-mid" onMousedown={e => onMousedown(e, { v: true, h: false })}></div>
            {/* <div class="square resize-wrap-top-mid" onMousedown={e => onMousedown(e, { v: true, h: false })}></div>
            <div class="square resize-wrap-left-mid" onMousedown={e => onMousedown(e, { v: false, h: true })}></div> */}
        </div>
    }
})