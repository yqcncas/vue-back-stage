<template>
    <div class="params">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>分类参数</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-alert
                    title="警告提示的文案"
                    type="warning"
                    :closable = "false"
                    show-icon>
            </el-alert>
            <el-row>
                <el-col>
                    <span>选中商品分类:  </span>
                    <el-cascader
                            v-model="saveCateListArr"
                            :options="getCateListArr"
                            :props="{ expandTrigger: 'hover', value: propsValue, label: propsLabel, children: propsChildren}"
                            @change="handleChange">
                    </el-cascader>
                </el-col>
            </el-row>

            <el-tabs v-model="activeName" @tab-click="handleTabClick">
                <el-tab-pane label="动态参数" name="many" >
                    <el-button type="primary" :disabled="!saveCateListArr.length" @click="showDialogButton">添加参数</el-button>
                    <el-table
                            :data="manyTabList"
                            stripe
                            border
                            style="width: 100%">
                        <el-table-column type="expand" >
                            <el-tag
                                    v-for="tag in manyTabList.attr_vals"
                                    :key="tag.attr_name"
                                    closable
                                   >
                                {{tag.name}}
                            </el-tag>
                            <el-input
                                    class="input-new-tag"
                                    v-if="inputVisible"
                                    v-model="inputValue"
                                    ref="saveTagInput"
                                    size="small"
                                    @keyup.enter.native="handleInputConfirm"
                                    @blur="handleInputConfirm"
                            >
                            </el-input>
                            <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>

                        </el-table-column>
                        <el-table-column type="index" label="#"></el-table-column>
                        <el-table-column
                                prop="attr_name"
                                label="参数名称"
                                >
                        </el-table-column>
                        <el-table-column
                                label="操作"
                                >
                            <template v-slot = "scope">
                                <el-button type="primary" icon="el-icon-edit">搜索</el-button>
                                <el-button type="danger" icon="el-icon-delete">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="静态属性" name="only" >
                    <el-button type="primary" :disabled="!saveCateListArr.length"  @click="showDialogButton">添加属性</el-button>
                    <el-table
                            :data="onlyTabList"
                            stripe
                            border
                            style="width: 100%">
                        <el-table-column type="expand" >
                            <el-input
                                    class="input-new-tag"
                                    v-if="inputVisible"
                                    v-model="inputValue"
                                    ref="saveTagInput"
                                    size="small"
                                    @keyup.enter.native="handleInputConfirm"
                                    @blur="handleInputConfirm"
                            >
                            </el-input>
                            <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>

                        </el-table-column>
                        <el-table-column type="index" label="#"></el-table-column>
                        <el-table-column
                                prop="attr_name"
                                label="参数名称"
                        >
                        </el-table-column>
                        <el-table-column
                                label="操作"
                        >
                            <template v-slot = "scope">
                                <el-button type="primary" icon="el-icon-edit">搜索</el-button>
                                <el-button type="danger" icon="el-icon-delete">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>

            <el-dialog
                    :title="activeName == 'many' ? '动态参数': '静态属性'"
                    :visible.sync="showDialog"
                    width="50%"
                    @close="closeAddDialog"
                    >
                <span>
                    <el-form :model="addParamsForm" :rules="addParamsFormRules" ref="addParamsFormRef" label-width="100px" >
                          <el-form-item :label="activeName == 'many' ? '动态参数': '静态属性'" prop="attr_name">
                            <el-input v-model="addParamsForm.attr_name"></el-input>
                          </el-form-item>
                    </el-form>
                </span>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="showDialog = false">取 消</el-button>
                    <el-button type="primary" @click="submitParamsForm">确 定</el-button>
                </span>
            </el-dialog>
        </el-card>
    </div>
</template>

<script>
    export default {
        name: "Params",
        created () {
            this.getCateList()
        },
        data () {
            return {
                getCateListArr: [],
                saveCateListArr: [],
                propsValue: 'cat_id',
                propsLabel: 'cat_name',
                propsChildren: 'children',
                activeName: 'many',
                courseId: null,
                manyTabList: [],
                onlyTabList: [],
                showDialog: false,
                addParamsForm: {
                    attr_name: ''
                },
                addParamsFormRules: {
                    attr_name: [
                        {required: true, message: '请输入活动名称', trigger: 'blur'}
                    ],
                },
                inputVisible: false,
                inputValue: ''
            }
        },
        methods: {
            async getCateList () {
                let {data: res} = await this.$axios.get('categories')
                console.log(res)
                this.getCateListArr = res.data
            },
            handleChange () {
                // console.log(this.saveCateListArr)
                if (this.saveCateListArr.length != 3) {
                    this.saveCateListArr = []
                    this.courseId = null
                    return
                }
                this.courseId = this.saveCateListArr[2]
                this.initParamsEleList()
            },
            handleTabClick () {
                this.initParamsEleList()
                console.log(this.activeName)
            },
            async initParamsEleList () {
                let {data: res} = await this.$axios.get(`categories/${this.courseId}/attributes`, {params: {sel: this.activeName}})
                console.log(res)
                res.data.forEach(item => {
                    item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
                })
                if (this.activeName == 'many') {
                    this.manyTabList = res.data
                } else {
                    this.onlyTabList = res.data
                }
            },
            showDialogButton () {
                this.showDialog = true
            },
            closeAddDialog () {
                this.$refs.addParamsFormRef.resetFields()
            },
             submitParamsForm () {
                this.$refs.addParamsFormRef.validate(async (valid) => {

                    if (!valid) return
                    let res = await this.$axios.post(`categories/${this.courseId}/attributes`, {attr_name: this.addParamsForm.attr_name, attr_sel: this.activeName})

                    this.showDialog = false
                    this.initParamsEleList()
                })
            },
            handleInputConfirm () {
                // let inputValue = this.inputValue;
                // if (inputValue) {
                    // this.dynamicTags.push(inputValue);
                // }
                // this.inputVisible = false;
                // this.inputValue = '';
                console.log('ok')
            },
            showInput () {
                console.log('zhanshi')
                this.inputVisible = true;
                // this.$nextTick(_ => {
                //     this.$refs.saveTagInput.$refs.input.focus();
                // });
            }
        }
    }
</script>

<style scoped lang="less">
.el-row{
    margin: 15px 0;
}
</style>
