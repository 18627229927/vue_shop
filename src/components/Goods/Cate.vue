<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图区域 -->
        <el-card>
            <!-- 收缩与添加区域 -->
            <el-row>
                <el-col>
                    <el-button type="primary">添加分类</el-button>
                </el-col>
            </el-row>
            <!-- 表格区域 -->
            <tree-table class="treeTable" :data="cateList" :columns="columns" show-index index-text="#" :selection-type="false" :expand-type="false" border>
                <!-- 是否有效 -->
                <template slot="isok" slot-scope="scope">
                    <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color: lightgreen"></i>
                    <i class="el-icon-error" v-else style="color: red"></i>
                </template>
                <!-- 排序 -->
                <template slot="order" slot-scope="scope">
                    <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
                    <el-tag size="mini" type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
                    <el-tag size="mini" type="warning" v-else>三级</el-tag>
                </template>
                <!-- 操作 -->
                <template slot="opt">
                    <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
                    <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
                </template>
            </tree-table>
            <!-- 分页区域 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="qureInfo.pagenum" :page-sizes="[3, 5, 10, 15]" :page-size="qureInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </el-card>
    </div>
</template>

<script>
export default {
    data() {
        return {
            // 获取数据的查询条件
            qureInfo: {
                type: 3,
                pagenum: 1,
                pagesize: 5
            },
            // 商品分类数据列表
            cateList: [],
            // 总数据条数
            total: 0,
            // 为table制定列的定义
            columns: [
                {
                    label: '分类名称',
                    prop: 'cat_name'
                },
                {
                    label: '是否有效',
                    // 表示将当前列定义为模板列
                    type: 'template',
                    // 表示当前列使用的模板名称
                    template: 'isok'
                },
                {
                    label: '排序',
                    // 表示将当前列定义为模板列
                    type: 'template',
                    // 表示当前列使用的模板名称
                    template: 'order'
                },
                {
                    label: '操作',
                    // 表示将当前列定义为模板列
                    type: 'template',
                    // 表示当前列使用的模板名称
                    template: 'opt'
                }
            ]
        }
    },
    created() {
        this.getCateList()
    },
    methods: {
        // 获取商品列表数据
        async getCateList() {
            const { data: res } = await this.$http.get('categories', {
                params: this.qureInfo
            })
            if (res.meta.status !== 200)
                return this.$message.error('获取商品列表失败')
            console.log(res.data)
            this.cateList = res.data.result
            this.total = res.data.total
        },
        // 监听 pagesize 改变
        handleSizeChange(newSize) {
            this.qureInfo.pagesize = newSize
            this.getCateList()
        },
        // 监听 pagenum 的改变
        handleCurrentChange(newNum) {
            this.qureInfo.pagenum = newNum
            this.getCateList()
        }
    }
}
</script>

<style lang="less" scoped>
.treeTable{
    margin-top: 15px;
}
</style>