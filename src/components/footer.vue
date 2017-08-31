<template>
	<div class="s-footer">

		<div class="f-cell" @click="toPage('quoteList')" :class="{'f-active':selectedTabBar('quoteList')}">
				<i class="fa fa-home fa-lg"></i>报价
		</div>
		<div class="f-cell">
			<i slot="icon" class="fa fa-comment-o"></i>消息
		</div>
		<div class="f-cell" @click="toPage('userCenter')" :class="{'f-active':selectedTabBar('userCenter')}">
				<i slot="icon" class="fa fa-user-o"></i>我的
		</div>
	</div>
</template>

<script>
	export default {
		name: 's-footer',
		methods: {
			selectedTabBar(str) {
				return this.$route.name === str;
			},
			toPage(str){
				this.$router.push({name: str})
			}
		}
	}
</script>

<style scoped>
	.s-footer {
		display: flex;
		position: fixed;
		bottom: 0;
		width: 100%;
		height: 40px;
		background: #FFFFFF;
		z-index: 100;
		font-size: 12px;
		color: #A1A1A1;
	}
	
	.s-footer .f-cell {
		display: flex;
		justify-content: center;
		align-items: center;
		flex: 1;
	}
	
	.s-footer .f-active {
		color: #2196f3;
	}
</style>