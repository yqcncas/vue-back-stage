<template>
    <div class="cate">
        <!-- 面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-row>
                <el-col>
                    <el-button type="primary" @click="addCateForm">添加分类</el-button>
                </el-col>
            </el-row>
            <!-- data 数据源 columns 每一列 -->
            <tree-table class="tree-table" :data = "cateList" :columns = "columns" :selection-type = "false" :expand-type = "false" show-index index-text = "#" stripe border>
                <template v-slot:isOk = "scope">
                    <i class="el-icon-success" v-if="scope.row.cat_deleted == false" style="color: lightgreen"></i>
                    <i class="el-icon-error" style="color: red" v-else></i>
                </template>
                <template v-slot:paixu = "scope">
                    <el-tag v-if="scope.row.cat_level == 0">一级</el-tag>
                    <el-tag type="success" v-else-if="scope.row.cat_level == 1">二级</el-tag>
                    <el-tag type="warning" v-else>三级</el-tag>
                </template>
                <template v-slot:opt = "scope">
                    <el-button type="primary" icon="el-icon-edit">编辑</el-button>
                    <el-button type="danger" icon="el-icon-delete">删除</el-button>
                </template>
            </tree-table>


            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="queryInfo.pagenum"
                    :page-sizes="[1, 2, 5, 10]"
                    :page-size="queryInfo.pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
        </el-card>

        <el-dialog
                title="添加分类"
                :visible.sync="addCateDialog"
                width="50%"
                @close="closeCateDialog">
            <span>
                <el-form ref="addCateRef" :model="addCate" :rules="addCateRules">
                  <el-form-item label="分类名称" prop="cat_name" label-width = "100px">
                    <el-input v-model="addCate.cat_name"></el-input>
                  </el-form-item>
                    <el-form-item label="父级分类" label-width = "100px">
                    <el-cascader
                            v-model="saveCateListArr"
                            :options="parentCateList"
                            :props="{ expandTrigger: 'hover',value: cascaderProps.value, label: cascaderProps.label, children: cascaderProps.children,checkStrictly: true  }"
                            @change="handleChange"
                            clearable
                            filterable>
                    </el-cascader>
                  </el-form-item>
                </el-form>
            </span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addCateDialog = false">取 消</el-button>
                <el-button type="primary" @click="submitCateForm">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "Cate",
        created () {
            this.getCateList()
        },
        data () {
            return {
                cateList: [],
                queryInfo: {
                    type: 3,
                    pagenum: 1,
                    pagesize: 5
                },
                total: 0,
                columns: [
                    {
                        label: '分类名称',
                        prop: 'cat_name',
                    },
                    {
                        label: '是否有效',
                        type: 'template',
                        template: 'isOk',
                    },
                    {
                        label: '排序',
                        type: 'template',
                        template: 'paixu',
                    },
                    {
                        label: '操作',
                        type: 'template',
                        template: 'opt',
                    }
                ],
                addCateDialog: false,
                // 请求要的数据
                addCate: {
                    cat_name: '',
                    cat_id: 0,
                    cat_level: 0
                },
                addCateRules: {
                    cat_name: [
                        { required: true, message: '请输入分类名称', trigger: 'blur' }
                    ]
                },
                // 级联所有
                parentCateList: [],
                // 保存选中的级联数据
                saveCateListArr: [],
                // 展示的所有级联数据
                cascaderProps: {
                    value: 'cat_id',
                    label: 'cat_name',
                    children: 'children'
                }
            }
        },
        methods: {
            async getCateList () {
                let {data: res} = await this.$axios.get('categories',{ params: this.queryInfo })
                this.cateList = res.data.result
                console.log(res)
                this.total = res.data.total
            },
            handleSizeChange (pageSize) {
                // console.log(pageSize);
                this.queryInfo.pagesize = pageSize
                this.getCateList()
            },
            handleCurrentChange (pageNum) {
                // console.log(pageNum);
                this.queryInfo.pagenum = pageNum
                this.getCateList()
            },
            addCateForm () {
                this.getCascaderList()
                this.addCateDialog = true
            },
            async getCascaderList () {
                let {data: res} = await this.$axios.get('categories', { params: { type: 2 } })
                this.parentCateList = res.data
                console.log(this.parentCateList)
            },
            handleChange () {
                console.log(this.saveCateListArr)
                if (this.saveCateListArr.length > 0) {

                    this.addCate.cat_id = this.saveCateListArr[this.saveCateListArr.length - 1]
                    this.addCate.cat_level = this.saveCateListArr.length
                    return
                } else {
                    this.addCate.cat_id = 0
                    this.addCate.cat_level = 0
                }
            },
            submitCateForm () {
                this.$refs.addCateRef.validate(async (valid) => {
                    if (!valid) {
                        return this.$message.error('失败')
                    }
                    let {data: res} = await this.$axios.post('categories', this.addCate)
                    console.log(res);
                    if (res.meta.status == 201) {
                        this.$message.success('成功')
                        this.addCateDialog = false
                        this.getCateList()
                    } else {
                        return this.$message.error('失败')
                    }
                })

            },
            closeCateDialog () {
                this.$refs.addCateRef.resetFields()
                this.saveCateListArr = []
                this.addCate.cat_id = 0
                this.addCate.cat_level = 0

            }
        }
    }
</script>

<style scoped lang="less">
.tree-table{
    margin-top: 15px;
}
.el-cascader{
    width: 100%;
}
</style>
