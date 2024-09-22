<template>
	<div class="login-container">
		<div class="auth-bg"></div>
		<u-toast ref="uToast"></u-toast>
		<div class="auth-body">
			<div class="common-layout">
				<div class="login-title">
					<div class="logo">
						<u--image class="logo-img" src="../../static/img/logo.png" width="32px" height="32px"></u--image>
						<div class="logo-title">易米派</div>
					</div>
					<div class="line">/</div>
					<div class="desc">专业的新零售管理</div>
				</div>
				<div class="content">
					<div class="login">
						<div class="login-tabs">
							<div class="login-tabs-item active">
								忘记密码
							</div>
						</div>
						<u--form class="login-form" ref="form" :model="form" label-width="0px" :rules="rules">
							<u-form-item label="" prop="phone" borderBottom>
								<u--input v-model="form.phone" placeholder="请输入手机号" border="none"
									@input="phoneChange"></u--input>
							</u-form-item>
							<u-form-item v-if="captchaImage" label="" prop="imgCaptcha" borderBottom>
								<u--input v-model="form.imgCaptcha" placeholder="输入图片验证码" border="none">
									<template slot="suffix">
										<img :src="captchaImage" style="border-radius: 5px; margin-left: 15px;" alt=""
											class="captcha" @click="getCaptcha">
									</template>
								</u--input>
							</u-form-item>
							<u-form-item label="" prop="smsCaptcha" borderBottom>
								<u--input v-model="form.smsCaptcha" placeholder="输入短信验证码" border="none">
									<template slot="suffix">
										<u-code ref="uCode" @change="codeChange" @start="smsCaptchaStart"
											@end="smsCaptchaEnd" :disabled="smsCodeDisable" :seconds="smsCountdown"
											changeText="X秒重新获取"></u-code>
										<u-button @tap="getSmsCaptcha" :text="btnSmsText" :disabled="smsCodeDisable"
											type="success" size="mini"></u-button>
									</template>
								</u--input>
							</u-form-item>
							<u-form-item label="" prop="password" borderBottom>
								<u--input v-model="form.password" placeholder="输入新密码" type="password" border="none">
								</u--input>
							</u-form-item>
							<u-form-item label="" prop="confirmPassword" borderBottom>
								<u--input v-model="form.confirmPassword" placeholder="再次输入新密码" type="password"
									border="none">
								</u--input>
							</u-form-item>
							<u-button :loading="loginLoading" loadingText="重置中" @click="forget"
								style="width: 100%;margin: 22px 0;" type="primary">
								找回密码
							</u-button>
						</u--form>
						<div class="login-foot">
							<u--text class="router-left" type="info" @click="login" text="登录" />
							<u--text class="router-right" type="info" @click="register" text="快速注册"></u--text>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import forget from '../../api/auth/forget';
	export default {
		data() {
			return {
				loginLoading: false,
				btnSmsText: '获取短信验证码',
				smsCountdown: 60,
				smsCodeDisable: false,
				form: {
					clientId: 'client',
					clientSecret: '123',
					grantType: 'sms_code',
					phone: '',
					imgCaptcha: '',
					smsCaptcha: '',
					password: '',
					confirmPassword: ''
				},
				captchaImage: '',
				rules: {
					'phone': [{
							type: 'string',
							required: true,
							message: '请填写手机号',
							trigger: ['blur', 'change']
						},
						{
							validator: (rule, value, callback) => {
								return uni.$u.test.mobile(value);
							},
							message: '手机号错误'
						}
					],
					'imgCaptcha': {
						type: 'string',
						required: true,
						message: '请填写图片验证码',
						trigger: ['blur', 'change']
					},
					'smsCaptcha': {
						type: 'string',
						required: true,
						message: '请填写短信验证码',
						trigger: ['blur', 'change']
					},
					'password': {
						type: 'string',
						required: true,
						message: '请填写新密码',
						trigger: ['blur', 'change']
					},
					'confirmPassword': [{
						type: 'string',
						required: true,
						message: '请再次输入新密码',
						trigger: ['blur', 'change']
					}, {
						validator: (rule, value, callback) => {
							return value === this.form.password
						},
						message: '两次密码输入不一致'
					}]
				}
			}
		},
		methods: {
			codeChange(text) {
				this.btnSmsText = text
			},
			getSmsCaptcha() {
				if (this.$refs.uCode.canGetCode) {
					const params = {
						phone: this.form.phone,
						imgCaptcha: this.form.imgCaptcha
					}
					forget.smsCaptcha(params).then(res => {
						this.$refs.uToast.show({
							type: 'success',
							message: '短信发送成功',
							icon: 'checkmark-circle'
						})
						setTimeout(() => {
							// 通知验证码组件内部开始倒计时
							this.$refs.uCode.start();
						}, this.smsCountdown);
					})
				} else {
					this.$refs.uToast.show({
						type: 'default',
						message: '短信已发送'
					})
				}
			},
			smsCaptchaStart() {
				this.smsCodeDisable = true
			},
			smsCaptchaEnd() {
				this.smsCodeDisable = false
			},
			phoneChange() {
				if (uni.$u.test.mobile(this.form.phone)) {
					this.getCaptcha()
				} else {
					this.captchaImage = ''
					this.form.imgCaptcha = ''
				}
			},
			getCaptcha() {
				this.captchaImage = ''
				forget.imgCaptcha(this.form.phone).then(res => {
					const {
						image,
						phone
					} = res.data
					this.captchaImage = image
				})
			},
			forget() {
				this.$refs.form.validate().then((valid) => {
					if (valid) {
						this.registerLoading = true
						forget.smsCaptchaReset(this.form).then(() => {
							uni.$refs.uToast.show({
								type: 'success',
								message: '密码重置成功',
								icon: 'checkmark-circle'
							})
							setTimeout(() => {
								this.login()
							}, 2000);
						}).finally(() => {
							this.registerLoading = false
						})
					}
				})
			},
			login() {
				uni.navigateTo({
					url: '/pages/auth/login'
				})
			},
			register() {
				uni.navigateTo({
					url: '/pages/auth/register'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import "@/common/css/auth.scss";
</style>