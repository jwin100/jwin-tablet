<script>
	import config from './common/config'
	import global from './common/const/global'
	export default {
		onLaunch: function() {},
		onShow: function() {
			this.autoLogin()
			uni.onWindowResize(this.windowResizeCallback)
			this.initSystem()
		},
		onHide: function() {},
		methods: {
			windowResizeCallback(res) {
				const width = res.size.windowWidth
				this.initGridCol(width)
				this.initModalSize(width)
			},
			autoLogin() {
				const localPath = this.$route.path
				if (config.noAuthPages.findIndex(x => x === localPath) >= 0) {
					return
				}
				this.$store.dispatch('actionInit').then(tokenInfo => {
					// 判断缓存是否有token,如果没有，跳转到登录页
					if (!tokenInfo) {
						uni.showToast({
							title: '未登录',
							icon: 'none',
							position: 'top',
							mask: true
						})
						setTimeout(() => {
							uni.reLaunch({
								url: '/pages/auth/login'
							})
						}, 1000)
					}
				})
			},
			initSystem() {
				const window = uni.getWindowInfo()
				const width = window.windowWidth
				this.initGridCol(width)
				this.initModalSize(width)
				if (window.windowHeight < 500) {
					uni.showModal({
						title: '提示',
						content: '屏幕过小会影响使用体验，请更换大屏幕使用',
						showCancel: false
					})
				}
			},
			initGridCol(width) {
				let col = 3
				if (width <= 600) {
					col = 1
				}
				if (width <= 1000) {
					col = 2
				} else if (width <= 1300) {
					col = 3
				} else if (width <= 1600) {
					col = 4
				} else {
					col = 5
				}
				global.setGridCol(col)
			},
			initModalSize(width, height) {
				const widthCacle = 0.6
				let modalWidth = '500px'
				if (width) {
					modalWidth = (width * widthCacle) + 'px'
				}
				global.setModalWidth(modalWidth)
			}
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import "@/uni_modules/uview-ui/index.scss";
	@import "./common/css/main.scss";
</style>