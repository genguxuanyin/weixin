<template>
  <div class="personalInfo">
    <el-row type="flex" class="row-bg" justify="center">
      <el-col :span="8">
        <div class="user">
          <el-upload
            class="avatar-uploader"
            name="avatar"
            :action="fileApi+user.id"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="user.avatar" :src="baseUrl+user.avatar" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <!-- <form :action="fileApi" method="post" enctype="multipart/form-data">
            <input type="file" name="avatar" size="50">
            <br>
            <input type="submit" value="上传文件">
          </form>-->
        </div>
      </el-col>
      <el-col :span="16">
        <div class="userinfo">
          <div class="user-item">
            <i class="fa fa-user-plus"></i>
            昵称:
            <span>{{user.nickName?user.nickName:'未填写'}}</span>
          </div>
          <div class="user-item">
            <i class="fa fa-user"></i>
            用户名:
            <span>{{user.name}}</span>
          </div>
          <div class="user-item">
            <i class="fa fa-intersex"></i>
            性别:
            <span>{{user.sex == 0?'男':'女'}}</span>
          </div>
          <div class="user-item">
            <i class="fa fa-birthday-cake"></i>
            出生日期:
            <span>{{user.birthday?user.birthday:'未填写'}}</span>
          </div>
          <div class="user-item">
            <i class="fa fa-phone"></i>
            手机号码:
            <span>{{user.phone?user.phone:'未填写'}}</span>
          </div>
          <div class="user-item">
            <i class="fa fa-cog"></i>
            身份:
            <span>{{user.identity == 'manager' ? '管理员' : '普通员工'}}</span>
          </div>
          <div class="user-item">
            <el-button type="primary" @click="onEditUser()" class="edit_btn">编 辑</el-button>
          </div>
        </div>
      </el-col>
    </el-row>
    <!-- 弹框页面 -->
    <DialogUser :dialog="dialog" :form="form"></DialogUser>
  </div>
</template>
<script>
import DialogUser from "../../components/DialogUser";

export default {
  name: "personalInfo",
  data() {
    return {
      dialog: {
        show: false,
        title: "",
        option: "edit"
      },
      form: {
        nickName: "",
        name: "",
        sex: "",
        birthday: "",
        phone: "",
        identity: "",
        id: "",
        avatar: ""
      },
      fileApi: `/api/users/file/`
    };
  },
  methods: {
    onEditUser() {
      // 编辑
      this.dialog = {
        show: true,
        title: "修改用户信息",
        option: "edit"
      };
      this.form = {
        nickName: this.user.nickName,
        name: this.user.name,
        sex: this.user.sex,
        birthday: this.user.birthday,
        phone: this.user.phone,
        identity: this.user.identity,
        id: this.user.id,
        avatar: this.user.avatar
      };
    },
    handleAvatarSuccess(res, file) {
      this.$store.dispatch("setIsAutnenticated", !this.isEmpty(res));
      this.$store.dispatch("setUser", res);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    isEmpty(value) {
      return (
        value === undefined ||
        value === null ||
        (typeof value === "object" && Object.keys(value).length === 0) ||
        (typeof value === "string" && value.trim().length === 0)
      );
    }
  },
  computed: {
    user() {
      return this.$store.getters.user;
    }
  },
  components: {
    DialogUser
  }
};
</script>
<style scoped>
.personalInfo {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  /* padding: 16px; */
}
.row-bg {
  width: 100%;
  height: 100%;
}
.user {
  text-align: center;
  position: relative;
  top: 30%;
}
.userinfo {
  height: 100%;
  background-color: #eee;
}
.user-item {
  position: relative;
  top: 20%;
  padding: 26px;
  font-size: 28px;
  color: #333;
}
.edit_btn {
  width: 200px;
}
.avatar-uploader{
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  text-align: center;
  width: 178px;
  height: 178px;
  margin: auto;
}
.avatar-uploader:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100%;
  height: 100%;
  line-height: 178px;
  border-radius: 50%;
}
.avatar {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
