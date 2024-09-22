<template>
	<div class="container cashier">
		<default-header theme="light"></default-header>
		<u-row class="cashier-row">
			<u-col class="cashier-col cashier-card" span="4">
				<div class="card-title">
					<div>商品清单</div>
					<div style="display: flex; flex-flow: row; align-items: center; padding: 2px 6px;">
						会员：
						<div class="tag tag-circle" @click="memberChange"
							:class="cashier.memberId?'tag-primary-plain':'tag-info-plain'">
							{{cashier.member.name || '散客'}}
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
								<div class="spu-delete" @click="cardDeleteItem(card)">
									删除
								</div>
							</div>
							<div class="cell-item-price">
								<div>
									￥{{card.referenceAmount}}
									<text v-if="card.unitName">/{{card.unitName}}</text>
								</div>
								<div>x{{card.quantity}}</div>
								<div>￥{{card.payableAmount}}</div>
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
						<div class="btn btn-info-plain" @click="clearCard()">清空购物车</div>
					</div>
					<div class="footer-item footer-right">
						<div class="btn btn-primary btn-submit" :loading="payLoading" @click="orderCreate">
							结账
						</div>
					</div>
				</div>
			</u-col>
			<u-col class="cashier-col cashier-goods" span="8">
				<div class="card-body">
					<div class="cashier-tabs">
						<div class="tabs-item" :class="cashierActiveName==='goods'?'active':''"
							@click="tabsChange('goods')">商品
						</div>
						<div class="tabs-item" :class="cashierActiveName==='member'?'active':''"
							@click="tabsChange('member')">会员
						</div>
						<div class="tabs-item" :class="cashierActiveName==='remark'?'active':''"
							@click="tabsChange('remark')">备注
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
						<div class="spu-line"></div>
						<div style="display: flex; flex-flow: row; overflow-y: hidden; flex: 1;">
							<u-empty class="card-body-empty" v-if="spuOptions.length===0"
								icon="../../static/img/empty/empty-search.png"></u-empty>
							<scroll-view v-else style="flex: 1;" scroll-y="true" @scrolltolower="spuScrollEvent()"
								lower-threshold="10">
								<u-grid :border="false" col="2" class="grid-body">
									<u-grid-item v-for="item in spuOptions" :key="item.id">
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
													<div class="text">可用商品：-</div>
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
					<div v-if="cashierActiveName==='remark'">
						<div style="padding: 16px;">
							<u--form label-position="right" label-width="80px" :model="cashier">
								<u-form-item label="调整总价" borderBottom>
									<u--input border="none" type="number" placeholder="输入调整价格"
										v-model="cashier.adjustAmount" @input="cashierAmount"></u--input>
								</u-form-item>
								<u-form-item label="整单折扣" borderBottom>
									<u-radio-group style="padding: 4px;" v-model="cashier.discount" placement="row">
										<u-radio v-for="item in discountList" :key="item.discount"
											:label="item.discountName" :name="item.discount"
											style="padding: 4px; cursor: pointer;">
										</u-radio>
									</u-radio-group>
								</u-form-item>
								<u-form-item label="抹零方式" borderBottom>
									<u-radio-group style="padding: 4px;" v-model="cashier.ignoreType" placement="row">
										<u-radio v-for="item in ignoreTypeList" :key="item.value" :label="item.label"
											:name="item.value" style="padding: 4px; cursor: pointer;">
										</u-radio>
									</u-radio-group>
								</u-form-item>
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
					<div v-if="cashierActiveName==='default'">
						<u-grid :border="false" :col="spuCol" class="default-body">
							<u-grid-item>
								<div class="grid-default-item" @click="logout()">
									<div class="name">交班</div>
								</div>
							</u-grid-item>
						</u-grid>
					</div>
				</div>
				<div class="card-footer">
					<div class="footer-item footer-left">
						<div class="btn btn-info-plain" @click="tempSpuSelect">
							临时商品销售
						</div>
						<div class="btn btn-success-plain" @click="timeCardSaleClick">
							计次核销
						</div>
					</div>
					<div class="footer-item footer-right">
						<div class="box" style="position:relative;">
							<div class="btn btn-info-plain" @click="saleHangList(1)">查看挂单</div>
							<u-badge type="error" max="99" :value="hangList.length" :absolute="true"
								:offset="[-6,6]"></u-badge>
						</div>
						<div class="btn btn-primary-plain btn-submit" :loading="hangBtnLoading" @click="saleHang">
							挂单
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
											<div slot="error" style="font-size: 24px;"></div>
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
		<u-modal title="添加临时商品" :show="tempSpuDialogVisible" @close="tempSpuDialogVisible=false"
			:closeOnClickOverlay="true" :showConfirmButton="false" :width="modalWidth">
			<div class="slot-content" style="overflow-y: auto;">
				<div class="slot-modal">
					<u--form ref="tempSpuForm" :rules="tempSpuRules" :model="tempSpu" labelPosition="left"
						labelAlign="right" label-width="80px">
						<u-form-item label="商品名称:" prop="skuName">
							<u--input placeholder="输入商品名称" maxlength="100" v-model="tempSpu.skuName"></u--input>
						</u-form-item>
						<u-form-item label="商品单价:" prop="adjustAmount">
							<u--input placeholder="输入商品单价" type="number" v-model="tempSpu.adjustAmount"></u--input>
						</u-form-item>
						<u-form-item label="商品数量:" prop="quantity">
							<u--input placeholder="输入商品数量" type="number" v-model="tempSpu.quantity"></u--input>
						</u-form-item>
					</u--form>
					<div class="footer">
						<div class="btn btn-info-plain" @click="tempSpuClose">取消</div>
						<div class="btn btn-primary" @click="tempSpuSubmit">确定</div>
					</div>
				</div>
			</div>
		</u-modal>
		<u-modal title="修改商品数量" :show="quantityDialogVisible" @close="quantityDialogVisible=false"
			:closeOnClickOverlay="true" :showConfirmButton="false" :width="modalWidth">
			<div class="slot-content" style="overflow-y: auto;">
				<div class="slot-modal">
					<u--form ref="cardItemRef" :model="selectCashierCardItem" labelPosition="left" labelAlign="right"
						label-width="80px">
						<u-form-item label="商品数量:" prop="quantity">
							<u--input placeholder="输入商品数量" type="number"
								v-model="selectCashierCardItem.quantity"></u--input>
						</u-form-item>
					</u--form>
					<div class="footer">
						<div class="btn btn-info-plain" @click="saleReferenceClose">取消</div>
						<div class="btn btn-primary" @click="saleReferenceSubmit">确定</div>
					</div>
				</div>
			</div>
		</u-modal>
		<u-modal title="挂单" :closeOnClickOverlay="true" @close="hangDialogVisible=false" :showConfirmButton="false"
			:show="hangDialogVisible">
			<div class="slot-content" style="overflow-y: auto;">
				<u--form ref="hangForm" labelPosition="left" :model="hangInfo" :rules="hangFormRules">
					<u-form-item label="名称" prop="name">
						<u--input maxlength="30" v-model="hangInfo.name" rules></u--input>
					</u-form-item>
					<u-form-item label="备注" prop="remark">
						<u--textarea v-model="hangInfo.remark" placeholder="请输入内容"></u--textarea>
					</u-form-item>
				</u--form>
				<div class="footer btn">
					<div class="btn btn-info-plain" @click="saleHangClose">取 消</div>
					<div class="btn btn-primary" @click="saleHangSubmit">确 定</div>
				</div>
			</div>
		</u-modal>
		<u-popup :show="hangPopupVisible" mode="right" @close="hangPopupVisible=false">
			<div class="popup-hang-list">
				<div class="popup-hang-title">
					挂单列表
				</div>
				<u-collapse class="popup-hang-content" :accordion="true">
					<u-collapse-item v-for="hang in hangList" :key="hang.id">
						<div slot="title">
							<div class="hang-item-title">
								{{hang.name}}
								<text style="color: ;">
									({{hang.updateTime}})
								</text>
							</div>
						</div>
						<div class="hang-item-content">
							<div class="header">
								<div class="total">
									<div class="expand-total-text">
										<div>
											共{{ hang.quantity }}件商品
										</div>
										<div>
											合计: ￥
											<text style="color: #e6a23c; font-size: 15px">
												{{ hang.computeAmount }}
											</text>
										</div>
									</div>
									<div class="expand-total-btn">
										<div class="btn btn-primary-plain" @click="saleHangTake(hang.hangNo)">取单
										</div>
									</div>
								</div>
								<div v-if="hang.remark" class="remark">
									<span>备注:{{ hang.remark }}</span>
								</div>
							</div>
							<u-line></u-line>
							<u-cell-group :border="false" class="content">
								<u-cell v-for="(item, index) in hang.items" :key="index">
									<div class="cell-item" slot="label">
										<div class="cell-item-spu">
											{{item.skuName}}
										</div>
										<div class="cell-item-price">
											<text class="title">单价:￥{{ item.referenceAmount }}</text>
											<text class="sub-title">数量:{{ item.quantity }}</text>
											<text class="sub-title">小计:{{ item.payableAmount }}</text>
										</div>
									</div>
								</u-cell>
							</u-cell-group>
						</div>
					</u-collapse-item>
				</u-collapse>
			</div>
		</u-popup>
		<u-modal title="支付" class="payment" :show="payTypeDialogVisible" :closeOnClickOverlay="false"
			:showConfirmButton="false" :width="modalWidth">
			<div class="slot-content" style="overflow-y: auto;">
				<div class="slot-modal pay-type">
					<div class="header">
						<span>应收款：{{ payResult.payableAmount }}</span>
						<u-line direction="col"></u-line>
						<span>已收款：{{ payResult.receivedAmount }}</span>
						<u-line direction="col"></u-line>
						<span>待收款：{{ payResult.waitAmount }}</span>
					</div>
					<div class="body">
						<div class="pay-amount">
							<u--form labelPosition="left" :model="model1" ref="payAamountForm" :labelWidth="80">
								<u-form-item label="支付金额：" prop="payAmount" borderBottom ref="item1">
									<u--input v-model="payAmount" type="number" border="none" fontSize="20"></u--input>
								</u-form-item>
							</u--form>
						</div>
						<u-grid :col='3'>
							<u-grid-item class="pay-list" v-for="item in payTypes" :key="item.payCode">
								<div class="pay-item" :class="item.payCode===selectPay.payCode?'active':''"
									@click="nativePayType(item)">
									<u-icon style="margin-top: 16px;" :size="22"
										:name="`../../static/img/paytype/${item.icon}.png`"></u-icon>
									<text style="margin: 16px 0;">{{ item.typeDesc }}</text>
								</div>
							</u-grid-item>
						</u-grid>
					</div>
					<div class="footer">
						<div class="btn btn-info-plain" @click="payTypeCancel">取消收款</div>
						<div class="btn btn-primary" @click="payTypeConfirm">确认收款</div>
					</div>
				</div>
			</div>
		</u-modal>
		<u-modal title="支付中" class="payment" :show="payStateDialogVisible" :closeOnClickOverlay="false"
			:showConfirmButton="false" :width="modalWidth">
			<div class="slot-content" style="overflow-y: auto;">
				<div class="slot-modal pay-type">
					<div class="body">
						<div class="scan-pay">
							<u--image :showLoading="true" src="../../static/img/cashier/scanCode.png" width="80px"
								height="80px"></u--image>
							<text class="text">使用扫码枪扫描客户二维码收款</text>
						</div>
					</div>
					<div class="footer">
						<div class="btn btn-info-plain" @click="payStateCancel">取消</div>
					</div>
				</div>
			</div>
		</u-modal>
		<i-modal title="支付结果" :show="payFinishDialogVisible" :showConfirm="true" confirmText="继续收银"
			:icon="payState.icon" :text="payState.text" :content="payState.content" :theme="payState.theme"
			@modalConfirm="clearCard()">
		</i-modal>
		<u-modal title="交班确认" class="logout" :show="logoutDialogVisible" :closeOnClickOverlay="false" confirm-text="交班"
			:show-cancel-button="true" width="300px" content="确认交班吗" @cancel="logoutDialogVisible=false"
			@confirm="logoutConfirm">
		</u-modal>
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
	import login from '../../api/auth/login'
	import cashierHang from '../../api/cashier/cashierHang'
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
				tempSpuDialogVisible: false,
				tempSpu: {
					skuName: '',
					adjustAmount: '',
					quantity: ''
				},
				quantityDialogVisible: false,
				selectCashierCardItem: {},
				memberDialogVisible: false,
				memberSearchKeyword: '',
				memberOptions: [],
				memberTimeCardOptions: [],
				hangDialogVisible: false,
				hangPopupVisible: false,
				hangBtnLoading: false,
				hangFormRules: {
					'name': {
						type: 'string',
						required: true,
						message: '请填写备注信息',
						trigger: ['blur', 'change']
					}
				},
				hangInfo: {
					name: '',
					remark: ''
				},
				hangList: [],
				categoryList: [],
				defaultCategory: {
					id: '',
					name: '全部分类'
				},
				serviceAccounts: [],
				ignoreTypeList: [{
						value: 0,
						label: '不抹零'
					},
					{
						value: 1,
						label: '抹分'
					},
					{
						value: 2,
						label: '抹角'
					},
					{
						value: 3,
						label: '元取整'
					}
				],
				defaultIgnoreType: {},
				discountList: [],
				tempSpuRules: {
					'skuName': {
						type: 'string',
						required: true,
						message: '请填写商品名',
						trigger: ['blur', 'change']
					},
					'adjustAmount': {
						type: 'number',
						required: true,
						message: '请填写单价',
						trigger: ['blur', 'change']
					},
					'quantity': {
						type: 'number',
						required: true,
						message: '请填写购买数量',
						trigger: ['blur', 'change']
					}
				},
				payTypeDialogVisible: false,
				payResult: {},
				payTypes: [],
				selectPay: {},
				payAmount: 0,
				authCode: '',
				payStateDialogVisible: false,
				payFinishDialogVisible: false,
				payErrorDialogVisible: false,
				payState: {},
				logoutDialogVisible: false
			}
		},
		onShow() {
			this.initSystem()
			uni.onWindowResize(this.windowResizeCallback)
		},
		created() {
			this.getCategoryList()
			this.getServiceAccount()
			this.getIgnoreInfo()
			this.getDiscountList()
			this.getPayType()
			this.saleHangList(0)
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
			getServiceAccount() {
				this.serviceAccounts = []
				staff.accountList().then(res => {
					if (res.data) {
						this.serviceAccounts = res.data
					}
				})
			},
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
			selectCategoryHandle(item) {
				this.spuSearchParam.keyword = ''
				this.spuSearchParam.categoryId = item.id
				this.spuOptions = []
				this.spuSearchList()
			},
			cardSelectItem(item) {
				// 转换解除双向绑定
				this.selectCashierCardItem = {
					...item
				}
				this.quantityDialogVisible = true
			},
			cardDeleteItem(item) {
				const findIndex = this.cashier.cards.findIndex(x => x.skuId === item.skuId)
				if (findIndex >= 0) {
					this.cashier.cards.splice(findIndex, 1)
					this.cashierAmount()
				}
			},
			orderCreate() {
				cashierOrder.cashierOrderConfirm(this.cashier).then(res => {
					this.orderId = res.data
					this.payTypeDialogVisible = true
					this.getPayResult()
				})
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
			tempSpuSelect() {
				this.tempSpuDialogVisible = true
			},
			tempSpuClose() {
				this.tempSpu = {}
				this.tempSpuDialogVisible = false
			},
			tempSpuSubmit() {
				this.$refs.tempSpuForm.validate().then(valid => {
					this.tempAddCard(this.tempSpu)
					this.tempSpuClose()
				}).catch((error) => {
					console.log(error)
				})
			},
			tempAddCard(item) {
				const index = this.cashier.cards.findIndex(x => x.skuId === item.skuId)
				if (index >= 0) {
					this.cashier.cards[index].quantity += 1
				} else {
					const card = {
						key: new Date().getTime().toString(),
						skuId: item.skuId,
						skuName: item.skuName,
						quantity: item.quantity,
						adjustAmount: item.adjustAmount,
						payableAmount: item.payableAmount,
						skuNo: item.skuNo
					}
					this.cashier.cards.push(card)
				}
				this.cashierAmount()
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
			addCard(item) {
				const index = this.cashier.cards.findIndex(x => x.skuId === item.skuId)
				if (index >= 0) {
					this.cashier.cards[index].quantity += 1
				} else {
					const card = {
						key: new Date().getTime().toString(),
						skuId: item.skuId,
						skuName: item.skuName,
						quantity: 1,
						adjustAmount: item.adjustAmount,
						payableAmount: item.payableAmount,
						skuNo: item.skuNo
					}
					this.cashier.cards.push(card)
				}
				this.cashierAmount()
			},
			clearCard() {
				this.selectPay = this.payTypes[0]
				this.cashier = {
					type: 0,
					discount: 10,
					discountAmount: 0, // 打折
					ignoreType: this.defaultIgnoreType.type || 0,
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
				this.payTypeDialogVisible = false
				this.payResult = {}
				this.payAmount = 0
				this.authCode = ''
				this.payStateDialogVisible = false
				this.payFinishDialogVisible = false
				this.payErrorDialogVisible = false
				this.cashierActiveName = 'goods'
			},
			cashierAmount() {
				cashierOrder.cashierOrderCompute(this.cashier).then(res => {
					const data = res.data
					const cards = []
					data.skus.forEach(item => {
						cards.push({
							key: item.key,
							skuId: item.skuId,
							skuName: item.skuName,
							quantity: item.quantity,
							referenceAmount: item.referenceAmount,
							adjustAmount: item.adjustAmount,
							payableAmount: item.payableAmount,
							skuNo: item.skuNo
						})
					})
					this.cashier.discountAmount = data.discountAmount
					this.cashier.ignoreAmount = data.ignoreAmount
					this.cashier.preferentialAmount = data.preferentialAmount
					this.cashier.adjustAmount = data.adjustAmount
					this.cashier.payableAmount = data.payableAmount
					this.cashier.cards = cards
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
			saleHang() {
				this.hangBtnLoading = true
				this.hangDialogVisible = true
			},
			saleHangSubmit() {
				const param = this.hangInfo
				if (!param.hangNo) {
					const shop = this.cashier.cards
					param.detail = JSON.stringify(shop)
				}
				this.saleHangRecord(param)
			},
			saleHangTake(hangNo) {
				cashierHang.saleTakeHang(hangNo).then(res => {
					const shop = JSON.parse(res.data.detail)
					this.cashier.cards = shop
					this.hangPopupVisible = false
					this.saleHangList(0)
				}).catch(e => {
					console.log(e)
				})
			},
			saleHangClose() {
				this.hangDialogVisible = false
				this.hangBtnLoading = false
			},
			saleHangRecord(param) {
				cashierHang.saleHangRecord(param).then(res => {
					uni.showToast({
						title: '挂单成功！',
						mask: true,
						icon: 'success'
					})
					console.log(this.hangDialogVisible)
					this.hangDialogVisible = false
					console.log(this.hangDialogVisible)
					this.clearCard()
					this.saleHangList(0)
				}).catch(e => {
					uni.showToast({
						title: '挂单失败！',
						mask: true,
						icon: 'error'
					})
				}).finally(() => {
					this.hangBtnLoading = false
				})
			},
			saleHangList(type) {
				cashierHang.saleHangList().then(res => {
					this.hangList = res.data || []
					if (type === 1) {
						this.hangPopupVisible = true
					}
				})
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
			getIgnoreInfo() {
				cashierIgnore.orderIgnoreInfo().then(res => {
					this.defaultIgnoreType = res.data
					this.cashier.ignoreType = this.defaultIgnoreType.type || 0
				})
			},
			getDiscountList() {
				cashierDiscount.orderDiscountList().then(res => {
					this.discountList = res.data || []
				})
			},
			getPayType() {
				payment.getCashierPayType().then(res => {
					this.payTypes = res.data
					if (this.payTypes) {
						this.selectPay = this.payTypes[0]
					}
				}).catch(() => {
					this.$message.warning('获取支付信息异常')
				})
			},
			nativePayType(item) {
				this.selectPay = item
				if (this.selectPay.payCode === 3) {
					this.payStateDialogVisible = true
					return
				}
			},
			getPayResult() {
				cashierOrder.cashierOrderPayResult(this.orderId).then(res => {
					this.payResult = res.data
					this.payAmount = this.payResult.waitAmount
				})
			},
			payTypeCancel() {
				this.payStateDialogVisible = false
				this.payTypeDialogVisible = false
			},
			payTypeConfirm() {
				if (this.selectPay.payCode === 3) {
					this.nativePayType(this.selectPay)
					return
				}
				this.cashierPay()
			},
			cashierPay() {
				this.payStateDialogVisible = false
				uni.showLoading({
					title: '正在支付中，请勿关闭',
					mask: true
				})
				const param = {
					id: this.payResult.orderId,
					payCode: this.selectPay.payCode,
					payAmount: this.payAmount,
					authCode: this.authCode
				}
				cashierOrder.cashierOrderPay(param).then(res => {
					this.payResult = res.data
					this.payAmount = this.payResult.waitAmount
					uni.hideLoading()
					if (this.payAmount === 0) {
						this.payFinishDialogVisible = true
						this.payState = {
							icon: 'checkbox-mark',
							text: '支付完成',
							content: '支付成功描述',
							theme: 'primary'
						}
					}
				}).finally(() => {
					uni.hideLoading()
				})
			},
			payStateCancel() {
				this.payStateDialogVisible = false
			},
			timeCardSaleClick() {
				uni.navigateTo({
					url: '/pages/cashier/timeCardCashier'
				})
			},
			logout() {
				if (!this.logoutDialogVisible) {
					this.logoutDialogVisible = true
				}
			},
			logoutConfirm() {
				this.$store.dispatch('actionLogout').then(() => {
					uni.reLaunch({
						url: '/pages/auth/login'
					})
				}).finally(() => {
					this.logoutDialogVisible = false
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import "@/common/css/cashier.scss"
</style>