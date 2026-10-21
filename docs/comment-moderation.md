# 博文留言审核

读者在文章底部填昵称和留言，无需 GitHub 账号。Netlify Forms 收到的内容不会自动公开。

## 查看待审核留言

打开 https://app.netlify.com/projects/shunyangwang/forms ，选择 `blog-comments`。
请同时查看 spam 列表，避免漏掉误判的留言。

Netlify 的 Verified 仅代表通过垃圾信息筛查，不代表作者批准公开。

## 批准并公开

由作者决定公开哪些留言。将获批留言写入对应的 `data/comments/<post>.yaml`，提交并推送后，网站会重新构建、显示留言。

例如《30岁小记》使用 `data/comments/turning-thirty.yaml`。将初始的 `[]` 替换为：

```yaml
- name: "读者昵称"
  date: "2026-10-21"
  message: |-
    此处粘贴已批准的留言原文。
  reply: |-
    可选的作者回复；不回复时删除 reply 字段。
```

后续在列表中追加。只复制作者确认公开的昵称、正文及可选日期；不要公开 Netlify 后台的 IP、邮件等元数据。
留言按纯文本输出，模板不执行留言里的 HTML 或脚本。

也可以直接让 Codex 帮忙查看待审核留言，由作者确认具体留言后再发布。

## 在其他博文启用

在文章 front matter 中设置：

```yaml
commentable: true
comment_provider: moderated
comments_key: turning-thirty
```

新文章使用自己的唯一 `comments_key`，并新增同名 YAML 文件。其他文章原有的 Giscus 留言保持不变。
