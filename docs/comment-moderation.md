# 博文留言

留言无需作者审核，直接保存并公开。此前的测试留言不迁移到公开列表。

## 收件、提醒及备份

后台：https://app.netlify.com/projects/shunyangwang/forms/6ad86371bc43107f936d579f

提交仍由 Netlify Forms 接收，现有 Gmail 提醒和 Download as CSV 导出继续可用。公开接口保留隐藏反机器人字段和字数限制；Netlify 的垃圾信息分类仅作用于后台收件及邮件提醒，不决定公开状态。

原始提交保存在 Forms；公开副本保存在站点级 Blobs 的 public-blog-comments store，重新部署网站不会清空。接口只公开昵称、正文、时间和 ID，不公开 IP 或后台元数据。新留言不再依赖 Git 提交；历史 data/comments/<post>.yaml 仍可显示。

## 删除公开留言

Netlify → Data & storage → Blobs → public-blog-comments → 对应文章目录，找到对应记录。可先下载备份再删除。
仅删除 Forms 原始提交或改为 spam 不会撤回已经公开的副本；需要删除 Blobs 的对应记录。

## 在其他文章启用

沿用 commentable: true、comment_provider: moderated、唯一的 comments_key。provider 名称为兼容既有模板而保留，实际上已不需要作者审核。
