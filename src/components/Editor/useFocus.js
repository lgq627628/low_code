import { computed, ref } from 'vue'
import events from './events'
/**
 * @description: 选中渲染元素
 * @param {*} editorData 所有渲染的数据
 * @param {*} afterMoveCb 准备点击移动的回调
 * @return {*}
 */
export function useFocus(editorData, editorDataUtils, beforeMoveCb) {
  const lastFocusIdx = ref(-1)
  const lastFocusBlock = computed(() => editorData.value.blocks[lastFocusIdx.value])
  const makeLastBlockFoucs = () => { // 拖拽完后高亮当前组件
    editorDataUtils.clearAllFocusBlock()
    editorData.value.blocks[editorData.value.blocks.length - 1].focus = true
  }
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
        editorDataUtils.clearAllFocusBlock()
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
    editorDataUtils.clearAllFocusBlock();
    lastFocusIdx.value = -1;
  };
  events.on('makeLastBlockFoucs', makeLastBlockFoucs)
  return {
    onMainMousedown,
    onBlockMousedown,
    focusData,
    lastFocusBlock
  }
};
