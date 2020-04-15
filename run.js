// run.js
let utils = require('./utils.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    running:false,
    latitude:0,
    longitude:0,
    markers:[],
    meters:0.00,
    second:0,
  },
  onLoad(options){
    this.curLocation()
    let timer = setInterval(this.record,1000)

  },
  record(){
    if(!this.data.running){
      return
    }
    this.setData({
      second:this.data.second+1
    })
    wx.getLocation({
      type:'gcj02',
      success:(res)=> {
        //add point
        let newMarker = {
          latitude:res.latitude,
          longitude:res.longitude,
          iconPath:'redPoint.png',
        };
        let pace = 0
        let tmarkers = this.data.markers

        if(this.data.markers.length>0){
          let lastmarker = this.data.markers[this.data.markers.length-1]
          pace = utils.getDistance(lastmarker.latitude,lastmarker.longitude,newMarker.latitude,newMarker.longitude)
          if(pace<15){
            pace = 0
          }else{
            tmarkers.push(newMarker)
          }
        }else{
          tmarkers.push(newMarker)
        }
        this.setData({
          latitude: res.latitude,
          longitude: res.longitude,
          markers:tmarkers,
          meters:this.data.meters+pace,
        });
      },
    })
  },
  run:function(){
    this.setData({
      running:!this.data.running
    })
  },
  clear:function(){
    this.setData({
      markers:[],
      meters:0,
      second:0,
      running:false
    })
  },
  curLocation(){
    wx.getLocation({
      type:'gcj02',
      success: (res) =>{
        console.log("latitude:"+res.latitude)
        console.log("longitude:"+res.longitude)
        this.setData({
          latitude:res.latitude,
          longitude:res.longitude,
        })
      },
    })
  }
})