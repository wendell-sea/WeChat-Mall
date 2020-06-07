//导入数据请求模块
import {
    request
} from "../../request/index"


Page({

    /**
     * 页面的初始数据
     */
    data: {
        tabs: [{
                id: 1,
                value: "综合",
                isActive: true
            },
            {
                id: 2,
                value: "销量",
                isActive: false
            },
            {
                id: 3,
                value: "价格",
                isActive: false
            }
        ],
        goodsList: []
    },
    // 获取数据的参数
    parameter: {
        query: '',
        cid: '',
        pagenum: 1,
        pagesize: 10
    },
    // 定义全局数据的总页数
    totalPage: 0,
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        // 获取 当前商品的id id没有 就获取当前 点击传过来的 query
        this.parameter.cid = options.cid || '',
            this.parameter.query = options.query || '',
            this.getGoodsListData()
    },
    handTabsIndex(e) {
        // 获取 当前点击的index
        const {
            index
        } = e.detail
            // 获取当前的数据源
        const {
            tabs
        } = this.data
            // 循环数据源的每一项 根据当前点击的index 改变 isActive
        tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false)
        this.setData({
            tabs
        })
    },
    //获取商品列表数据
    getGoodsListData() {
        request({
                url: 'goods/search',
                data: this.parameter
            })
            .then((result) => {
                let total = result.data.message.total
                this.totalPage = Math.ceil(total / this.parameter.pagesize)
                const res = result.data.message.goods
                this.setData({
                        goodsList: [...this.data.goodsList, ...res]
                    })
                    //页面刷新完成离开关闭下拉窗口
                wx.stopPullDownRefresh()
            })
    },
    // 上拉加载更多
    onReachBottom() {
        // 如果当前页数大于等于 totalPage 总页数 
        if (this.parameter.pagenum >= this.totalPage) {
            wx.showToast({
                title: '没有更多啦！',
                "icon": 'none'
            })
        } else {
            this.parameter.pagenum++
                this.getGoodsListData()

        }

    },
    // 监听页面下拉刷新
    onPullDownRefresh() {
        //1.重置数组
        this.setData({
                goodsList: []
            })
            //2.重置页码
        this.parameter.pagenum = 1
            //3.重新发起数据请求
        this.getGoodsListData()
            //5.页面数据刷新成功 立刻关闭 下拉窗口
            /* wx.stopPullDownRefresh() */

    }

})