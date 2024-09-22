<template>
	<i-modal ref="iModal" :theme="theme" :widthType="widthType" :width="width" :icon="icon" :text="text"
		:show="toastVisible"></i-modal>
</template>

<script>
	export default {
		name: 'i-toast',
		data() {
			return {
				theme: 'primary',
				widthType: 'pixel',
				width: 200,
				icon: '',
				text: '',
				duration: 2000,
				toastVisible: false
			}
		},
		methods: {
			show(options) {
				this.toastVisible = true
				this.theme = options.theme || 'primary'
				this.widthType = options.widthType || 'pixel'
				this.width = options.width || 200
				this.icon = options.icon || ''
				this.text = options.text || '提示'
				this.duration = options.duration || 2000
				setTimeout(() => {
					this.toastVisible = false
				}, this.duration)
			}
		}
	}
</script>

<style>
</style>