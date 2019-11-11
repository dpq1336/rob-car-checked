<template>
  <div class="main-box">
    <!-- 标签模块 -->
    <div class="current-position">&nbsp;当前位置：<span @click="back">{{this.firstTitle}}</span> >图片列表 <el-button size="mini"
                 @click="back"
                 style="transform:translateX(100px);">返回</el-button>
    </div>
    <!-- 标签模块 -->
    <!-- 详情模块 -->
    <el-row style="margin-left:10px; position: relative; padding-top:10px;margin-bottom:20px;margin-top:50px">
      <el-col :span="9">
        <div style="margin-bottom:5px">
          <span>经销商：{{dealerName}}</span>
          <span style="display:inline-block;transform: translateX(100px);">拍摄场景：{{scene}}</span>

        </div>
        <div>
          运营标题：{{title}}
        </div>
      </el-col>
      <el-col :span="7">
        <el-button type="primary"
                   class="pass"
                   size="small"
                   @click="dialogFormVisible = true"
                   :style="{display:status==3?'block':'none'}">通过</el-button>
        <el-dialog title="确认审核通过吗，请确认图集的默认状态"
                   :visible.sync="dialogFormVisible">
          <!-- <el-form :model="form">
          <el-form-item label="活动名称"
                        :label-width="formLabelWidth">
            <el-input v-model="form.name"
                      autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="活动区域"
                        :label-width="formLabelWidth">
            <el-select v-model="form.region"
                       placeholder="请选择活动区域">
              <el-option label="区域一"
                         value="shanghai"></el-option>
              <el-option label="区域二"
                         value="beijing"></el-option>
            </el-select>
          </el-form-item>
        </el-form> -->
          <el-radio v-model="isPublish"
                    label="1">未发布</el-radio>
          <el-radio v-model="isPublish"
                    label="2">已发布</el-radio>
          <div slot="footer"
               class="dialog-footer">

            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary"
                       @click="handlePass">确 定</el-button>
          </div>
        </el-dialog>

        <el-button type="danger"
                   class="nopass"
                   size="small"
                   @click="handleUnpass"
                   :style="{display:status==3?'block':'none'}">不通过</el-button>
      </el-col>
      <el-col :span="8">
        <el-tag class="check-status"
                :type="status==3?'danger':'info'">{{status==3?'未审核':'审核已通过'}}</el-tag>
      </el-col>
      <!-- <div style="margin-left:10px; position: relative; padding-top:10px;margin-bottom:20px;margin-top:50px">

      </div> -->
    </el-row>
    <!-- 详情模块 -->
    <!-- 图片展示模块 -->
    <el-tabs type="card"
             v-model="value"
             @tab-click="handleClick">
      <el-tab-pane label="
             全部">
        <el-row>
          <el-col :span="2.8"
                  v-for="item in detailsData.imageList"
                  :key="item.photoId"
                  :offset="item.index== 1||item.index%8==0 ? 0 : 1">
            <el-card :body-style="{ padding: '0px'}"
                     class="card">
              <a :href="item.photoUrl"
                 target="_blank"><img :src="item.photoUrl"
                     class="image"></a>

              <div style="padding: 5px;padding-top:10px;padding-bottom:0px;">
                <!-- <span>好吃的汉堡</span> -->
                <div style="font-size:10px;margin-bottom:5px;margin-top:5px">上传者：{{item.uploadUserName}}</div>
                <div style="font-size:10px;margin-bottom:5px">权重：{{item.weight}}</div>
                <div style="font-size:10px;margin-bottom:5px;overflow:hidden;height:12px">位置：{{item.positionName}}</div>
                <div style="font-size:10px;margin-bottom:5px">时间：{{item.createTime}}</div>
                <div class="bottom clearfix">

                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <el-pagination background
                       layout="prev, pager, next"
                       :total="allTotal"
                       style="margin-top:20px"
                       :current-page="detailPage"
                       @current-change="handlePage"
                       :page-size="pageSize">
        </el-pagination>
      </el-tab-pane>
      <el-tab-pane :label="`外观（${outTotal}张）`">
        <el-row>
          <el-col :span="2.8"
                  v-for="item in detailsData.imageList"
                  :key="item.photoId"
                  :offset="item.index== 1||item.index%8==0 ? 0 : 1">
            <el-card :body-style="{ padding: '0px'}"
                     class="card">
              <a :href="item.photoUrl"
                 target="_blank"><img :src="item.photoUrl"
                     class="image"></a>
              <div style="padding: 5px;padding-top:10px;padding-bottom:0px;">
                <!-- <span>好吃的汉堡</span> -->
                <div style="font-size:10px;margin-bottom:5px;margin-top:5px">上传者：{{item.uploadUserName}}</div>
                <div style="font-size:10px;margin-bottom:5px">权重：{{item.weight}}</div>
                <div style="font-size:10px;margin-bottom:5px;overflow:hidden;height:12px">位置：{{item.positionName}}</div>
                <div style="font-size:10px;margin-bottom:5px">时间：{{item.createTime}}</div>
                <div class="bottom clearfix">

                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <el-pagination background
                       layout="prev, pager, next"
                       :total="outTotal"
                       style="margin-top:20px"
                       :current-page="detailPage"
                       @current-change="handlePage"
                       :page-size="pageSize">
        </el-pagination>
      </el-tab-pane>
      <el-tab-pane :label="`前排（${frontTotal}张）`">
        <el-row>
          <el-col :span="2.8"
                  v-for="item in detailsData.imageList"
                  :key="item.photoId"
                  :offset="item.index== 1||item.index%8==0 ? 0 : 1">
            <el-card :body-style="{ padding: '0px'}"
                     class="card">
              <a :href="item.photoUrl"
                 target="_blank"><img :src="item.photoUrl"
                     class="image"></a>
              <div style="padding: 5px;padding-top:10px;padding-bottom:0px;">
                <!-- <span>好吃的汉堡</span> -->
                <div style="font-size:10px;margin-bottom:5px;margin-top:5px">上传者：{{item.uploadUserName}}</div>
                <div style="font-size:10px;margin-bottom:5px">权重：{{item.weight}}</div>
                <div style="font-size:10px;margin-bottom:5px;overflow:hidden;height:12px">位置：{{item.positionName}}</div>
                <div style="font-size:10px;margin-bottom:5px">时间：{{item.createTime}}</div>
                <div class="bottom clearfix">

                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <el-pagination background
                       layout="prev, pager, next"
                       :total="frontTotal"
                       style="margin-top:20px"
                       :current-page="detailPage"
                       @current-change="handlePage"
                       :page-size="pageSize">
        </el-pagination>
      </el-tab-pane>
      <el-tab-pane :label="`后排（${behindTotal}张）`">
        <el-row>
          <el-col :span="2.8"
                  v-for="item in detailsData.imageList"
                  :key="item.photoId"
                  :offset="item.index== 1||item.index%8==0 ? 0 : 1">
            <el-card :body-style="{ padding: '0px'}"
                     class="card">
              <a :href="item.photoUrl"
                 target="_blank"><img :src="item.photoUrl"
                     class="image"></a>
              <div style="padding: 5px;padding-top:10px;padding-bottom:0px;">
                <!-- <span>好吃的汉堡</span> -->
                <div style="font-size:10px;margin-bottom:5px;margin-top:5px">上传者：{{item.uploadUserName}}</div>
                <div style="font-size:10px;margin-bottom:5px">权重：{{item.weight}}</div>
                <div style="font-size:10px;margin-bottom:5px;overflow:hidden;height:12px">位置：{{item.positionName}}</div>
                <div style="font-size:10px;margin-bottom:5px">时间：{{item.createTime}}</div>
                <div class="bottom clearfix">

                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <el-pagination background
                       layout="prev, pager, next"
                       :total="behindTotal"
                       style="margin-top:20px"
                       :current-page="detailPage"
                       @current-change="handlePage"
                       :page-size="pageSize">
        </el-pagination>
      </el-tab-pane>
    </el-tabs>
    <!-- 图片展示模块 -->

  </div>
