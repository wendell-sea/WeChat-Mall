// pages/order/index.js
Page({
    /**
     * 页面的初始数据
     */
    data: {
        orderList: []
    },
    // 在页面第一次渲染拿到 
    onShow() {
        // 获取当前支付的 商品 在缓存中
        let orderData = wx.getStorageSync("orderData");
        //遍历嵌套数组  把里面的对象 给取出来
        let arrOrder = []
        for (let i = 0; i < orderData.length; i++) {
            for (let a = 0; a < orderData[i].length; a++) {
                arrOrder.push(orderData[i][a])
            }

        }
        // 拼接数组
        let { orderList } = this.data
        this.setData({
            orderList: arrOrder
        })

        // 清除购物车内容
        wx.removeStorageSync("cart");


    }

})