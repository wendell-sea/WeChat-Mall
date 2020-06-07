//导入数据请求模块
import {
    request
} from "../../request/index"
/* 
加入购物车逻辑：
1：先绑定点击事件
2：获取缓存中的购物车数据 （数组格式）
3：先判断 当前的商品是否已经存在于购物车
4： 已经存在 修改商品数据 执行购物车数量++ 重新把购物车数组 填充回缓存中
5： 不存在于购物车的数组中 直接给购物车数组添加一个数组  添加一个num 数量 然后重新把数组添加进缓存中

*/

Page({

    /**
     * 页面的初始数据
     */
    data: {
        goodsObj: {},
        // 收藏状态
        collectState:false
    },
    // 当前商品的id
    goodsInfo: {},
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.getDetailData(options.goods_id)
    },
    // 获取商品详情数据
    getDetailData(goods_id) {
        request({
            url: 'goods/detail',
            data: { goods_id }
        }).then((result) => {
            this.goodsInfo = result.data.message
            let res = result.data.message
            this.setData({
                goodsObj: {
                    goods_name: res.goods_name,
                    goods_price: res.goods_price,
                    goods_introduce: res.goods_introduce.replace(/\.webp/g, '.jpg'),
                    pics: res.pics
                }
            })
        })
    },
    // 点击图片预览
    handImgClick(e) {
        //1:获取 需要预览图片的http连接列表
        let urls = this.data.goodsObj.pics.map((v, i) => v.pics_mid)
            //2:接收传递过来图片url 
        let current = e.currentTarget.dataset.url
        wx.previewImage({
            current: current, // 当前显示图片的http链接
            urls: urls // 需要预览的图片http链接列表
        })
    },
    // 点击加入购物车
    handAddCartClick() {
        console.log(this.goodsInfo);

        // 1:先在本地储存中添加一个空数组 
        let cart = wx.getStorageSync("cart") || [];
        // 2；查找购物车数组 有没有当前商品
        let com = cart.findIndex(v => v.goods_id == this.goodsInfo.goods_id)
            // 3: 判断当前数组有没有当前商品
        if (com === -1) {
            // 不存在，就直接push 当前商品信息 到购物车数组 加上一个num
            this.goodsInfo.num = 1
                // 还要加上一个 checked属性 默认当前为选中状态  true
            this.goodsInfo.checked = true
            cart.push(this.goodsInfo)
        } else {
            // 存在的话  就让当前商品的num++
            cart[com].num++
        }
        //4：把当前购物车数组 在 添加到缓存中
        wx.setStorageSync("cart", cart);
        wx.showToast({
            title: '添加购物车成功',
            icon: 'success',
        });


    },
    //点击收藏
    handCollClick(){
     let { collectState } = this.data
     collectState = !collectState
     this.setData({
         collectState
     })
     // 获取当前商品的id
     let id =  this.goodsInfo.goods_id
     //判断当前选择的状态
     if (this.data.collectState){
        //如果当前状态是选中 收藏状态 就对比当前id 是不是一样的 一样的 就把他加入到一个新的数组中，储到缓存当中,到时候 直接在收藏页面渲染 就可以了
        if(id ===  this.goodsInfo.goods_id ){
        // 储到缓存当中
        // 但是要先取出来 因为 下面要拼接数组
       let newCollData = wx.getStorageSync('collData') || []
        // 判断 缓存中的数组 里面 有没有当前收藏的数据 根据 goods_id 找 如果有就不用在加进去
       let index = newCollData.findIndex(v=>v.goods_id === id)
        if(index !== -1){
         // 不等于-1 就找到了就不用再添加进去
           return;
        }else{
        // 找不到 就 拼接数组
        wx.setStorageSync('collData',[...newCollData,this.goodsInfo] )
        }

        }
     }else{
       // 否则 就没有收藏该商品 
       //先获取缓存中已经收藏的商品数据
       let newCollDataList = wx.getStorageSync('collData') || []
       // 循环查找 当前id是不是已经存在缓存当中了 没有返回-1 
       let index =  newCollDataList.findIndex(v=>v.goods_id === id)
       // 根据 当前 查找到的第一个 删除
        newCollDataList.splice(index,1)

       // 再重新储入缓存当中
       wx.setStorageSync('collData',newCollDataList)
       
     }
    
     
     
    
        
    }



})