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
            <tree-table :data="cateList" :columns="columns" show-index index-text="#" :selection-type="false" :expand-type="false" border></tree-table>
            <!-- 分页区域 -->
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
        }
    }
}
</script>

<style lang="less" scoped>
</style>