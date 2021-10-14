import { defineComponent } from 'vue'
import './index.scss'

export default defineComponent({
    props: {
        data: {
            type: Object,
            default: () => ({})
        }
    },
    setup(props) {
        const handleClick = () => {
            console.log('提交接口啦')
        }
        return () => <button onClick={handleClick}>{props.data.text}</button>
    }
})