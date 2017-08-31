<template>
	<div id="app">
		<s-header v-show="showHeader" :title="'找件儿'">车益佰找件</s-header>
		<div v-show="showHeader" style="padding-top: 40px;"></div>
		<router-view></router-view>
		<div v-show="showTabBar" style="padding-top: 53px;"></div>
		<s-footer v-show="showTabBar" ></s-footer>
		<!--
		<tabbar v-show="showTabBar" style="position: fixed;z-index: 500;bottom: 0;width: 100%;">
			<tabbar-item :selected="selectedTabBar('quoteList')" :link="{name:'quoteList'}">
				<i slot="icon"  class="fa fa-home"></i>
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
		-->
	</div>
</template>

<script>
	import { Tabbar, TabbarItem, XHeader } from 'vux'
	import sHeader from './components/header'
	import sFooter from './components/footer'
	export default {
		name: 'app',
		components: {
			XHeader,
			Tabbar,
			TabbarItem,
			sHeader,
			sFooter
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