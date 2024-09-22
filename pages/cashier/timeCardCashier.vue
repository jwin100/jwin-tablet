<template>
	<div class="container cashier">
		<default-header theme="light"></default-header>
		<u-row class="cashier-row">
			<u-col class="cashier-col cashier-card" span="4">
				<div class="card-title">
					<div>商品清单</div>
					<div style="display: flex; flex-flow: row; align-items: center;" v-if="cashier.memberId">
						会员：
						<div class="tag tag-circle" @click="memberChange"
							:class="cashier.memberId?'tag-primary-plain':''">
							{{cashier.member.name}}
						</div>
					</div>
				</div>
				<u-empty class="card-body-empty" v-if="cashier.cards.length===0"
					icon="../../static/img/empty/empty-card.png"></u-empty>
				<u-cell-group v-else class="card-body">
					<u-cell class="cell-item" v-for="card in cashier.cards" :key="card.key"
						@click="cardSelectItem(card)">
						<div class="cell-item-body" slot="label">
							<div class="cell-item-spu">
								<div class="spu-info">
									<span class="spu-name">{{card.skuName}}</span>
								</div>
								<div class="btn btn-error-plain btn-small btn-circle" @click="cardDeleteItem(card)">
									删除
								</div>
							</div>
							<div class="cell-item-price">
								<div>{{card.referenceTimeCardTotal}}次/{{card.unitName}}</div>
								<div><text
										style="font-size: 12px; color: #767a82;">{{card.timeCard.name}}</text>x{{card.quantity}}
								</div>
								<div>总：{{card.timeCardTotal}}次</div>
							</div>
						</div>
					</u-cell>
				</u-cell-group>
				<div class="card-sumarry">
					<div class="detail-list">
						<div class="detail-item preferential">
							<div>本次优惠</div>
							<div class="amount">
								<span>￥{{ cashier.preferentialAmount }}</span>
							</div>
						</div>
						<div class="detail-item payable">
							<div>应收金额</div>
							<div class="amount">￥
								<span>{{ cashier.payableAmount }}</span>
							</div>
						</div>
					</div>
				</div>
				<div class="card-footer">
					<div class="footer-item footer-left">
						<div class="btn btn-info-plain" @click="cardClear">清空购物车</div>
					</div>
					<div class="footer-item footer-right">
						<div class="btn btn-primary btn-submit" :loading="payLoading" @click="orderCreate">
							结账
						</div>
					</div>
				</div>
			</u-col>
			<u-col class="cashier-col" span="8">
				<div class="card-body">
					<div class="cashier-tabs">
						<div class="tabs-item" :class="cashierActiveName==='goods'?'active':''"
							@click="tabsChange('goods')">商品
						</div>
						<div class="tabs-item" :class="cashierActiveName==='member'?'active':''"
							@click="tabsChange('member')">会员
						</div>
						<div class="tabs-item" :class="cashierActiveName==='default'?'active':''"
							@click="tabsChange('default')">其他
						</div>
					</div>
					<div v-if="cashierActiveName==='goods'"
						style="overflow:hidden; flex: 1; display: flex; flex-flow: column;">
						<div style="padding: 0 8px;">
							<u-search v-model="spuSearchParam.keyword" placeholder="请输入商品信息" search-icon="scan"
								:show-action="false" @search="spuSearch" :clearabled="true" @clear="spuSearchClear">
							</u-search>
						</div>
						<div style="display: flex; flex-flow: row; overflow-y: hidden; flex: 1;">
							<u-empty class="card-body-empty" v-if="spuOptions.length===0"
								icon="../../static/img/empty/empty-search.png"></u-empty>
							<scroll-view v-else style="flex: 1;" scroll-y="true" @scrolltolower="spuScrollEvent()"
								lower-threshold="10">
								<u-grid :border="false" :col="spuCol" class="grid-body">
									<u-grid-item v-for="item in spuOptions" :key="item.id" class="grid-spu-item">
										<div class="grid-item">
											<div class="grid-item-content" @click="spuClick(item)">
												<div class="grid-item-flex">
													<div class="item-img">
														<u--image class="img" :src="item.picture" width="80px"
															height="80px">
															<div slot="error" style="font-size: 24rpx;"></div>
														</u--image>
													</div>
													<div class="item-text">
														<div class="name">{{ item.name }}</div>
														<div class="specs1" v-if="item.specs">
															<div class="specs">多规格</div>
														</div>
														<div class="amount">
															￥<span class="reference-amount">
																{{ item.referenceAmount }}
															</span>
															/{{ item.unitName }}
														</div>
													</div>
												</div>
											</div>
										</div>
									</u-grid-item>
								</u-grid>
								<u-loadmore style="padding-bottom: 16px;" v-if="spuSearchRows>1"
									:status="loadMoreStatus" />
							</scroll-view>
							<div class="spu-category">
								<div class="spu-category-viewider"></div>
								<div class="spu-category-list">
									<div class="category-item" v-for="category in categoryList" :key="category.id"
										:class="spuSearchParam.categoryId===category.id?'active':''"
										@click="selectCategoryHandle(category)">
										{{ category.name }}
									</div>
								</div>
							</div>
						</div>
					</div>
					<div v-if="cashierActiveName==='member'">
						<div v-if="cashier.memberId" class="member">
							<div class="member-info">
								<u--form labelAlign="right" labelWidth="60">
									<u-form-item label="姓名:">
										<div class="item">
											<div>{{ cashier.member.name }}</div>
											<div style="display: flex; flex-flow: row; margin-left: 16px;">
												<div class="btn btn-primary-plain" @click="memberChange">更换</div>
												<div class="btn btn-error-plain" @click="memberClear">删除</div>
											</div>
										</div>
									</u-form-item>
									<u-form-item label="手机号:">{{ cashier.member.phone }}</u-form-item>
									<u-form-item label="余额:">
										<div class="item">
											<div class="text">{{ cashier.member.nowRecharge }}</div>
											<div style="display: flex; flex-flow: row; margin-left: 16px;">
												<div class="btn btn-primary-plain" @click="memberClear">充值</div>
											</div>
										</div>
									</u-form-item>
									<u-form-item label="积分:">
										<div>{{ cashier.member.nowIntegral }}</div>
									</u-form-item>
								</u--form>
							</div>
							<u-divider textPosition="left" text="计次卡"></u-divider>
							<div class="member-time-card">
								<u-grid :border="false" :col="memberCol" class="grid-time-card-body">
									<u-grid-item v-for="item in memberTimeCardOptions" :key="item.id">
										<div class="grid-time-card-item">
											<div class="time-card-header">
												<div>{{item.name}}</div>
												<div class="btn btn-info-plain">续次</div>
											</div>
											<div class="time-card-body">
												<div class="item-text">
													<div class="text">
														剩余可用次数：
														<div style="color: #53c21d; font-size: 16px;">
															{{item.nowTimeCard}}
														</div>
													</div>
													<div class="text" style="margin-top: 12px;">可用商品：-</div>
												</div>
												<div class="item-text">
													<div class="text">
														有效期：
														<div v-if="item.expireTime">{{item.expireTime}}</div>
														<div v-else style="color: #f1a532;">永久有效</div>
													</div>
												</div>
											</div>
										</div>
									</u-grid-item>
								</u-grid>
							</div>
						</div>
					</div>
					<div v-if="cashierActiveName==='default'">
						<div style="padding: 16px;">
							<u--form label-position="right" label-width="80px" :model="cashier">
								<u-form-item label="服务人员">
									<u-checkbox-group style="padding: 8px 0;" v-model="cashier.serviceAccounts"
										placement="row">
										<u-checkbox :customStyle="{marginBottom: '8px'}" v-for="item in serviceAccounts"
											:key="item.id" :label="item.name" :value="item.id">
										</u-checkbox>
									</u-checkbox-group>
								</u-form-item>
								<u-form-item label="整单备注">
									<u--textarea style="text-align: left;" v-model="cashier.remark" placeholder="输入备注信息"
										count></u--textarea>
								</u-form-item>
							</u--form>
						</div>
					</div>
				</div>
				<div class="card-footer">
					<div class="footer-item footer-left">
						<div class="btn btn-info-plain" @click="goBackCashier">
							返回收银台
						</div>
					</div>
				</div>
			</u-col>
		</u-row>
		<u-modal title="选择商品" :show="skuDialogVisible" @close="skuDialogVisible=false" :closeOnClickOverlay="true"
			:showConfirmButton="false" :width="modalWidth">
			<div class="slot-content">
				<u-grid :border="false" :col="skuCol" class="grid-body">
					<u-grid-item v-for="item in skuOptions" :key="item.skuId">
						<div class="grid-item">
							<div class="grid-item-content" @click="skuClick(item)">
								<div class="grid-item-flex">
									<div class="item-img">
										<u--image class="img" :src="item.picture" width="80px" height="80px">
											<div slot="error" style="font-size: 24rpx;"></div>
										</u--image>
									</div>
									<div class="item-text">
										<div class="name">{{ item.skuName }}</div>
										<div class="specs1">
											<div class="specs">{{ item.statusName }}</div>
										</div>
										<div class="amount">
											<div>￥
												<span class="reference-amount">{{ item.referenceAmount }}</span>
												/{{ item.unitName }}
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</u-grid-item>
				</u-grid>
			</div>
		</u-modal>
		<u-modal title="选择会员" :show="memberDialogVisible" @close="memberDialogVisible=false" :closeOnClickOverlay="true"
			:showConfirmButton="false" :width="modalWidth">
			<div class="slot-content">
				<div class="search-member">
					<u-search v-model="memberSearchKeyword" placeholder="请输入会员信息并确认" :show-action="false"
						@search="memberSearch" :clearabled="true" @clear="memberSearchClear">
					</u-search>
				</div>
				<u-grid :border="false" :col="memberCol" class="grid-body">
					<u-grid-item v-for="item in memberOptions" :key="item.skuId">
						<div class="grid-item">
							<div class="grid-item-content" @click="memberClick(item)">
								<div class="grid-item-flex">
									<div class="item-img">
										<u--image class="img" :src="item.headPath" width="80px" height="80px">
											<div slot="error" style="font-size: 24rpx;"></div>
										</u--image>
									</div>
									<div class="item-text">
										<div class="name">
											{{ item.phone }}
										</div>
										<div class="amount">
											{{ item.name }}
										</div>
									</div>
								</div>
							</div>
						</div>
					</u-grid-item>
				</u-grid>
			</div>
		</u-modal>
		<u-modal title="修改商品数量" :show="quantityDialogVisible" @close="quantityDialogVisible=false"
			:closeOnClickOverlay="true" :showConfirmButton="false" :width="modalWidth">
			<div class="slot-content" style="overflow-y: auto;">
				<div class="slot-modal">
					<u--form ref="cardItemRef" :model="selectCashierCardItem" labelPosition="left" labelAlign="right"
						label-width="100px">
						<u-form-item label="商品数量:" prop="quantity">
							<u--input placeholder="输入商品数量" type="number"
								v-model="selectCashierCardItem.quantity"></u--input>
						</u-form-item>
						<u-form-item label="选择计次卡:" prop="quantity">
							<div class="member-time-card" style="flex: 1;">
								<u-grid :border="false" :col="memberCol" class="select-time-card-body" :class="">
									<u-grid-item v-for="item in selectCashierCardItem.timeCardList" :key="item.id">
										<div style="padding: 10px; cursor: pointer;"
											@click="selectTimeCardHandle(item)">
											<div class="grid-time-card-item"
												:class="selectCashierCardItem.timeCardId===item.id?'active':''">
												<div class="time-card-header">
													<div>{{item.name}}</div>
												</div>
												<div class="time-card-body">
													<div class="item-text">
														<div class="text">
															<div>剩余可用次数：</div>
															<div style="color: #53c21d; font-size: 16px;">
																{{item.nowTimeCard}}
															</div>
														</div>
														<div class="text" style="margin-top: 12px;">可用商品：-</div>
													</div>
													<div class="item-text">
														<div class="text">
															有效期：
															<div v-if="item.expireTime">{{item.expireTime}}</div>
															<div v-else style="color: #f1a532;">永久有效</div>
														</div>
													</div>
												</div>
											</div>
										</div>
									</u-grid-item>
								</u-grid>
							</div>
						</u-form-item>
					</u--form>
					<div class="footer">
						<div class="btn btn-info-plain" @click="saleReferenceClose">取消</div>
						<div class="btn btn-primary" @click="saleReferenceSubmit">确定</div>
					</div>
				</div>
			</div>
		</u-modal>
		<i-modal title="" :show="payFinishDialogVisible" :icon="payState.icon" :text="payState.text"
			:content="payState.content" :theme="payState.theme" :show-confirm="true" @modalConfirm="continueCashier">
		</i-modal>
		<i-toast ref="iToast"></i-toast>
	</div>
