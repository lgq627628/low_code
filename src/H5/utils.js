// 通过 webpack 实现
// export function getComponent() {
//     const componentConfig = []
//     const requireConfig = require.context('./components', true, /package.json$/)
//     requireConfig.keys().forEach(fileName => {
//         componentConfig.push(requireConfig(fileName))
//     });
//     console.log(componentConfig)
//     return componentConfig
// }

// 通过 node 实现
// const fs = require('fs')
// export function getComponent() {
//     const componentList = []
//     const dirs = fs.readdirSync('./components')
//     dirs.forEach(dir => {
//         const config = fs.readFileSync(`./components/${dir}/package.json`)
//         console.log(config)
//         componentList.push(JSON.parse(config.toString()))
//     })
//     console.log(dirs, componentList)
//     return componentList
// }

// 通过 vite 实现
export function getComponent() {
    const componentList = [];
    const fileMap = import.meta.globEager('./components/**/*.json');
    Object.keys(fileMap).forEach(fileName => {
        const config = fileMap[fileName].default;
        componentList.push(config);
    });
    return componentList;
}

export function postMsgToParent (msg) {
    window.parent.postMessage(msg, '*')
}
