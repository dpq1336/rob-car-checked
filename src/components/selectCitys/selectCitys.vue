<!--
 * @Author: 王亮
 * @Date: 2019-02-19 09:30:47
 * @LastEditors: 王亮
 * @LastEditTime: 2019-04-12 14:39:12
 * @Description: elementUI 二级城市控件
 -->
 <template>
    <!--城市组件 start -->
    <div class="selectCitys">
       <!--省份 start-->
       <el-select class="select" ref="master"  v-model="regionId" filterable @change="regionChangeEvent($event)" :disabled="regionDisabled">
          <el-option :label="defaultRegionName" :value="-10"></el-option>
          <!--循环 start-->
          <el-option-group v-for="(group,groupIndex) in dat.regionDat" :key="groupIndex" :label="group.label">
            <el-option v-for="(item,index) in group.options" :key="index" :label="item.label" :value="item.regionId"></el-option>
          </el-option-group>
           <!--循环 end-->
       </el-select>
       <!--省份 end-->
       <!--城市 start-->
       <el-select v-if="cityEnabled && selectCityEnabled"  class="select" v-model="cityRegionId" @change="cityChangeEvent($event)" :disabled="cityDisabled">
          <el-option :label="defaultCityName" :value="-10"></el-option>
          <el-option v-for="(item,index) in dat.cityDat" :key="index" :label="item.regionName" :value="item.regionId">
                <span class="select_title">{{ item.regionName }}</span>
          </el-option>
      </el-select>
      <!--城市 end-->
    </div>
    <!--城市组件 end -->
 </template>
<script>

//公共方法类
import { getDataFun } from '@/utils/request.js'

