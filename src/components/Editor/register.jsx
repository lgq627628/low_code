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
    render: () => <ElTag>渲染标签</ElTag>
})
registerConfig.register({
    key: 'ElButton',
    name: '按钮',
    preview: () => <ElButton>预览按钮</ElButton>,
    render: () => <ElButton>渲染按钮</ElButton>
})
registerConfig.register({
    key: 'ElInput',
    name: '输入框',
    preview: () => <ElInput>预览输入框</ElInput>,
    render: () => <ElInput>渲染输入框</ElInput>
})
registerConfig.register({
    key: 'CustomText',
    name: '文本',
    preview: () => <CustomText>预览文本</CustomText>,
    render: () => <CustomText>渲染文本</CustomText>
})

export default registerConfig