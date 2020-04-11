<template>
    <div class="home">
        <el-container>
            <!--头部-->
            <el-header>
                <div class="home-header-left">
                    <img src="http://5b0988e595225.cdn.sohucs.com/q_70,c_zoom,w_640/images/20200105/c5162a9d6f484ce3b8ff464b27f8865f.jpeg" alt="">
                    <div class="header-title">后台管理系统</div>
                </div>
                <el-button type="info" @click="loginExit">退出</el-button>
            </el-header>
            <!--内容区域-->
            <el-container>
                <!--侧边栏-->
                <el-aside :width="collapseFlag ? '64px' : '200px'">
                    <div class="toggle-button" @click="toggleMenu">|||</div>
                    <!--菜单栏-->
                    <el-menu text-color = "#fff" background-color="#333744" active-text-color="#409eff" :unique-opened = "true" :collapse = "collapseFlag" :collapse-transition = "false" router :default-active="activeMenuPath">
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
                            <el-menu-item :index="subItem.path + ''" v-for="subItem in item.children" :key = "subItem.id" @click="changeSubItem(subItem.path + '')">
                                <i class="el-icon-menu"></i>
                                <span slot="title">{{subItem.authName}}</span>
                            </el-menu-item>
                        </el-submenu>
                    </el-menu>
                </el-aside>
                <!--右侧内容-->
                <el-main>
                    <router-view></router-view>
                </el-main>
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
        mounted () {
            if (window.sessionStorage.getItem('activeMenuPath')) {
                this.activeMenuPath = window.sessionStorage.getItem('activeMenuPath')
            }
        },
        data () {
          return {
              menuList: [],
              // 方法一 使用数组
              elIconList: ['el-icon-s-custom', 'el-icon-star-on', 'el-icon-s-goods', 'el-icon-tickets', 'el-icon-s-data'],
              // 方法二 使用对象
              // elIconList: {
              //     110: 'el-icon-s-custom',
              //     103: 'el-icon-star-on',
              //     101: 'el-icon-s-goods',
              //     102: 'el-icon-tickets',
              //     145: 'el-icon-s-data'
              // },
              collapseFlag: false,
              activeMenuPath: ''
          }
        },
        methods: {
            // 退出登录
            loginExit () {
                window.sessionStorage.clear()
                this.$message.success('退出成功');
                this.$router.replace('/login')
            },
            // 左侧菜单内容
            async initListInfo () {
                let {data: res} = await this.$axios.get('menus')
                if (res.meta.status !== 200) {
                    return this.$message.error(res.meta.msg);
                }
                this.menuList = res.data
            },
            // 菜单栏展开
            toggleMenu () {
                this.collapseFlag = !this.collapseFlag
            },
            changeSubItem (subPath) {
                console.log(subPath)
                console.log(this.$route.name)
                console.log(this.$route.path)
                this.activeMenuPath = this.$route.name.toLowerCase();
                window.sessionStorage.setItem('activeMenuPath', this.activeMenuPath)
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
                border: none;
            }
            .toggle-button{
                background-color: #4a5064;
                font-size: 10px;
                line-height: 24px;
                color: #FFFFFF;
                text-align: center;
                letter-spacing: 0.2em;
                cursor: pointer;
            }
        }
    }
}
</style>
