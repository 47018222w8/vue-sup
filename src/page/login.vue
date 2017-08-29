<template>
	<div style="text-align: center;">
		<group>
			<x-input title="账号" type="text" v-model="formData.uname"></x-input>
			<x-input title="密码" type="password" v-model="formData.password"></x-input>
			<x-button class="blue" text="登录" :disabled="disabled" @click.native="submitForm" :show-loading="loading" type="primary"></x-button>
		</group>

	</div>
</template>

<script>
	import constant from '../components/constant'
	import { XInput, Group, XButton, Cell } from 'vux'
	export default {
		name: 'Login',
		components: {
			XInput,
			Group,
			XButton,
			Cell
		},
		data() {
			return {
				formData: {
					uname: '',
					password: ''
				},
				disabled: false,
				loading: false,
				message: '',
				toast: false
			};
		},
		methods: {
			submitForm() {
				if(this.validate()) {
					this.loading = true;
					this.disabled = true;
					this.$http.post('/login/validate', this.formData).then((response) => {
						let result = response.data;
						if(result.code === 200) {
							this.showToast("登录成功");
							localStorage.setItem(constant.JWT_HEADER,constant.JWT_TOKEN_HEAD+result.data);
							this.$router.push({
								name: 'quoteList'
							})
						} else {}
					}).catch(function(error) {

					})
				}
			},
			validate() {
				if(this.formData.uname.trim() === '') {
					this.$vux.toast.show({
						text: '请输入用户名',
						type:'text'
					})
					return false;
				} else if(this.formData.password.trim() === '') {
					this.$vux.toast.show({
						text: '请输入密码',
						type:'text'
					})
					return false;
				} else {
					return true;
				}
			},
			showToast(message) {
				this.toast = true;
				this.message = message;
				if(this.toastTimer) clearTimeout(this.toastTimer)
				this.toastTimer = setTimeout(() => {
					this.toast = false
				}, 1500)
			}
		}

	}
</script>

<style>

</style>