export default {
   name:'selectCitys',
   data(){
     return {
        // 省份ID
        regionId: -10,
        // 城市ID
        cityRegionId: -10,
        // 省份对象
        region: null,
        // 城市对象
        city: null,
        //默认省份ID
        dRid:-10,
        //默认城市ID
        dCid:-10,
        // 默认级联省份ID
        defaultRegionId:-10,
        //默认级联城市ID
        defaultRegionCityId:-10,
        //集合
        dat: {
          //省份集合
          regionDat: [],
          //城市集合
          cityDat: [],
        },
        //特殊处理 港 澳 台
        specialIds:[710000,810000,820000],
        //是否显示城市可用
        selectCityEnabled:true
     }

   },
   props: {
      //默认省份ID
      defaultRid:{
        type:Number,
        default: -10
      },
      // 默认省份名称
      defaultRegionName: {
        type:String,
        default: '请选择省份'
      },
      //默认城市ID
      defaultCid:{
         type:Number,
         default: -10
      },
      // 默认城市名称
      defaultCityName: {
        type:String,
        default: '请选择城市'
      },
      //省份数据源
      regionSource:{
         type: Function,
         default: async function(){
           //省份接口
           let url = '/api/citybase/city/subCity'
           let dat = await getDataFun({url,data:{ regionId:1000000 }})
           return dat.data
         }
      },
      //城市数据源
      citySource:{
        type: Function,
        default: async function(regionId){
           let url = '/api/citybase/city/subCity'
           let dat = await getDataFun({url,data:{ regionId:regionId }})
           return dat.data
        }
      },
      //是否显示
      cityEnabled:{
        type: Boolean,
        default: true
      },
      //是否禁用
      regionDisabled:{
        type: Boolean,
        default: false
      },
      //是否禁用
      cityDisabled:{
        type: Boolean,
        default: false
      }
   },
   methods:{
      /*************************初始化方法 start************************** */
      // 加载省份数据
      async initRegionList () {
          let that = this
          //获取省份数据源
          let dat = await that.regionSource()
          // 从新组装省份数据
          that.dat.regionDat = that.filterRegionData(dat)
       },
       //加载城市数据
       async initCityList(){
           let that = this
           //获取城市数据源
           let dat = await that.citySource(that.regionId)
           that.dat.cityDat = that.filterCityData(dat)
       },
      /***************************初始化方法 end*************************** */
      /*************************附加方法 start ******************************* */
       /**
       * 省份数据过滤器
       * @params data {array} 输入值
       * return {array} 新结构数据
       */
      filterRegionData(dat){
         let groupArr = []
         if (!(dat instanceof Array)) return groupArr
         //排序规则
         let sortRegion = (a,b) => { return  a.cityPinyin.localeCompare(b.cityPinyin)}
         //拼音排序
         dat.sort(sortRegion)

         //截取首字母规则
         let initialFn = (item) => {
           return item.cityPinyin.substr(0,1).toUpperCase()
         }
         //添加首字符字段
         dat = dat.map((item)=>{
           return Object.assign({initial:initialFn(item)},item)
         })

        // 获取分组[{label:'A',options:[]}]
        dat.forEach(function (n, i) {
          if (!groupArr.some((item) => item.label === n.initial)) {
            groupArr.push({label: n.initial, options: []})
          }
        })

        // 根据分组获取数据[{label:'B',options:[{label:'北京',id:2}]}]
        let newGroup = groupArr.filter(function (item) {
          item.options = dat.filter((n) => n.initial === item.label).map(function (n) {
            return { label: n.regionName, value: Number(n.cityId), regionId:Number(n.regionId)}
          })
          return item
        })
        return newGroup
      },
      //城市过滤
      filterCityData(dat){
         if(!(dat instanceof Array)) return []
          //添加首字符字段
         dat = dat.map((item)=>{
           item.cityId = Number(item.cityId)
           item.regionId = Number(item.regionId)
           return item
         })
         return dat
      },
      /*************************附加方法 end ******************************* */
      /********************************事件 start******************************** */
      //省份改变事件
      regionChangeEvent (ev) {
        let that = this
        //清空城市集合
        that.dat.cityDat = []
        that.region = { id: -10, name: that.defaultRegionName}
        that.cityRegionId = -10
         //如果是事件选择就清掉默认值
        if(ev){
          that.dRid = -10
          that.dCid = -10
        }
        //判断是否有省份ID
        if (that.regionId >= 0) {
           let arr = []
           // 合并数组
           that.dat.regionDat.forEach(function (item) {
              arr = arr.concat(item.options)
           })
           // 获取选中品牌对象
           let {label, value} = arr.find((item) => item.regionId === that.regionId)

           // 统一返回属性
           that.region = {id: value, name: label}
           // 省份ID为空跳过
           if (!that.region.id) return
           if(that.specialIds.includes(that.region.id)){
              that.selectCityEnabled = false
              that.selectCityEnabled = true
              that.dat.cityDat.push({
                regionName : that.region.name,
                regionId : Number(that.region.id),
                cityId : Number(that.region.id)
              })
           }else{
              //调用城市初始化
              that.initCityList()
              that.selectCityEnabled = true
           }

        }
        // 回调选车型事件
        if (!ev) return
        //是否显示城市选择框 港澳台不出二级选择框
        if(that.cityEnabled && that.selectCityEnabled){
            // 回调选省份事件
            that.$emit('regionChangeEvent', { region: that.region })
        }else{
            //选择城市事件
            that.$emit('cityChangeEvent', { region: that.region, city: that.region })
        }

      },
      //城市改变事件
      cityChangeEvent(ev){
         let that = this
         // 城市是否启用
         if (!that.cityEnabled) return
         that.city = {id: -10, name: that.defaultCityName }
          //如果是事件选择就清掉默认值
        if(ev){
          that.dCid = -10;
        }
        // 判断是否有城市ID
        if (that.cityRegionId >= 0) {
          let {cityId, regionName, regionId } = that.dat.cityDat.find((item) => item.regionId === that.cityRegionId)
          // 统一返回属性
          that.city = { id:cityId, name:regionName }
        }
        // 回调选车型事件
        if (!ev) return
        that.$emit('cityChangeEvent', { region: that.region, city: that.city })
      },
      // 重置选择器
      clearSelectFn () {
        let that = this
        that.regionId = -10
        that.cityRegionId = -10
        that.dat.cityDat = []
      },
      //监控改变省份方法
      watchRegion(){
           let that = this

           let regionIdHandle = (dRid) =>{

              let arr = []
              // 合并数组
              that.dat.regionDat.forEach(function (item) {
                  arr = arr.concat(item.options)
              })
              //检测ID是否存在
              if(!arr.some((item)=> { return item.value === dRid})) return -10
              //查询关联省份ID
              let current = arr.find((item)=>{ return item.value === dRid })
              if(!current) return -10
              return current.regionId
           }
           //如果defaultRid大于0 那么转换一下级联省份ID
           that.regionId =  that.dRid > 0 ? regionIdHandle(that.dRid): that.defaultRegionCityId

           // 如果有默认省份就触发选择品牌事件
           if (that.regionId > 0) {
              that.regionChangeEvent()
           }
      },
      //监控改变城市方法
      watchCity(){
        let that = this
        let cityIdHandle = (dCid) =>{
            //查询关联城市ID
            let current = that.dat.cityDat.find((item)=>{ return item.cityId === dCid})
            if(!current) return -10
            return current.regionId
        }
        //如果defaultCid大于0 那么转换一下级联城市ID
        that.cityRegionId = that.dCid > 0 ? cityIdHandle(that.dCid): that.defaultRegionCityId

        // 如果有默认城市就触发选择品牌事件
        if (that.cityRegionId > 0) {
          that.cityChangeEvent()
        }
      }
      /********************************事件 end********************************** */
   },
   /** **************************生命周期 start**************************** */
   created () {
      let that = this
      // 初始化省份
      that.initRegionList()
   },
   watch: {
      //默认省份ID监控
      'dat.regionDat':function(){
         let that = this;
         that.watchRegion()
      },
      'dat.cityDat':function(){
        let that = this;
        that.watchCity()
      },
      //省份集合监控
      'defaultRid':{
        handler(newValue,oldValue){
           let that = this;
           that.dRid = that.defaultRid
           that.watchRegion()
        },
        immediate:true
      },
      //城市集合监控
      'defaultCid':{
         handler(newValue,oldValue){
            let that = this;
            that.dCid = that.defaultCid
            that.watchCity()
         },
         immediate:true
      }
   }

   /** **************************生命周期 end**************************** */
 }
 </script>

<style lang="scss">
  .selectCitys {
    .models{
        display: inline-block;
        input{ width:300px; }
    }
  }
</style>

<style lang="scss" scoped>
  .select_title { float: left; }
  .select_status {
    float: right;
    padding-left:20px;
    color: #f56c6c;
    font-size: 13px;
    &.sell{
      color: #409EFF
    }
    &.future {
      color: #67c23a
    }
  }
</style>



