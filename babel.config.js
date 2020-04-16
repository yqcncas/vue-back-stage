const prodPlugins = []
// process.env.NODE_ENV === "plugins"  打包模式
if (process.env.NODE_ENV === "plugins") {
  prodPlugins.push("transform-remove-console")
}

module.exports = {
  presets: ['@vue/cli-plugin-babel/preset'],
  plugins: [...prodPlugins]
}
