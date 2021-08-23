 import { reactive } from 'vue'
 /**
  * @description: 移动渲染元素
  * @param {*} focusData 需要移动的元素
  * @return {*}
  */
export function useMove(focusData, lastFocusBlock, editorData) {
  let moveState = null;
  const helpLine = reactive({
    x: null,
    y: null
  })
  const getAllLines = () => { // 移动开始前直接一次性获取所有辅助线
    const unfocusBlocks = focusData.value.unfocusBlocks
    const lines = { x: [], y: [] };
    [...unfocusBlocks, { // 加上这个可以针对整个容器居中
      top: 0,
      left: 0,
      width: editorData.value.container.width,
      height: editorData.value.container.height,
    }].forEach(unfocusBlock => {
      const { width: AWidth, height: AHeight, top: ATop, left: ALeft } = unfocusBlock
      const { width: BWidth, height: BHeight, top: BTop, left: BLeft } = lastFocusBlock.value
      // 当元素拖拽移动到 targetTop 值时，显示辅助线 helpTop 值
      // 先存横线
      lines.x.push({ targetTop: ATop, helpTop: ATop })
      lines.x.push({ targetTop: ATop - BHeight, helpTop: ATop })
      lines.x.push({ targetTop: ATop + AHeight / 2 - BHeight / 2, helpTop: ATop + AHeight / 2 })
      lines.x.push({ targetTop: ATop + AHeight, helpTop: ATop + AHeight })
      lines.x.push({ targetTop: ATop + AHeight - BHeight, helpTop: ATop + AHeight })
      // 再存纵线
      lines.y.push({ targetLeft: ALeft, helpLeft: ALeft })
      lines.y.push({ targetLeft: ALeft - BWidth, helpLeft: ALeft })
      lines.y.push({ targetLeft: ALeft + AWidth / 2 - BWidth / 2, helpLeft: ALeft + AWidth / 2 })
      lines.y.push({ targetLeft: ALeft + AWidth, helpLeft: ALeft + AWidth })
      lines.y.push({ targetLeft: ALeft + AWidth - BWidth, helpLeft: ALeft + AWidth })
    })
    return lines
  }
  const onDocumentMousedown = (e) => {
    // 移动所有选中元素
    moveState = {
      startX: e.clientX,
      startY: e.clientY,
      startTop: lastFocusBlock.value.top,
      startLeft: lastFocusBlock.value.left,
      focusBlocks: focusData.value.focusBlocks,
      lines: getAllLines()
    }
    document.addEventListener('mousemove', onDocumentMousemove)
    document.addEventListener('mouseup', onDocumentMouseup)
  }
  const onDocumentMousemove = (e) => {
    let { clientX, clientY } = e
    const { startX, startY, startTop, startLeft} = moveState
    const offsetTop = startY - startTop // 容器到页面顶部的距离
    const offsetLeft = startX - startLeft // 容器到页面左边的距离

    // 此次移动后的最新位置
    const newTop = clientY - offsetTop
    const newLeft = clientX - offsetLeft

    const err = 10
    const x = moveState.lines.x.find(line => {
      return Math.abs(line.targetTop - newTop) < err
    })
    const y = moveState.lines.y.find(line => {
      return Math.abs(line.targetLeft - newLeft) < err
    })
    if (x) { // 显示辅助线 x
      helpLine.x = x.helpTop
      clientY = x.targetTop + offsetTop
    } else {
      helpLine.x = null
    }
    if (y) { // 显示辅助线 y
      helpLine.y = y.helpLeft
      clientX = y.targetLeft + offsetLeft
    } else {
      helpLine.y = null 
    }
    const deltaX = clientX - startX
    const deltaY = clientY - startY
    
    moveState.startX = clientX;
    moveState.startY = clientY;
    moveState.startTop = clientY - offsetTop;
    moveState.startLeft = clientX - offsetLeft;
    moveState.focusBlocks.forEach((focusBlock) => {
      focusBlock.top += deltaY;
      focusBlock.left += deltaX;
    })
  }
  const onDocumentMouseup = (e) => {
    document.removeEventListener('mousemove', onDocumentMousemove)
    document.removeEventListener('mouseup', onDocumentMouseup)
    moveState = null
    helpLine.x = null
    helpLine.y = null
  };

  return {
    onDocumentMousedown,
    onDocumentMousemove,
    onDocumentMouseup,
    helpLine
  }
}
