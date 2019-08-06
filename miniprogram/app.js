//app.js
App({
    onLaunch: function () {
        
        if (!wx.cloud) {
            console.error('请使用 2.2.3 或以上的基础库以使用云能力')
        } else {
            wx.cloud.init({
                traceUser: true,
            })
        }

        // 展示本地存储能力
        var logs = wx.getStorageSync('logs') || []
        logs.unshift(Date.now())
        wx.setStorageSync('logs', logs)

        // 登录
        wx.login({
            success: res => {
                // 发送 res.code 到后台换取 openId, sessionKey, unionId
            }
        })
        // 询问用户是否授权
        wx.getSetting({
            success(res) {
              if (!res.authSetting['scope.userInfo']) {
                wx.authorize({
                  scope: 'scope.userInfo',
                  success(res) {
                    // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
                    // wx.startRecord()
                    wx.openSetting({
                        success: function(res){
                           console.log('权限0-------', res)
                        }
                    })
                  }
                })
              }
            }
          })
        // 获取用户信息
        wx.getSetting({
            success: res => {
              console.log('用户-------', res)
                if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                    wx.getUserInfo({
                        // withCredentials: true,
                        success: res => {
                            console.log('授权成功-------')
                            // 可以将 res 发送给后台解码出 unionId
                            this.globalData.userInfo = res.userInfo
                            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                            // 所以此处加入 callback 以防止这种情况
                            if (this.userInfoReadyCallback) {
                                this.userInfoReadyCallback(res)
                            }
                        }
                    })
                }
            }
        });

        console.log()
    },
    globalData: {
        pageHeight: wx.getSystemInfoSync().windowHeight,
        userInfo: null,
        messageList: [] //配置全局留言板列表数组
    },
   
    // 云接口对象
    cloudApi:{
        /**
         * 添加留言
         * @param {object} obj 留言数据对象 
         * @param {function} callback 添加成功后的回调函数
         */
        addComments:function(obj,callback){
            const db = wx.cloud.database();
            const tCursor = db.collection('comments');
            
            tCursor.add({
                data:obj
            }).then(res=>{
                callback();
            })
        },
        /**
         * 获取留言(包括评论)
         * @param {number} startIdx 开始索引
         * @param {number} limitNum 请求数据条数
         * @param {function} callback 回调函数(必填)
         */
        getComments:function(callback,startIdx,limitNum){
            let _this = this;
            let rData = [];
            const db = wx.cloud.database();
            const tCursor = db.collection('comments');
            if(typeof startIdx=='undefined'){
                tCursor.get().then(res=>{
                    // _this.getReviews
                    if(typeof callback=='function'){
                        callback(res.data.reverse());
                    }
                });
            }else if(typeof limitNum=='undefined'){
                rData = tCursor.skip(startIdx).get().then(res=>{
                    if(typeof callback=='function'){
                        callback(res.data.reverse());
                    }
                });
            }else{
                rData = tCursor.skip(startIdx).limit(limitNum).get().then(res=>{
                    if(typeof callback=='function'){
                        callback(res.data.reverse());
                    }
                });
            }
            
            return rData;
        },
        /**
         * 添加评论
         * @param {object} obj 评论数据对象 
         * @param {function} callback 添加成功后的回调函数
         */
        addReviews:function(obj,callback){
            const db = wx.cloud.database();
            const tCursor = db.collection('reviews');
            tCursor.add({
                data:{
                    cId:obj._id,
                    name:obj.name,
                    headImgUrl:obj.headImgUrl,
                    commentText: obj.commentText,
                    time: obj.time
                }
            }).then(res=>{
                callback();
            })
        },   

        /**
         * 获取留言(包括评论)
         * @param {number} startIdx 开始索引
         * @param {number} limitNum 请求数据条数
         * @param {function} callback 回调函数(必填)
         */
        getReivews:function(callback,startIdx,limitNum){
            let _this = this;
            let rData = [];
            const db = wx.cloud.database();
            const tCursor = db.collection('reviews');
            if(typeof startIdx=='undefined'){
                tCursor.get().then(res=>{
                    // _this.getReviews
                    if(typeof callback=='function'){
                        callback(res.data.reverse());
                    }
                });
            }else if(typeof limitNum=='undefined'){
                rData = tCursor.skip(startIdx).get().then(res=>{
                    if(typeof callback=='function'){
                        callback(res.data.reverse());
                    }
                });
            }else{
                rData = tCursor.skip(startIdx).limit(limitNum).get().then(res=>{
                    if(typeof callback=='function'){
                        callback(res.data.reverse());
                    }
                });
            }
            
            return rData;
        },
    }
})