// pages/cart/index.js
Page({
    data: {
        address: {},
        cart: [],
        //全选按钮 默认为false
        allChecked: false,
        // 总价格
        allPrice: 0,
        // 总数量
        allNum: 0
    },
    // 点击获取收货地址按钮 切换 显示收货地址
    onShow() {
        //1:获取缓存中的有没有收货地址
        const address = wx.getStorageSync("address")
            // 1:获取缓存中购物车数组
        let cart = wx.getStorageSync("cart") || [];
        // 计算购物车的商品总价格 和 总数量
        this.cartAllPriceNum(cart)
        this.setData({
            address,
            cart,
        })



    },
    /* 
       授权 获取用户收货地址 步骤
       1：绑定点击事件
       2：调用小程序内置api  获取收货地址 wx.chooseAddress(直接调用会出问题)
       ------------------------------
       3：需要判断 用户对小程序 授权的 状态  scope
         3.1: 如果用户点击收货地址提示框是确定 那当前的状态就是 authSetting  scope.address: true
         3.2：如果用户什么都没有点击 那就是undefined 
         3.3：如果用户点击了取消 authSetting  scope.address: false
           3.3.1：如果用户点击了取消的话 当第二次想打开获取收货地址权限的时候要引导用户 打开小程序设置页面
            wx.openSetting  让他手动打开获取地址权限
    */
    /* 
      添加购物车逻辑 步骤
      1：先获取缓存中购物车数据
      2：渲染购物车页面
      3：当前选中的checkbox 为true
         3.1:  在加入购物车的时候 就要添加一个 checked属性 为true
    */
    // 点击获取收货地址按钮
    handAddressClick() {
        wx.getSetting({
            success: (result) => {
                //1:获取当前 权限状态 
                let authSetting = result.authSetting["scope.address"]
                    // 2: 判断当前状态
                if (authSetting === true || authSetting == undefined) {
                    // 3: 获取收货地址
                    wx.chooseAddress({
                        success: (result1) => {

                            // 将获取到的收货地址保存在本地缓存中
                            wx.setStorageSync("address", result1);


                        },
                    });
                } else {
                    //4: 手动打开 小程序设置
                    wx.openSetting({
                        success: (result2) => {
                            //5: 重新获取收货地址
                            wx.chooseAddress({
                                success: (result3) => {
                                    // 将获取到的收货地址保存在本地缓存中
                                    wx.setStorageSync("address", result3);
                                },
                            });


                        },
                    });

                }
            },
        });



    },
    // 商品的选中状态 
    handChangeClick(e) {
        // 1:获取当前点击状态商品的id
        const { id } = e.currentTarget.dataset
            // 2:根据id 查询 缓存中对应的商品数据
        let { cart } = this.data
        let index = cart.findIndex(v => v.goods_id === id)
            // 3:取反 当前商品的checked 
        cart[index].checked = !cart[index].checked

        // 5: 重新计算购物车的商品总价格 和 总数量
        this.cartAllPriceNum(cart)

    },
    // 封装 商品总价格 总数量
    cartAllPriceNum(cart) {
        // 4:把取反后的购物车数组 重新储进缓存中
        wx.setStorageSync("cart", cart)
            // 数组 every 方法 是检测当前数组循环项 如果有一项 为false 就返回false 并且终止当前循环 
        let allChecked = cart.length ? cart.every(v => v.checked) : false
        let allPrice = 0
        let allNum = 0
        cart.forEach(v => {
            if (v.checked) {
                allPrice += v.num * v.goods_price
                allNum += v.num
            }
        })
        this.setData({
            allPrice,
            allNum,
            allChecked,
            cart
        })
    },
    //购物车商品全选
    handAllChecked() {
        // 1: 获取data 中的数据
        let { cart, allChecked } = this.data
            // 2： 点击全选 取反
        allChecked = !allChecked
            // 3:修改cart 数组中每一个商品的 选中状态 跟随全选而改变
        cart.forEach(v => v.checked = allChecked);

        // 4：重新计算价格 和数量 全选
        this.cartAllPriceNum(cart)
    },
    // 修改购物车数量 
    handClickEdit(e) {
        // 获取点击事件源  id 和 operation（加1  和 减1）
        let { id, operation } = e.currentTarget.dataset
            //获取data 中的数据
        let { cart } = this.data
            // 循环当前数组 查找对应的商品 id
        let index = cart.findIndex(v => v.goods_id == id)
            // 如果当前的数量对于1  并且点击的是减号  就什么都不做
        if (cart[index].num == 1 && operation == -1) {
            return;
        }
        cart[index].num += operation
            // 4：重新计算价格 和数量 全选
        this.cartAllPriceNum(cart)
    },
    // 删除购物车 当前 商品
    handClidkDelet(e) {
        // 获取data中的数据
        let { cart } = this.data
            // 获取点击事件源 当前商品id
        let { id } = e.currentTarget.dataset
            // 根据当前id 查找对应商品的id
        let index = cart.findIndex(v => v.goods_id == id)
            //  确定删除当前商品的弹出框
        wx.showModal({
            title: '确定删除当前商品！',
            success: (res) => {
                if (res.confirm) {
                    cart.splice(index, 1)
                        // 5: 重新计算购物车的商品总价格 和 总数量
                    this.cartAllPriceNum(cart)
                } else if (res.cancel) {
                    return;
                }
            }
        })




    },
    // 点击支付 跳转支付界面
    handPaly() {
        // 判断当前用户 有没有选择收货地址
        let { address, allNum } = this.data
        if (!address.userName) {
            wx.showToast({
                title: '还没有选择收货地址噢',
                icon: 'none',
            });
            return;
        }
        //判断当前有没有商品
        if (allNum == 0) {
            wx.showToast({
                title: '还没有商品噢',
                icon: 'none',
            });
            return;
        }
        new Promise((res, rej) => {
            res(
                //如果都满足上面的条件了，就跳转支付页面
                wx.navigateTo({
                    url: '/pages/pay/index',
                })
            )
        })

    },


})