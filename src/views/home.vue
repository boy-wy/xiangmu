<template>
<el-container class="container">
    <el-header class="header">
        <el-row>
            <el-col :span="4">
                <div class="grid-content bg-purple">
                    <img src="../assets/logo.png" alt="">
                </div>
            </el-col>
            <el-col :span="19" class="middle">
                <div class="grid-content bg-purple-light">
                    <h2>电商后台管理系统</h2>
                </div>
            </el-col>
            <el-col :span="1">
                <div class="grid-content bg-purple">
                    <a href="#"  
                    class="loginout" @click.prevent="handleSignout">退出</a>
                </div>
            </el-col>
        </el-row>
    </el-header>
    <el-container>
        <el-aside class="aside" width="200px">
            <el-menu default-active="2" class="el-menu-vertical-demo" :unique-opened="true" :router="true">
                <el-submenu :index="index+''" v-for="(item1,index) in menus" :key="index">
                    <template slot="title">
                        <i class="el-icon-location"></i>
                        <span>{{item1.authName}}</span>
                    </template>

                    <el-menu-item :index="'/'+item2.path" v-for="(item2,index) in item1.children" :key="index">
                        <i class="el-icon-menu"></i>
                        {{item2.authName}}</el-menu-item>
                </el-submenu>

               
            </el-menu>
        </el-aside>
        <el-main class="main">
            <router-view></router-view>
        </el-main>
    </el-container>
</el-container>
</template>

<script>
export default {
    data(){
        return{
            menus:[]
        }
    },
    beforeCreate() {
        // 从session中获取token 判断是否有token
        const token = sessionStorage.getItem('token')
        if (!token) {
            // 返回登录页
            this.$router.push({
                name: 'login'
            })
            this.$message.warning('请先登录')
        }
    },
    created(){
        this.getMenus()
    },
    methods:{
        async getMenus(){
            const res = await this.$http.get(`menus`)
            // console.log(res)
            this.menus=res.data.data
        },
        handleSignout(){
            sessionStorage.clear()
            this.$router.push({name:'login'})
             this.$message.success('退出成功')
        }
    }
}
</script>

<style>
.container {
    height: 100%;
}

.header {
    background-color: #b3c0d1;
}

.aside {
    background-color: #d3dce6;
}

.main {
    background-color: #e9eef3;
    height: 100%;
}

.header .middle {
    line-height: 60px;
    color: #fff;
    text-align: center;
}

.header .loginout {
    line-height: 60px;
    text-decoration: none;
}
</style>
