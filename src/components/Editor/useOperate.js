import deepcopy from 'deepcopy'
import { onUnmounted } from 'vue'
import events from './events.js'
export function useOperate(editorData) {
    const state = {
        point: -1,
        queue: [],
        commandMap: {},
        commandList: [],
        destoryList: []
    }

    const register = command => {
        if (command.init) {
            const destoryItem = command.init()
            destoryItem && state.destoryList.push(destoryItem)
        }
        state.commandList.push(command)
        state.commandMap[command.name] = () => { // 命令对应执行函数
            const { redo, undo } = command.exec()
            redo()
            if (!command.pushQueue) return
            const { queue, point } = state
            state.queue = queue.slice(0, point + 1) // 撤销过程中再添加的话需要舍弃栈指针后面的元素
            state.queue.push({ redo, undo })
            state.point++
            console.log(state.queue)
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
                    console.log('撤销')
                    const last = state.queue[state.point]
                    if (last) {
                        last.undo && last.undo()
                        state.point--
                    }
                }
            }
        }
    })
    register({
        name: 'redo',
        keyboard: 'ctrl+y',
        exec() {
            return {
                redo() {
                    if (!state.queue.length || state.point >= state.queue.length - 1) return
                    console.log('重做')
                    const next = state.queue[state.point + 1]
                    if (next) {
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
            const after = editorData.value.blocks
            console.log('after', after.length)
            return {
                redo() {
                    // editorData.value = { ...editorData.value, blocks: after }
                    editorData.value.blocks = after
                },
                undo() {
                    // editorData.value = { ...editorData.value, blocks: before }
                    editorData.value.blocks = before
                }
            }
        }
    })
    onUnmounted(() => {
        state.destoryList.forEach(fn => fn && fn())
    })
    window.xxx = state
    return {
        commandMap: state.commandMap
    }
}