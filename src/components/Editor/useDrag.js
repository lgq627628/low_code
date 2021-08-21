/**
 * @description: 从左侧物料区拖拽到右侧画布区
 * @param {*} mainRef 右侧画布容器
 * @param {*} editorData 画布数据
 * @return {*}
 */
export function useDrag(mainRef, editorData) {
    let curComp = null

    const ondragstart = (e, comp) => {
        curComp = comp
        // e.dataTransfer.setData('curComp', JSON.stringify(comp)) 为什么不用这样存呢，因为 setData 里面放的是字符串，而我们有函数会被忽略掉
        mainRef.value.addEventListener('dragenter', ondragenter)
        mainRef.value.addEventListener('dragleave', ondragleave)
        mainRef.value.addEventListener('dragover', ondragover)
        mainRef.value.addEventListener('drop', ondrop)
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
        const { offsetX, offsetY } = e
        const block = {
            top: offsetY,
            left: offsetX,
            key: curComp.key,
            needCenterAfterDrag: true // 拖拽后居中
        }
        editorData.value.blocks.push(block)
        // editorData.value.blocks = [...editorData.value.blocks, block]
        curComp = null
    };
    const ondragleave = e => {
        e.dataTransfer.dropEffect = 'none'
    }

    return {
        ondragstart,
        ondragend
    }
}