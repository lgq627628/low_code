import { defineComponent } from "vue";

export default defineComponent({
    props: {
        block: { type: Object }
    },
    setup(props) {
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
                    {
                        Object.keys(props.block.style || {}).map(key => {
                            return <ElFormItem label={keyLabelMap[key]}>
                                <ElInput v-model={props.block.style[key]}></ElInput>
                            </ElFormItem>
                        })
                    }
                    </ElForm> : ''
                }
        </>
    }
})