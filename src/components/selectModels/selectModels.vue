<!--
 * @Author: 王亮
 * @Date: 2019-02-19 09:30:47
 * @LastEditors: 王亮
 * @LastEditTime: 2019-04-12 14:22:01
 * @Description: elementUI 三级选车插件
 -->
 <template>
  <!--选车组件 start -->
  <div class="selectCarModels">
    <!--品牌 start-->
    <el-select class="select"
               ref="master"
               v-model="masterId"
               filterable
               @change="masterChangeEvent($event)"
               :disabled="masterDisabled">
      <el-option :label="defaultMasterName"
                 :value="-10"></el-option>
      <!--循环 start-->
      <el-option-group v-for="group in dat.masterDat"
                       :key="group.label"
                       :label="group.label">

        <el-option v-for="(item,index) in group.options"
                   :key="index"
                   :label="item.label"
                   :value="item.value"></el-option>
      </el-option-group>
      <!--循环 end-->
    </el-select>
    <!--品牌 end-->
    <!--车型 start-->
    <el-select v-if="carEnabled"
               class="select"
               v-model="carId"
               @change="carChangeEvent($event)"
               :disabled="carDisabled">
      <el-option :label="defaultCarName"
                 :value="-10"></el-option>
      <el-option-group v-for="group in dat.carDat"
                       :key="group.brandId"
                       :label="group.brandName">
        <el-option v-for="item in group.serialList"
                   :key="item.serialId"
                   :label="item.serialName"
                   :value="item.serialId">
          <span class="select_title">{{ item.serialName }}</span>
          <span :class="item.saleStatus | saleStatusClassNameById(item.saleStatus)">{{ item.saleStatus | saleStatusNameById  }}</span>
        </el-option>
      </el-option-group>
    </el-select>
    <!--车型 end-->
    <!--车款 start-->
    <!-- <div class="models"
         v-if="modelsEnabled">
      <el-select class="select"
                 v-model="modelsId"
                 @change="modelsChangeEvent($event)"
                 :disabled="modelsDisabled">
        <el-option :label="defaultModelsName"
                   :value="-10"></el-option>
        <el-option-group v-for="group in dat.modelsDat"
                         :key="group.year"
                         :label="group.year + '款'">
          <el-option v-for="item in group.carList"
                     :key="item.carId"
                     :label="item.name"
                     :value="item.carId">
            <span class="select_title">{{ item.name }}{{ item.saleStatus }}</span>
            <span :class="item.saleStatus | saleStatusClassNameById(item.saleStatus)">{{ item.saleStatus }}</span>
          </el-option>
        </el-option-group>
      </el-select>
    </div> -->
    <!--车款 end-->
  </div>
  <!--选车组件 end -->
</template>
<script>

