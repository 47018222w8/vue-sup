<template>
  <div ref="part" class="c-part">
    <x-header :left-options="{preventGoBack:true,showBack:false}" :right-options="{showMore:false}" title="报价">
      <div slot="overwrite-left" @click="back">
        <i slot="icon" class="fa fa-chevron-left fa-lg"></i>
      </div>
    </x-header>
    <tab class="c-cell" active-color="#2196f3" v-model="tabIndex">
      <tab-item index="0" selected>零件</tab-item>
      <tab-item index="1">车辆信息</tab-item>
    </tab>
    <group gutter="0" class="c-cell" v-show="tabIndex===1">
      <!-- <swiper v-if="insImgList.length>0" :list="insImgList" height="180px" dots-class="custom-bottom" dots-position="center"></swiper> -->
      <cell title="品牌" :value="carInfoTitle"></cell>
      <cell-form-preview :list="carInfo"></cell-form-preview>
      <img v-for="(item, index) in insImgList" :src="item.img" width="100" :key="index" @click="showInsImg(index)">
    </group>
    <div class="parts" v-show="tabIndex===0" ref="parts">
      <template v-if="reportPriceList.length>0">
        <div class="c-body">
          <ul class="c-left">
            <li class="c-li" :class="cLeftIndex===index?'c-active':''" v-for="(info,index) in reportPriceList" :key="info.id" @click="savePart(index)">
              <p style="padding-right:4px;">
                <i v-show="info.done === 1" class="fa fa-check fa-primary s-badge"></i>
                <i v-show="info.done === 2" class="fa fa-check fa-times s-badge"></i>
                <badge v-show="info.done === 0"></badge>
                <span style="padding-left:5px;">{{info.name}}</span>
              </p>
            </li>
          </ul>
          <scroll ref="scrollRight" class="c-right" :data="reportPriceList[cLeftIndex].listRPI">
            <div>
              <group gutter="0" class="groupClass" v-for="(rpi,index) in reportPriceList[cLeftIndex].listRPI" :key="index" label-width="4.5em" label-margin-right="2em" label-align="right">
                <popup-picker @on-show="qualityShow(index)" @on-change="changeQuality(index)" :data="qualityList" v-model="rpi.qrArry" :columns="1" title="零件品质" value-text-align="left" show-name></popup-picker>
                <cell value-align="left" title="相关图片" :value="reportPriceList[cLeftIndex].imgPriviewList.length?'点击查看':'此零件没有图片'" is-link @click.native="showPartImg(cLeftIndex)"></cell>
                <x-input @on-focus="onFocus(index)" title="金额" v-model="rpi.reportPrice" type="number"></x-input>
                <x-textarea style="padding-bottom: 0;" title="备注" v-model="rpi.remark" :show-counter="false" :rows="3" :max="100"></x-textarea>
                <div style="text-align: center;padding-top: 5px;padding-bottom:5px;">
                  <x-button mini v-if="index!==0" @click.native="delMoreQuality(index)" type="warn">删除此品质报价</x-button>
                </div>
              </group>
              <div style="text-align: center;margin: 5px 0 10px 0;">
                <x-button @click.native="addMoreQuality" plain mini>提供更多品质报价</x-button>
              </div>
              <br>
            </div>
          </scroll>
        </div>
        <div class="s-footer-btn">
          <x-button style="width:80%" v-show="tabIndex===0" :disabled="subLoading" :show-loading="subLoading" @click.native="subForm" type="primary">核对报价</x-button>
        </div>
      </template>
    </div>
    <!--零件图片预览-->
    <div v-transfer-dom>
      <previewer :list="imgPriviewList" ref="previewer"></previewer>
    </div>
  </div>
</template>

