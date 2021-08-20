import { defineComponent } from 'vue'
export default defineComponent({
    props: {
        comp: { type: Object }
    },
    setup(props) {
        const { comp } = props;
        return () => <div class="preview-comp">
            <div class="preview-comp__name">{comp.name}：</div>
            {comp.preview()}
        </div>
    }
})