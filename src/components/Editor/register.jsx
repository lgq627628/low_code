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
    render: (block) => <ElTag color={block.props.color} size={block.props.size || 'medium'} style={`width: ${block.width}px; height: ${block.height}px;`}>{ block.props.text || '渲染标签'}</ElTag>,
    props: {
        text: createInputProp('显示文本'),
        color: createColorProp('背景颜色'),
        size: createSelectProp('字体大小', [{label: '中等', val: 'medium'}, {label: '小', val: 'small'}, {label: '极小', val: 'mini'}]),
    },
    style: {}
})
registerConfig.register({
    key: 'ElButton',
    name: '按钮',
    preview: () => <ElButton>预览按钮</ElButton>,
    render: (block) => <ElButton type={block.props.type || 'primary'} size={block.props.size || 'medium'}>{block.props.text || '默认按钮'}{block.props.type}</ElButton>,
    props: {
        text: createInputProp('显示文本'),
        type: createSelectProp('按钮类型', [{label: '基础', val: 'primary'}, {label: '成功', val: 'success'}, {label: '错误', val: 'danger'}, {label: '警告', val: 'warning'}]),
        size: createSelectProp('按钮大小', [{label: '中等', val: 'medium'}, {label: '小', val: 'small'}, {label: '极小', val: 'mini'}])
    },
    style: {}
})
registerConfig.register({
    key: 'ElInput',
    name: '输入框',
    preview: () => <ElInput>预览输入框</ElInput>,
    render: (block) => <ElInput clearable={block.props.clearable || false} size={block.props.size || 'medium'} v-model={block.props.text}></ElInput>,
    props: {
        text: createInputProp('显示文本'),
        clearable: createSwitchProp('是否可清空'),
        size: createSelectProp('输入框大小', [{label: '中等', val: 'medium'}, {label: '小', val: 'small'}, {label: '极小', val: 'mini'}])
    },
    style: {}
})
registerConfig.register({
    key: 'CustomText',
    name: '文本',
    preview: () => <CustomText>预览文本</CustomText>,
    render: (block) => <CustomText text={block.props.text || '自定义文本'} style={`fontSize: ${block.props.size}px; width: ${block.width}px; height: ${block.height}px;`}></CustomText>,
    props: {
        text: createInputProp('显示文本'),
        size: createInputProp('字体大小')
    }
})

export default registerConfig