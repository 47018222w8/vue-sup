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
			<scroll ref="scrollLeft" class="wrapper c-left" :data="insInfoList">
				<ul>
					<li class="c-li" :class="cLeftIndex===index?'c-active':''" v-for="(info,index) in insInfoList" :key="info.id" @click="choosePart(info.id,index)">
						<p>{{info.name}}</p>
					</li>
				</ul>
				<!--
				<div>
					<group title="零件">
						<cell class="cLeftList" :class="cLeftIndex===index?'c-active':'c-link'" v-for="(info,index) in insInfoList" :key="info.id" :title="info.name" @click.native="choosePart(info.id,index)" />
					</group>
				</div>
				-->
			</scroll>
			<div class="c-middle"></div>
			<div class="c-right ">
				<group :title="insInfoList[cLeftIndex].name" label-width="4.5em" label-margin-right="2em" label-align="right">
					<checker v-model="insInfoList[cLeftIndex].isOperProd" default-item-class="c-checker" selected-item-class="c-checker-selected">
						<checker-item v-for="i in ['0','1']" :key="i" :value="i">{{i==='0'?'经营':'不经营'}}</checker-item>
					</checker>
					<cell title="相关图片" is-link @click.native="showPartImg(cLeftIndex)"></cell>
				</group>
				<group v-for="(rpi,index) in insInfoList[cLeftIndex].listRPI" :key="index" label-width="4.5em" label-margin-right="2em" label-align="right">
					<selector v-model="rpi.qualityRequirement" :options="qualityList" value-text-align="left" title="零件质量"></selector>
					<datetime v-model="rpi.canShipDateBs" format="YYYY-MM-DD HH" title="发货时间" value-text-align="left"></datetime>
					<x-input title="金额" v-model="rpi.reportPrice" type="number"></x-input>
					<div style="text-align: center;">
						<x-button v-if="index!==0" type="warn" @click.native="delMoreQuality" mini>删除此品质报价</x-button>
					</div>

				</group>
				<group style="text-align:center;">
					<x-textarea style="padding-bottom: 0;" title="备注" v-model="insInfoList[cLeftIndex].remark" :show-counter="false" :rows="3" :max="100"></x-textarea>
					<x-button type="primary" @click.native="addMoreQuality" plain mini>提供更多品质报价</x-button>
				</group>
			</div>
		</div>
		<x-button @click.native="confirmIndex=1" v-show="tabIndex===0" type="primary" style="position: fixed;z-index: 500;bottom: 0;width: 100%;">核对报价</x-button>
		<div v-transfer-dom>
			<previewer :list="imgPriviewList" ref="previewer"></previewer>
		</div>
	</div>
</template>

<script>
	import { Swiper, Checker, CheckerItem, XButton, TransferDom, CellFormPreview, Flexbox, FlexboxItem, XTextarea, XInput, Datetime, Selector, PopupPicker, Cell, Group, Tab, TabItem, Previewer } from 'vux'
	import scroll from '../components/scroll'

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
		computed: {},
		methods: {
			//初始化数据
			async _initData() {
				this.$vux.loading.show({
					text: '加载中'
				});
				await this.$http.get('/quote/info/' + this.insId).then((response) => {
					let result = response.data;
					if(result.code === 200) {
						let ins = result.data.ins;
						let insInfoList = result.data.insInfoList;
						for(let i = 0; i < insInfoList.length; i++) {
							let listRPI = [{
								canShipDateBs: null,
								reportPrice: null,
								qualityRequirement: null
							}];
							insInfoList[i].listRPI = listRPI;
						}
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
						let qualityList = result.data.qualityList;
						for(let i = 0; i < qualityList.length; i++) {
							this.qualityList.push({
								key: qualityList[i].id,
								value: qualityList[i].propertyName
							})
						}
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
				this.cLeftIndex = index;
			},
			addMoreQuality() {
				this.insInfoList[this.cLeftIndex].listRPI.push({
					canShipDateBs: null,
					reportPrice: null,
					qualityRequirement: null
				});
			},
			delMoreQuality(index) {
				this.insInfoList[this.cLeftIndex].listRPI.splice(index, 1);
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
			scroll,
			Previewer,
			XButton,
			Checker,
			CheckerItem,
			Swiper
		}
	}
</script>

<style scoped lang="less">
	.parts {
		display: flex;
		position: absolute;
		top: 94px;
		bottom: 42px;
		width: 100%;
		.c-left {
			flex: 0 0 80px;
			width: 80px;
			background: #fff;
			margin-top: 2px;
			overflow: hidden;
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
			overflow: scroll;
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