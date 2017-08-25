<template>
	<div id="app">
		<x-header v-show="showHeader" :left-options="{backText: ''}" :right-options="{showMore: true}" style="position: fixed;top: 0px;left: 0px;z-index: 100;width: 100%;">车益佰找件</x-header>
		<div v-show="showHeader" style="padding-top: 50px;"></div>
		<router-view></router-view>
		<div v-show="showTabBar" style="padding-top: 53px;"></div>
		<tabbar v-show="showTabBar" style="position: fixed;z-index: 500;bottom: 0;width: 100%;">
			<tabbar-item :selected="selectedTabBar('quoteList')" :link="{name:'quoteList'}">
				<i slot="icon"   class="fa fa-home"></i>
				<span slot="label" >报价</span>
			</tabbar-item>
			<tabbar-item >
				<i slot="icon" class="fa fa-comment"></i>
				<span slot="label">消息</span>
			</tabbar-item>
			<tabbar-item icon-class="success" :selected="selectedTabBar('userCenter')" :link="{name:'userCenter'}">
				<i slot="icon" class="fa fa-user-o"></i>
				<span slot="label">我的</span>
			</tabbar-item>
		</tabbar>
		
	</div>
</template>

<script>
	import { Tabbar, TabbarItem, XHeader } from 'vux'
	export default {
		name: 'app',
		components: {
			XHeader,
			Tabbar,
			TabbarItem
		},
		computed:{
			showTabBar(){
				return /tabbar/.test(this.$route.path)
			},
			showHeader(){
				return this.$route.name!=='login'
			}
			
		},
		methods:{
			selectedTabBar(str){
				return this.$route.name===str;
			}
		}
	}
</script>

<style lang="less">
	@import '~vux/src/styles/reset.less';
	@import '~vux/src/styles/1px.less';
	body {
		background-color: #fbf9fe;
	}
</style>