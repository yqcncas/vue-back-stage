<template>
    <div class="orders">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>订单管理</el-breadcrumb-item>
            <el-breadcrumb-item>订单列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-row>
                <el-col :span = "8">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" class="input-with-select" >
                        <el-button slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                </el-col>
            </el-row>
            <el-table :data="orderList" border stripe>
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column  label="订单编号" prop="order_number"></el-table-column>
                <el-table-column  label="订单价格" prop="order_price"></el-table-column>
                <el-table-column  label="是否付款">
                    <template v-slot = "scope">
                        <el-tag type="success" v-if="scope.row.order_pay == 1">已付款</el-tag>
                        <el-tag type="danger" v-else>未付款</el-tag>
                    </template>
                </el-table-column>
                <el-table-column  label="是否发货" prop="is_send"></el-table-column>
                <el-table-column  label="下单时间" prop = "create_time"></el-table-column>
                <el-table-column  label="操作">
                    <template v-slot = "scope">
                        <el-button type="primary" icon="el-icon-edit" @click="showBoxDialog"></el-button>
                        <el-button type="success" icon="el-icon-location" @click="showProgressDialog(scope.row.order_id)"></el-button>
                    </template>
                </el-table-column>


            </el-table>
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="queryInfo.pagenum"
                    :page-sizes="[1, 5, 10, 20]"
                    :page-size="queryInfo.pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
        </el-card>

        <el-dialog
                title="修改地址"
                :visible.sync="showBox"
                width="50%"
                >
            <span>
                <el-form :model="addRessForm" status-icon :rules="addRessFormRules" ref="addRessFormRef" label-width="100px" >
                  <el-form-item label="省市区" prop="address">
                   <el-cascader style="width: 100%"
                           v-model="saveCity"
                           :options="cityData"
                           :props="{ expandTrigger: 'hover' }"
                           @change="handleChange"
                            @close = "addressClose">
                   </el-cascader>
                  </el-form-item>
                    <el-form-item label="详细地址" prop="addressDetail">
                    <el-input t v-model="addRessForm.addressDetail" autocomplete="off"></el-input>
                  </el-form-item>
                </el-form>
            </span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="showBox = false">取 消</el-button>
                <el-button type="primary" @click="showBox = false">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog
                title="物流信息"
                :visible.sync="progressDialog"
                width="50%"
                >
            <span>
                 <el-timeline >
                    <el-timeline-item
                            v-for="(activity, index) in progressList"
                            :key="index"
                            :timestamp="activity.time">
                      {{activity.context}}
                    </el-timeline-item>
                  </el-timeline>
            </span>

        </el-dialog>

    </div>
</template>

<script>
    import cityData from '../citydata'
    export default {
        name: "Orders",
        created () {
            this.getOrderList()
        },
        data () {
            return {
                queryInfo:{
                    query: '',
                    pagenum: 1,
                    pagesize: 10
                },
                total: 0,
                orderList: [],
                showBox: false,
                addRessForm: {
                    address: [],
                    addressDetail: ''
                },
                addRessFormRules: {
                    address: [
                        { required: true, message: '请输入活动名称', trigger: 'blur' }
                    ]
                },
                cityData: cityData,
                saveCity: [],
                progressDialog: false,
                progressList: []
            }
        },
        methods: {
            async getOrderList () {
                let {data: res} = await this.$axios.get('orders',{params: this.queryInfo})
                console.log(res);
                res.data.goods.forEach(item => {
                    item.create_time = this.$dayjs(item.create_time).format('YYYY-MM-DD HH:mm:ss')
                })

                this.total = res.data.total
                this.orderList = res.data.goods
            },
            handleSizeChange (pagesize) {
                this.queryInfo.pagesize = pagesize
                this.getOrderList()
            },
            handleCurrentChange (pagenum) {
                this.queryInfo.pagenum = pagenum
                this.getOrderList()
            },
            showBoxDialog () {
                this.showBox = true
            },
            addressClose () {
                this.$refs.addRessFormRef.resetFields()
                this.saveCity = []
                this.showBox = false
            },
            handleChange () {
                console.log(this.saveCity);
            },
            async showProgressDialog (id) {
                let {data: res} = await this.$axios.get('/kuaidi/804909574412544580')
                console.log(res);
                this.progressDialog = true
                this.progressList = res.data
            }
        }
    }
</script>

<style scoped>

</style>
