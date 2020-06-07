Page({
    data: {
        userInfo: {},
        collNum:0
    },

    onLoad: function(options){
        // 当页面 第一次加载 就取出缓存用户信息 
        let userInfos = wx.getStorageSync("userInfo");
        
        this.setData({
            userInfo: userInfos,
            
        })
    



    },
    onShow:function(){
        // 获取当前用户收藏的商品数量
        let collNum = wx.getStorageSync('collData')
        this.setData({
            
            collNum:collNum.length
        })
    },
    handBindgetuserinfo(res) {
        // 获取用户信息
        let { userInfo } = res.detail
            //把当前用户信息存到 缓存中 以便检查登录状态   
        wx.setStorageSync("userInfo", userInfo);
        // 取出缓存用户信息 
        let userInfos = wx.getStorageSync("userInfo");
        this.setData({
            userInfo: userInfos
        })
    },

})