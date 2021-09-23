import deepcopy from 'deepcopy'
import { onUnmounted } from 'vue'
import { ElMessage } from "element-plus"
import events from './events.js'
export function useOperate(editorData, editorDataUtils, focusData) {
    const state = {
        point: -1,
        queue: [],
        commandMap: {},
        commandList: [],
        keyboard2Command: {},
        destoryList: []
    }

    const register = command => {
        if (command.init) {
            const destoryItem = command.init()
            destoryItem && state.destoryList.push(destoryItem)
        }
        state.commandList.push(command)
        state.keyboard2Command[command.keyboard] = command.name
        state.commandMap[command.name] = () => { // 命令对应执行函数
            const { redo, undo } = command.exec() || {}
            if (!redo) return
            redo()
            if (!command.pushQueue) return
            const { queue, point } = state
            state.queue = queue.slice(0, point + 1) // 撤销过程中再添加的话需要舍弃栈指针后面的元素
            state.queue.push({ redo, undo })
            state.point++
            console.log('111')
        }
    }

    register({
        name: 'undo',
        keyboard: 'ctrl+z',
        exec() {
            // 可以初始化一些事情
            return {
                redo() { // 约定都有这个方法
                    if (!state.queue.length || state.point < 0) return
                    const last = state.queue[state.point]
                    if (last) {
                        console.log('撤销')
                        last.undo && last.undo()
                        state.point--
                    }
                }
            }
        }
    })
    register({
        name: 'redo',
        keyboard: 'ctrl+shift+z',
        exec() {
            return {
                redo() {
                    if (!state.queue.length || state.point >= state.queue.length - 1) return
                    const next = state.queue[state.point + 1]
                    if (next) {
                        console.log('重做')
                        next.redo && next.redo()
                        state.point++
                    }
                }
            }
        }
    })
    register({
        name: 'drag',
        pushQueue: true,
        init() {
            this.before = null
            const dragstart = () => this.before = deepcopy(editorData.value.blocks)
            const dragend = () => state.commandMap.drag()
            events.on('dragstart', dragstart)
            events.on('dragend', dragend)

            return () => {
                events.off('dragstart', dragstart)
                events.off('dragend', dragend)
            }
        },
        exec() {
            const before = this.before
            const after = deepcopy(editorData.value.blocks)
            return {
                redo() {
                    editorDataUtils.updateBlocks(after)
                },
                undo() {
                    editorDataUtils.updateBlocks(before)
                }
            }
        }
    })
    register({
        name: 'delete',
        pushQueue: true,
        init() {

        },
        exec() {
            if (!focusData.value.focusBlocks.length) return // 当前无聚焦元素则操作无效
            const before = deepcopy(editorData.value.blocks)
            const after = deepcopy(focusData.value.unfocusBlocks)
            editorDataUtils.clearAllFocusBlock()
            return {
                redo() {
                    editorDataUtils.updateBlocks(after)
                },
                undo() {
                    editorDataUtils.updateBlocks(before)
                }
            }
        }

    })
    register({
        name: 'placeTop',
        pushQueue: true,
        init() {},
        exec() {
            if (!focusData.value.focusBlocks.length) return // 当前无聚焦元素则操作无效
            const before = deepcopy(editorData.value.blocks)
            const after = deepcopy(editorData.value.blocks)
            const maxZIndex = after.reduce((prev, cur) => Math.max(prev, cur.zIndex || 0), -Infinity)
            after.forEach(block => {
                if (block.focus) block.zIndex = maxZIndex + 1
            })
            return {
                redo() {
                    editorDataUtils.updateBlocks(after)
                },
                undo() {
                    editorDataUtils.updateBlocks(before)
                }
            }
        }
    })
    register({
        name: 'placeBottom',
        pushQueue: true,
        init() {},
        exec() {
            if (!focusData.value.focusBlocks.length) return // 当前无聚焦元素则操作无效
            const before = deepcopy(editorData.value.blocks)
            const after = deepcopy(editorData.value.blocks)
            const minZIndex = after.reduce((prev, cur) => Math.min(prev || 0, cur.zIndex || 0), Infinity)
            after.forEach(block => {
                if (block.focus) {
                    block.zIndex = Math.max(minZIndex, 0) // zIndex 不能小于 0，否则就在画布下面了，选中不了
                } else {
                    block.zIndex = (block.zIndex || 0) + 1 // 如果点击多次置底，视觉上可能会无效，因为大家都是一样的值，所以置底的同时让其他元素层级上升
                }
            })
            return {
                redo() {
                    editorDataUtils.updateBlocks(after)
                },
                undo() {
                    editorDataUtils.updateBlocks(before)
                }
            }
        }
    })
    register({
        name: 'playback',
        init() {},
        exec() {
            return {
                redo() {
                    ElMessage.success('开始回放')
                    state.queue.forEach((q, i) => {
                        setTimeout(() => {
                            q && q.redo && q.redo()
                            if (i === state.queue.length - 1) {
                                ElMessage.success('回放完毕')
                                state.point = state.queue.length - 1
                            }
                        }, i * 1000);
                    })
                    
                }
            }
        }
    })
    register({
        name: 'clear',
        pushQueue: true,
        init() {},
        exec() {
            if (!editorData.value.blocks) return
            const before = deepcopy(editorData.value.blocks)
            const after = []
            return {
                redo() {
                    editorDataUtils.updateBlocks(after)
                },
                undo() {
                    editorDataUtils.updateBlocks(before)
                }
            }
        }
    })
    const addKeyboardEvent = () => {
        const keyMap = {
            '90': 'z'
        }
        const onkeydown = e => {
            const keys = []
            if (e.metaKey) keys.push('ctrl')
            if (e.shiftKey) keys.push('shift')
            keys.push(keyMap[e.keyCode])
            const keyString = keys.join('+')
            const name = state.keyboard2Command[keyString]
            const fn = state.commandMap[name]
            if (fn) {
                e.preventDefault() // 阻止浏览器的默认快捷键，比如 ctrl+s, ctrl+f 
                fn()
            }
        }
        const init = () => {
            window.addEventListener('keydown', onkeydown)
            return () => {
                window.removeEventListener('keydown', onkeydown)
            }
        }
        return init()
    }
    state.destoryList.push(addKeyboardEvent())
    onUnmounted(() => {
        state.destoryList.forEach(fn => fn && fn())
    })
    return {
        commandMap: state.commandMap
    }
}