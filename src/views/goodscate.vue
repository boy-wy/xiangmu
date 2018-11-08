<template>
<el-card class="box-card">
    <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-row class="searchArea">
        <el-col :span="24">
            <el-button @click="addGoodsCate()" type="success" plain>添加商品</el-button>
        </el-col>
    </el-row>

    <el-dialog title="添加分类" :visible.sync="dialogFormVisibleAdd">
        <el-form :model="form">
            <el-form-item label="分类名称" :label-width="formLabelWidth">
                <el-input v-model="form.cat_name" autocomplete="off"></el-input>
            </el-form-item>

            <el-form-item label="分类" :label-width="formLabelWidth">

                <el-cascader expand-trigger="hover" change-on-select clearable :options="caslist" v-model="selectedOptions" :props="defaultProp">
                </el-cascader>
            </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="addCate()">确 定</el-button>
        </div>
    </el-dialog>

    <el-table height="300" :data="list" style="width: 100%">

        <el-tree-grid prop="cat_name" label="分类名称" width="140" treeKey="cat_id" parentKey="cat_pid" levelKey="cat_level" childKey="children">

        </el-tree-grid>
        <el-table-column label="级别">
            <template slot-scope="scope">
                <span v-if="scope.row.cat_level===0">一级</span>
                <span v-else-if="scope.row.cat_level===1">二级</span>
                <span v-else-if="scope.row.cat_level===2">三级</span>
            </template>
        </el-table-column>
        <el-table-column label="是否有效">
            <template slot-scope="scope">
                <span v-if="scope.row.cat_deleted===false">无效</span>
                <span v-else-if="scope.row.cat_deleted===true">有效</span>

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

    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagenum" :page-sizes="[5, 10, 15, 20]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>
</el-card>
</template>

<script>
// 导入包
const ElTreeGrid = require('element-tree-grid')
export default {
    components: {
        // 自定义标签名:导入的对象ElTreeGrid
        ElTreeGrid
    },
    data() {
        return {
            list: [],
            pagenum: 1,
            pagesize: 10,
            total: 1,
            dialogFormVisibleAdd: false,
            formLabelWidth: '140px',
            form: {
                cat_pid: -1,
                cat_name: '',
                cat_level: -1
            },
            caslist: [],
            selectedOptions: [],
            defaultProp: {
                value: 'cat_id',
                label: 'cat_name',
                children: 'children'
            }
        }
    },
    created() {
        this.getGoodsCate()
    },
    methods: {

        // 添加分类 - 发送请求
        async addCate() {
            // 关闭对话框
            this.dialogFormVisibleAdd = false
            // 如果未选择 添加的是第一级
            // 如果选择了一个 添加的第二级
            // 如果选择了二个 添加的第三级
            if (this.selectedOptions.length === 0) {
                this.form.cat_pid = 0
                // this.form.cat_level = 0
            } else if (this.selectedOptions.length === 1) {
                this.form.cat_pid = this.selectedOptions[0]
                // this.form.cat_level = 1
            } else if (this.selectedOptions.length === 2) {
                this.form.cat_pid = this.selectedOptions[1]
                // this.form.cat_level = 2
            }
            this.form.cat_level = this.selectedOptions.length

            // 发送请求
            const res = await this.$http.post(`categories`, this.form)
            // console.log(res)
            const {
                meta: {
                    status,
                    msg
                }
            } = res.data
            if (status === 201) {
                this.$message.success(msg)
                this.getGoodsCate()
            } else {
                this.$message.warning(msg)
            }
        },
        //添加商品分类
        async addGoodsCate() {
            this.dialogFormVisibleAdd = true
            const res = await this.$http.get(`categories?type=2`)
            console.log(res)
            this.caslist = res.data.data

        },
        async getGoodsCate() {
            const res = await this.$http.get(`categories?type=3&pagenum=${this.pagenum}&pagesize=${this.pagesize}`)
            // console.log(res)
            this.list = res.data.data.result
            this.total = res.data.data.total
        },
        // 分页的相关方法
        handleSizeChange(val) {
            // console.log(`每页 ${val} 条`)
            this.pagesize = val
            this.pagenum = 1
            this.getGoodsCate()
        },
        handleCurrentChange(val) {
            // console.log(`当前页: ${val}`)
            // this.pagenum = 2 = val
            this.pagenum = val
            this.getGoodsCate()
        },

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
