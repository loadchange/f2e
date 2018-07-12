import React from 'react';
import {
    Layout,
    Form,
    Input,
    Button,
    Upload,
    Notification,
    MessageBox
} from 'element-react';
import CategorySelector from './category-selector.jsx'
import PageTitle from 'component/page-title/index.jsx'
import {saveProductList, getProduct} from 'api/ProductApi.jsx'

class ProductList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            id: this.props.match.params.pid,
            name: '',
            subtitle: '',
            categoryId: '',
            parentCategoryId: '',
            price: '',
            stock: '',
            subImages: [],
            detail: '',
            fileList: [],
            rules: {
                name: [
                    {required: true, message: '请输入商品名称', trigger: 'blur'}
                ],
                subtitle: [
                    {required: true, message: '请输入商品描述', trigger: 'blur'}
                ],
                categoryId: [
                    {type: 'number', required: true, message: '请选择商品分类', trigger: 'change'}
                ],
                price: [
                    {required: true, message: '请输入商品价格', trigger: 'blur'}
                ],
                stock: [
                    {required: true, message: '请输入商品库存', trigger: 'blur'}
                ],
                subImages: [
                    {type: 'array', required: true, message: '请上传一张图片', trigger: 'change'}
                ],
                detail: [
                    {required: true, message: '请输入商品描述', trigger: 'blur'}
                ]
            }
        };
    }

    componentDidMount() {
        this.loadProduct()
    }

    loadProduct() {
        if (!this.state.id) {
            this.setState({loading: false})
            return
        }
        getProduct(this.state.id).then(res => {
            for (let key in res.data) {
                if (key === 'imageHost') continue
                if (key === 'subImages') {
                    let subImages = res.data.subImages.split(',').map(uri => {
                        return {uri: uri, url: res.data.imageHost + uri}
                    })
                    this.setState({
                        subImages,
                        fileList: subImages.map(item => {
                            return {name: item.uri, url: item.url, status: 'finished'}
                        })
                    })
                    continue
                }
                if (['price', 'stock'].indexOf(key) >= 0) {
                    this.setState({[key]: res.data[key] + ''})
                    continue
                }
                this.setState({[key]: res.data[key]})
            }
            this.setState({loading: false})
        })
    }

    onCategoryChange(categoryId, parentCategoryId) {
        this.setState({categoryId: categoryId + ''})
        console.log('categoryId:', categoryId, 'parentCategoryId:', parentCategoryId)
    }

    handleSubmit(e) {
        e.preventDefault();


        this.refs.form.validate(valid => {
            if (!valid) return
            let product = {
                name: this.state.name,
                subtitle: this.state.subtitle,
                categoryId: this.state.categoryId,
                price: this.state.price,
                stock: this.state.stock,
                subImages: this.state.subImages.map(img => img.uri) + '',
                detail: this.state.detail,
            }
            if (this.state.id) {
                product.id = this.state.id
            }
            saveProductList(product).then(res => {
                if (res.status) {
                    Notification.error({
                        title: '错误',
                        message: res.data || '商品保存失败'
                    });
                    return
                }
                MessageBox.msgbox({
                    title: '消息',
                    message: res.data || '商品保存成功'
                }).then(() => {
                    location.href = '/#/product'
                })
            })
        })
    }

    onChange(key, value) {
        this.setState({[key]: value})
    }

    onUploadSuccess(res) {
        this.setState({
            subImages: [...this.state.subImages, res.data]
        })
    }

    onUploadError(res) {
        Notification.error({
            title: '错误',
            message: res.message || '上传图片失败'
        });
    }

    onRemoveUploadFile(file) {
        this.setState({
            subImages: this.state.subImages.filter(item => file.name !== item.uri)
        })
    }

    render() {
        return (
            <div>
                <PageTitle title={(this.state.id ? '编辑' : '添加') + '商品'}/>
                {
                    this.state.loading ? null : (
                        <div className="form-box">
                            <Form ref="form" model={this.state} rules={this.state.rules} labelWidth="80"
                                  className="demo-ruleForm">
                                <Form.Item label="商品名称" prop="name">
                                    <Input value={this.state.name} onChange={this.onChange.bind(this, 'name')}/>
                                </Form.Item>
                                <Form.Item label="商品描述" prop="subtitle">
                                    <Input value={this.state.subtitle} onChange={this.onChange.bind(this, 'subtitle')}/>
                                </Form.Item>
                                <Form.Item label="所属分类" prop="categoryId">
                                    <CategorySelector
                                        categoryId={this.state.categoryId}
                                        parentCategoryId={this.state.parentCategoryId}
                                        onCategoryChange={(categoryId, parentCategoryId) => this.onCategoryChange(categoryId, parentCategoryId)}/>
                                </Form.Item>
                                <Form.Item label="商品价格" prop="price">
                                    <Layout.Row>
                                        <Layout.Col span="8">
                                            <Input value={this.state.price} onChange={this.onChange.bind(this, 'price')}
                                                   append="元"/>
                                        </Layout.Col>
                                    </Layout.Row>
                                </Form.Item>
                                <Form.Item label="商品库存" prop="stock">
                                    <Layout.Row>
                                        <Layout.Col span="8">
                                            <Input value={this.state.stock} onChange={this.onChange.bind(this, 'stock')}
                                                   append="件"/>
                                        </Layout.Col>
                                    </Layout.Row>
                                </Form.Item>
                                <Form.Item label="商品图片" prop="subImages">
                                    <Upload
                                        multiple
                                        accept="image/*"
                                        action="/manage/product/upload.do"
                                        name="upload_file"
                                        listType="picture-card"
                                        onSuccess={res => this.onUploadSuccess(res)}
                                        onError={res => this.onUploadError(res)}
                                        onRemove={file => this.onRemoveUploadFile(file)}
                                        fileList={this.state.fileList}
                                    >
                                        <i className="el-icon-plus"/>
                                    </Upload>
                                </Form.Item>
                                <Form.Item label="商品详情" prop="detail">
                                    <Input
                                        type="textarea"
                                        autosize={{minRows: 4, maxRows: 4}}
                                        value={this.state.detail} onChange={this.onChange.bind(this, 'detail')}/>
                                </Form.Item>

                                <Form.Item>
                                    <Button type="primary" onClick={this.handleSubmit.bind(this)}>提交</Button>
                                </Form.Item>
                            </Form>
                        </div>
                    )
                }
            </div>
        )
    }
}

export default ProductList