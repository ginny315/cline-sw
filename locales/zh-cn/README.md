## SWAI 基于 VsCode 插件 Cline 开发，默认调用 DeepSeek 671B V3 模型，后期将加入更多模型选择。从 SWAI 官网 http://ai.thuwaytec.com/ 中可获取个人 tokenKey。

## 本地开发说明
1. 克隆仓库 _(需要 [git-lfs](https://git-lfs.com/))_：
        ```bash
        git clone https://github.com/cline/cline.git
        ```
2. 在 VSCode 中打开项目：
        ```bash
        code cline
        ```
3. 安装扩展和 webview-gui 的必要依赖：
        ```bash
        npm run install:all
        ```
4. 按 `F5`（或 `运行`->`开始调试`）启动以打开一个加载了扩展的新 VSCode 窗口。（如果你在构建项目时遇到问题，可能需要安装 [esbuild problem matchers 扩展](https://marketplace.visualstudio.com/items?itemName=connor4312.esbuild-problem-matchers)）


## 许可证
[Apache 2.0](./LICENSE)

