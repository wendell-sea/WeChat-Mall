// pages/collect/index.js
Page({

    data: {
        ImageDataList: [],
        inputValue: ''
    },

    //点击添加图片
    handImgClick() {
        //小程序自代api
        wx.chooseImage({
            count: 5,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: (result) => {
                let res = [...this.data.ImageDataList, ...result.tempFilePaths]
                this.setData({
                    ImageDataList: res
                })
            },
        });

    },
    //点击删除图片
    handRemClick(e) {
        let { index } = e.currentTarget.dataset
        let { ImageDataList } = this.data
        ImageDataList.splice(index, 1)
        this.setData({
            ImageDataList
        })
    },
    //获取 文本域 的内容
    inputValue(e) {
        let { inputValue } = this.data
        inputValue = e.detail.value
        this.setData({
            inputValue
        })

    },
    // 提交信息
    handSubmit() {
        // 当前用户填写的内容 和  用户选择的图片
        let { inputValue, ImageDataList } = this.data
            // 没有接口 也没服务器  所以到这就不做提交到后台了
            // 判断当前 合法 提交吗
        if (!inputValue.trim()) {
            wx.showToast({
                title: '请填写信息！',
                icon: 'none'
            });
            return;
        } else {
            wx.showToast({
                // 到这里 就算成功提交了哈  
                title: '已提交',
                icon: 'succsee',
                success: () => {

                    wx.switchTab({
                        url: '/pages/user/index',

                    });












                },
            });
        }



    },


})