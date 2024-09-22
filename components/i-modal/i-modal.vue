<template>
	<u-modal :title="title" :show="show" :closeOnClickOverlay="false" :showConfirmButton="false" :width="modalWidth">
		<div class="slot-content" style="overflow-y: auto;">
			<div class="modal-result" :class="theme">
				<div class="body">
					<u-icon class="icon" :name="icon" size="60"></u-icon>
					<text class="text">{{text}}</text>
					<text class="content">{{content}}</text>
				</div>
				<div class="footer">
					<div v-if="showCancel" class="btn btn-info-plain" @click="modalClose">{{cancelText}}</div>
					<div v-if="showConfirm" class="btn btn-primary-plain" @click="modalConfirm">{{confirmText}}</div>
				</div>
			</div>
		</div>
	</u-modal>
</template>

<script>
	export default {
		name: 'i-modal',
		props: {
			theme: {
				type: String,
				default: 'primary'
			},
			title: {
				type: String,
				default: ''
			},
			widthType: {
				type: String,
				default: 'pixel' // 像素:pixel，百分比:ratio
			},
			width: {
				type: Number,
				default: 300
			},
			show: {
				type: Boolean,
				default: false
			},
			icon: String,
			text: String,
			content: String,
			showCancel: {
				type: Boolean,
				default: false
			},
			cancelText: {
				type: String,
				default: '取消'
			},
			showConfirm: {
				type: Boolean,
				default: false
			},
			confirmText: {
				type: String,
				default: '确认'
			},
		},
		data() {
			return {
				modalWidth: 0
			}
		},
		created() {
			this.initModalWidth()
		},
		methods: {
			initModalWidth() {
				if (this.widthType === 'pixel') {
					this.modalWidth = this.width + 'px'
				} else {
					const window = uni.getWindowInfo()
					const windowWidth = window.windowWidth
					const tempWidth = this.width * (windowWidth / 100)
					this.modalWidth = (this.width - tempWidth) + 'px'
				}
			},
			modalClose() {
				this.$emit('modalClose')
			},
			modalConfirm() {
				this.$emit('modalConfirm')
			}
		}
	}
</script>

<style lang="scss" scoped>
	.modal-result {
		display: flex;
		flex-flow: column;
		align-items: center;

		.body {
			display: flex;
			flex-flow: column;
			align-items: center;
			margin: 16px 0;
		}

		.icon {
			border-radius: 100px;
			width: 60px;
			height: 60px;
			display: flex;
			flex-flow: row;
			justify-content: center;
			align-items: center;
			
			/deep/.u-icon__icon{
				font-size: 30px !important;
				line-height: 30px !important;
			}
		}
		
		.text{
			margin: 16px 0;
			text-align: center;
			line-height: 22px;
		}
	}
	.primary {
		.icon {
			background: #3c9cff;
			
			/deep/ .u-icon__icon{
				color: #ffffff !important;
			}
		}
	
		.text {
			color: #3c9cff;
		}
	}
	
	.error {
		.icon {
			background: #f56c6c;
			
			/deep/ .u-icon__icon{
				color: #ffffff !important;
			}
		}
	
		.text {
			color: #f56c6c;
		}
	}
</style>