<script>
  import { XHeader, Spinner, XButton, Step, StepItem, GroupTitle, Badge, Swiper, TransferDom, CellFormPreview, Flexbox, FlexboxItem, XTextarea, XInput, Datetime, Selector, PopupPicker, Cell, Group, Tab, TabItem, Previewer } from 'vux'
  import { RE_MONEY } from '@/components/constant'
  import { REPORT_PRICE_LIST } from '@/store/mutation-type'
  import scroll from '@/components/scroll'
  export default {
    directives: {
      TransferDom
    },
    data() {
      return {
        irpe: {
          insId: this.$route.params.insId,
          expressMoney: 0,
          taxRate: 0,
          canShipDateBsStr: null
        },
        reportPriceList: [], // 零件信息
        iilKey: 'reportPriceList' + this.$route.params.insId, // 本地存储key
        qualityList: [], // 零件品质
        carInfo: [], // 车辆信息
        carInfoTitle: '',
        tabIndex: 0, // tab索引
        cLeftIndex: 0, // menu索引
        imgPriviewList: [], // 询价单图片信息
        insImgList: [], // 询价单图片信息
        partInfosHeight: [], // 右边零件高度
        subLoading: false, // 提交等待
        isAndroid: null, // 是否是安卓
        qualityC: null, // 弹出时零件品质
        isOperProdList: [
          {
            value: '0', // 沃日,show-name只能用string
            name: '经营',
            parent: 0
          }, {
            value: '1',
            name: '不经营',
            parent: 0
          }]// 是否经营
      }
    },
    created() {
      this._initData()
      let u = navigator.userAgent
      this.isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1
    },
    mounted() {

    },
    computed: {
      imgValue() {

      }
    },
    methods: {
      // 初始化数据
      async _initData() {
        await this.$http.get('/insruances/' + this.irpe.insId, { params: { state: '0' } }).then((response) => {
          let quote = response.data
          // 零件品质
          let qualityList = quote.qualityList
          for (let i = 0; i < qualityList.length; i++) {
            this.qualityList.push({
              value: String(qualityList[i].id), // 沃日,show-name只能用string
              name: qualityList[i].propertyName,
              parent: 0
            })
          }
          // 零件列表
          let reportPriceList = localStorage.getItem(this.iilKey)
          if (reportPriceList) {
            reportPriceList = JSON.parse(reportPriceList)
          } else {
            reportPriceList = quote.reportPriceList
            for (let i = 0; i < reportPriceList.length; i++) {
              let listRPI = [{
                canShipDateBsStr: '2017-01-01 01',
                reportPrice: null,
                qrArry: [this.qualityList[0].value], // 坑爹的数组 vmodel的是数组,需要自己在转为要提交的格式
                qualityRequirement: this.qualityList[0].value,
                remark: null
              }]
              reportPriceList[i].imgPriviewList = []
              reportPriceList[i].img && reportPriceList[i].imgPriviewList.push({ src: quote.domain + reportPriceList[i].img, w: 600, h: 400 })
              reportPriceList[i].img1 && reportPriceList[i].imgPriviewList.push({ src: quote.domain + reportPriceList[i].img1, w: 600, h: 400 })
              reportPriceList[i].img2 && reportPriceList[i].imgPriviewList.push({ src: quote.domain + reportPriceList[i].img2, w: 600, h: 400 })
              reportPriceList[i].img3 && reportPriceList[i].imgPriviewList.push({ src: quote.domain + reportPriceList[i].img3, w: 600, h: 400 })
              reportPriceList[i].img4 && reportPriceList[i].imgPriviewList.push({ src: quote.domain + reportPriceList[i].img4, w: 600, h: 400 })
              reportPriceList[i].iopArry = [1] // 1为不经营
              reportPriceList[i].isOperProd = this.isOperProdList[0].value
              reportPriceList[i].done = 0 // 0:不经营 1:已完成 2:格式错误
              reportPriceList[i].listRPI = listRPI
            }
          }
          this.reportPriceList = reportPriceList
          // 询价单信息
          let ins = quote.ins
          ins.rearImg && this.insImgList.push({
            img: quote.domain + ins.rearImg,
            title: '车尾照片'
          })
          ins.frontImg && this.insImgList.push({
            img: quote.domain + ins.frontImg,
            title: '车头照片'
          })
          ins.driveLicense && this.insImgList.push({
            img: quote.domain + ins.driveLicense,
            title: '行车证照片'
          })
          this.irpe.insNo = ins.insNo
          this.irpe.repairName = ins.entMemberName
          this.irpe.carNo = ins.carNo
          this.irpe.carMark = ins.carMark
          this.irpe.arriveTimeStr = ins.arriveTimeStr
          this.irpe.isInvoice = ins.isInvoice
          this.carInfoTitle = ins.carBrandName
          this.carInfo.splice(0, 0, { label: '车型', value: ins.carMark },
            {
              label: '车牌号',
              value: ins.carNo ? ins.carNo : '无'
            }, {
              label: '单号',
              value: ins.insNo
            }, {
              label: 'vin',
              value: ins.vin === '00000000000000000' ? '无' : ins.vin
            }, {
              label: '到货时间',
              value: ins.arriveTimeStr
            }, {
              label: '修理厂',
              value: ins.entMemberName
            }, {
              label: '地址',
              value: ins.address
            }, {
              label: '是否需要发票',
              value: ins.isInvoice === 1 ? '需要' : '不需要'
            })
        })
        this._calculateHeight()
      },
      // 显示零件图片
      showPartImg(index) {
        this.blur
        if (this.reportPriceList[index].imgPriviewList.length > 0) {
          this.imgPriviewList = this.reportPriceList[index].imgPriviewList
          this.$nextTick(() => {
            this.$refs.previewer.show(0)
          })
        } else {
          this.$vux.toast.text('此零件没有图片', 'bottom')
        }
      },
      // 询价单图片
      showInsImg(index) {
        this.imgPriviewList = []
        console.log(this.insImgList)
        this.insImgList.forEach(item => this.imgPriviewList.push({ src: item.img, w: 600, h: 400 }))
        this.$nextTick(() => {
          this.$refs.previewer.show(index)
        })
      },
      // 验证是否完成
      validateDone(index) {
        let rpi = this.reportPriceList[index].listRPI
        if (rpi.length === 1 && !rpi[0].reportPrice) {
          // 不经营
          this.reportPriceList[index].isOperProd = '1'
          this.reportPriceList[index].done = 0
        } else {
          this.reportPriceList[index].isOperProd = '0'
          // 验证成功
          this.reportPriceList[index].done = 1
          for (let i = 0; i < rpi.length; i++) {
            if (!RE_MONEY.test(rpi[i].reportPrice) || !rpi[i].qualityRequirement) {
              // 验证失败
              this.reportPriceList[index].done = 2
              break
            }
          }
        }
      },
      // 选择零件时保存数据
      savePart(index) {
        this.validateDone(this.cLeftIndex)
        this._calculateHeight()
        this.cLeftIndex = index
        localStorage.setItem(this.iilKey, JSON.stringify(this.reportPriceList))
      },
      // 返回
      back() {
        this.$router.go(-1)
      },
      // 提供更多品质报价
      addMoreQuality() {
        if (this.reportPriceList[this.cLeftIndex].listRPI.length < this.qualityList.length) {
          let qrValue = null
          for (let i = 0; i < this.qualityList.length; i++) {
            let f = true
            this.reportPriceList[this.cLeftIndex].listRPI.forEach((item) => {
              if (item.qrArry[0] === this.qualityList[i].value) {
                f = false
              }
            })
            if (f) {
              qrValue = this.qualityList[i].value
              break
            }
          }
          this.reportPriceList[this.cLeftIndex].listRPI.push({
            canShipDateBsStr: null,
            reportPrice: null,
            qrArry: [qrValue],
            qualityRequirement: this.qualityList[0].value,
            remark: null
          })
        } else {
          this.$vux.toast.text('无法添加更多品质', 'bottom')
        }
        setTimeout((e) => {
          this._calculateHeight()
        }, 150)
      },
      // 删除品质报价
      delMoreQuality(index) {
        this.reportPriceList[this.cLeftIndex].listRPI.splice(index, 1)
        setTimeout((e) => {
          this._calculateHeight()
        }, 150)
      },
      // 修改一个品质时,检查是否其它品质已有此品质,如有,则提示,并不修改
      changeQuality(index) {
        for (let i = 0; i < this.reportPriceList[this.cLeftIndex].listRPI.length; i++) {
          let item = this.reportPriceList[this.cLeftIndex].listRPI[i]
          if (i !== index && item.qrArry[0] === this.reportPriceList[this.cLeftIndex].listRPI[index].qrArry[0]) {
            this.reportPriceList[this.cLeftIndex].listRPI[index].qrArry[0] = this.qualityC
            this.$vux.toast.text('已含有该品质', 'bottom')
            break
          }
        }
      },
      qualityShow(index) {
        this.blur()
        // 更换品质必弹出,记住此时的零件品质,用以更新零件品质
        for (let i = 0; i < this.qualityList.length; i++) {
          if (this.qualityList[i].value === this.reportPriceList[this.cLeftIndex].listRPI[index].qrArry[0]) {
            this.qualityC = this.reportPriceList[this.cLeftIndex].listRPI[index].qrArry[0]
            break
          }
        }
      },
      // 提交报价
      subForm() {
        this.validateDone(this.cLeftIndex)
        let reportPriceList = this.reportPriceList
        let f = true
        for (let i = 0; i < reportPriceList.length; i++) {
          if (reportPriceList[i].done === 2) {
            this.$vux.alert.show({
              title: '提示',
              content: '带x的零件请输入正确的金额'
            })
            return
          }
          (reportPriceList[i].done === 1) && (f = false)
        }
        if (f) {
          this.$vux.toast.text('请至少输入一个报价', 'middle')
          return
        }
        let listRP = [] // 提交的集合
        let listRPShow = [] // 展示的集合
        for (let i = 0; i < reportPriceList.length; i++) {
          if (reportPriceList[i].listRPI.length === 1 && !reportPriceList[i].listRPI[0].reportPrice) {
            // 不经营
            reportPriceList[i].isOperProd = '1'
          }
          for (let j = 0; j < reportPriceList[i].listRPI.length; j++) {
            reportPriceList[i].listRPI[j].qualityRequirement = reportPriceList[i].listRPI[j].qrArry[0]
            for (let k = 0; k < this.qualityList.length; k++) {
              if (this.qualityList[k].value === reportPriceList[i].listRPI[j].qualityRequirement) {
                reportPriceList[i].listRPI[j].qualityRequirementName = this.qualityList[k].name
                break
              }
            }
          }
          listRP.push({
            id: reportPriceList[i].id,
            isOperProd: reportPriceList[i].isOperProd, // 是否经营
            name: reportPriceList[i].name, // 名称
            listRPI: reportPriceList[i].listRPI // 报价结果
          })
          reportPriceList[i].done === 1 && listRPShow.push({
            id: reportPriceList[i].id,
            isOperProd: reportPriceList[i].isOperProd, // 是否经营
            name: reportPriceList[i].name, // 名称
            listRPI: reportPriceList[i].listRPI // 报价结果
          })
        }
        this.irpe.listRP = listRP
        this.irpe.listRPShow = listRPShow
        this.$store.commit(REPORT_PRICE_LIST, this.irpe)
        localStorage.setItem(this.iilKey, JSON.stringify(this.reportPriceList))
        this.$router.push({ name: 'quoteInfo', params: { insId: this.irpe.insId } })
      },
      // 计算高度
      _calculateHeight() {
        let partInfos = this.$refs.part.querySelectorAll('.groupClass')
        let height = 0
        this.partInfosHeight.length = 0
        for (let i = 0, l = partInfos.length; i < l; i++) {
          let item = partInfos[i]
          height += item.clientHeight
          this.partInfosHeight.push(height)
        }
      },
      // 哔了狗的虚拟键盘遮挡
      onFocus(index) {
        // 键盘弹出需要时间
        this.isAndroid && setTimeout((e) => {
          this.$refs.scrollRight.scrollTo(0, -this.partInfosHeight[index], 300)
        }, 200)
      },
      // 失去全部焦点
      blur() {
        document.activeElement.blur()
      }
    },
    components: {
      XHeader,
      Cell,
      Group,
      GroupTitle,
      Tab,
      TabItem,
      PopupPicker,
      Selector,
      Datetime,
      XInput,
      XTextarea,
      Flexbox,
      FlexboxItem,
      CellFormPreview,
      Previewer,
      Swiper,
      Badge,
      TransferDom,
      scroll,
      Step,
      StepItem,
      XButton,
      Spinner
    }
  }
