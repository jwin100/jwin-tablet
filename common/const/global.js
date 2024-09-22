const {
	storageGridColKey,
	storageModalWidthKey
} = require("@/common/config.js")

export default {
	setGridCol(val) {
		uni.setStorageSync(storageGridColKey, val)
	},
	getGridCol() {
		const col = uni.getStorageSync(storageGridColKey);
		if (col) {
			return Number(col)
		}
		return 3
	},
	setModalWidth(val) {
		uni.setStorageSync(storageModalWidthKey, val)
	},
	getModalWidth() {
		const modalWidth = uni.getStorageSync(storageModalWidthKey);
		if (modalWidth) {
			return modalWidth
		}
		return '700px'
	}
}