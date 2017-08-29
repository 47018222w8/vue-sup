<template>
	<div ref="quote">
		<tab active-color="#2196f3" v-model="tabIndex">
			<tab-item index="0" selected>零件</tab-item>
			<tab-item index="1">车辆信息</tab-item>
		</tab>
		<group v-show="tabIndex===1">
			<cell title="品牌" :value="carInfoTitle"></cell>
			<cell-form-preview :list="carInfo"></cell-form-preview>
		</group>
		<div class="parts" v-show="tabIndex===0" ref="parts">
			<scroll ref="scrollLeft" class="wrapper c-left" :data="insInfoList">
				<div>
					<group title="零件">
						<cell class="cLeftList" :class="cLeftIndex===index?'c-active':'c-link'" v-for="(info,index) in insInfoList" :key="info.id+'l'" :title="info.name" @click.native="choosePart(info.id,index)" />
					</group>
				</div>
			</scroll>
			<scroll class="wrapper c-right " ref="scrollRight" :data="insInfoList" :listenScroll="true" :probeType="3" @scroll="menuCurrentIndex">
				<div>
					<group class="cRightList" :title="info.name+' 数量:'+info.amount" v-for="(info,index) in insInfoList" :key="info.id+'r'" label-width="4.5em" label-margin-right="2em" label-align="right">
						<checker v-model="demo5" default-item-class="demo5-item" selected-item-class="demo5-item-selected">
							<checker-item v-for="i in [1, 2]" :key="i" :value="i">￥{{i*300}}</checker-item>
						</checker>
						<selector v-model="info.qualityRequirement" :options="qualityList" value-text-align="left" title="零件质量"></selector>
						<datetime v-model="info.canShipDateBs" format="YYYY-MM-DD HH" title="发货时间" value-text-align="left"></datetime>
						<x-input title="金额" v-model="info.reportPrice" type="number"></x-input>
						<cell title="相关图片" is-link @click.native="showPartImg(index)"></cell>
						<x-textarea style="padding-bottom: 0;" title="备注" v-model="info.remark" :show-counter="false" :rows="3" :max="100"></x-textarea>
					</group>
				</div>
			</scroll>
		</div>
		<x-button @click.native="confirmIndex=1" v-show="tabIndex===0" type="primary" style="position: fixed;z-index: 500;bottom: 0;width: 100%;">核对报价</x-button>
		<div v-transfer-dom>
			<previewer :list="imgPriviewList" ref="previewer"></previewer>
		</div>
	</div>
</template>

<script>
	import { Checker, CheckerItem, XButton, TransferDom, CellFormPreview, Flexbox, FlexboxItem, XTextarea, XInput, Datetime, Selector, PopupPicker, Cell, Group, Tab, TabItem, Previewer } from 'vux'
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
				rightPartListHeight: [], //右侧零件区域高度
				leftPartListHeight: [], //左侧零件区域高度
				tabIndex: 0, //tab索引
				cLeftIndex: 0, //menu索引
				imgPriviewList: [],
				carInfoTitle: '',
				partClientHeight: 0,
				    demo5: 1,
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
						this.carInfo.push({
							label: "车型",
							value: ins.carMark
						})
						this.carInfo.push({
							label: "车牌号",
							value: ins.carNo ? ins.carNo : '无'
						})
						this.carInfo.push({
							label: "vin",
							value: ins.vin === '00000000000000000' ? '无' : ins.vin
						})
						this.carInfo.push({
							label: "到货时间",
							value: ins.arriveTime
						})
						this.carInfo.push({
							label: "修理厂",
							value: ins.entMemberName
						})
						this.carInfo.push({
							label: "地址",
							value: ins.address
						})
						this.carInfo.push({
							label: "是否需要发票",
							value: ins.invoice
						})
					} else if(result.code === 1) {
						this.$vux.alert.show({
							title: '错误',
							content: result.msg,
							onHide() {
								this.$router.push({
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
					this.$nextTick(() => {
						this._calculateHeight(); // 初始化列表高度列表 不在这个时期用不了
					})
				}).catch((error) => {
					console.log(error)
					this.$vux.alert.show({
						title: '错误',
						content: '未知错误,请联系管理员'
					})
				})
				this.$vux.loading.hide();
			},
			//滚动时计算左右两边零件高度
			menuCurrentIndex() {
				this.partScrollY = Math.abs(Math.round(this.$store.state.scrollY))
				let cLeftIndex = 0;
				for(let i = 0, l = this.rightPartListHeight.length; i < l; i++) {
					let topHeight = this.rightPartListHeight[i]
					let bottomHeight = this.rightPartListHeight[i + 1]
					if((this.partScrollY >= topHeight && this.partScrollY < bottomHeight)) {
						cLeftIndex = i;
					}
				}
				this.cLeftIndex = cLeftIndex;
				//this.$refs.scrollLeft.scrollTo(0, -this.leftPartListHeight[cLeftIndex], 300);

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
				this.$refs.scrollRight.scrollTo(0, -this.rightPartListHeight[index], 300); //滚动到该零件所在位置
			},
			//计算左右每个零件所在高度
			_calculateHeight() {
				let rightPartList = this.$refs.quote.querySelectorAll('.cRightList');
				let height = 0;
				this.rightPartListHeight.push(height);
				for(let i = 0, l = rightPartList.length; i < l; i++) {
					let item = rightPartList[i];
					height += item.clientHeight + 11; //title margin-top去不掉,高度试出来的..
					this.rightPartListHeight.push(height);
				}
				let leftPartList = this.$refs.quote.querySelectorAll('.cLeftList');
				this.partClientHeight = this.$refs.parts.clientHeight;
				height = 0;
				this.leftPartListHeight.push(height);
				for(let i = 0, l = leftPartList.length; i < l; i++) {
					let item = leftPartList[i];
					height += item.clientHeight;
					this.leftPartListHeight.push(height);
				}
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
			CheckerItem
		}
	}
</script>

<style scoped>
	.c-link {
		background-color: #EDEDED;
	}
	
	.c-active {
		background-color: #FFFFFF;
	}
	
	.parts {
		display: flex;
		position: absolute;
		top: 94px;
		bottom: 46px;
		width: 100%;
		overflow: hidden;
	}
	
	.parts .c-left {
		flex: 0 0 80px;
		width: 80px;
		background: #f3f5f7;
		margin-top: 2px;
	}
	
	.parts .c-right {
		flex: 1;
		margin-top: 2px;
	}
	
	.demo5-item {
		width: 100px;
		height: 26px;
		line-height: 26px;
		text-align: center;
		border-radius: 3px;
		border: 1px solid #ccc;
		background-color: #fff;
		margin-right: 6px;
	}
	
	.demo5-item-selected {
		background: #ffffff url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAALCAMAAACecocUAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QTZDOEJBQ0E3NkIxMTFFNEE3MzJFOUJCMEU5QUM0QkIiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QTZDOEJBQ0I3NkIxMTFFNEE3MzJFOUJCMEU5QUM0QkIiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpBNkM4QkFDODc2QjExMUU0QTczMkU5QkIwRTlBQzRCQiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpBNkM4QkFDOTc2QjExMUU0QTczMkU5QkIwRTlBQzRCQiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PnMGp3kAAAAJUExURf9KAP///////4Jqdw0AAAADdFJOU///ANfKDUEAAAAuSURBVHjaTMpBDgAABAPB5f+PlhLUpZMWuQcYMWLEyDN4ymqa5KS4+3G+KAEGACQmAGlKzr56AAAAAElFTkSuQmCC) no-repeat right bottom;
		border-color: #ff4a00;
	}
</style>