<template>
    <div class="home">
        <el-container>
            <!--头部-->
            <el-header>
                <div class="home-header-left">
                    <img src="http://img4.imgtn.bdimg.com/it/u=1834303886,1990802258&fm=26&gp=0.jpg" alt="">
                    <div class="header-title">后台管理系统</div>
                </div>
                <el-button type="info" @click="loginExit">退出</el-button>
            </el-header>
            <!--内容区域-->
            <el-container>
                <!--侧边栏-->
                <el-aside width="200px">
                    <!--菜单栏-->
                    <el-menu text-color = "#fff" background-color="#333744" active-text-color="#409eff">
                        <!-- el-submenu 一级菜单项 -->
                        <!-- index必须为字符串 所以 + '' 变字符串 -->
                        <el-submenu :index="index + ''" v-for="(item, index) in menuList" :key = "item.id">
                            <!-- 模板区域 用来放图标 文字等 -->
                            <template slot="title">
                                <!--图标-->
                                <i class="el-icon-location" :class="elIconList[index]"></i>
                                <span>{{item.authName}}</span>
                            </template>
                            <!-- el-menu-item 二级菜单项 -->
                            <el-menu-item :index="subItem.id + ''" v-for="subItem in item.children" :key = "subItem.id">
                                <i class="el-icon-menu"></i>
                                <span slot="title">{{subItem.authName}}</span>
                            </el-menu-item>
                        </el-submenu>
                    </el-menu>
                </el-aside>
                <!--右侧内容-->
                <el-main>Main</el-main>
            </el-container>
        </el-container>
    </div>

</template>

<script>
    export default {
        name: "Home",
        created () {
            this.initListInfo()
        },
        data () {
          return {
              menuList: [],
              // 方法一 使用数组
              elIconList: ['el-icon-s-custom', 'el-icon-star-on', 'el-icon-s-goods', 'el-icon-tickets', 'el-icon-s-data']
              // 方法二 使用对象
              // elIconList: {
              //     110: 'el-icon-s-custom',
              //     103: 'el-icon-star-on',
              //     101: 'el-icon-s-goods',
              //     102: 'el-icon-tickets',
              //     145: 'el-icon-s-data'
              // }
          }
        },
        methods: {
            loginExit () {
                window.sessionStorage.clear()
                this.$message.success('退出成功');
                this.$router.replace('/login')
            },
            async initListInfo () {
                let {data: res} = await this.$axios.get('menus')
                if (res.meta.status !== 200) {
                    return this.$message.error(res.meta.msg);
                }
                this.menuList = res.data
            }
        }
    }
</script>

<style scoped lang="less">
.home{
    width: 100%;
    height: 100%;
    .el-container{
        width: 100%;
        height: 100%;
        .el-header{
            background-color: #373d41;
            padding-left: 0;
            padding-right: 15px;
            box-sizing: border-box;
            display: flex;
            justify-content: space-around;
            align-items: center;
            .home-header-left{
                height: 100%;
                width: 100%;
                display: flex;
                align-items: center;
                color: #FFFFFF;
                font-size: 20px;
                padding-left: 10px;
                img{
                    height: 100%;
                    border-radius: 50%;
                }
                .header-title{
                    padding-left: 15px;
                    box-sizing: border-box;
                }

            }
        }
        .el-main{
            background-color: #eaedf1;
        }
        .el-aside{
            background-color: #333744;
            .el-menu{

            }
        }
    }
}
</style>