</template>

<script>
	import cashierDiscount from '../../api/cashier/cashierDiscount'
	import cashierIgnore from '../../api/cashier/cashierIgnore'
	import cashierOrder from '../../api/cashier/cashierOrder'
	import category from '../../api/goods/category'
	import member from '../../api/member/member'
	import timeCard from '../../api/member/timeCard'
	import payment from '../../api/cashier/payment'
	import staff from '../../api/security/staff'
	import stockStore from '../../api/stock/stockStore'
	import config from '../../common/config'
	import global from '../../common/const/global'
	export default {
		data() {
			return {
				spuCol: 3,
				skuCol: 3,
				memberCol: 3,
				modalWidth: '700px',
				payLoading: false,
				orderId: '',
				cashier: {
					type: 1,
					discount: 10,
					discountAmount: 0, // 打折
					ignoreType: 0,
					ignoreAmount: 0, // 抹零
					preferentialAmount: 0, // 优惠金额
					collectAmount: 0, // 优惠后金额
					adjustAmount: 0, // 调整金额
					payableAmount: 0, // 应收
					remark: '',
					memberId: '',
					member: {},
					cards: [],
					source: config.platformCode
				},
				cashierActiveName: 'goods',
				loadMoreStatus: 'loadmore',
				spuSearchLoading: false,
				spuSearchParam: {
					keyword: '',
					categoryId: '',
					pageIndex: 1,
					pageSize: 30
				},
				spuSearchRows: 0,
				spuOptions: [],
				skuDialogVisible: false,
				skuOptions: [],
				quantityDialogVisible: false,
				selectCashierCardItem: {},
				memberDialogVisible: false,
				memberSearchKeyword: '',
				memberOptions: [],
				memberTimeCardOptions: [],
				categoryList: [],
				defaultCategory: {
					id: '',
					name: '全部分类'
				},
				serviceAccounts: [],
				selectPay: {
					payCode: 7
				},
				payFinishDialogVisible: false,
				payErrorDialogVisible: false,
				payState: {}
			}
		},
		onShow() {
			this.initSystem()
			uni.onWindowResize(this.windowResizeCallback)
		},
		created() {
			this.getMemberInfo()
			this.getCategoryList()
			this.getServiceAccount()
		},
		methods: {
			windowResizeCallback(res) {
				const width = res.size.windowWidth
				this.initCol(width)
			},
			initSystem() {
				const window = uni.getWindowInfo()
				const width = window.windowWidth
				this.initCol(width)
			},
			initCol(width) {
				this.modalWidth = global.getModalWidth()
				if (width <= 800) {
					this.spuCol = 2
					this.skuCol = 1
					this.memberCol = 1
				} else if (width <= 1000) {
					this.spuCol = 2
					this.skuCol = 1
					this.memberCol = 2
				} else if (width <= 1300) {
					this.spuCol = 3
					this.skuCol = 2
					this.memberCol = 3
				} else if (width <= 1600) {
					this.spuCol = 4
					this.skuCol = 3
					this.memberCol = 4
				} else {
					this.spuCol = 5
					this.skuCol = 4
					this.memberCol = 5
				}
			},
			// 会员信息
			getMemberInfo() {
				if (!this.cashier.memberId) {
					this.memberChange()
				}
			},
			// 服务人员
			getServiceAccount() {
				this.serviceAccounts = []
				staff.accountList().then(res => {
					if (res.data) {
						this.serviceAccounts = res.data
					}
				})
			},
			// 商品分类
			getCategoryList() {
				category.categoryList().then(res => {
					this.categoryList = [this.defaultCategory]
					res.data.forEach(x => {
						this.categoryList.push({
							id: x.id,
							name: x.name
						})
					})
					this.spuSearchList()
				})
			},
			// 选择分类
			selectCategoryHandle(item) {
				this.spuSearchParam.keyword = ''
				this.spuSearchParam.categoryId = item.id
				this.spuOptions = []
				this.spuSearchList()
			},
			// 修改购物车商品数量
			cardSelectItem(row) {
				// 转换解除双向绑定
				console.log(row)
				this.selectCashierCardItem = {
					...row
				}
				this.quantityDialogVisible = true
			},
			// 删除购物车商品数量
			cardDeleteItem(item) {
				const index = this.cashier.cards.findIndex(x => x.skuId === item.skuId)
				if (index >= 0) {
					this.cashier.cards.splice(index, 1)
					this.cashierAmount()
				}
			},
			selectTimeCardHandle(item) {
				this.selectCashierCardItem.timeCard = item
				this.selectCashierCardItem.timeCardId = item.id
			},
			saleReferenceClose() {
				this.quantityDialogVisible = false
				this.selectCashierCardItem = {}
			},
			saleReferenceSubmit() {
				if (Number(this.selectCashierCardItem.quantity) === 0) {
					this.cardDeleteItem(this.selectCashierCardItem)
				} else {
					this.cashier.cards.forEach(card => {
						if (this.selectCashierCardItem.key === card.key) {
							card.quantity = this.selectCashierCardItem.quantity
						}
					})
				}
				this.cashierAmount()
				this.saleReferenceClose()
			},
			// 清空购物车
			cardClear() {
				this.cashier = {
					type: 0,
					discount: 10,
					discountAmount: 0, // 打折
					ignoreType: 0,
					ignoreAmount: 0, // 抹零
					preferentialAmount: 0, // 优惠金额
					collectAmount: 0, // 优惠后金额
					adjustAmount: 0, // 调整金额
					payableAmount: 0, // 应收
					remark: '',
					memberId: '',
					member: {},
					cards: [],
					source: config.platformCode
				}
				this.orderId = ''
			},
			tabsChange(activeName) {
				this.cashierActiveName = activeName
				if (activeName === 'member') {
					if (!this.cashier.memberId) {
						this.memberDialogVisible = true
					}
				}
			},
			spuSearchClear() {
				this.spuSearchParam.keyword = ''
			},
			spuSearch(query) {
				if (query) {
					this.spuSearchParam.categoryId = ''
				}
				this.spuSearchList()
			},
			spuSearchList(type) {
				if (this.spuSearchParam.keyword) {
					this.spuSearchParam.categoryId = ''
				} else {
					this.spuSearchParam.keyword = ''
				}
				this.spuSearchLoading = true
				this.loadMoreStatus = 'loading'
				stockStore.stockSpuSearchByKeyword(this.spuSearchParam).then(res => {
					if (this.spuSearchParam.pageIndex === 1) {
						this.spuOptions = []
					}
					if (res.data) {
						this.spuSearchRows = res.data.rows
						res.data.data.forEach(x => this.spuOptions.push(x))
						if (this.spuSearchParam.keyword && res.data.total === 1) {
							const spuId = this.spuOptions[0].id
							this.skuSearch(spuId)
						}
					}
				}).catch(() => {
					this.spuOptions = []
				}).finally(() => {
					this.spuSearchLoading = false
					if (this.spuSearchRows === this.spuSearchParam.pageIndex) {
						this.loadMoreStatus = 'nomore'
					} else {
						this.loadMoreStatus = 'loadmore'
					}
					this.spuSearchClear()
				})
			},
			skuSearch(spuId) {
				stockStore.stockSkuSearch(spuId).then(res => {
					this.skuOptions = res.data
					if (this.skuOptions.length === 1) {
						this.addCard(this.skuOptions[0])
					} else {
						this.skuDialogVisible = true
					}
				})
			},
			addCard(item) {
				const index = this.cashier.cards.findIndex(x => x.skuId === item.skuId)
				if (index >= 0) {
					this.cashier.cards[index].quantity += 1
					this.cashierAmount()
					return
				}
				let timeCard = {}
				this.initTimeCard(item.spuId).then(res => {
					const timeCardList = res
					if (timeCardList.length > 1) {
						// 弹窗选择计次卡
					} else if (timeCardList.length > 0) {
						// 默认选中计次卡
						timeCard = timeCardList[0]
					} else {
						// 提示商品没有计次卡信息
						// uni.showToast({
						// 	icon: 'error',
						// 	title:'此商品没有对应计次卡可核销'
						// })
						this.$refs.iToast.show({
							theme: 'error',
							icon: 'close',
							text: '此商品没有对应计次卡可核销'
						})
						return
					}
					const card = {
						key: new Date().getTime().toString(),
						skuId: item.skuId,
						spuId: item.spuId,
						skuName: item.skuName,
						skuNo: item.skuNo,
						quantity: 1,
						sellStock: item.sellStock,
						referenceTimeCardTotal: 1,
						skuNo: item.skuNo,
						timeCardList: timeCardList,
						timeCard: timeCard,
						timeCardId: timeCard.id
					}
					this.cashier.cards.push(card)
					this.cashierAmount()
				})
			},
			async initTimeCard(spuId) {
				if (!this.cashier.memberId) {
					return
				}
				let timeCardList = []
				await timeCard.memberTimeCardBySpuIdList(this.cashier.memberId, spuId).then(res => {
					timeCardList = res.data
				})
				return timeCardList
			},
			cashierAmount() {
				cashierOrder.cashierOrderCompute(this.cashier).then(res => {
					const data = res.data
					this.cashier.cards.forEach(card => {
						const skus = data.skus
						const findIndex = skus.findIndex(y => y.key === card.key)
						if (findIndex >= 0) {
							this.$set(card, 'timeCardTotal', skus[findIndex].timeCardTotal)
						}
					})
				})
			},
			spuScrollEvent() {
				if (this.spuSearchParam.pageIndex < this.spuSearchRows) {
					this.spuSearchParam.pageIndex += 1
					this.spuSearchList()
				}
			},
			spuClick(item) {
				this.skuSearch(item.id)
			},
			skuClick(item) {
				this.skuDialogVisible = false
				this.addCard(item)
			},
			saleHangList() {

			},
			memberSearch(query) {
				if (query !== '') {
					this.memberSearchLoading = true
					member.memberSearch(query).then(res => {
						this.memberOptions = res.data || []
					}).finally(() => {
						this.memberSearchLoading = false
					})
				}
			},
			memberSearchClear() {
				this.memberSearchKeyword = ''
			},
			memberClick(item) {
				this.memberDialogVisible = false
				this.cashier.member = item
				this.cashier.memberId = item.id
				this.getMemberTimeCardList()
			},
			memberChange() {
				this.memberDialogVisible = true
			},
			memberClear() {
				this.cashier.member = {}
				this.cashier.memberId = ''
			},
			getMemberTimeCardList() {
				timeCard.memberTimeCardList(this.cashier.memberId).then(res => {
					this.memberTimeCardOptions = res.data || []
				})
			},
			orderCreate() {
				cashierOrder.cashierOrderConfirm(this.cashier).then(res => {
					this.orderId = res.data
					this.cashierPay()
				})
			},
			cashierPay() {
				uni.showLoading({
					title: '正在支付中，请勿关闭',
					mask: true
				})
				const param = {
					id: this.orderId,
					payCode: this.selectPay.payCode
				}
				cashierOrder.cashierOrderPay(param).then(res => {
					uni.hideLoading()
					this.payFinishDialogVisible = true
					this.payState = {
						icon: 'checkbox-mark',
						text: '支付完成',
						content: '支付成功描述',
						theme: 'primary'
					}
				}).finally(() => {
					uni.hideLoading()
				})
			},
			continueCashier() {
				this.cashier = {
					type: 0,
					discount: 10,
					discountAmount: 0, // 打折
					ignoreType: 0,
					ignoreAmount: 0, // 抹零
					preferentialAmount: 0, // 优惠金额
					collectAmount: 0, // 优惠后金额
					adjustAmount: 0, // 调整金额
					payableAmount: 0, // 应收
					remark: '',
					memberId: '',
					member: {},
					cards: [],
					source: config.platformCode
				}
				this.orderId = ''
				this.payFinishDialogVisible = false
				this.payErrorDialogVisible = false
			},
			goBackCashier() {
				uni.navigateTo({
					url: '/pages/cashier/cashier'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import "@/common/css/cashier.scss"
</style>