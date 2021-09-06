import events from "./events"
import registerConfig from './register'

/**
 * @description: 从左侧物料区拖拽到右侧画布区
 * @param {*} mainRef 右侧画布容器
 * @param {*} editorData 画布数据
 * @return {*}
 */
export function useDrag(mainRef, editorData, editorDataUtils) {
    let curComp = null
    let state

    const ondragstart = (e, comp) => {
        state = {
            startX: mainRef.value.getBoundingClientRect().left,
            startY: mainRef.value.getBoundingClientRect().top
        }
        curComp = comp
        // e.dataTransfer.setData('curComp', JSON.stringify(comp)) 为什么不用这样存呢，因为 setData 里面放的是字符串，而我们有函数会被忽略掉
        mainRef.value.addEventListener('dragenter', ondragenter)
        mainRef.value.addEventListener('dragleave', ondragleave)
        mainRef.value.addEventListener('dragover', ondragover)
        mainRef.value.addEventListener('drop', ondrop)
        events.emit('dragstart')
    }
    const ondragend = e => {
        mainRef.value.removeEventListener('dragenter', ondragenter)
        mainRef.value.removeEventListener('dragleave', ondragleave)
        mainRef.value.removeEventListener('dragover', ondragover)
        mainRef.value.removeEventListener('drop', ondrop)
    }
    const ondragenter = e => {
        e.dataTransfer.dropEffect = 'move'
    };
    const ondragover = e => {
        e.preventDefault()
    }
    const ondrop = e => {
        const { clientX, clientY } = e
        const block = {
            top: clientY - state.startY,
            left: clientX - state.startX,
            key: curComp.key,
            props: registerConfig.componentMap[curComp.key].props,
            style: {},
            needCenterAfterDrag: true // 拖拽后居中
        }
        const blocks = editorData.value.blocks
        blocks.push(block)
        editorDataUtils.updateBlocks(blocks)
        events.emit('makeLastBlockFoucs')
        curComp = null
        events.emit('dragend')
        
    };
    const ondragleave = e => {
        e.dataTransfer.dropEffect = 'none'
    }

    return {
        ondragstart,
        ondragend
    }
}