<template>
    <div class="roles">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card class="box-card">
           <el-row>
               <el-col>
                   <el-button type="primary">添加角色</el-button>
               </el-col>
           </el-row>

            <el-table
                    :data="rolesList"
                    border
                    style="width: 100%">
                <el-table-column type="expand">
                    <template v-slot = "scope">
                        <el-row v-for = "(roles1, index) in scope.row.children" :key = "index" class="bdbottom" :class="{bdtop: index == 0}">
                            <el-col :span="5">
                                <el-tag closable @close = "removeRoles(scope.row, roles1.id)">{{roles1.authName}}</el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <el-col :span="19">
                                <el-row v-for = "(roles2, i) in roles1.children" :key = "i" :class="{bdtop: i != '0'}">
                                    <el-col :span="6">
                                        <el-tag closable type="success" @close = "removeRoles(scope.row, roles2.id)">{{roles2.authName}}</el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <el-col :span = "18">
                                        <el-tag closable @close = "removeRoles(scope.row, roles3.id)" type="warning" v-for = "(roles3, index3) in roles2.children" :key = "index3">{{roles3.authName}}</el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column
                        prop="roleName"
                        label="角色名称"
                       >
                </el-table-column>
                <el-table-column
                        prop="roleDesc"
                        label="角色描述"
                       >
                </el-table-column>
                <el-table-column
                        label="操作"
                        >
                    <template v-slot = "scope">
                        <el-button type="primary" icon="el-icon-search">编辑</el-button>
                        <el-button type="danger" icon="el-icon-delete-solid">删除</el-button>
                        <el-button type="warning" icon="el-icon-s-tools" @click="showPowerDigLog(scope.row)">分配权限</el-button>
                    </template>
                </el-table-column>
            </el-table>

        </el-card>

        <el-dialog
                title="分配权限"
                :visible.sync="PowerDigLog"
                width="50%"
                @close="closeRolesDigLog"
                >
            <span>
                <el-tree :data="rightList" :props="defaultProps"
                         show-checkbox node-key="id" default-expand-all :default-checked-keys = "defaultCheckedArray" ref = "treeRef"></el-tree>
            </span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="PowerDigLog = false">取 消</el-button>
                <el-button type="primary" @click="allotRights">确 定</el-button>
              </span>
        </el-dialog>

    </div>
</template>

<script>
    export default {
        name: "Roles",
        created () {
            this.getRolesList()
        },
        data () {
            return {
                rolesList: [],
                PowerDigLog: false,
                rightList: [],
                defaultProps: {
                    children: 'children',
                    label: 'authName'
                },
                defaultCheckedArray: [],
                roleId: null
            }
        },
        methods: {
            async getRolesList () {
                let {data: res} = await this.$axios.get('roles')
                this.rolesList = res.data
                console.log(res)
                console.log( this.rolesList)

            },
            removeRoles (item, index) {
                console.log(item)
                console.log(index)
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                   let res = await this.$axios.delete(`roles/${item.id}/rights/${index}`)
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                   item.children = res.data.data
                   // this.getRolesList()
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
           async showPowerDigLog (role) {
                this.roleId = role.id
                // 获取数据
                let {data: res} = await this.$axios.get('rights/tree')
                this.rightList = res.data
                // role 为scope.row 一张行数据  存放默认选中的数组
                this.getLeafKeys(role, this.defaultCheckedArray)
                this.PowerDigLog = true
            },
            // 递归取出三级节点的ID   接收第一级数组, 要返回的数组
            getLeafKeys (node, arr) {
                console.log(node)
                // 若该数组不包含children 则是三级节点了
                if (!node.children) {
                    // 直接插入id
                    return arr.push(node.id)
                }
                // 循环数组 直到最后一级数组
                node.children.forEach(item => {
                    this.getLeafKeys(item, arr)
                })
            },
            closeRolesDigLog () {
                this.defaultCheckedArray = []
            },
            async allotRights () {
                let checkArr = this.$refs.treeRef.getCheckedKeys()
                let halfCheckArr = this.$refs.treeRef.getHalfCheckedKeys()
                let submitArr = [...halfCheckArr, ...checkArr].join(',')
                let {data: res} = await this.$axios.post(`roles/${this.roleId}/rights`, {rids: submitArr})
                if (res.meta.status != 200) {
                    return this.$message.error(res.meta.msg)
                }
                this.$message.success(res.meta.msg)
                this.PowerDigLog = false
                this.getRolesList()
            }
        },
    }
</script>

<style scoped lang="less">
.el-tag{
    margin: 7px;
    box-sizing: border-box;
}
.el-row{
    display: flex;
    align-items: center;
}
.bdtop{
    border-top: 1px solid #eee;
}
.bdbottom{
    border-bottom: 1px solid #eee;
}
</style>
