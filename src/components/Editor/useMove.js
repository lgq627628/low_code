 import { reactive } from 'vue'
import events from './events'
 /**
  * @description: 移动渲染元素
  * @param {*} focusData 需要移动的元素
  * @return {*}
  */
export function useMove(focusData, lastFocusBlock, editorData) { // 拖拽的时候之所以用 mousedown 事件，是因为可以在移动的时候使用滚轮，这是和 drag 事件的区别
  let moveState = null
  const helpLine = reactive({
    x: null,
    y: null
  })
  const getAllLines = () => { // 移动开始前直接一次性获取所有辅助线
    const { width: BWidth, height: BHeight } = lastFocusBlock.value
    const unfocusBlocks = focusData.value.unfocusBlocks
    const lines = { x: [], y: [] };
    [...unfocusBlocks, { // 加上这个可以针对整个容器居中
      top: 0,
      left: 0,
      width: editorData.value.container.width,
      height: editorData.value.container.height,
    }].forEach(unfocusBlock => {
      const { width: AWidth, height: AHeight, top: ATop, left: ALeft } = unfocusBlock
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
  const getValidVal = (val, min, max) => {
    if (val > max) val = max
    if (val < min) val = min
    return val
  }
  const onDocumentMousedown = (e) => {
    // 移动所有选中元素
    moveState = {
      isMoving: false,
      startX: e.clientX,
      startY: e.clientY,
      startTop: lastFocusBlock.value.top,
      startLeft: lastFocusBlock.value.left,
      startPos: focusData.value.focusBlocks.map(({ top, left }) => ({ top, left })),
      lines: getAllLines()
    }
    document.addEventListener('mousemove', onDocumentMousemove)
    document.addEventListener('mouseup', onDocumentMouseup)
  }
  const onDocumentMousemove = (e) => {
    if (!moveState.isMoving) {
      moveState.isMoving = true
      events.emit('dragstart')
    }

    let { clientX, clientY } = e
    const { startX, startY, startTop, startLeft} = moveState
    const shiftLinePos = []

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
    // 禁止超出边界，但是没有考虑选中多个物体的情况
    const maxX = offsetLeft + editorData.value.container.width - lastFocusBlock.value.width
    const minX = offsetLeft
    const maxY = offsetTop + editorData.value.container.height - lastFocusBlock.value.height
    const minY = offsetTop
    clientX = getValidVal(clientX, minX, maxX)
    clientY = getValidVal(clientY, minY, maxY)

    const deltaX = clientX - startX
    const deltaY = clientY - startY

    focusData.value.focusBlocks.forEach((focusBlock, i) => {
      focusBlock.top = moveState.startPos[i].top + deltaY
      focusBlock.left = moveState.startPos[i].left + deltaX
    })
  }
  const onDocumentMouseup = (e) => {
    if (moveState.isMoving) {
      events.emit('dragend')
    }
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
