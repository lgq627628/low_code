import { defineComponent } from 'vue'
import { getComponent } from './utils.js'
import H5Banner from './components/banner/index.jsx'
import H5Button from './components/button/index.jsx'
import './App.scss'

const componentMap = {
    'H5Banner': H5Banner,
    'H5Button': H5Button
}
console.log('xxxx', getComponent())
export default defineComponent({
    setup(props) {
        const blocks = [{
            name: "H5Banner",
            props: {
                src: "favicon.ico",
                link: ""
            }
          }, {
            name: "H5Button",
            props: {
                text: "哈哈哈",
                action: ""
            }
          }
        ]
        return () => <div className="wrap">
            {
                blocks.map(block => {
                    const comp = componentMap[block.name]
                    return <comp className="row" data={block.props}></comp>
                })
            }
        </div>
    }
})