//公共方法类
import { getDataFun } from '@/utils/request.js'
export default {
  name: 'selectModels',
  data () {
    return {
      // 品牌ID
      masterId: -10,
      // 车型ID
      carId: -10,
      // 车款ID
      modelsId: -10,
      // 品牌对象
      master: null,
      // 车型对象
      car: null,
      // 车款对象
      models: null,
      //品牌默认ID
      dmasterId: -10,
      //车型默认ID
      dcarId: -10,
      //车款默认ID
      dmodelsId: -10,
      dat: {
        masterDat: [],
        carDat: [],
        modelsDat: []
      }
    }
  },
  props: {
    firstId: {
      type: Number,
      default: null
    },
    lastMasterId: {
      type: Number,

    },
    lastCarId: {
      type: Number,

    }, lastModelsId: {
      type: Number,

    },
    // 默认品牌ID
    defaultMasterId: {
      type: Number,
      default: -10
    },
    // 默认车型ID
    defaultCarId: {
      type: Number,
      default: -10
    },
    // 默认车款ID
    defaultModelsId: {
      type: Number,
      default: -10
    },
    // 品牌
    masterSource: {
      type: Function,
      //默认品牌获取品牌数据
      default: async function () {
        let url = process.env.selectCarBaseUrl + '/api/brand/getMasterBrandList'
        let dat = await getDataFun({ url, data: { allmasterbrand: false, source: 1, saleState: this.saleState } })
        return dat.data
      }
    },
    // 车型
    carSource: {
      type: Function,
      default: async function (masterId) {
        let url = process.env.selectCarBaseUrl + '/api/brand/getBrandList'
        var dat = await getDataFun({ url, data: { masterid: masterId, allserial: true, saleState: this.saleState } })
        return dat.data
      }
    },
    // 车款
    modelsSource: {
      type: Function,
      default: async function (carId) {
        let url = process.env.selectCarBaseUrl + '/api/brand/getCarInfoListGroupByYearAnExhaust'
        let dat = await getDataFun({ url, data: { csId: carId, cityId: 201, includeStopSale: true, saleState: this.saleState } })
        return dat.data
      }
    },
    // 默认品牌名称
    defaultMasterName: {
      type: String,
      default: '请选择品牌'
    },
    // 默认车型名称
    defaultCarName: {
      type: String,
      default: '请选择车型'
    },
    // 默认车型名称
    defaultModelsName: {
      type: String,
      default: '请选择车款'
    },
    // 是否显示
    carEnabled: {
      type: Boolean,
      default: true
    },
    // 是否显示
    modelsEnabled: {
      type: Boolean,
      default: true
    },
    //是否可用
    masterDisabled: {
      type: Boolean,
      default: false
    }, //是否可用
    carDisabled: {
      type: Boolean,
      default: false
    }, //是否可用
    modelsDisabled: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    /*******************************初始化方法 start****************************** */
    // 加载品牌数据
    async initMasterList () {
      let that = this
      // source: 类型（1车型所有数据2显示有图片的数据） status 销售状态（1：在销，2： 停销，4： 未上市（待销），3：在销+停销，5：在销+未上市 6：停销+未上市，7：所有,allBrands:是否显示所有品牌（默认为false，即返回不包含停销车型的主品牌）
      //获取品牌数据源
      let dat = await that.masterSource()
      // 从新组装品牌数据
      that.dat.masterDat = that.filterMasterData(dat)
    },
    // 加载车型数据
    async initCarList () {
      let that = this
      //获取车型数据源
      that.dat.carDat = await that.carSource(that.masterId)
    },
    // 加载车款数据
    async initModelsList () {
      let that = this
      //获取车款数据源
      let dat = await that.modelsSource(that.carId)
      that.dat.modelsDat = that.filterModelsData(dat)
    },
    /********************************初始化方法 end****************************** */
    /********************************事件 start********************************** */
    masterChangeEvent (ev) {
      let that = this
      // 清空车型集合
      that.dat.carDat = []
      // 清空车款集合
      that.dat.modelsDat = []
      // 判断是否有品牌ID
      that.master = { id: -10, name: that.defaultMasterName }
      that.carId = -10
      that.modelsId = -10
      //如果是事件选择就清掉默认值
      if (ev) {
        that.dmasterId = -10;
        that.dcarId = -10;
        that.dmodelsId = -10;
      }

      if (that.masterId >= 0) {
        let arr = []
        // 合并数组
        that.dat.masterDat.forEach(function (item) {
          arr = arr.concat(item.options)
        })
        // 获取选中品牌对象
        let { label, value } = arr.find((item) => item.value === that.masterId)
        // 统一返回属性
        that.master = { id: value, name: label }
        // 品牌ID为空跳过
        if (!that.master.id) return
        that.initCarList()
      }
      // 回调选品牌事件
      if (!ev) return
      that.$emit('masterChangeEvent', { master: that.master })
    },
    // 选择车型事件
    carChangeEvent (ev) {
      let that = this
      // 车型不启用跳过
      if (!that.carEnabled) return
      // 清空车款集合
      that.dat.modelsDat = []
      that.car = { id: -10, name: that.defaultCarName, status: -1 }
      that.modelsId = -10
      //如果是事件选择就清掉默认值
      if (ev) {
        that.dcarId = -10;
        that.dmodelsId = -10;
      }
      //如果车型集合为空跳出
      if (that.dat.carDat.length === 0) return
      // 判断是否有车型ID
      if (that.carId >= 0) {
        let arr = []
        // 合并数组
        that.dat.carDat.forEach(function (item) {
          arr = arr.concat(item.serialList)
        })

        let { serialId, serialName, saleStatus, brandId, brandName } = arr.find((item) => item.serialId === that.carId)
        // 统一返回属性
        that.car = { id: serialId, name: serialName, status: saleStatus, brandId: brandId, brandName: brandName }
        // 车型ID为空跳过
        if (!that.car.id) return

        that.initModelsList()
      }

      // 回调选车型事件
      if (!ev) return
      that.$emit('carChangeEvent', { master: that.master, car: that.car })
    },
    // 选择车款事件
    modelsChangeEvent (ev) {
      let that = this
      // 车款不启用跳过
      if (!that.modelsEnabled) return
      //如果车款集合为空跳出
      if (that.dat.modelsDat.length === 0) return
      // 判断是否有车款ID
      that.models = { id: -1, name: that.defaultModelsName, status: -1 }
      //如果是事件选择就清掉默认值
      if (ev) { that.dmodelsId = -10; }
      if (that.modelsId >= 0) {
        let arr = []
        // 合并数组
        that.dat.modelsDat.forEach(function (item) {
          arr = arr.concat(item.carList)
        })
        // 统一返回属性
        let { carId, name, saleStatus } = arr.find((item) => item.carId === that.modelsId)
        // 属性名称重置
        that.models = { id: carId, name: name, status: saleStatus }
      }
      // 回调选车款事件
      if (!ev) return
      that.$emit('modelsChangeEvent', { master: that.master, car: that.car, models: that.models })
    },
    // 重置选择器
    clearSelectFn () {
      let that = this
      that.masterId = -10
      that.carId = -10
      that.modelsId = -10
    },
    /********************************事件 end********************************** */
    /*************************附加方法 start ******************************* */
    /**
     * 品牌数据过滤器
     * @params data {array} 输入值
     * return {arry} 新结构数据
     */
    filterMasterData (data) {
      let groupArr = []
      if (!(data instanceof Array)) return groupArr
      // 获取分组[{label:'A',options:[]}]
      data.forEach(function (n, i) {
        if (!groupArr.some((item) => item.label === n.initial)) {
          groupArr.push({ label: n.initial, options: [] })
        }
      })
      // 根据分组获取数据[{label:'A',options:[{label:'奥迪'},{masterId:8}]}]
      let newGroup = groupArr.filter(function (item) {
        item.options = data.filter((n) => n.initial === item.label).map(function (n) {
          return { label: n.name, value: n.masterId }
        })
        return item
      })
      return newGroup
    },
    /**
  * 组装车款数据
  * @params data {array} 输入值
  * return {arry} 新结构数据
  */
    filterModelsData (data) {
      let groupArr = []
      if (!(data instanceof Array)) return groupArr
      data.forEach(function (item) {
        let carList = []
        item.yearList.forEach(function (itemYear) {
          itemYear.carList.forEach(function (itemCar) {
            carList.push({ carId: itemCar.carId, name: itemCar.name, saleStatus: itemCar.saleState })
          })
        })
        groupArr.push({ year: item.year, carList: carList })
      })
      return groupArr
    },
    //品牌监控
    watchMaster () {
      let that = this
      if (that.dmasterId === -10) return
      //检测ID是否存在
      let exists = (masterId) => {
        let arr = []
        // 合并数组
        that.dat.masterDat.forEach(function (item) {
          arr = arr.concat(item.options)
        })
        return arr.some((item) => { return item.value === masterId })

      }
      that.masterId = exists(that.dmasterId) ? that.dmasterId : -10
      // 如果有默认品牌ID那触发选择品牌事件
      if (Number(that.masterId) > 0) {
        that.masterChangeEvent()
      }
    },
    //车型监控
    watchCar () {
      let that = this
      if (that.dcarId === -10) return
      //检测ID是否存在
      let exists = (carId) => {
        let arr = []
        // 合并数组
        that.dat.carDat.forEach(function (item) {
          arr = arr.concat(item.serialList)
        })
        return arr.some((item) => { return item.serialId === carId })
      }
      that.carId = exists(that.dcarId) ? that.dcarId : -10
      // 如果有默认车型ID那触发选择车型事件
      if (Number(that.carId) > 0) {
        that.carChangeEvent()
      }
    },
    //车款监控
    watchModels () {
      let that = this
      if (that.dmodelsId === -10) return
      //检测ID是否存在
      let exists = (modelsId) => {
        let arr = []
        // 合并数组
        that.dat.modelsDat.forEach(function (item) {
          arr = arr.concat(item.carList)
        })
        return arr.some((item) => { return item.carId === modelsId })
      }
      that.modelsId = exists(that.dmodelsId) ? that.dmodelsId : -10
      // 如果有默认车款ID那触发选择车款事件
      if (Number(that.modelsId) > 0) {
        that.modelsChangeEvent()
      }
    }
    /*************************附加方法 end ******************************* */
  },
  /** **************************生命周期 start**************************** */

  created () {
    let that = this
    // 初始化品牌
    that.initMasterList()
    // console.log(this.lastMasterId, '我是子组件')
    // this.masterId = 1
    this.masterId = this.lastMasterId
    this.carId = this.lastCarId
    this.modelsId = this.lastModelsId
    that.initCarList()
    that.initModelsList()
    // this.masterSource(that.masterId)
    // this.carSource(that.masterId)
    // this.modelsSource(that.carId)


  },
  filters: {
    // 获取销售状态名称
    saleStatusNameById (v) {
      // 销售状态（-1:停销、0:待销、1:在销）
      let name = ''
      switch (v) {
        case -1:
          name = '停销'
          break
        case 0:
          name = '待销'
          break
        case 1:
          name = '在销'
          break
      }
      return name
    },
    // 获取销售状态样式
    saleStatusClassNameById (v) {
      let name = 'select_status'
      switch (v) {
        case -1:
        case '停销':
          name += ''
          break
        case 0:
        case '待销':
          name += ' future'
          break
        case 1:
        case '在销':
          name += ' sell'
          break
      }
      return name
    }
  },
  // 监听
  watch: {
    firstId (val) {
      console.log(val, 6666666)
      if (val == null) {
        this.carId = null
        this.masterId = null
      }

    },
    master (val) {
      if (val.id == -10) {
        console.log(val, 111)

        this.car.id = null
        this.master.id = null
        this.$emit('carChangeEvent', { master: this.master, car: this.car })
        // this.$emit('carChangeEvent',{})

      }
    },
    //品牌默认ID监控
    'defaultMasterId': {
      handler (newValue, oldValue) {
        let that = this
        that.dmasterId = that.defaultMasterId
        that.watchMaster()
      },
      immediate: true
    },
    // 监听品牌集合
    'dat.masterDat': {
      handler (newValue, oldValue) {
        let that = this
        that.watchMaster()
      }
    },
    //车型ID监控
    'defaultCarId': {
      handler (newValue, oldValue) {
        let that = this
        that.dcarId = that.defaultCarId
        that.watchCar()
      },
      immediate: true
    },
    // 监听车型集合
    'dat.carDat': {
      handler (newValue, oldValue) {
        let that = this
        that.watchCar()
      }
    },
    'defaultModelsId': {
      handler (newValue, oldValue) {
        let that = this
        that.dmodelsId = that.defaultModelsId
        that.watchModels()
      },
      immediate: true
    },
    // 监听车款集合
    'dat.modelsDat': {
      handler (newValue, oldValue) {
        let that = this
        that.watchModels()
      }
    }
  }
}
 </script>

<style lang="scss">
.selectCarModels {
  .models {
    display: inline-block;
    input {
      width: 195px;
    }
  }
}
</style>

<style lang="scss" scoped>
.select_title {
  float: left;
}
.select_status {
  float: right;
  padding-left: 20px;
  color: #f56c6c;
  font-size: 13px;
  &.sell {
    color: #409eff;
  }
  &.future {
    color: #67c23a;
  }
}
</style>



