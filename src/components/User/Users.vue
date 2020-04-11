<template>
    <div class="users">
        <!-- 面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片区域 -->
        <el-card class="box-card">
            <!-- 栅格 -->
            <el-row :gutter="20">
                <el-col :span="8">
                    <!-- 搜索头部 -->
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" class="input-with-select" clearable @clear = "clear">
                        <el-button slot="append" icon="el-icon-search" @click="initUserList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span = '4'>
                    <!-- 添加用户 -->
                    <el-button type="primary" @click="handleUserDialog">添加用户</el-button>
                </el-col>
            </el-row>
            <!-- 表格 -->
            <el-table
                    :data="userList"
                    style="width: 100%"
                    border
                    stripe>
                <el-table-column
                        type="index"
                        label = "#">
                </el-table-column>
                <el-table-column
                        prop="username"
                        label="姓名">
                </el-table-column>
                <el-table-column
                        prop="email"
                        label="邮箱">

                </el-table-column>
                <el-table-column
                        prop="mobile"
                        label="电话">

                </el-table-column>
                <el-table-column
                        prop="role_name"
                        label="角色">
                </el-table-column>
                <el-table-column  label="状态">
                    <!-- 获取本行数据 使用templete v-slot  -->
                    <template v-slot = 'scope'>
                        <!-- 开关 -->
                        <el-switch v-model="scope.row.mg_state" @change = "switchChange(scope.row)"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                        <template v-slot = 'scope'>
                            <el-button type="primary" icon="el-icon-edit" size = "small " @click="handleEditDialogFlag(scope.row.id)"></el-button>
                            <el-button type="danger" icon="el-icon-delete" size = "small" @click="deleteUserInfo(scope.row.id)"></el-button>
                            <el-tooltip  effect="dark" content="分配角色" placement="top" :enterable = "false">
                                <el-button type="warning" icon="el-icon-setting" size = "small "></el-button>
                            </el-tooltip>

                        </template>
                </el-table-column>


            </el-table>
            <!-- 分页 -->
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

        <!-- 添加用户对话框 -->
        <el-dialog
                title="添加用户"
                :visible.sync="userDialog"
                width="50%"
                @close = "addDialogClose">
            <span>
                <el-form  :rules="addFormRules" :model="addForm" ref="addFormRef" label-width="100px">
                    <el-form-item label="用户名" prop="username">
                        <el-input v-model="addForm.username"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input v-model="addForm.password" type="password"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="addForm.email"></el-input>
                    </el-form-item>
                    <el-form-item label="手机" prop="mobile">
                        <el-input v-model="addForm.mobile"></el-input>
                    </el-form-item>
                </el-form>
            </span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="userDialog = false">取 消</el-button>
                <el-button type="primary" @click="addUser">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 修改用户信息对话框 -->
        <el-dialog
            title="修改用户信息"
            :visible.sync="editUserInfoDialog"
            width="50%"
            @close = "closeEditUserInfo">
            <el-form ref="editFormRef" :model="editUserInfo"  label-width="80px" :rules="addFormRules">
                <el-form-item label="用户名">
                    <el-input v-model="editUserInfo.username" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="editUserInfo.email"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                    <el-input v-model="editUserInfo.mobile"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editUserInfoDialog = false">取 消</el-button>
                <el-button type="primary" @click="editUserInfoButton">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
    export default {
        name: "Users",
        data () {
            // 自定义验证规则
            var checkAge = (rule, value, callback) => {
                const regEmail = /^([a-zA-Z0-9]*[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/
                if (regEmail.test(value)) {
                    return callback()
                }
                callback( new Error('请输入合法邮箱'))
            }

            var checkPhone = (rule, value, callback) => {
                const regPhone = /^1[3456789]\d{9}$/
                if (regPhone.test(value)) {
                    return callback()
                }
                callback( new Error('请输入正确手机号'))
            }

            return {
                userList: [], // 获取的用户数据
                // 查询的内容 分页内容
                queryInfo: {
                    query: '',
                    pagenum: 1,
                    pagesize: 2
                },
                total: 0, // 总数
                userDialog: false, // 对话框是否显示
                // 要添加的用户内容
                addForm: {
                    username: "",
                    password: "",
                    email: "",
                    mobile: ''
                },
                // 添加用户的表单验证
                addFormRules: {
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' },
                        { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' },
                        { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
                    ],
                    email: [
                        { required: true, message: '请输入邮箱', trigger: 'blur' },
                        {validator: checkAge, trigger: 'blur'}
                    ],
                    mobile: [
                        { required: true, message: '请输入手机号', trigger: 'blur' },
                        {validator: checkPhone, trigger: 'blur'}
                    ]
                },
                editUserInfoDialog: false, // 修改用户信息对话框
                // 修改的用户信息数据
                editUserInfo: {
                    id: '',
                    rid: '',
                    username: '',
                    mobile: '',
                    email: ''
                }
            }
        },
        created () {
            this.initUserList()
        },
        methods: {
            // 用户数据
            async initUserList () {
                let res = await this.$axios.get('users', {params: this.queryInfo})
                console.log(res)
                if (res.data.meta.status != 200) {
                    return this.$message.error(res.data.meta.msg);
                }
                this.userList = res.data.data.users
                console.log(this.userList)
                this.total = res.data.data.total
            },
            // 监听pageSize改变
            handleSizeChange (pageSize) {
                // 可以拿到点击的是多少个数 更改pageSize
                this.queryInfo.pagesize = pageSize
                this.initUserList()
            },
            // 监听页码改变
            handleCurrentChange (index) {
                this.queryInfo.pagenum = index
                this.initUserList()
            },
            // 监听开关
           async switchChange (flag) {
                console.log(flag)
               let res = await this.$axios.put(`users/${flag.id}/state/${flag.mg_state}`)
               console.log(res)
               if (res.status !== 200) {
                   flag.mg_state = !flag.mg_state
                   return this.$message.error(res.data.meta.msg)
               } else {
                   return this.$message.success(res.data.meta.msg)
               }

            },
            // 清除input
            clear () {
                this.initUserList()
            },
            // 显示对话框
            handleUserDialog () {
                this.userDialog = true
            },
            // 关闭对话框
            addDialogClose () {
                this.$refs.addFormRef.resetFields()
                // this.$refs.addFormRef.clearValidate()
            },
            // 添加用户按钮 点击确定
            addUser () {
                this.$refs.addFormRef.validate( async(valid) => {
                    if (!valid) {
                        console.log('1313')
                        return this.$message.error('请检查输入内容是否正确')
                    }
                    let res = await this.$axios.post('users',this.addForm)
                    console.log(res)
                    if (res.status != 200) return this.$message.error(res.data.meta.msg)
                    this.$message.success(res.data.meta.msg)
                    this.userDialog = false
                    this.initUserList()
                })
            },
            // 更改修改个人信息对话框显示
           async handleEditDialogFlag (id) {
                let res = await this.$axios.get(`users/${id}`, {params: id})
                this.editUserInfo = res.data.data
               console.log(this.editUserInfo)
                this.editUserInfoDialog = true
            },
            // 关闭修改个人信息对话框
            closeEditUserInfo () {
                this.$refs.editFormRef.resetFields()
            },
            // 修改个人信息
            editUserInfoButton () {
                console.log('1313')
                this.$refs.editFormRef.validate(async (valid) => {
                  if (!valid) return
                 let {data: res} = await this.$axios.put(`users/${this.editUserInfo.id}`, this.editUserInfo)
                    console.log(res)
                 if (res.meta.status == 200) {
                     this.$message.success(res.meta.msg)
                     this.editUserInfoDialog = false
                     this.initUserList()
                 }
                })
            },
            // 删除个人用户信息
            deleteUserInfo (id) {
                this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    let res = await this.$axios.delete(`users/${id}`)
                    this.$message.success(res.data.meta.msg)
                    this.initUserList()
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            }
        }
    }
</script>

<style scoped lang="less">

</style>
