<template>
    <div class="goods">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-row :gutter="20">
                <el-col :span = "8">
                    <el-input placeholder="请输入内容" class="input-with-select" v-model="queryInfo.query" clearable @clear = "getGoodsList">
                        <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span = "4" >
                    <el-button type="primary" @click="goToAddShop">添加商品</el-button>
                </el-col>
            </el-row>
            <el-table :data="goodsList" border stripe>
                <el-table-column type="index" label="#"></el-table-column>

                <el-table-column label="商品名称" prop="goods_name">

                </el-table-column>
                <el-table-column label="商品价格(元)"  prop="goods_price" width="95px">

                </el-table-column>
                <el-table-column label="商品重量"  prop="goods_weight">

                </el-table-column>
                <el-table-column label="创建时间"  prop="add_time" >

                </el-table-column>
                <el-table-column label="操作"  width="200px">
                  <template v-slot = "scope">
                      <el-button type="primary" icon="el-icon-edit" size="small">编辑</el-button>
                      <el-button type="danger" icon="el-icon-delete" size="small" @click="showDeleteShop(scope.row.goods_id)">删除</el-button>
                  </template>
                </el-table-column>
            </el-table>

            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="queryInfo.pagenum"
                    :page-sizes="[1, 2, 5, 10]"
                    :page-size="queryInfo.pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total"
                    background>
            </el-pagination>
        </el-card>
    </div>
</template>

<script>
    export default {
        name: "Goods",
        created () {
            this.getGoodsList()
        },
        data () {
            return {
                queryInfo: {
                    query: '',
                    pagenum: 1,
                    pagesize: 10
                },
                goodsList: [],
                total: 0
            }
        },
        methods: {
            async getGoodsList () {
                let {data: res} = await this.$axios.get('goods',{params: this.queryInfo})
                this.goodsList = res.data.goods
                this.total = res.data.total
                console.log(this.goodsList)
                this.goodsList.forEach(item => {
                    item.add_time = this.$dayjs(item.add_time).format('YYYY-MM-DD hh:mm:ss ')
                })
            },
            handleSizeChange (pageSize) {
                this.queryInfo.pagesize = pageSize
                this.getGoodsList()
            },
            handleCurrentChange (pageNum) {
                this.queryInfo.pagenum = pageNum
                this.getGoodsList()
            },
            showDeleteShop (id) {
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                   let {data: res} = await this.$axios.delete(`goods/${id}`)
                    console.log(res)
                    if (res.meta.status == 200) {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                    }
                    this.getGoodsList()
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            goToAddShop () {
                this.$router.push('goods/add')
            }
        }
    }
</script>

<style scoped>

</style>
