<template>
    <div class="add">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-alert
                    title="添加商品信息"
                    type="info"
                    center
                    :closable = "false"
                    show-icon>
            </el-alert>
            <!-- 步骤条绑定的是数值, - 0 变数字  或 + -->
            <el-steps :active="+active" finish-status="success" align-center>
                <el-step title="基本信息"></el-step>
                <el-step title="商品参数"></el-step>
                <el-step title="商品属性"></el-step>
                <el-step title="商品图片"></el-step>
                <el-step title="商品内容"></el-step>
                <el-step title="完成"></el-step>
            </el-steps>

            <el-form :model="tabsModel" :rules="tabsModelRules" ref="tabsModelRuleForm" label-width="100px" :label-position = "'top'">
                <el-tabs :tab-position="'left'" v-model="active" :before-leave = "beforeLeave" @tab-click = "tabsClick">
                    <el-tab-pane label="基本信息" name="0">
                        <el-form-item label="商品名称" prop="goods_name">
                            <el-input v-model="tabsModel.goods_name"></el-input>
                        </el-form-item>
                        <el-form-item label="商品价格" prop="goods_price">
                            <el-input v-model="tabsModel.goods_price" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品重量" prop="goods_weight">
                            <el-input v-model="tabsModel.goods_weight"></el-input>
                        </el-form-item>
                        <el-form-item label="商品数量" prop="goods_number">
                            <el-input v-model="tabsModel.goods_number" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品分类" prop="goods_cat">
                            <el-cascader
                                    v-model="tabsModel.goods_cat"
                                    :options="getSelectListArr"
                                    :props="{ expandTrigger: 'hover',
                                 value: cascaderProps.value,
                                 label: cascaderProps.label,
                                 children: cascaderProps.children
                                }"
                                    filterable
                                    @change="handleChange">
                            </el-cascader>
                        </el-form-item>

                    </el-tab-pane>
                    <el-tab-pane label="商品参数" name="1">
                        <el-form-item :label="item.attr_name" v-for="item in manyTabList" :key="item.attr_id">
                            <el-checkbox-group v-model="item.attr_vals">
                                <el-checkbox border :label="cb" v-for="(cb, i) in item.attr_vals" :key = "i"></el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品属性" name="2">
                        <el-form-item :label="item.attr_name" v-for="item in onlyTabList" :key = "item.attr_id">
                            <el-input v-model="item.attr_vals"></el-input>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品图片" name="3">
                        <!-- action 指定上传地址 on-preview 预览图片 on-remove删除图片 file-list 文件列表  list-type指定预览组件呈现方式-->
                        <el-upload
                                action="https://www.liulongbin.top:8888/api/private/v1/upload"
                                :on-preview="handlePreview"
                                :on-remove="handleRemove"
                                :on-success = "handleSuccess"
                                :headers = "headersObj"
                                 list-type="picture">
                            <el-button size="small" type="primary">点击上传</el-button>
                            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                        </el-upload>
                    </el-tab-pane>
                    <el-tab-pane label="商品内容" name="4">
                        <quill-editor v-model="tabsModel.goods_introduce"></quill-editor>
                        <el-button type="primary" class="addShopButton" @click="addShop">添加商品</el-button>
                    </el-tab-pane>
                    <el-tab-pane label="完成" name="5">完成</el-tab-pane>
                </el-tabs>
            </el-form>
        </el-card>

        <el-dialog
                title="图片预览"
                :visible.sync="previewDialog"
                 width="50%"
                >
            <span>
                <img :src="previewImgUrl" alt="" style="width: 100%;">
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import _ from 'lodash'
    export default {
        name: "Add",
        created () {
            this.getSelectList()
        },
        data () {
            return {
                active: "0",
                tabsModel: {
                    goods_name: '',
                    goods_price: 0,
                    goods_weight: 0,
                    goods_number: 0,
                    goods_cat: [],
                    pics:[],
                    goods_introduce: ''
                },
                tabsModelRules: {
                    goods_name: [
                        { required: true, message: '请输入商品名称', trigger: 'blur' }
                    ],
                    goods_price: [
                        { required: true, message: '请输入商品价格', trigger: 'blur' }
                    ],
                    goods_weight:[
                        { required: true, message: '请输入商品重量', trigger: 'blur' }
                    ],
                    goods_number: [
                        { required: true, message: '请输入商品数量', trigger: 'blur' }
                    ],
                    goods_cat: [
                        { required: true, message: '请选择', trigger: 'blur' }
                    ]
                },
                getSelectListArr: [],
                cascaderProps: {
                    value: 'cat_id',
                    label: 'cat_name',
                    children: 'children'
                },
                manyTabList: [],
                onlyTabList: [],
                headersObj: {
                    Authorization: window.sessionStorage.getItem('token')
                },
                previewImgUrl: '',
                previewDialog: false
            }
        },
        methods: {
           async getSelectList () {
                let {data: res} = await this.$axios.get('categories')
               this.getSelectListArr  = res.data
           },
            handleChange () {
                if (this.tabsModel.goods_cat.length < 3) {
                    this.tabsModel.goods_cat = []
                    return this.$message.error('不是三级')
                }
            },
            // tabs的函数 可监听页面的切换 相当于 watch
            beforeLeave (activeName, oldActiveName) {
               if (oldActiveName == 0 && this.tabsModel.goods_cat.length != 3) {
                   this.$message.error('请先完成第一项')
                   return false
               }
            },
            async tabsClick () {
                if (this.active == 1) {
                    let {data: res} = await this.$axios.get(`categories/${this.tabsModel.goods_cat[2]}/attributes`, {params: {sel: 'many'}})
                    res.data.forEach(item => {
                        item.attr_vals =  item.attr_vals == ''  ? [] : item.attr_vals.split(' ')
                    })
                    this.manyTabList = res.data
                    console.log(this.manyTabList);
                } else if (this.active == 2) {
                    let {data: res} = await this.$axios.get(`categories/${this.tabsModel.goods_cat[2]}/attributes`, {params: {sel: 'only'}})
                    this.onlyTabList = res.data
                }
            },
            // 预览
            handlePreview (file) {
                this.previewDialog = true

                this.previewImgUrl = file.url
            },
            // 删除
            handleRemove (file) {
                const filePath = file.response.data.tmp_path
                let currentIndex =  this.tabsModel.pics.findIndex(currentValue => {
                    if (currentValue.pic == filePath) {
                        return true
                    }
                })
                if (currentIndex != -1) {
                    this.tabsModel.pics.splice(currentIndex, 1)
                }
                console.log(this.tabsModel.pics)
            },
            // 图片上传成功
            handleSuccess (response) {
                let picObj = {pic: response.data.tmp_path}
                this.tabsModel.pics.push(picObj)
            },
            addShop () {
                this.$refs.tabsModelRuleForm.validate((valid) => {
                    if (!valid) {
                        return this.$message.error('失败')
                    }

                    let formSubmit = _.cloneDeep(this.tabsModel)
                    formSubmit.goods_cat =  formSubmit.goods_cat.join(',')
                    console.log(formSubmit)
                });
            }
        }
    }
</script>

<style scoped lang="less">
.el-steps{
    margin: 15px 0;
}
.el-step__title{
    font-size: 12px;
}
.addShopButton{
    margin-top: 15px;
}
</style>
