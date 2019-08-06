// pages/editor/editor.js
import { $wuxToptips,$wuxDialog } from '../../assets/wuxui/index'

//index.js
//获取应用实例
const app = getApp()
Page({
    data: {
        textValue:'',//编辑内容
        commitLock:true,//内容提交锁
    },
    
    // 获取editor文字
    getEditorValue:function(e){
        this.setData({
            textValue:e.detail.value
        });
    },

    // 提交编辑后的文字
    submitText:function(){
        const self = this;
        const timer = new Date();
        if(this.data.textValue===''){
            $wuxToptips().warn({
                hidden: false,
                text: '请先编辑文字',
                duration: 3000,
                success() {},
            })
            return;
        };
        if(this.data.commitLock){
            // 关锁
            this.setData({
                commitLock:false
            })
            const itemComments = {
                name: app.globalData.userInfo.nickName,
                headImgUrl: app.globalData.userInfo.avatarUrl,
                text: self.data.textValue,
                stars:0,
                time: timer.getTime(),
                reviews: []
            }
            app.globalData.messageList.unshift(itemComments);

            // 云对接函数
            app.cloudApi.addComments(itemComments,function(){
                $wuxToptips().success({
                    hidden: false,
                    text: '留言成功',
                    duration: 600,
                    success() {
                        // 开锁
                        self.setData({
                            commitLock:true
                        });
                        wx.navigateBack({
                            delta: 1
                        })
                    },
                })
            });            
        }
    },

    // 清空编辑框文字
    clearText:function(){
        if(this.data.textValue==='') return;
        const self = this;
        $wuxDialog().confirm({
            resetOnClose: true,
            closable: true,
            title: '',
            content: '确定清空内容？',
            onConfirm(e) {
                console.log('确定')
                self.setData({
                    textValue:''
                });
            },
            onCancel(e) {
                console.log('取消')

            },
        })
        
    },


    onLoad: function () {
        
    },
    onUnload:function(){
        
    }
})