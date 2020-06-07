//导入数据请求模块
import {
    request
} from "../../request/index"
Page({
    /* 
    分析搜索逻辑
    1:绑定input 事件 拿到事件源 里输入的值
    2:输入的值 调用接口
    3：渲染页面

    */
    data: {
        value:'',
        searchData:[],
        isHidden:false
    },
    //定义一个全局定时器
    TiemID:-1,
    // input 改变事件
    inputChang(e){
    // 获取点击事件源 里的value值
    let { value } = e.detail
    // 判断值是不是空的
    if(!value.trim()){
        //空的 不发起请求
        this.setData({
            value:'',
            searchData:[],
            isHidden:false
        })
        return;
    }
    // 防抖 操作 定时器
    //清除定时器
    clearTimeout(this.TiemID)
    this.TiemID=setTimeout(()=>{
        this.getSearchData(value)
    },1000)
    //如果当前input框有内容 就显示取消按钮
    this.setData({
        isHidden:true
    })    
    },
    //发起网络请求
    getSearchData(value){
        request({
            url: 'goods/qsearch',
            data:{query:value}
        })
        .then(result => {
           this.setData({
            searchData:result.data.message
           })
           
        })
    },
    // 点击取消按钮 清空数据内容
    handButtonClaer(){
        this.setData({
        value:'',
        searchData:[],
        isHidden:false
        })
    }

})