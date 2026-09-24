# Sakura Spine

Sakura 的 Spine 3.6 表现插件，提供表情切换、循环动画、一次动作，以及角色工坊中的预览和编辑。

| 项目 | 值 |
| --- | --- |
| 插件 ID | `sakura.visual.spine` |
| 源码版本 | `0.2.7` |
| Plugin API | `4` |
| 形态资源类型 | `spine.json@1` |
| 宿主服务 | `sakura.host.character`、`sakura.host.logging` |

<a id="026-更新"></a>

## 0.2.7 更新

0.2.6 同步了当时 Sakura 内置插件的透明区域命中检测、高清渲染缓冲、工坊预览缩放与拖动、视图恢复和缩略图生成。
表情名称按资源配置显示，未配置时使用原始名称；资源加载和编辑预览错误接入宿主日志。
该版本新增必需服务 `sakura.host.logging`，透明区域命中检测需要宿主提供 `setHitTest` 接口。

0.2.7 继续修正半透明纹理合成和资源兼容性。插件市场已收录 0.2.7；本仓库独立 Release 的最新附件仍为 `v0.2.5`，请通过市场或对应源码安装新版。

## 安装

在“设置 → 插件 → 市场”搜索 Spine 并安装，再到“已安装”中启用。市场版本由 [Sakura Registry](https://github.com/Rvosy/Sakura-Registry) 从固定源码构建。

也可以从“更多 → 从 ZIP 安装…”导入源码包或独立 Release 附件。独立 [v0.2.5 安装包](https://github.com/Rvosy/Sakura-Spine/releases/download/v0.2.5/sakura.visual.spine.zip)保留用于该版本，不包含 0.2.6 和 0.2.7 的改动。

安装包根目录直接包含 `plugin.yaml`。GitHub 的标签源码 ZIP 也保留可识别的单层目录。
从 Git 克隆后可运行 `python3 tools/package.py`，安装生成的 `dist/sakura.visual.spine.zip`，无需复制整个 Sakura 仓库。

插件需要支持正式表现插件、角色工坊和透明区域鼠标检测接口的 Sakura 桌面版本，建议使用支持插件市场的新版。宿主服务要求见 `plugin.yaml`。插件后端仅使用 Python 标准库，前端运行库随包提供。

启用后，在“角色工坊 → 角色形态”导入 `.visual`，或添加 Spine 形态再导入模型目录。
表情按钮用于预览，“表情名称”可改按钮文字；“默认表情”单独设置角色加载时的表情。
切换表情和翻阅历史保持循环动画进度。插件安装本身不会更改角色的显示方式。

## 资源范围

支持 Spine `3.6.x` JSON 骨骼、文本图集和 PNG/JPEG 贴图；不支持 `.skel`、其他 Spine 版本或多骨骼特效编排。
角色美术、模型、贴图和游戏解包素材不随插件发布。

`.visual` 内的资源配置示例：

```json
{
  "version": 1,
  "skeleton": "model/skeleton.json",
  "atlas": "model/skeleton.atlas",
  "defaultAnimation": "idle",
  "defaultSkin": "normal",
  "selectableSkins": ["normal", "smile"],
  "skinLabels": {"normal": "平静", "smile": "开心"},
  "speed": 1,
  "premultipliedAlpha": true,
  "modelControls": ["skin"]
}
```

皮肤、动画、文件名和透明方式必须按实际素材填写。只含基础部件的皮肤应从 `selectableSkins` 排除。
`.visual` 的打包工具与独立预览服务器仍由 [Sakura](https://github.com/Rvosy/Sakura) 的 `tools.spine_preview` 提供；
本仓库的 `preview/` 页面需由该服务器托管，不能直接双击 HTML 使用。
完整接口见 [Spine 插件规范](https://github.com/Rvosy/Sakura/blob/main/docs/specs/runtime-v2/spine-visual-plugin.md)。

## 开发和发布

```sh
node --test tests/*.test.mjs
python3 tools/package.py
```

测试使用随包的 Spine 运行库验证动作、取消、表情切换和销毁。Sakura 宿主安装、工坊和原生窗口验收仍应在主程序中执行。

发布新版本时修改 `plugin.yaml` 和上方版本说明，提交后推送对应 `vX.Y.Z` 标签。
GitHub Actions 会验证插件并生成 Release，附件固定为 `sakura.visual.spine.zip`。
标签必须与清单版本一致；已发布标签不移动。

后续下载器可查询 [最新 Release API](https://api.github.com/repos/Rvosy/Sakura-Spine/releases/latest)，
读取 `tag_name` 与 `assets`，选择 `sakura.visual.spine.zip` 对应的 `browser_download_url`。
此 API 只查询本仓库的独立 Release。Sakura 插件市场使用 Registry 目录，两处的可用版本可能不同；在市场更新时，以市场显示的版本为准。

初始代码来自 Sakura 的 `plugins/optional/sakura_spine`，来源提交见 [NOTICE](NOTICE)。
主仓库中的现有副本保留，当前没有自动双向同步；更新独立仓库后需单独决定是否同步主仓库副本。

## 许可证

原创插件代码使用 [MIT](LICENSE)。`vendor/spine-webgl.mjs` 使用独立的
[Spine Runtimes Software License v2.5](vendor/SPINE-LICENSE)，不适用 MIT；上游来源见 [vendor/README.md](vendor/README.md)。
使用、修改与分发 Spine Runtime 须遵守其许可证及相应 Spine 授权条件。角色资源的授权由资源提供者负责。
