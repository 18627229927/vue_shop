<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图区域 -->
        <el-card>
            <!-- 添加角色按钮区域 -->
            <el-row>
                <el-col>
                    <el-button type="primary" @click="addDialogVisible = true">添加角色</el-button>
                </el-col>
            </el-row>
            <!-- 角色列表区域 -->
            <el-table :data="roleList" border stripe>
                <el-table-column type="expand"></el-table-column>
                <el-table-column label="#" type="index"></el-table-column>
                <el-table-column label="角色名称" prop="roleName"></el-table-column>
                <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
                <el-table-column label="操作" width="300px">
                    <template slot-scope="{}">
                        <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
                        <el-button type="warning" icon="el-icon-setting" size="mini">分配权限</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 添加角色的对话框 -->
            <el-dialog title="提示" :visible.sync="addDialogVisible" width="50%" @close="addDialogClose">
                <!-- 内容主体区域 -->
                <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="80px">
                    <el-form-item label="角色名称" prop="roleName">
                        <el-input v-model="addForm.roleName"></el-input>
                    </el-form-item>
                    <el-form-item label="角色描述" prop="roleDesc">
                        <el-input v-model="addForm.roleDesc"></el-input>
                    </el-form-item>
                </el-form>
                <!-- 底部区域 -->
                <span slot="footer" class="dialog-footer">
                    <el-button @click="addDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addRoles">确 定</el-button>
                </span>
            </el-dialog>
        </el-card>
    </div>
</template>

<script>
export default {
    data() {
        // 角色的验证规则
        var checkroleName = (rule, value, callback) => {
            // 角色名称验证正则表达式
            const regroleName = /^[\u2E80-\u9FFF]+$/

            if (!regroleName.test(value)) {
                return callback(new Error('请输入合法的角色名称（必须全为汉字）'))
            }
            callback()
        }
        return {
            // 角色列表
            roleList: [],
            // 控制添加角色的对话框显示与隐藏
            addDialogVisible: false,
            // 添加角色表单数据
            addForm: {
                roleName: '',
                roleDesc: ''
            },
            // 添加角色表单的验证规则对象
            addFormRules: {
                roleName: [
                    {
                        required: true,
                        message: '请输入角色名称',
                        trigger: 'blur'
                    },
                    {
                        validator: checkroleName,
                        trigger: 'blur'
                    }
                ]
            }
        }
    },
    created() {
        this.getRolesList()
    },
    methods: {
        // 获取角色列表
        async getRolesList() {
            const { data: res } = await this.$http.get('roles')
            console.log(res)
            if (res.meta.status !== 200)
                return this.$message.error('获取角色列表失败')
            this.roleList = res.data
        },
        // 监听添加用户对话框关闭事件
        addDialogClose() {
            this.$refs.addFormRef.resetFields()
        },
        // 点击确定按钮添加新角色
        addRoles() {
            this.$refs.addFormRef.validate(async valid => {
                if (!valid) return
                // 可以发起添加用户的网络请求
                const {data:res} = await this.$http.post('roles',this.addForm)
                console.log(res)
                if (res.meta.status !== 201)
                    return this.$message.error('添加角色失败！')
                this.$message.success('添加角色成功！')
                this.addDialogVisible = false
                this.getRolesList()
            })
        }
    }
}
</script>

<style lang="less" scoped>
</style>