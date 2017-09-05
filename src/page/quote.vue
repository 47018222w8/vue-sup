<template>
	<div>
		<tab active-color="#2196f3" v-model="tabIndex">
			<tab-item index="0" selected>零件</tab-item>
			<tab-item index="1">车辆信息</tab-item>
		</tab>
		<group v-show="tabIndex===1">
			<swiper v-if="insImgList.length>0" :list="insImgList" height="180px" dots-class="custom-bottom" dots-position="center"></swiper>
			<cell title="品牌" :value="carInfoTitle"></cell>
			<cell-form-preview :list="carInfo"></cell-form-preview>
		</group>
		<div class="parts" v-show="tabIndex===0" ref="parts">
			<ul class="c-left">
				<li class="c-li" :class="cLeftIndex===index?'c-active':''" v-for="(info,index) in insInfoList" :key="info.id" @click="choosePart(info.id,index)">
					<p><i v-show="info.done" class="fa fa-check fa-primary"></i>
						<badge v-show="!info.done"></badge>{{info.name}}</p>
				</li>
			</ul>
			<div class="c-middle"></div>
			<div class="c-right " v-if="insInfoList.length>0">
				<group :title="insInfoList[cLeftIndex].name" label-width="4.5em" label-margin-right="2em" label-align="right">
					<cell title="相关图片" is-link @click.native="showPartImg(cLeftIndex)"></cell>
				</group>
				<checker v-model="insInfoList[cLeftIndex].isOperProd" default-item-class="c-checker" selected-item-class="c-checker-selected">
					<checker-item v-for="i in ['0','1']" :key="i" :value="i">{{i==='0'?'经营':'不经营'}}</checker-item>
				</checker>
				<group v-for="(rpi,index) in insInfoList[cLeftIndex].listRPI" :key="index" label-width="4.5em" label-margin-right="2em" label-align="right">
					<popup-picker :data="qualityList" v-model="rpi.qrArry" :columns="1" title="零件品质" value-text-align="left" show-name></popup-picker>
					<datetime v-model="rpi.canShipDateBsStr" format="YYYY-MM-DD HH" title="发货时间" value-text-align="left"></datetime>
					<x-input title="金额" v-model="rpi.reportPrice" type="number"></x-input>
					<x-textarea style="padding-bottom: 0;" title="备注" v-model="rpi.remark" :show-counter="false" :rows="3" :max="100"></x-textarea>
					<div style="text-align: center;padding-top: 5px;padding-bottom:5px;">
						<button v-if="index!==0" @click="delMoreQuality(index)" class="s-btn s-btn-danger s-btn-outline">删除此品质报价</button>
					</div>
				</group>
				<div style="text-align: center;margin: 5px 0 10px 0;">
					<button @click="addMoreQuality" class="s-btn s-btn-primary s-btn-outline">提供更多品质报价</button>
				</div>
			</div>
		</div>
		<div style="text-align: center;position: fixed;bottom: 0;width: 100%;">
			<button @click="subForm" class="s-btn s-btn-primary" style="width: 100%;font-size: 16px;">核对报价</button>
		</div>
		<!--零件图片预览-->
		<div v-transfer-dom>
			<previewer :list="imgPriviewList" ref="previewer"></previewer>
		</div>
	</div>
</template>

