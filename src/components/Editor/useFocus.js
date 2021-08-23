
import { computed, ref } from 'vue'
/**
 * @description: 选中渲染元素
 * @param {*} editorData 所有渲染的数据
 * @param {*} afterMoveCb 准备点击移动的回调
 * @return {*}
 */
export function useFocus(editorData, beforeMoveCb) {
  const lastFocusIdx = ref(-1)
  const lastFocusBlock = computed(() => editorData.value.blocks[lastFocusIdx.value])
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
  const onBlockMousedown = (e, block, i) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.shiftKey) {
      block.focus = !block.focus;
    } else {
      if (!block.focus) {
        clearAllFocusBlock()
        block.focus = true
      }
    }
    if (block.focus) {
      lastFocusIdx.value = i
      beforeMoveCb(e) // 按在渲染元素上才即刻开始准备移动，也就是开始监听 document
    } else {
      lastFocusIdx.value = -1
    }
  };
  const onMainMousedown = (e) => {
    clearAllFocusBlock();
    lastFocusIdx.value = -1
  };

  return {
    onMainMousedown,
    onBlockMousedown,
    focusData,
    clearAllFocusBlock,
    lastFocusIdx,
    lastFocusBlock
  }
};
