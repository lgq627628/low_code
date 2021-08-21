
import { computed } from 'vue'
/**
 * @description: 选中渲染元素
 * @param {*} editorData 所有渲染的数据
 * @param {*} afterMoveCb 准备点击移动的回调
 * @return {*}
 */
export function useFocus(editorData, beforeMoveCb) {
  const clearAllFocusBlock = () => {
    editorData.value.blocks.forEach((block) => {
      block.focus = false;
    });
  };
  const focusData = computed(() => {
    const focusBlocks = [];
    const unfocusBlocks = [];
    editorData.value.blocks.forEach((block) => {
      if (block.focus) {
        focusBlocks.push(block);
      } else {
        unfocusBlocks.push(block);
      }
    });
    return {
      focusBlocks,
      unfocusBlocks,
    };
  });
  const onBlockMousedown = (e, block) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.shiftKey) {
      block.focus = !block.focus;
    } else {
      clearAllFocusBlock();
      block.focus = true;
    }
    beforeMoveCb(e) // 按下鼠标即刻开始准备移动，也就是开始监听 document
  };
  const onMainMousedown = (e) => {
    clearAllFocusBlock();
  };

  return {
    onMainMousedown,
    onBlockMousedown,
    focusData,
    clearAllFocusBlock

  }
};
