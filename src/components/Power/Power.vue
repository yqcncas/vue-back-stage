<template>
    <div class="power">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card class="box-card">
            <el-table
                    :data="rightList"
                    stripe
                    style="width: 100%"
                    border>
                <el-table-column type="index" label = "#"></el-table-column>
                <el-table-column
                        prop="authName"
                        label="权限名称"
                      >
                </el-table-column>
                <el-table-column
                        prop="path"
                        label="路径"
                        >
                </el-table-column>
                <el-table-column

                        label="权限等级">
                    <template v-slot = "scope">
                        <el-tag v-if="scope.row.level == '0'">一级</el-tag>
                        <el-tag v-else-if="scope.row.level == '1'" type="success">二级</el-tag>
                        <el-tag v-else type="warning">三级</el-tag>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script>
    export default {
        name: "Power",
        created () {
            this.getRightList()
        },
        data () {
            return {
                rightList: []
            }
        },
        methods: {
            async getRightList () {
                let {data: res} = await this.$axios.get('rights/list')
                this.rightList = res.data
                console.log(this.rightList)
            }
        }
    }
</script>

<style scoped>

</style>
