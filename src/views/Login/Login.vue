<template>
    <div class="login">
        <div class="login-box">
            <div class="avatar-box">
                <img :src="avatar" alt="">
            </div>
            <el-form  label-width="80px" :model="loginForm" :rules="loginFormRules" ref="ruleForm" hide-required-asterisk = false>
                <el-form-item label="账号" prop="userName">
                    <el-input prefix-icon="el-icon-s-custom" v-model="loginForm.userName"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="passWord">
                    <el-input prefix-icon="el-icon-lock"  type = 'password' v-model="loginForm.passWord"></el-input>
                </el-form-item>
                <el-row>
                   <div class="button-box">
                       <el-button type="primary" @click = "login">登录</el-button>
                       <el-button type="info" @click="resetForm">重置</el-button>
                   </div>
                </el-row>
            </el-form>
        </div>
        <!--<el-button :plain="true"></el-button>-->
    </div>
</template>

<script>
    export default {
        name: "login",
        data () {
            return {
                avatar: 'http://imgsrc.baidu.com/forum/w%3D580/sign=f480662e3cadcbef01347e0e9cae2e0e/8f5b1cd8bc3eb13517d8e851ab1ea8d3fc1f4489.jpg',
                loginForm: {
                    userName: '',
                    passWord: ''
                },
                loginFormRules: {
                    userName: [
                        { required: true, message: '请输入账号密码', trigger: 'blur' },
                        { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                    ],
                    passWord: [
                        { required: true, message: '请输入密码'}
                    ]
                }
            }
        },
        methods: {
            resetForm () {
                // 重置
                this.$refs.ruleForm.resetFields();
            },
            login () {
                // 统一验证
                this.$refs.ruleForm.validate(async (valid) => {
                    // 返回true false 通过则true
                    // console.log(valid)】
                    if (!valid) return
                    let {data: res} = await this.$axios.post('login', {username: this.loginForm.userName, password: this.loginForm.passWord})
                    let msg = res.meta.msg
                    console.log(res)
                    if (res.meta.status != 200) {
                        return this.$message.error(msg);
                    }
                    this.$message.success(msg);
                    window.sessionStorage.setItem('token', res.data.token)
                    this.$router.push('/home')
                })
            }
        }
    }
</script>

<style scoped lang="less">
.login{
    width: 100%;
    height: 100%;
    background-color: #2b4b6b;
    .login-box{
        width: 450px;
        /*height: 300px;*/
        background-color: #fff;
        border-radius: 3px;
        padding-bottom: 20px;
        padding-right: 20px;
        box-sizing: border-box;
        position: absolute;
        left: 52%;
        top: 50%;
        transform: translate(-50%, -50%);
        .avatar-box{
            width: 130px;
            height: 130px;
            border: 1px solid #eee;
            background-color: #fff;
            border-radius: 50%;
            overflow: hidden;
            padding: 10px;
            box-sizing: border-box;
            box-shadow: 0 0 10px #ddd;
            position: relative;
            left: 50%;
            transform: translate(-50%, -50%);
            img{
                width: 100%;
                height: 100%;
                border-radius: 50%;
                box-sizing: border-box;
            }
        }
        /deep/.el-form-item__label{
            text-align: center;
        }
        /deep/.el-input__inner{
            width: 100%;
        }
        .button-box{
            display: flex;
            justify-content: flex-end;
        }
    }
}
</style>
