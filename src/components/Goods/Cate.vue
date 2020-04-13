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
                    <el-button type="primary">添加分类</el-button>
                </el-col>
            </el-row>
            <!-- data 数据源 columns 每一列 -->
            <tree-table :data = "cateList" :columns = "columns" :selection-type = "false" :expand-type = "false" show-index index-text = "#" stripe border>
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


            <!--<el-pagination-->
                    <!--@size-change="handleSizeChange"-->
                    <!--@current-change="handleCurrentChange"-->
                    <!--:current-page="currentPage4"-->
                    <!--:page-sizes="[100, 200, 300, 400]"-->
                    <!--:page-size="100"-->
                    <!--layout="total, sizes, prev, pager, next, jumper"-->
                    <!--:total="400">-->
            <!--</el-pagination>-->
        </el-card>

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
            }
        },
        methods: {
            async getCateList () {
                let {data: res} = await this.$axios.get('categories',{ params: this.queryInfo })
                this.cateList = res.data.result
                console.log( this.cateList)
            }
        }
    }
</script>

<style scoped lang="less">

</style>
