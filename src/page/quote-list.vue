<template>
	<div>
		<tab active-color="#2196f3" v-model="index">
			<tab-item index="0" selected>报价</tab-item>
			<tab-item index="1">整单</tab-item>
		</tab>
		<div v-if="index===0">
			<group>
				<cell v-for="quote in quoteList" :key="quote.insId" :title="quote.title" @click.native="toQuotePage(quote.insId)" :inline-desc='quote.desc'>
					<img slot="icon" width="30" style="display:block;margin-right:5px;" :src="quote.src">
				</cell>
			</group>
			<mugen-scroll :handler="fetchData" :should-handle="!loading">
				加载中...
			</mugen-scroll>
		</div>

	</div>
</template>
<script>
	import { Tabbar, TabbarItem, XHeader, Cell, Group, Tab, TabItem } from 'vux'
	import MugenScroll from 'vue-mugen-scroll'
	import axios from '../components/fetch'
	export default {
		components: {
			XHeader,
			Cell,
			Group,
			Tabbar,
			TabbarItem,
			Tab,
			TabItem,
			MugenScroll
		},
		data() {
			return {
				quoteList: [],
				pageNum: 1,
				activeTab: 'tab1',
				refreshing: false,
				scroller: null,
				trigger: null,
				index: 0,
				loading:false
			};
		},
		mounted() {
			this.scroller = window;
		},
		methods: {
			async initData() {
				this.$vux.loading.show({
					text: '加载中'
				})
				await axios.get('/quote/list?pageNum=' + this.pageNum).then((response) => {
					let result = response.data;
					if(result.code === 200) {
						this.quoteList.push(...result.data.list);
						this.pageNum++
					} else {}
				}).catch(function(error) {

				})
				this.$vux.loading.hide()
			},
			toQuotePage(insId) {
				this.$router.push({
					name: 'quote',
					params: {
						insId: insId
					}
				})
			},
			handleTabChange(val) {
				this.activeTab = val;
			},
			async refresh() {
				this.refreshing = true;
				this.pageNum = 1;
				await axios.get('/quote/list?pageNum=1').then((response) => {
					let result = response.data;
					if(result.code === 200) {
						this.quoteList = result.data.list;
					} else {}
				}).catch(function(error) {

				})
				this.refreshing = false;
			},
			fetchData(){
				this.loading=true;
				this.initData();
				this.loading=false;
			}
		}
	}
</script>

<style>

</style>