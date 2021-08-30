import deepcopy from 'deepcopy'
import { onUnmounted } from 'vue'
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
    window.xxx = state
    return {
        commandMap: state.commandMap
    }
}