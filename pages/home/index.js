//导入数据请求模块
import {
    request
} from "../../request/index"

// pages/home/index.js
Page({
    /**
     * 页面的初始数据
     */
    data: {
        swiperData: [],
        catesData: [],
        floorData: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // var reqTask = wx.request({
        //     url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata',
        //     success: (result) => {
        //         this.setData({
        //             swiperData: result.data.message
        //         })
        //     },

            this.getSwiperData(),
            this.getCatesData(),
            this.getFloorData()
    },
    // 获取轮播图数据
    getSwiperData() {
        request({
                url: 'home/swiperdata'
            })
            .then(result => {
                this.setData({
                    swiperData: result.data.message
                })
            })
    },
    // 获取分类导航数据
    getCatesData() {
        request({
                url: 'home/catitems'
            })
            .then(result => {
                this.setData({
                    catesData: result.data.message
                })
            })
    },
    // 获取楼层数据
    getFloorData() {
        request({
                url: 'home/floordata'
            })
            .then(result => {
                this.setData({
                    floorData: result.data.message
                })
            })
    }



})