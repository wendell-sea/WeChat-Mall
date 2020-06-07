// pages/login/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        listData: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        //获取当前 收藏的商品 数组
        let collData = wx.getStorageSync("collData");
        this.setData({
            listData: collData
        })
    },
    //点击删除 当前收藏的商品
    handRemGoods(e) {
        let { listData } = this.data
        // 拿到 当前的id
        let { id } = e.currentTarget.dataset
            // 判断当前 点击删除的id 和 当前id 是不是一样的
            //循环查出对应的id  
        let index = listData.findIndex(v => v.goods_id === id)
            //根据当前id的index 删除对应的 收藏商品
        let res =  listData.splice(index, 1)
        console.log(res);
        
        this.setData({
                listData
            })
       //  重新保存到缓存中
       wx.setStorageSync("collData", this.data.listData);
       // let { listData } = this.data
       // wx.setStorageSync("collData", this.data.listDataata);



    }
})