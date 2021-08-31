import { defineComponent } from 'vue'
export default defineComponent({
    props: {
        comp: { type: Object }
    },
    setup(props) {
        return () => <div class="preview-comp">
            <div class="preview-comp__name">{props.comp.name}：</div>
            {props.comp.preview()}
        </div>
    }
})