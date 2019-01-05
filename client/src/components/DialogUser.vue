<template>
  <div class="logUser">
    <el-dialog
      :title="dialog.title"
      :visible.sync="dialog.show"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :modal-append-to-body="false"
    >
      <div class="form">
        <el-form
          ref="form"
          :model="form"
          :rules="form_rules"
          label-width="120px"
          style="margin:10px;width:auto;"
        >
          <el-form-item prop="nickName" label="昵称:">
            <el-input type="nickName" v-model="form.nickName"></el-input>
          </el-form-item>

          <el-form-item prop="name" label="用户名:">
            <el-input type="name" v-model="form.name"></el-input>
          </el-form-item>

          <el-form-item label="性别:">
            <el-select v-model="form.sex" placeholder="性别">
              <el-option
                v-for="(formtype, index) in [0,1]"
                :key="index"
                :label="formtype == 0?'男':'女'"
                :value="formtype"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item prop="birthday" label="出生日期:">
            <el-date-picker v-model="form.birthday" type="date" placeholder="选择生日"></el-date-picker>
          </el-form-item>

          <el-form-item prop="phone" label="手机号码:">
            <el-input type="phone" v-model="form.phone"></el-input>
          </el-form-item>

          <el-form-item label="备注:">
            <el-select v-model="form.identity" placeholder="请选择身份">
              <el-option label="管理员" value="manager"></el-option>
              <el-option label="员工" value="employee"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item class="text_right">
            <el-button @click="dialog.show = false">取 消</el-button>
            <el-button type="primary" @click="onSubmit('form')">提 交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "logUser",
  props: {
    dialog: Object,
    form: Object
  },
  data() {
    var validatePhone = (rule, value, callback) => {
      if (!/^1[34578]\d{9}$/.test(value)) {
        callback(new Error("请输入正确的手机号!"));
      } else {
        callback();
      }
    };
    return {
      form_rules: {
        name: [
          { required: true, message: "用户名不能为空！", trigger: "blur" }
        ],
        phone: [
          { required: true, message: "手机号不能为空！", trigger: "blur" },
          { validator: validatePhone, trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    onSubmit(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          //表单数据验证完成之后，提交数据;
          const url =
            this.dialog.option == "add" ? "add" : `edit/${this.form.id}`;
          this.$axios
            .post(`/api/users/${url}`, this.form)
            .then(res => {
              // 操作成功
              debugger
              this.$message({
                message: "编辑成功！",
                type: "success"
              });
              var decode = res.data;
              this.dialog.show = false;
              this.$store.dispatch("setIsAutnenticated", !this.isEmpty(res.data));
              this.$store.dispatch("setUser", res.data);
            })
            .catch(err => {
              if (err.response.status == 404) {
                this.$message({
                  message: err.response.data,
                  type: "error"
                });
              }
            });
        }
      });
    },
    isEmpty(value) {
      return (
        value === undefined ||
        value === null ||
        (typeof value === "object" && Object.keys(value).length === 0) ||
        (typeof value === "string" && value.trim().length === 0)
      );
    }
  }
};
</script>

