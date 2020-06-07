// pages/pay/index.js
Page({

    /* 
 微信支付步骤
    1：那些人 那些账号 可以实现微信支付
       1.1：企业账户
       1.2：企业账户的小程序后台中  必须 给开发者 添加白名单
            1.2.1 : 一个企业账户 可以同时绑定多个开发者
            1.2.2 : 这些开发者就可以同时公用这个企业appid 和 它的开发权限

    2： 支付流程
        2.1：绑定支付点击事件
        2.2：判断当前缓存中有没有 token 值
            2.2.1:如果当前缓存中有token值
            2.2.2：如果当前没有token值 就跳转 获取权限页面
*/
    data: {
        address: {},
        cart: [],
        allPrice: 0,
        allNum: 0

    },
    onShow() {
        // 获取当前收货地址
        let address = wx.getStorageSync("address");
        // 获取当前购物车里 checked 为true 选中状态的商品
        let cart = wx.getStorageSync("cart");
        // 过滤 checked 为true的
        let checked = cart.filter(v => v.checked)
            //获取当前商品总价格 和 总数量
        let allPrice = 0
        let allNum = 0
        checked.forEach(v => {
            allPrice += v.num * v.goods_price
            allNum += v.num
        });
        this.setData({
            address,
            cart: checked,
            allPrice,
            allNum
        })

    },
    /* 
     点击支付按钮 跳转 支付
     注： 因为当前账号不是企业账号，所以使用不了 微信支付功能，
          只能把当前点击支付的商品存入缓存当中 ，以便渲染订单页面
      1：步骤
        1.1：点击支付按钮 获取登录状态 
        1.2：如果当前缓存中没有登录信息 就获取权限登录
        1.3：如果当前缓存中有登录信息  就表示已登录了 弹出购买成功提示框 跳转订单页面
    */
    handPayPage() {
        // 1: 获取当前缓存中有没有 登录状态信息
        let userInfo = wx.getStorageSync('userInfo')
            //2: 判断当前状态
        if (userInfo) {
            //2.1: 如果已经登录了 就跳转订单页面 查看订单信息
            // 这里是异步的 要整个 promise
            new Promise((res, rej) => {
                    res(
                        wx.switchTab({
                            url: '/pages/user/index',
                        }),
                    )
                }).then(res => {
                    wx.showToast({
                        title: '支付成功',
                        icon: 'success'
                    })
                })
                // 在点击支付进入 订单页面 的同时 要把当前 支付的商品 存入 缓存中
            let { cart } = this.data
                // 这里我是循环 每一项  往里面 加了一个 假订单编号
            cart.forEach(v => {
                v.number = 'GD202006051234679' + Math.floor(Math.random() * 100)
                v.date = new Date()
            })

            let orderData = cart
                // 获取 到当前支付的数组
            let orderAge = wx.getStorageSync("orderData") || [];
            // 把当前商品 添加进原来的支付数组
            orderAge.push(orderData)
                // 然后存在缓存当中 以便渲染订单页面

            wx.setStorageSync("orderData", orderAge);

        } else {
            //没有登录 就跳转 登录页面 提醒用户 登录
            wx.switchTab({
                url: '/pages/user/index',
            })
            wx.showToast({
                title: '还没有登录噢',
                icon: 'none'
            })
        }


    }
})