</template>
<script>
import { getDataFun, postDataFun } from '@/utils/request.js'
export default {
  watch: {
    //监听tab选项栏
    value (val) {
      switch (val) {
        case '0':
          this.groupId = null;
          // this.$emit('tab', null);
          break;
        case '1':
          this.groupId = 6;

          // this.$emit('tab', 6);
          break;
        case '2':
          this.groupId = 7;

          // this.$emit('tab', 7);
          break;
        case '3':
          this.groupId = 8;

          // this.$emit('tab', 8);
          break;
      }
      this.detailPage = 1
      this.handleDetail()
    },
    isPublish (val) {
      if (val == '2') {
        this.isPublishId = 1
      } else {
        this.isPublishId = 0
      }
    }

  },
  data () {
    return {
      // dialogTableVisible: false,
      value: null,   //未通过原因
      groupId: null, //当前tab选项id值
      detailPage: 1, //当前页码
      allTotal: 1000, //全部总数
      outTotal: 1000, //外观总数
      frontTotal: 1000, //前排总数
      behindTotal: 1000,//后排总数
      //审核图集详情数据
      detailsData: {},
      pageSize: 100,    //每页显示条数
      dialogFormVisible: false,  //控制通过弹层
      isPublish: '2',   //审核通过发布选择
      isPublishId: 1,    //审核通过发布ID
      dealerName: '',   //经销商名字
      scene: null,      //拍摄场景
      title: '',        //运营标题
      userId: null,
      userName: ''
    }
  },
  props: {
    // //detail显示隐藏
    // show: {
    //   type: [Boolean],
    //   default: true
    // },
    //图集id
    albumId: {
      type: Number,
      default: null
    },
    // 图集状态
    status: {
      type: Number,
      default: 3

    },
    // 父子组件切换显示函数
    isShow: {
      type: Function,

    },
    //展示待审核图集
    handlePendingImageCollection: {
      type: Function,

    },
    taskCode: {
      type: String
    },
    firstTitle: {
      type: String

    }


  },
  created () {
    this.userId = JSON.parse(localStorage.getItem('userData')).user.userId
    this.userName = JSON.parse(localStorage.getItem('userData')).user.trueName
    console.log(this.userId, this.taskCode, this.userName, 666)
  },
  methods: {
    //图集详情列表
    async handleDetail () {
      // console.log(JSON.parse(localStorage.getItem('userData').user.userId), this.taskCode, 4444444)

      console.log(this.status, 'aaaa')
      try {
        var arg = { url: '/yipaimanager/check/checkPhotoListWithAlbum', data: { albumId: this.albumId, groupId: this.groupId, checkState: this.status, pageSize: this.pageSize, pageNumber: this.detailPage } };
        var res = await getDataFun(arg)
        // this.detailsData = res.data
        // console.log(this.detailsData, 12345)
        var a = res.data
        console.log(a)
        for (var i = 0; i < a.imageList.length; i++) {
          var str1 = a.imageList[i].photoUrl.split("_")[0];
          // console.log(str1,12345678)
          var str2 = a.imageList[i].photoUrl.split("_")[2].split(".")[1];
          var url = str1.concat(".", str2);
          a.imageList[i].photoUrl = url;
        }
        this.detailsData = a
        this.allTotal = this.detailsData.total.outside + this.detailsData.total.front + this.detailsData.total.behind
        this.outTotal = this.detailsData.total.outside
        this.frontTotal = this.detailsData.total.front
        this.behindTotal = this.detailsData.total.behind
        this.dealerName = this.detailsData.header.dealerName
        console.log(this.detailsData.header.scene, 111)
        switch (this.detailsData.header.scene) {
          case '1':
            this.scene = '室外全套'
            break;
          case '2':
            this.scene = '室外补色'
            break;
          case '3':
            this.scene = '室内'
            break

        }


        this.title = this.detailsData.header.title

      } catch (err) {
        console.log(err)
      }
      // console.log(id)
    },

    handleClick (tab, event) {
      // console.log(tab);
      console.log(this.value)
    },
    //返回子组件函数
    back () {
      this.isShow()
      // this.show = false;
      // // console.log(this.show)
      // this.$emit('show', false)
    },
    //审核通过函数
    async handlePass () {
      this.dialogFormVisible = false
      try {
        var arg = { url: '/yipaimanager/album/checkAlbum', data: { albumId: this.albumId, checkState: 1, isPublish: this.isPublishId, userId: this.userId, taskCode: this.taskCode, userName: this.userName } };

        var res = await postDataFun(arg)
        // this.datilsData=res.data
        console.log(arg, res, 12345678)
        if (res.status == 1) {
          this.$message({
            type: 'success',
            message: '审核通过!'
          });
          this.back()
          this.handlePendingImageCollection()
        } else {
          this.$message({
            type: 'warning',
            message: '审核失败!'
          });
        }
      } catch (err) {
        console.log(err)
      }
    },
    //审核不通过
    handleUnpass () {
      this.$prompt('不通过的理由', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        // inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
        // inputErrorMessage: '邮箱格式不正确'
      }).then(({ value }) => {
        console.log(value)
        var arg = { url: '/yipaimanager/album/checkAlbum', data: { albumId: this.albumId, checkState: 0, isPublish: 0, remarks: value, userId: this.userId, taskCode: this.taskCode, userName: this.userName } };
        postDataFun(arg).then((res) => {
          console.log(res)
          if (res.status == 1) {
            this.$message({
              type: 'success',
              message: '提交成功'
            });
            this.back()
            this.handlePendingImageCollection()          } else {
            this.$message({
              type: 'warning',
              message: '提交失败'
            });
          }
        })


      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        });
      });
    },
    //分页功能
    handlePage (val) {
      console.log(val)
      this.detailPage = val
      this.handleDetail()
    }

  },

}
</script>
<style lang="scss" scoped>
.current-position {
  height: 50px;
  background-color: #ddd;
  line-height: 50px;
  transform: translateY(-10px);
  position: fixed;
  z-index: 999;
  width: 100%;
  // margin-bottom: 50px;
}
.check-status {
  position: absolute;
  top: 0;
  right: 270px;
  width: 200px;
  height: 60px;
  text-align: center;
  line-height: 60px;
  font-size: 25px;
}
.pass {
  position: absolute;
  left: 45%;
  top: 15px;
  width: 68px;
}
.nopass {
  position: absolute;
  // left: 750px;
  top: 15px;
}
.time {
  font-size: 13px;
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
}

.button {
  padding: 0;
  float: right;
}

.image {
  width: 150px;
  height: 100px;
  display: block;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both;
}
.card {
  // float: left;
  width: 150px;
  margin-bottom: 20px;
}
</style>
