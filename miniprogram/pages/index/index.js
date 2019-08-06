//index.js
import { $wuxToast } from '../../assets/wuxui/index'
//获取应用实例
const app = getApp()
Page({
    data: {
        pageHeight:app.globalData.pageHeight,
        commentBottomHeight:0,//评论框距离底部的距离
        commentValue:'', //评论内容
        commentIdx:-1,//评论留言索引
        completeBoolean:false, //去掉输入框完成
        commentVisible:false, //评论遮罩显隐
        userInfo: {},
        hasUserInfo: false,
        messageList: app.globalData.messageList, //私有页面list列表
        canIUse: wx.canIUse('button.open-type.getUserInfo')
    },
    //事件处理函数
    /**
     * [goWrite 跳转留言编辑页面]
     */
    goWrite: function (res) {
        console.log('哈哈哈哈------', res)
    
        if(res.detail.errMsg==="getUserInfo:ok"){
          app.globalData.userInfo = res.detail.userInfo
          wx.navigateTo({
             url: '../editor/editor'
          })
        }
    },
    
    /**
     * [showComment 显示评论遮罩层]
     */
    showComment:function(e){
        console.log(e)
        if(!this.data.commentVisible){
            if(e.currentTarget.dataset.idx == this.data.commentIdx){
                this.setData({
                    commentVisible:true,
                    commentIdx:e.currentTarget.dataset.idx,
                });
            }else{
                this.setData({
                    commentVisible:true,
                    commentIdx:e.currentTarget.dataset.idx,
                    commentValue:'', 
                });
            }
        }else{
            this.setData({
                commentVisible:false,
                commentBottomHeight:0,
            });
        }
    },

    /**
     * [setCommentPosition 动态设置评论输入框距离底部高度]
     */
    setCommentPosition:function(e){
        this.setData({
            commentBottomHeight:e.detail.height
        })
    },

    initCommentHeight:function(e){
        this.setData({
            commentBottomHeight:0
        });
    },
    /**
     * [addComment 提交评论]
     */
    addComment:function(e){
        if(this.data.commentValue=='') return;
        else{
            var timer = new Date();
            var self = this;
            var itemComment = {
                _id:app.globalData.messageList[self.data.commentIdx]._id,
                name:app.globalData.userInfo.nickName,
                headImgUrl: app.globalData.userInfo.avatarUrl,
                commentText: this.data.commentValue,
                time: timer.getTime(),
            }

            app.cloudApi.addReviews(itemComment,function(res){
                
                $wuxToast().show({
                    type: 'success',
                    duration: 800,
                    color: '#fff',
                    text: '评论成功',
                    success: () => {
                        app.globalData.messageList[self.data.commentIdx].reviews.unshift(itemComment);
                        self.setData({
                            commentValue:'',
                            messageList:app.globalData.messageList
                        })
                    }
                })
            })

            
        }
    },

    /**
     * [getCommentValue 获取评论的内容]
     */
    getCommentValue:function(e){
        this.setData({
            commentValue:e.detail.value
        });
    },


    onShow:function(){
        let _this = this;
        app.cloudApi.getComments(function(res){
            app.globalData.messageList = res;
            _this.setData({
                messageList:res
            });


            app.cloudApi.getReivews(function(res){
                var gList = app.globalData.messageList;
                for(let i=0;i<gList.length;i++){
                    var medArr = [];
                    for(let j=0;j<res.length;j++){
                        if(gList[i]._id===res[j].cId){
                            medArr.push(res[j]);
                        }
                    }
                    app.globalData.messageList[i].reviews = medArr;
                    

                    _this.setData({
                        messageList:app.globalData.messageList
                    });
                }
            })
        });
    },


    onLoad: function (options) {
        let _this = this;
        app.cloudApi.getComments(function(res){
            app.globalData.messageList = res;
            _this.setData({
                messageList:res
            });



            app.cloudApi.getReivews(function(res){
                var gList = app.globalData.messageList;
                for(let i=0;i<gList.length;i++){
                    var medArr = [];
                    for(let j=0;j<res.length;j++){
                        if(gList[i]._id===res[j].cId){
                            medArr.push(res[j]);
                        }
                    }
                    app.globalData.messageList[i].reviews = medArr;
                    

                    _this.setData({
                        messageList:app.globalData.messageList
                    });
                }
            })
        });









        if (app.globalData.userInfo) {
            this.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: true
            })
        } else if (this.data.canIUse) {
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            app.userInfoReadyCallback = res => {
                this.setData({
                    userInfo: res.userInfo,
                    hasUserInfo: true
                })
            }
        } else {
            // 在没有 open-type=getUserInfo 版本的兼容处理
            wx.getUserInfo({
                success: res => {
                    app.globalData.userInfo = res.userInfo
                    this.setData({
                        userInfo: res.userInfo,
                        hasUserInfo: true
                    })
                }
            })
        }
    }
})