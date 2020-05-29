// 这是项目发布阶段需要用到的 babel 插件
const prodPlugins = []
// 判断项目是否处于发布阶段
if (process.env.NODE_ENV === 'production') {
    // 移除项目中所有的 console
    prodPlugins.push('transform-remove-console')
}


module.exports = {
    "presets": [
        "@vue/cli-plugin-babel/preset"
    ],
    "plugins": [
        [
            "component",
            {
                "libraryName": "element-ui",
                "styleLibraryName": "theme-chalk"
            }
        ],
        // 发布产品时候的插件数组
        ...prodPlugins
    ]
}