<script>
	import { Badge, Swiper, Checker, CheckerItem, TransferDom, CellFormPreview, Flexbox, FlexboxItem, XTextarea, XInput, Datetime, Selector, PopupPicker, Cell, Group, Tab, TabItem, Previewer } from 'vux'
	import constant from '../components/constant'
	export default {
		directives: {
			TransferDom
		},
		data() {
			return {
				insId: this.$route.params.insId, //询价单id
				insInfoList: [], //零件信息
				qualityList: [], //零件品质
				insInfoId: 0, //当前选中的零件id
				carInfo: [], //车辆信息
				tabIndex: 0, //tab索引
				cLeftIndex: 0, //menu索引
				imgPriviewList: [], //零件图预览
				carInfoTitle: '', //
				insImgList: [], //询价单图片信息
				leftPartEachHeight: [] //左侧每个零件的高度
			};
		},
		created() {
			this._initData();
		},
		mounted() {

		},
		computed: {

		},
		methods: {
			//初始化数据
			async _initData() {
				this.$vux.loading.show({
					text: '加载中'
				});
				await this.$http.get('/quote/' + this.insId).then((response) => {
					let result = response.data;
					if(result.code === 200) {
						//零件品质
						let qualityList = result.data.qualityList;
						for(let i = 0; i < qualityList.length; i++) {
							this.qualityList.push({
								value: String(qualityList[i].id), //沃日,show-name只能用string
								name: qualityList[i].propertyName,
								parent: 0
							})
						}
						//零件列表
						let insInfoList = result.data.insInfoList;
						for(let i = 0; i < insInfoList.length; i++) {
							let listRPI = [{
								canShipDateBsStr: null,
								reportPrice: null,
								qrArry: [this.qualityList[0].value], //坑爹的数组
								qualityRequirement: this.qualityList[0].value,
								remark: null
							}];
							insInfoList[i].done = false;
							insInfoList[i].listRPI = listRPI;
						}
						//询价单信息
						let ins = result.data.ins;
						ins.rearImg && this.insImgList.push({
							img: ins.rearImg,
							title: '车尾照片'
						})
						ins.fontImg && this.insImgList.push({
							img: ins.fontImg,
							title: '车头照片'
						})
						ins.driveLicense && this.insImgList.push({
							img: ins.driveLicense,
							title: '车头照片'
						})
						this.carInfoTitle = ins.carBrandName;
						this.insInfoList = insInfoList;
						this.insInfoId = this.insInfoList[0].id;
						this.carInfo.splice(0, 0, {
							label: "车型",
							value: ins.carMark
						}, {
							label: "车牌号",
							value: ins.carNo ? ins.carNo : '无'
						}, {
							label: "vin",
							value: ins.vin === '00000000000000000' ? '无' : ins.vin
						}, {
							label: "到货时间",
							value: ins.arriveTime
						}, {
							label: "修理厂",
							value: ins.entMemberName
						}, {
							label: "地址",
							value: ins.address
						}, {
							label: "是否需要发票",
							value: ins.invoice == 1 ? '需要' : '不需要'
						})
					} else if(result.code === 1) {
						let vue = this
						this.$vux.alert.show({
							title: '错误',
							content: result.msg,
							onHide() {
								vue.$router.push({
									name: 'login'
								})
							}
						})
					} else {
						this.$vux.alert.show({
							title: '错误',
							content: result.msg
						})
					}
				}).catch((error) => {
					console.log(error)
					this.$vux.alert.show({
						title: '错误',
						content: '未知错误,请联系管理员'
					})
				})
				this.$vux.loading.hide();
			},
			//显示零件图片
			showPartImg(index) {
				if(this.insInfoList[index].groupSrc.length > 0) {
					this.imgPriviewList = this.insInfoList[index].groupSrc;
					this.$nextTick(() => {
						this.$refs.previewer.show(0)
					})
				} else {
					this.$vux.toast.text('此零件没有图片', 'bottom');
				}

			},
			//选择零件
			choosePart(insInfoId, index) {
				let rpi = this.insInfoList[this.cLeftIndex].listRPI;
				let f = false;
				if(this.insInfoList[this.cLeftIndex].isOperProd === '0') {
					for(let i = 0; i < rpi.length; i++) {
						if(constant.MONEY_TEST.test(rpi[i].reportPrice) && rpi[i].qualityRequirement && rpi[i].canShipDateBsStr) {
							f = true;
						} else {
							f = false;
						}
					}
				} else {
					f = true;
				}

				if(f) {
					this.insInfoList[this.cLeftIndex].done = true;
				} else {
					this.insInfoList[this.cLeftIndex].done = false;
				}
				this.cLeftIndex = index;
			},
			addMoreQuality() {
				this.insInfoList[this.cLeftIndex].listRPI.push({
					canShipDateBsStr: null,
					reportPrice: null,
					qrArry: [this.qualityList[0].value],
					qualityRequirement: this.qualityList[0].value,
					remark: null
				});
			},
			delMoreQuality(index) {
				this.insInfoList[this.cLeftIndex].listRPI.splice(index, 1);
			},
			subForm() {
				let insInfoList = this.insInfoList;
				let listRP = [];
				for(let i = 0; i < insInfoList.length; i++) {
					listRP.push({
						id: insInfoList[i].id,
						isOperProd:insInfoList[i].isOperProd,
						listRPI: insInfoList[i].listRPI
					})
				}
				let ins = {
					id: this.insId,
					listRP: listRP
				}
				console.log(JSON.stringify(ins))
				this.$http.post('/quote', ins).then((response) => {
					let result = response.data;
					if(result.code === 200) {
						this.$vux.toast.show({
							text: '报价成功',
							time:1500,
							position:'bottom'
						})
					} else {}
				}).catch((error) => {
					console.log(error);
					this.$vux.alert.show({
						title: '错误',
						content: '未知错误,请联系管理员'
					})
				})
			}
		},
		components: {
			Cell,
			Group,
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
			Checker,
			CheckerItem,
			Swiper,
			Badge
		}
	}
</script>

<style lang="less">
	.parts {
		display: flex;
		position: absolute;
		top: 94px;
		bottom: 50px;
		width: 100%;
		.c-left {
			flex: 0 0 80px;
			width: 80px;
			background: #fff;
			margin-top: 2px;
			overflow: auto;
			.c-active {
				background-color: @popup-picker-header-bg-color;
				color: #2196F3;
				border-left: 5px solid #2196F3;
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
			flex: 0 0 3%;
		}
		.c-right {
			flex: 1;
			margin-top: 2px;
			overflow: auto;
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
		background: #ffffff url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAALCAMAAACecocUAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QTZDOEJBQ0E3NkIxMTFFNEE3MzJFOUJCMEU5QUM0QkIiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QTZDOEJBQ0I3NkIxMTFFNEE3MzJFOUJCMEU5QUM0QkIiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpBNkM4QkFDODc2QjExMUU0QTczMkU5QkIwRTlBQzRCQiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpBNkM4QkFDOTc2QjExMUU0QTczMkU5QkIwRTlBQzRCQiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PnMGp3kAAAAJUExURf9KAP///////4Jqdw0AAAADdFJOU///ANfKDUEAAAAuSURBVHjaTMpBDgAABAPB5f+PlhLUpZMWuQcYMWLEyDN4ymqa5KS4+3G+KAEGACQmAGlKzr56AAAAAElFTkSuQmCC) no-repeat right bottom;
		border-color: #ff4a00;
	}
</style>