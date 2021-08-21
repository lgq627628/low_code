 /**
  * @description: 移动渲染元素
  * @param {*} focusData 需要移动的元素
  * @return {*}
  */
export function useMove(focusData) {
  let moveState = null;
  const onDocumentMousedown = (e) => {
    // 移动所有选中元素
    moveState = {
      startX: e.clientX,
      startY: e.clientY,
      focusBlocks: focusData.value.focusBlocks,
    };
    document.addEventListener('mousemove', onDocumentMousemove);
    document.addEventListener('mouseup', onDocumentMouseup);
  };
  const onDocumentMousemove = (e) => {
    const { clientX, clientY } = e;
    const deltaX = clientX - moveState.startX;
    const deltaY = clientY - moveState.startY;
    moveState.startX = clientX;
    moveState.startY = clientY;
    moveState.focusBlocks.forEach((focusBlock) => {
      focusBlock.top += deltaY;
      focusBlock.left += deltaX;
    });
  };
  const onDocumentMouseup = (e) => {
    document.removeEventListener('mousemove', onDocumentMousemove);
    document.removeEventListener('mouseup', onDocumentMouseup);
    moveState = null;
  };

  return {
    onDocumentMousedown,
    onDocumentMousemove,
    onDocumentMouseup
  }
}
