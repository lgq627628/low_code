import { createColorProp, createInputProp, createSelectProp, createSwitchProp } from './comp-props'
// 其实在这个页面直接导出 componentList, componentMap 也可以
function createRegisterConfig() {
    const componentList = []
    const componentMap = {}
    return {
        componentList,
        componentMap,
        register: (comp) => {
            componentList.push(comp)
            componentMap[comp.key] = comp
        }
    }
}

const registerConfig = createRegisterConfig()

registerConfig.register({
    key: 'ElTag',
    name: '标签',
    preview: () => <ElTag>预览标签</ElTag>,
    render: () => <ElTag>渲染标签</ElTag>,
    props: {
        text: createInputProp('显示文本'),
        color: createColorProp('字体颜色'),
        size: createSelectProp('字体大小', [{label: '12px', val: 12}, {label: '24px', val: 24}, {label: '48px', val: 48}]),
    }
})
registerConfig.register({
    key: 'ElButton',
    name: '按钮',
    preview: () => <ElButton>预览按钮</ElButton>,
    render: (props) => <ElButton type={props.type || 'primary'} size={props.size || 'medium'}>{props.text || '默认按钮'}{props.type}</ElButton>,
    props: {
        text: createInputProp('显示文本'),
        type: createSelectProp('按钮类型', [{label: '基础', val: 'primary'}, {label: '成功', val: 'success'}, {label: '错误', val: 'danger'}, {label: '警告', val: 'warning'}]),
        size: createSelectProp('按钮大小', [{label: '中等', val: 'medium'}, {label: '小', val: 'small'}, {label: '极小', val: 'mini'}])
    }
})
registerConfig.register({
    key: 'ElInput',
    name: '输入框',
    preview: () => <ElInput>预览输入框</ElInput>,
    render: (props) => <ElInput clearable={props.clearable || false} size={props.size || 'medium'} v-model={props.text}></ElInput>,
    props: {
        text: createInputProp('显示文本'),
        clearable: createSwitchProp('是否可清空'),
        size: createSelectProp('输入框大小', [{label: '中等', val: 'medium'}, {label: '小', val: 'small'}, {label: '极小', val: 'mini'}])
    }
})
registerConfig.register({
    key: 'CustomText',
    name: '文本',
    preview: () => <CustomText>预览文本</CustomText>,
    render: (props) => <CustomText text={props.text || '自定义文本'} style={`fontSize: ${props.size}px`}></CustomText>,
    props: {
        text: createInputProp('显示文本'),
        size: createInputProp('字体大小')
    }
})

export default registerConfig