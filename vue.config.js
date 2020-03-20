module.exports = {
  publicPath: './',
  css: {
    // 是否开启支持 foo.module.css 样式
    requireModuleExtension: true,
    // 是否使用 css 分离插件 ExtractTextPlugin，采用独立样式文件载入，不采用 <style> 方式内联至 html 文件中
    extract: false,
    // 是否构建样式地图，false 将提高构建速度
    sourceMap: true,

  }
}