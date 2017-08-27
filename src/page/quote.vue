<template>
	<div ref="quote">
		<tab active-color="#2196f3" v-model="index">
			<tab-item index="0" selected>零件</tab-item>
			<tab-item index="1">车辆信息</tab-item>
		</tab>
		<group v-show="index===1">
			<cell title="品牌" :value="ins.title" is-link @click.native="showPreview = !showPreview" :arrow-direction="showPreview ? 'up' : 'down'"></cell>
			<template v-if="showPreview">
				<cell-form-preview :list="previewList"></cell-form-preview>
			</template>
		</group>
		<div class="parts" v-show="index===0">
			<scroll class="wrapper c-left" :data="infoList">
				<div>
					<group title="零件">
						<cell :class="insInfoId===info.insInfoId?'c-active':'c-link'" v-for="(info,index) in infoList" :key="info.insInfoId+'t'" :title="info.name" @click.native="choosePart(info.insInfoId,index)" />
					</group>
				</div>
			</scroll>
			<scroll class="wrapper c-right " ref="scrollRight" :data="infoList">
				<div ref="cRight">
					<group class="cRightList" :title="info.name" v-for="info in infoList" :key="info.insInfoId" label-width="4.5em" label-margin-right="2em" label-align="right">
						<selector v-model="info.qualityRequirement" :options="qualityList" value-text-align="left" title="零件质量"></selector>
						<datetime v-model="info.canShipDateBs" format="YYYY-MM-DD HH" title="发货时间" value-text-align="left"></datetime>
						<x-input title="金额" v-model="info.reportPrice" type="number" :max="10"></x-input>
						<x-textarea style="padding-bottom: 0;" title="备注" v-model="info.remark" :show-counter="false" :rows="3" :max="100"></x-textarea>
					</group>
				</div>
			</scroll>
		</div>
	</div>
</template>

<script>
	import axios from '../components/fetch'
	import { CellFormPreview, Flexbox, FlexboxItem, XTextarea, XInput, Datetime, Selector, PopupPicker, Cell, Group, Tab, TabItem } from 'vux'
	import scroll from '../components/scroll'
	export default {
		data() {
			return {
				insId: this.$route.params.insId,
				ins: {},
				infoList: [],
				qualityList: [{
					key: 'gd',
					value: '广东'
				}, {
					key: 'gx',
					value: '广西'
				}],
				insInfoId: 0, //当前选中的零件id
				previewList: [],
				showPreview: false, //折叠面板信息
				listenScroll: true,
				partListHeight: [],
				index:0
			};
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
			scroll
		},
		created() {
			this.initData();

		},
		mounted() {

		},

		beforeUpdate() {
			this.$nextTick(() => {
				this._calculateHeight(); // 初始化列表高度列表 不在这个时期用不了
			})
		},
		methods: {
			async initData() {
				await axios.get('/quote/info/' + this.insId).then((response) => {
					let result = response.data;
					if(result.code === 200) {
						this.ins = result.data.ins;
						this.infoList = result.data.list;
						this.insInfoId = this.infoList[0].insInfoId;
						this.previewList = this.ins.previewList;
					} else {}
				}).catch(function(error) {

				})
			},
			choosePart(insInfoId, index) {
				this.insInfoId = insInfoId;
				this.$refs.scrollRight.scrollTo(0, -this.partListHeight[index], 300)
			},
			_calculateHeight() {
				let partList = this.$refs.quote.querySelectorAll('.cRightList');
				let height = 0;
				this.partListHeight.push(height);
				for(let i = 0, l = partList.length; i < l; i++) {
					let item = partList[i];
					height += item.offsetHeight;
					console.log(item.style.margin);
					this.partListHeight.push(height);
				}
			}
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
		top: 174px;
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
</style>