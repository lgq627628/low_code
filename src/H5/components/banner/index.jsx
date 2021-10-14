import { defineComponent } from 'vue'
import './index.scss'
export default defineComponent({
    name: 'h5-banner',
    props: {
        data: {
            type: Object,
            default: () => ({})
        }
    },
    setup(props) {
        return () => <a href={props.data.href}>
            <img src={props.data.src} alt="图片" class="h5-img"/>
        </a>
    },
})
