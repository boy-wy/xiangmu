<template>
   <el-card class="box-card">
    <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-row class="searchArea">
        <el-col :span="24">
            <el-input v-model="searchVal" class="searchInput" clearable placeholder="请输入内容">
                <el-button slot="append" icon="el-icon-search" @click="searchUser()"></el-button>
            </el-input>
            <el-button @click="addUserDialogFormVisible = true" type="success" plain>添加商品</el-button>
        </el-col>
    </el-row>
    <el-table height="450" :data="list" style="width: 100%">
        <el-table-column type="index" prop="date" label="#" width="80">
        </el-table-column>

        <el-table-column prop="goods_name" label="商品名称" width="300">
        </el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)">
        </el-table-column>
         <el-table-column prop="goods_weight" label="商品重量">
        </el-table-column>
        <el-table-column label="创建日期">
            <template slot-scope="scope">
                {{scope.row.add_time | formDate}}
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

    <el-pagination @size-change="handleSizeChange" 
    @current-change="handleCurrentChange" :current-page="pagenum" 
    :page-sizes="[50, 100, 150, 200]" :page-size="pagesize" 
    layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>
    </el-card>
</template>
<script>
export default {
     data(){
         return {
             searchVal:'',
             list:[],
             pagenum:1,
             pagesize:100,
             total:1,
            //  loading: true

         }
     },
      created(){
        this.getGoods()
    },
     methods:{
          // 分页的相关方法
    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`)
      this.pagesize = val
      this.pagenum = 1
      this.getGoods()
    },
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      // this.pagenum = 2 = val
      this.pagenum = val
      this.getGoods()
    },
   
         //获取商品列表
         async getGoods(){
             const res = await this.$http.get(`goods?pagenum=${this.pagenum}&pagesize=${this.pagesize}&query=${this.searchVal}`)
             console.log(res)
             this.list=res.data.data.goods
             this.total=res.data.data.total
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