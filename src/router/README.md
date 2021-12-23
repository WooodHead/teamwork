# 路由的命名

xxxHome,
xxxList,
xxxDashboard,
xxxRank,
archivedxxxs
xxxIndex,
xxxDetail,
xxxAdd,
xxxEdit,


# goBack的设置

部分路由的元数据meta中给出了goBack，这个参数是控制在移动端头部左上角的返回按钮的返回路径的。
移动端返回按钮默认是和浏览器的保持一致，返回上一页window.history.back(),
但在有些情况下这样的返回路径并不是用户期望的，比如：
在一个团队的详情页，期望的返回团队的主页（列表页）；
在团队的列表页，期望返回系统的主页。

给出goBack就是为了控制有些页面的返回路径的。
目前只控制模块级的返回路径，这些模块包括：项目，团队，产品管理，客户，商机，订单，工程服务。
这些模块的返回路径是：详情页->（列表页->）模块主页->系统主页


