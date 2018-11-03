<template>
<el-card class="box-card">
    <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-row class="searchArea">
        <el-col :span="24">
            <el-input v-model="searchVal" class="searchInput" clearable placeholder="请输入内容">
                <el-button slot="append" icon="el-icon-search" @click="searchUser()"></el-button>
            </el-input>
            <el-button type="success" plain>添加用户</el-button>
        </el-col>
    </el-row>
    <el-table v-loading="loading" :data="list" style="width: 100%">
        <el-table-column type="index" prop="date" label="#" width="180">
        </el-table-column>

        <el-table-column prop="username" label="姓名" width="180">
        </el-table-column>
        <el-table-column prop="email" label="邮箱">
        </el-table-column>
        <el-table-column label="创建日期">
            <template slot-scope="scope">
                {{scope.row.create_time | formDate}}
            </template>
        </el-table-column>
        <el-table-column label="用户状态">
            <template slot-scope="scope">
                <!-- scope.row就是当前绑定的数据对象 -->
                <el-switch @change="handleSwitchChange(scope.row)" v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949">
                </el-switch>
            </template>
        </el-table-column>

        <el-table-column label="操作">
            <template slot-scope="scope">
                <el-button plain size="mini" type="primary" icon="el-icon-edit" circle></el-button>
                <el-button @click="showDelefirm(scope.row.id)" plain size="mini" type="danger" icon="el-icon-delete" circle></el-button>
                <el-button plain size="mini" type="success" icon="el-icon-check" circle></el-button>
            </template>
        </el-table-column>
    </el-table>

    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagenum" :page-sizes="[2, 4, 6, 8]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>
</el-card>
</template>

<script>
export default {
    mounted() {
        this.loadTableData()
    },
    methods: {
        showDelefirm(user) {
            this.$confirm('Sure?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                .then(async () => {
                    // 发送请求
                    // users/:id
                    const res = await this.$http.delete(`users/${user.id}`)
                    // console.log(res)
                    const {
                        meta: {
                            msg,
                            status
                        }
                    } = res.data
                    if (status === 200) {
                        this.pagenum = 1
                        this.loadTableData() // pagenum=1

                        this.$message.success(msg)
                    }
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    })
                })
        },
        async handleSwitchChange(user) {
            console.log(user)
            //  this.$http.defaults.headers.common['Authorization'] = sessionStorage.getItem('token')
            const res = await this.$http.put(`users/${user.id}/state/${user.mg_state}`)
            console.log(res)
            const {
                meta: {
                    msg,
                    status
                }
            } = res.data

            if (status === 200) {
                this.$message.success(msg)
            } else {
                this.$message.error(msg)
            }
        },
        async loadTableData() {
            this.loading = true
            const AUTH_TOKEN = sessionStorage.getItem('token')
            this.$http.defaults.headers.common['Authorization'] = AUTH_TOKEN
            const res = await this.$http.get(`users?pagenum=${this.pagenum}&pagesize=${this.pagesize}&query=${this.searchVal}`)
            console.log(res)
            const {
                meta,
                data
            } = res.data
            if (meta.status == 200) {
                this.total = res.data.data.total
                this.loading = false
                this.list = data.users
            }
        },
        async searchUser() {
            this.loadTableData()
        },
        handleSizeChange(val) {
            // size发生变化
            console.log(`每页 ${val} 条`);
            this.pagesize = val
            this.loadTableData()
        },
        handleCurrentChange(val) {
            // 页码发生变化
            console.log(`当前页: ${val}`);
            this.pagenum = val
            this.loadTableData()
        }
    },
    data() {
        return {
            list: [],
            loading: true,
            pagenum: 1,
            pagesize: 2,
            total: 10,
            //搜索关键字
            searchVal: ''
        }
    }
}
</script>

<style>
.box-card {
    height: 100%;
}

.searchArea {
    margin-top: 10px;
    margin-bottom: 10px;
}

.searchArea .searchInput {
    width: 350px;
}
</style>
