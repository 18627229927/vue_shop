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
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row)">编辑</el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeRulesById(scope.row)">删除</el-button>
                        <el-button type="warning" icon="el-icon-setting" size="mini">分配权限</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 添加角色的对话框 -->
            <el-dialog title="添加角色" :visible.sync="addDialogVisible" width="50%" @close="addDialogClose">
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
            <!-- 编辑角色的对话框 -->
            <el-dialog title="编辑角色" :visible.sync="editDialogVisible" width="50%" @close="editDialogClose">
                <!-- 内容主体区域 -->
                <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="80px">
                    <el-form-item label="角色名称" prop="roleName">
                        <el-input v-model="editForm.roleName"></el-input>
                    </el-form-item>
                    <el-form-item label="角色描述" prop="roleDesc">
                        <el-input v-model="editForm.roleDesc"></el-input>
                    </el-form-item>
                </el-form>
                <!-- 底部区域 -->
                <span slot="footer" class="dialog-footer">
                    <el-button @click="editDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="editRoles">确 定</el-button>
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
                return callback(
                    new Error('请输入合法的角色名称（必须全为汉字）')
                )
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
            },
            // 控制修改角色的对话框显示与隐藏
            editDialogVisible: false,
            // 修改角色时查询到的角色信息
            editForm: {},
            // 修改角色表单的验证规则对象
            editFormRules: {
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
        // 监听添加角色对话框关闭事件
        addDialogClose() {
            this.$refs.addFormRef.resetFields()
        },
        // 监听修改角色对话框关闭事件
        editDialogClose() {
            this.$refs.editFormRef.resetFields()
        },
        // 点击确定按钮添加新角色
        addRoles() {
            this.$refs.addFormRef.validate(async valid => {
                if (!valid) return
                // 可以发起添加角色的网络请求
                const { data: res } = await this.$http.post(
                    'roles',
                    this.addForm
                )
                if (res.meta.status !== 201)
                    return this.$message.error('添加角色失败！')
                this.$message.success('添加角色成功！')
                this.addDialogVisible = false
                this.getRolesList()
            })
        },
        // 修改角色按钮点击事件
        async showEditDialog(row) {
            const { data: res } = await this.$http.get('roles/' + row.id)
            if (res.meta.status !== 200)
                return this.$message.error('查询角色信息失败！')
            this.editForm = res.data
            this.editDialogVisible = true
        },
        // 点击确定按钮修改角色信息并提交
        editRoles() {
            this.$refs.editFormRef.validate(async valid => {
                if (!valid) return
                // 可以发起修改角色的请求
                const { data: res } = await this.$http.put(
                    'roles/' + this.editForm.roleId,
                    {
                        roleName: this.editForm.roleName,
                        roleDesc: this.editForm.roleDesc
                    }
                )
                if (res.meta.status !== 200)
                    return this.$message.error('修改觉得信息失败！')
                this.$message.success('修改角色信息成功！')
                this.editDialogVisible = false
                this.getRolesList()
            })
        },
        // 点击删除按钮通过ID删除该角色
        async removeRulesById(row) {
            const confirmResult = await this.$confirm(
                '此操作将永久删除该角色, 是否继续?',
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
            const { data: res } = await this.$http.delete('roles/' + row.id)
            if (res.meta.status !== 200)
                return this.$message.error('删除角色失败')
            this.$message.success('删除角色成功')
            this.getRolesList()
        }
    }
}
</script>

<style lang="less" scoped>
</style>