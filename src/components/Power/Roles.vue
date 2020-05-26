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
                <!-- 展开列 -->
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <el-row :class="['bdBottom', i1 === 0 ? 'bdTop': '', 'vcenter']" v-for="(item1, i1) in scope.row.children" :key="item1.id">
                            <!-- 渲染一级权限 -->
                            <el-col :span="5">
                                <el-tag closable @close='removeRightById(scope.row, item1.id)'>{{item1.authName}}</el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <!-- 渲染二级于三级权限 -->
                            <el-col :span="19">
                                <el-row :class="[i2 === 0 ? '': 'bdTop', 'vcenter']" v-for="(item2, i2) in item1.children" :key="item2.id">
                                    <el-col :span="6">
                                        <el-tag type="success" closable @close='removeRightById(scope.row, item2.id)'>{{item2.authName}}</el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <el-col :span="18">
                                        <el-tag type="warning" v-for="item3 in item2.children" :key="item3.id" closable @close='removeRightById(scope.row, item3.id)'>{{item3.authName}}</el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>
                <!-- 索引列 -->
                <el-table-column label="#" type="index"></el-table-column>
                <el-table-column label="角色名称" prop="roleName"></el-table-column>
                <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
                <el-table-column label="操作" width="300px">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row)">编辑</el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeRulesById(scope.row)">删除</el-button>
                        <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRightDialog(scope.row)">分配权限</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
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
        <!-- 分配权限的对话框 -->
        <el-dialog title="分配权限" :visible.sync="setRightsDialogVisible" width="50%" @close="setRightsDialogClosed">
            <el-tree :data="rightsTree" :props="treeProps" show-checkbox node-key="id" default-expand-all :default-checked-keys="defKeys" ref="treeRef"></el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button @click="setRightsDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="allotRights">确 定</el-button>
            </span>
        </el-dialog>
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
            // 权限树形列表
            rightsTree: [],
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
            // 控制分配的对话框显示与隐藏
            setRightsDialogVisible: false,
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
            },
            // 树形权限控件的属性绑定对象
            treeProps: {
                children: 'children',
                label: 'authName'
            },
            // 默认勾选的树形节点
            defKeys: [],
            // 即将进行分配的角色ID
            roleId: ''
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
                    return this.$message.error('修改角色信息失败！')
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
        },
        // 根据id删除对应的权限
        async removeRightById(role, rightId) {
            // 提示弹框是否要删除
            const confirmResult = await this.$confirm(
                '此操作将永久删除该权限, 是否继续?',
                '提示',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }
            ).catch(err => err)
            if (confirmResult !== 'confirm')
                return this.$message.info('取消了删除')
            const { data: res } = await this.$http.delete(
                `roles/${role.id}/rights/${rightId}`
            )
            if (res.meta.status !== 200)
                return this.$message.error('删除权限失败')
            role.children = res.data
        },
        // 展示分配权限的对话框
        async showSetRightDialog(role) {
            this.roleId = role.id
            // 获取所有权限数据
            const { data: res } = await this.$http.get('rights/tree')
            if (res.meta.status !== 200)
                return this.$message.error('获取所有权限失败')
            this.rightsTree = res.data
            // console.log(this.rightsTree)
            // 递归获取当前角色的三级权限节点
            this.getLeafKeys(role, this.defKeys)
            this.setRightsDialogVisible = true
        },
        // 通过递归的形式，获取当前角色下所有的3级权限的id，并保存到 defKeys数组中
        getLeafKeys(node, arr) {
            if (!node.children) return arr.push(node.id)
            node.children.forEach(item => this.getLeafKeys(item, arr))
        },
        // 监听分配权限对话框的关闭事件
        setRightsDialogClosed() {
            this.defKeys = []
        },
        // 点击确定为角色分配权限
        async allotRights() {
            const keys = [
                ...this.$refs.treeRef.getCheckedKeys(),
                ...this.$refs.treeRef.getHalfCheckedKeys()
            ]
            console.log(keys)
            const idStr = keys.join(',')
            const {data:res} = await this.$http.post(`roles/${this.roleId}/rights`, { rids: idStr })
            if(res.meta.status !==200) return this.$message.error('分配角色权限失败')
            this.getRolesList()
            this.setRightsDialogVisible = false
        }
    }
}
</script>

<style lang="less" scoped>
.el-tag {
    margin: 7px;
}
.bdTop {
    border-top: 1px solid #eee;
}
.bdBottom {
    border-bottom: 1px solid #eee;
}
.vcenter {
    display: flex;
    align-items: center;
}
</style>