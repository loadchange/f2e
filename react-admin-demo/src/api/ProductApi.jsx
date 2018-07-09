import request from './base.js'

export function getProductList(data) {
    return request({url: '/manage/product/list.do', data})
}

export function searchProductList(data) {
    return request({url: '/manage/product/search.do', data})
}

export function setSaleStatus(data) {
    return request({url: '/manage/product/set_sale_status.do', data})
}

export function getCategoryList(categoryId = 0) {
    return request({url: '/manage/category/get_category.do', data: {categoryId}})
}
