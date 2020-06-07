import { request } from "../../request/index"


Page({
    data: {
        // 左侧菜单数据
        leftCategortData: [],
        // 右侧列表数据
        rigthMeunList: [],
        // 当前注册菜单选择项
        currentIndex: 0,
        // 点击不同菜单项 右侧页面滚动位置到顶部
        scrollTop: 0
    },
    //接口的返回数据
    cates: [],

    //生命周期函数--监听页面加载
    onLoad: function(options) {
        /* 
         数据缓存 （节约性能）
         1：第一次进入页面 先把获取的数据存到本地存储中
         2：然后下一次进入页面的时候，判断当前缓存中有没有数据和数据有没有过期
         3：如果没有数据就直接发起数据请求
         4：如果本地存储中有数据 数据页没有过期 就直接用本地存储中的数据渲染页面
        */
        const Cates = wx.getStorageSync("cates");

        // 如果本地存储中没有数据，就直接发起数据请求
        if (!Cates) {
            this.getCategortData()
        } else {
            // 如果当前本地存储中的数据过期了  也要重新发起数据请求
            if (Date.now() - Cates.tiem > 1000 * 10) {
                this.getCategortData()
            } else {
                // 否则就把 本地存储中的数据 来渲染页面
                this.cates = Cates.data
                    // 构造左侧菜单数据
                let leftCategortData = this.cates.map(v => v.cat_name)
                    //  构造右侧数据列表、
                let rigthMeunList = this.cates[0].children
                this.setData({
                    leftCategortData,
                    rigthMeunList
                })
            }

        }



    },
    //获取分类页面数据
    getCategortData() {
        request({ url: 'categories' })
            .then(result => {
                //console.log(result);
                this.cates = result.data.message
                    // 把数据存储到本地存储中
                wx.setStorageSync("cates", { tiem: Date.now(), data: this.cates })
                    // 构造左侧菜单数据
                let leftCategortData = this.cates.map(v => v.cat_name)
                    //  构造右侧数据列表、
                let rigthMeunList = this.cates[0].children
                this.setData({
                    leftCategortData,
                    rigthMeunList
                })
            })
    },
    // 点击左侧菜单
    handMenuClick(e) {
        /*
        1：获取 当前点击菜单的index
        2：把当前index 赋值给 currentIndex
        3:根据不同的索引渲染商品的内容
         */
        const { index } = e.currentTarget.dataset
        let rigthMeunList = this.cates[index].children
        this.setData({
            currentIndex: index,
            rigthMeunList,
            scrollTop: 0
        })

    }


})