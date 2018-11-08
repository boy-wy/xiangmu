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
            <el-button @click="addUserDialogFormVisible = true" type="success" plain>添加用户</el-button>
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
                <el-button @click="showEditdia(scope.row)" plain size="mini" type="primary" icon="el-icon-edit" circle></el-button>
                <el-button @click="showDelefirm(scope.row)" plain size="mini" type="danger" icon="el-icon-delete" circle></el-button>
                <el-button @click="showRoledia(scope.row)" plain size="mini" type="success" icon="el-icon-check" circle></el-button>
            </template>
        </el-table-column>
    </el-table>

    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagenum" :page-sizes="[2, 4, 6, 8]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>

    <!-- 添加用户 -->
    <el-dialog title="添加用户" :visible.sync="addUserDialogFormVisible">
        <el-form label-width="100px" :model="formData">
            <el-form-item label="用户名">
                <el-input v-model="formData.username" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="密码">
                <el-input v-model="formData.password" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="邮箱">
                <el-input v-model="formData.email" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="电话">
                <el-input v-model="formData.mobile" auto-complete="off"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="addUserDialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="addUser">确 定</el-button>
        </div>
    </el-dialog>

    <!-- 编辑用户 -->
    <el-dialog title="编辑用户" :visible.sync="editUserDialogFormVisible">
        <el-form ref="myform" label-width="100px" :model="formData">
            <el-form-item label="用户名" prop="username">
                <el-input disabled v-model="formData.username" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="邮箱">
                <el-input v-model="formData.email" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="电话">
                <el-input v-model="formData.mobile" auto-complete="off"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="editUserDialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="editUser()">确 定</el-button>
        </div>
    </el-dialog>

    <!-- 分配角色 -->
    <el-dialog title="分配角色" :visible.sync="setRoleDialogFormVisible">
        <el-form label-width="100px">
            <el-form-item label="用户名" prop="username">
                {{currUserName}}
            </el-form-item>
            <el-form-item label="角色">
                <el-select v-model="currRoleId">
                    <el-option 
                    disabled label="请选择" :value="-1">
                    </el-option>
                    <el-option v-for="(item,index) in roles" :key="index" 
                    :label="item.roleName" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="setRoleDialogFormVisible = false">取 消</el-button>
            <el-button @click="setRole()" type="primary">确 定</el-button>
        </div>
    </el-dialog>

</el-card>
</template>

<script>
export default {
    mounted() {
        this.loadTableData()
    },
    methods: {
         async setRole(){
        // 关闭对话框
        // this.dialogFormVisibleRoleuser = false
        // 发送请求
        const res = await this.$http.put(`users/${this.getRoleByUserId}/role`,{
          rid:this.currRoleId
        })
        console.log(res)
        const {meta:{status,msg}} = res.data
        if (status===200) {
        this.setRoleDialogFormVisible = false
          this.$message.success(msg)
        }

      },
        async showRoledia(user){
            this.getRoleByUserId=user.id
            this.setRoleDialogFormVisible = true
            this.currUserName=user.username
            const res = await this.$http.get('roles')
            // console.log(res)
            this.roles = res.data.data
            // 显示当前用户的角色
            // 要通过users/:id请求 获取当前用户的role_id
            const res1 = await this.$http.get(`users/${user.id}`)
            // console.log(res1)
            // 接口参数名 错了
            // 接口文档 role_id
            // 实际rid
            this.currRoleId =  res1.data.data.rid
        },
        //编辑用户，提交表单
        async editUser() {
            this.editUserDialogFormVisible = false
            const res = await this.$http.put(`users/${this.currUserId}`, this.formData)
            console.log(res)
            const {
                meta: {
                    msg,
                    status
                }
            } = res.data
            if (status == 200) {
                this.$message.success(msg)
            }
        },
        showEditdia(user) {
            this.editUserDialogFormVisible = true,
                this.formData = user,
                this.currUserId = user.id
        },
        //添加
        async addUser() {
            this.$http.defaults.headers.common['Authorization'] = sessionStorage.getItem('token')
            const res = await this.$http.post('users', this.formData)
            const data = res.data
            const {
                meta: {
                    status,
                    msg
                }
            } = data
            if (status === 201) {
                // 添加成功
                // 隐藏对话框
                this.addUserDialogFormVisible = false
                // 提示成功
                this.$message.success(msg)
                // 重新加载数据
                this.loadData()
                // 清空文本输入框的值
                for (const key in this.formData) {
                    this.formData[key] = ''
                }
            } else {
                this.$message.error(msg)
            }
        },
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
                    console.log(res)
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
            searchVal: '',
            addUserDialogFormVisible: false,
            // 绑定表单数据
            formData: {
                username: '',
                password: '',
                email: '',
                mobile: ''
            },
            //编辑用户
            editUserDialogFormVisible: false,
            currUserId: -1,

            setRoleDialogFormVisible: false,
            roles: [],
            getRoleByUserId:-1,
            currUserName:'',
            currRoleId:-1
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
