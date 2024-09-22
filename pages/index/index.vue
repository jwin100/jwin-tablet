<template>
	<div class="container index">
		<div class="index-bg"></div>
		<default-header theme='dark'></default-header>
		<div class="index-body">
			<u-grid :border="false" :col="col">
				<u-grid-item class="menu-item" v-for="(item,index) in menuList" :key="index"
					@click="menuHandle(item.path)">
					<div class="item">
						<u-icon class="menu-icon" :name="item.icon" :size="66"></u-icon>
						<text class="menu-title grid-text">{{item.title}}</text>
					</div>
				</u-grid-item>
			</u-grid>
		</div>
	</div>
</template>

<script>
import global from '../../common/const/global'
	export default {
		data() {
			return {
				col: 5,
				menuList: [{
						title: '收银',
						icon: '../../static/img/index/index-email.png',
						path: '/pages/cashier/cashier'
					},
					{
						title: '订单',
						icon: '../../static/img/index/index-email.png',
						path: '/pages/order/order'
					},
					{
						title: '会员',
						icon: '../../static/img/index/index-email.png',
						path: '/pages/index/index'
					},
					{
						title: '设置',
						icon: '../../static/img/index/index-email.png',
						path: '/pages/index/index'
					},
				]
			}
		},
		created() {
			this.col = global.getGridCol()
		},
		methods: {
			menuHandle(path) {
				uni.navigateTo({
					url: path
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.index-bg {
		position: fixed;
		left: 0;
		top: 0;
		height: 100%;
		width: 100%;
		background-image: url('../../static/img/index/index_bg.png');
		background-repeat: no-repeat;
	}

	.index-body {
		position: relative;
		padding: 32px 0;
		color: #ffffff;

		.menu-item {
			cursor: pointer;
			inline-size: auto;
			transition: transform .2s cubic-bezier(.32, .08, .24, 1);

			.menu-title {
				margin-top: 12px;
			}

			.item {
				display: flex;
				flex-flow: column;
				align-items: center;
				justify-content: center;
				border-radius: 10px;
				padding: 26px;
			}

			.item:hover {
				backdrop-filter: blur(15px) saturate(0.9) brightness(1.4);
			}

			.menu-icon,
			.menu-title {
				text-shadow: 2px 2px 4px #22222230, 0 0 3px #000;
				transform: 400ms 200ms cubic-bezier(0.9, 0, 0.1, 1), transform 200ms;
			}
		}
	}
</style>