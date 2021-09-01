import { defineComponent } from "vue";
import './custom-text.scss'
export default defineComponent({
    nmae: 'custom-text',
    props: {
        text: {
            type: String,
            default: '默认文本'
        }
    },
    setup(props) {
        return () => <div class="custom-text">
            { props.text }
        </div>
    }
})