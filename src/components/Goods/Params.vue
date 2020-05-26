<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>参数列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图区域 -->
        <el-card>
            <!-- 警告区域 -->
            <el-alert title="注意：值允许第三级分类设置参数" type="warning" show-icon :closable="false">
            </el-alert>
            <!-- 选择商品分类区域 -->
            <el-row class="cat_opt">
                <el-col>
                    <span>选择商品分类：</span>
                    <!-- 选择商品的级联选择框 -->
                    <el-cascader v-model="selectedCateKeys" :options="cateList" :props="cateProps" @change="handleChange" clearable></el-cascader>
                </el-col>
            </el-row>
            
            <!-- tabs 页签区域 -->
            <el-tabs v-model="activeName" @tab-click="handleTabClick">

                <!-- 添加动态参数的面板 -->
                <el-tab-pane label="动态参数" name="many">
                    <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="showAddDialig">添加参数</el-button>
                    <!-- 动态数据表格 -->
                    <el-table :data="manyTableData" border stripe>
                        <!-- 展开行 -->
                        <el-table-column type="expand"></el-table-column>
                        <!-- 索引列 -->
                        <el-table-column type="index" label="#"></el-table-column>
                        <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                                <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>

                <!-- 添加静态属性的面板 -->
                <el-tab-pane label="静态属性" name="only">
                    <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="showAddDialig">添加属性</el-button>
                    <!-- 静态属性表格 -->
                    <el-table :data="onlyTableData" border stripe>
                        <!-- 展开行 -->
                        <el-table-column type="expand"></el-table-column>
                        <!-- 索引列 -->
                        <el-table-column type="index" label="#"></el-table-column>
                        <el-table-column label="属性名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                                <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </el-card>

        <!-- 添加参数的对话框 -->
        <el-dialog :title="'添加'+titleText" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
                <el-form-item :label="titleText" prop="attr_name">
                    <el-input v-model="addForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addParams">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            cateList: [],
            // 级联选择器的配置对象
            cateProps: {
                expandTrigger: 'hover',
                value: 'cat_id',
                label: 'cat_name',
                children: 'children'
            },
            // 级联选择框双向绑定的数组
            selectedCateKeys: [],
            // 被激活的页签名称
            activeName: 'many',
            // 动态参数的数据
            manyTableData: [],
            // 静态属性的数据
            onlyTableData: [],
            // 添加参数对话框的显示与隐藏
            addDialogVisible: false,
            // 添加参数的表单验证对象
            addForm: {
                attr_name: ''
            },
            // 添加参数的表单验证规则对象
            addFormRules: {
                attr_name: [
                    {
                        required: true,
                        message: '请输入名称',
                        trigger: 'blur'
                    }
                ]
            }
        }
    },
    created() {
        this.getCateList()
    },
    methods: {
        async getCateList() {
            const { data: res } = await this.$http.get('categories')
            if (res.meta.status !== 200)
                return this.$message.error('请求分类数据列表失败')
            this.cateList = res.data
            console.log(this.cateList)
        },
        // 监听级联选择器发生变化的函数
        handleChange() {
            this.getParamsData()
        },
        // tab页签点击事件的处理函数
        handleTabClick() {
            this.getParamsData()
        },
        // 获取参数列表的数据
        async getParamsData() {
            // 证明选择的不是三级分类
            if (this.selectedCateKeys.length !== 3) {
                this.selectedCateKeys = []
                return
            }
            // 根据所选分类的ID和当前所处的面板,获取对应的参数
            const { data: res } = await this.$http.get(
                `categories/${this.cateId}/attributes`,
                {
                    params: { sel: this.activeName }
                }
            )
            if (res.meta.status !== 200)
                return this.$message.error('获取参数列表失败!')
            console.log(res)
            if (this.activeName === 'many') {
                this.manyTableData = res.data
            } else {
                this.onlyTableData = res.data
            }
        },
        // 控制添加参数对话框的显示与隐藏
        showAddDialig() {
            this.addDialogVisible = true
        },
        // 监听添加参数对话框关闭事件
        addDialogClosed() {
            this.$refs.addFormRef.resetFields()
        },
        // 点击确定按钮添加相应参数
        addParams() {
            this.$refs.addFormRef.validate(async valid => {
                if (!valid) return
                const { data: res } = await this.$http.post(
                    `categories/${this.cateId}/attributes`,
                    {
                        attr_name: this.addForm.attr_name,
                        attr_sel: this.activeName
                    }
                )
                if (res.meta.status !== 201)
                    return this.$message.error('添加参数失败！')
                this.$message.success('添加参数成功！')
                this.addDialogVisible = false
                this.getParamsData()
            })
        }
    },
    computed: {
        // 如果按钮需要被禁用则返回true否则返回false
        isBtnDisabled() {
            if (this.selectedCateKeys.length !== 3) {
                return true
            }
            return false
        },
        // 当前选中的三级分类的ID
        cateId() {
            if (this.selectedCateKeys.length === 3) {
                return this.selectedCateKeys[2]
            }
            return null
        },
        // 动态计算标题的文本
        titleText() {
            if (this.activeName === 'many') {
                return '动态参数'
            }
            return '静态属性'
        }
    }
}
</script>

<style lang="less" scoped>
.cat_opt {
    margin: 15px 0;
    font-weight: 600;
}
.el-cascader {
    width: 50%;
}
</style>