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
                    <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
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
                <template slot="opt" slot-scope="scope">
                    <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditCateDialog(scope.row)">编辑</el-button>
                    <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeCateById(scope.row)">删除</el-button>
                </template>
            </tree-table>
            <!-- 分页区域 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="qureInfo.pagenum" :page-sizes="[3, 5, 10, 15]" :page-size="qureInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </el-card>
        <!-- 添加分类对话框 -->
        <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="50%" @close="addCateDialogClose">
            <!-- 添加分类的表单 -->
            <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
                <el-form-item label="分类名称：" prop="cat_name">
                    <el-input v-model="addCateForm.cat_name"></el-input>
                </el-form-item>
                <el-form-item label="父级名称：">
                    <!-- options 用来制定数据源 -->
                    <!-- props 用来指定配置象 -->
                    <el-cascader v-model="selectedKeys" :options="parentCateList" :props="cascaderProps" @change="parentCateChange" clearable></el-cascader>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addCateDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addCate">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 编辑分类对话框 -->
        <el-dialog title="编辑分类" :visible.sync="editDialogVisible" width="50%">
            <!-- 编辑分类的表单 -->
            <el-form :model="editCateForm" :rules="editCateFormRules" ref="editCateFormmRef" label-width="100px">
                <el-form-item label="分类名称：" prop="cat_name">
                    <el-input v-model="editCateForm.cat_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editCate">确 定</el-button>
            </span>
        </el-dialog>
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
            ],
            // 控制添加分类对话框的显示与隐藏
            addCateDialogVisible: false,
            // 添加分类的表单数据对象
            addCateForm: {
                // 将要添加的分类名称
                cat_name: '',
                // 父级分类的ID
                cat_pid: 0,
                // 分类的等级，默认添加的等级是1级分类
                cat_level: 0
            },
            // 添加分类表单的验证规则对象
            addCateFormRules: {
                cat_name: [
                    {
                        required: true,
                        message: '请输入分类名称',
                        trigger: 'blur'
                    }
                ]
            },
            // 修改分类表单的验证规则对象
            editCateFormRules: {
                cat_name: [
                    {
                        required: true,
                        message: '请输入分类名称',
                        trigger: 'blur'
                    }
                ]
            },
            // 父级分类的数据列表
            parentCateList: [],
            // 联级选择器的配置对象
            cascaderProps: {
                expandTrigger: 'hover',
                value: 'cat_id',
                label: 'cat_name',
                children: 'children',
                checkStrictly: true
            },
            // 选中的父级ID分类的数组
            selectedKeys: [],
            // 控制编辑分类对话框的显示与隐藏
            editDialogVisible: false,
            // 修改呋喃类时查询到的分类信息
            editCateForm: {}
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
        },
        // 添加分类按钮点击事件
        showAddCateDialog() {
            this.getParentCateList()
            this.addCateDialogVisible = true
        },
        // 获取父级分类的数据列表
        async getParentCateList() {
            const { data: res } = await this.$http.get('categories', {
                params: { type: 2 }
            })
            if (res.meta.status !== 200)
                return this.$message.error('获取父级分类列表失败')
            console.log(res.data)
            this.parentCateList = res.data
        },
        // 添加分类对话框联级选择器发生变化时触发的函数
        parentCateChange() {
            console.log(this.selectedKeys)
            if (this.selectedKeys.length > 0) {
                this.addCateForm.cat_pid = this.selectedKeys[
                    this.selectedKeys.length - 1
                ]
                this.addCateForm.cat_level = this.selectedKeys.length
                return
            } else {
                this.addCateForm.cat_pid = 0
                this.addCateForm.cat_level = 0
            }
        },
        // 添加分类对话框确定按钮点击事件
        addCate() {
            this.$refs.addCateFormRef.validate(async valid => {
                if (!valid) return

                const { data: res } = await this.$http.post(
                    'categories',
                    this.addCateForm
                )
                if (res.meta.status !== 201)
                    return this.$message.error('添加分类失败！')
                console.log(res)
                this.$message.success('添加分类成功！')
                this.getCateList()
                this.addCateDialogVisible = false
            })
        },
        // 监听添加分类对话框关闭事件
        addCateDialogClose() {
            this.$refs.addCateFormRef.resetFields()
            this.selectedKeys = []
            this.addCateForm.cat_pid = 0
            this.addCateForm.cat_level = 0
        },
        // 监听编辑按钮点击事件
        async showEditCateDialog(row) {
            const { data: res } = await this.$http.get(
                'categories/' + row.cat_id
            )
            if (res.meta.status !== 200)
                return this.$message.error('查询分类信息失败！')
            console.log(res)
            this.editCateForm = res.data
            this.editDialogVisible = true
        },
        // 点击确定按钮修改分类信息并提交
        editCate() {
            this.$refs.editCateFormmRef.validate(async valid => {
                if (!valid) return
                const { data: res } = await this.$http.put(
                    'categories/' + this.editCateForm.cat_id,
                    {
                        cat_name: this.editCateForm.cat_name
                    }
                )
                if (res.meta.status !== 200)
                    return this.$message.error('修改分类信息失败！')
                this.$message.success('修改分类信息成功！')
                this.editDialogVisible = false
                this.getCateList()
            })
        },
        // 删除分类按钮点击事件
        async removeCateById(row) {
            const confirmResult = await this.$confirm(
                '此操作将永久删除该分类, 是否继续?',
                '提示',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }
            ).catch(err => err)
            // console.log(confirmResult)
            // 如果用户点击确定删除，返回字符串 confirm
            // 如果用户点击取消删除，返回字符串 cancel
            if (confirmResult !== 'confirm')
                return this.$message.info('已取消删除')
            const { data: res } = await this.$http.delete(
                'categories/' + row.cat_id
            )
            if (res.meta.status !== 200)
                return this.$message.error('删除分类失败')
            this.$message.success('删除分类成功')
            this.getCateList()
        }
    }
}
</script>

<style lang="less" scoped>
.treeTable {
    margin-top: 15px;
}
.el-cascader {
    width: 100%;
}
</style>