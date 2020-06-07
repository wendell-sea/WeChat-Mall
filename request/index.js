// 定义一个（如果多数据请求时，加载图标和发起数据次数保持一致）
let ajaxTimes = 0;
export const request = (params) => {
    //每发起一次数据请求时，就加一
    ajaxTimes++;
    //显示加载图标
     wx.showLoading({
       title: '加载中',
       mask:true
     })
    const baseUrl = 'https://api-hmugo-web.itheima.net/api/public/v1/'
    return new Promise((resolve, reject) => {
        wx.request({
            ...params,
            url: baseUrl + params.url,
            success: (result) => {
                resolve(result)
            },
            fail: (err) => {
                reject(err)
            },
            complete:()=>{
               //每关闭一次时，对应的发起数据请求就减一
               ajaxTimes--;
                //判断如果数据请求的ajaxload 对于0 时 就关闭图标
                if(ajaxTimes == 0){
                //关闭加载图标
                wx.hideLoading()
                }
             
            }
        });

    })
}