</script>

<style  lang="less">
@import "../../styles/sup.less";
.c-part {
  .display-flex;
  flex-direction: column;
  .c-cell {
    .flex(none);
  }
  p {
    padding: 0px;
  }
  overflow: hidden;
  .parts {
    .display-flex;
    .flex(none);
    .flex-direction(column);
    overflow: hidden;
    .c-header {
      display: flex;
      .justify-content(center);
    }
    .c-body {
      overflow: hidden;
      .display-flex;
      .flex(auto);
      border-bottom: 1px solid @s-hr-color;
      height: calc(
        ~"100vh - @{vux-header-height} - @{vux-tab-height} - @{vux-button-div-height}"
      );
      .c-left {
        .flex(0 0 80px);
        width: 80px;
        background: #fff;
        overflow: auto;
        border-right: 1px solid @s-hr-color;
        .c-active {
          background-color: @popup-picker-header-bg-color;
          color: @s-primary-color;
          border-left: 2px solid @s-primary-color;
          font-size: 16px;
        }
        li {
          font-size: 14px;
          text-align: right;
          p {
            padding-top: 7px;
            padding-bottom: 7px;
            padding-right: 2px;
          }
        }
      }
      .c-middle {
        .flex(0 0 3%);
      }
      .c-right {
        .flex(auto);
        overflow: hidden;
      }
    }
  }
  .vux-tab .vux-tab-item {
    background-size: 100% 0px;
  }
}

.c-checker {
  width: 100px;
  height: 26px;
  line-height: 26px;
  text-align: center;
  border-radius: 3px;
  border: 1px solid #ccc;
  background-color: #fff;
  margin-right: 6px;
  margin-left: 15px;
}

.c-checker-selected {
  background: #ffffff
    url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAALCAMAAACecocUAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QTZDOEJBQ0E3NkIxMTFFNEE3MzJFOUJCMEU5QUM0QkIiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QTZDOEJBQ0I3NkIxMTFFNEE3MzJFOUJCMEU5QUM0QkIiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpBNkM4QkFDODc2QjExMUU0QTczMkU5QkIwRTlBQzRCQiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpBNkM4QkFDOTc2QjExMUU0QTczMkU5QkIwRTlBQzRCQiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PnMGp3kAAAAJUExURf9KAP///////4Jqdw0AAAADdFJOU///ANfKDUEAAAAuSURBVHjaTMpBDgAABAPB5f+PlhLUpZMWuQcYMWLEyDN4ymqa5KS4+3g+KAEGACQmAGlKzr56AAAAAElFTkSuQmCC)
    no-repeat right bottom;
  border-color: #ff4a00;
}
</style>