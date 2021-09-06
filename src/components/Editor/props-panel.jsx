import { computed, defineComponent, reactive, watch } from "vue";
import registerConfig from './register'
import { PROPS_TYPE_MAP } from './comp-props'
import deepcopy from "deepcopy";

export default defineComponent({
    props: {
        block: { type: Object, default: {} }
    },
    setup(props) {
        const propFormItem = (propName, propCfg) => {
            console.log(propName, props.block.props)
            return {
                [PROPS_TYPE_MAP.INPUT]: () => <ElInput v-model={props.block.props[propName]}></ElInput>,
                [PROPS_TYPE_MAP.COLOR]: () => <ElColorPicker v-model={props.block.props[propName]}></ElColorPicker>,
                [PROPS_TYPE_MAP.SELECT]: () => <ElSelect v-model={props.block.props[propName]}>
                    {
                        propCfg.opts.map(opt => {
                            return <el-option label={opt.label} value={opt.val} key={opt.val}></el-option>
                        })
                    }
                </ElSelect>,
                [PROPS_TYPE_MAP.SWITCH]: () => <ElSwitch v-model={props.block.props[propName]}></ElSwitch>
            }[propCfg.type]()
        }
        const keyLabelMap = {
            width: '宽度',
            height: '高度',
            fontSize: '字号',
            fontWeight: '粗细',
            color: '颜色'
        }
        return () => <>
            {
                props.block ? <ElForm>
                    <ElFormItem label='宽度'>
                        <ElInput></ElInput>
                    </ElFormItem>
                    <ElFormItem label='高度'>
                        <ElInput></ElInput>
                    </ElFormItem>
                    {
                        props.block.key ? Object.entries(registerConfig.componentMap[props.block.key].props).map(([propName, propCfg]) => {
                            return <ElFormItem label={propCfg.label}>
                                { propFormItem(propName, propCfg) }
                            </ElFormItem>
                        }) : ''
                    }
                    </ElForm> : ''
                }
        </>
    }
})