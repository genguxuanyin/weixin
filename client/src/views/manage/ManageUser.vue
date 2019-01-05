<template>
  <div class="fillcontain">
    <div>
      <el-form :inline="true" ref="search_data" :model="search_data">
        <el-form-item label="筛选:">
          <el-input v-model="search_data.searchPhone" placeholder="输入手机号查找" clearable @input="onScreeoutMoney()"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="search_data.searchName" placeholder="输入用户名查找" clearable @input="onScreeoutMoney()"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="table_container">
      <el-table
        v-if="tableData.length > 0"
        :data="tableData"
        max-height="450"
        border
        :default-sort="{prop: 'date', order: 'descending'}"
        style="width: 100%"
      >
        <el-table-column type="index" label="用户头像" align="center" width="100">
          <template slot-scope="scope">
            <img :src="baseUrl+scope.row.avatar">
          </template>
        </el-table-column>
        <el-table-column prop="nickName" label="昵称" align="center" width="250"></el-table-column>
        <el-table-column prop="name" label="用户名" align="center" width="150"></el-table-column>
        <el-table-column prop="sex" label="性别" align="center" width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.sex==0?'男':'女' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="birthday" label="出生年月" align="center" width="220" sortable>
          <template slot-scope="scope">
            <el-icon name="time"></el-icon>
            <span style="margin-left: 10px">{{ scope.row.birthday }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="手机号" align="center" width="170">
          <template slot-scope="scope">
            <span style="color:#00d053">{{ scope.row.phone }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="cardNum" label="卡券数" align="center" width="170">
          <template slot-scope="scope">
            <span style="color:#f56767">{{ scope.row.cardNum }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="sex" label="性别" align="center" width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.sex==0?'男':'女' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="注册时间" align="center" width="220" sortable>
          <template slot-scope="scope">
            <el-icon name="time"></el-icon>
            <span style="margin-left: 10px">{{ scope.row.createdAt }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="operation" align="center" label="操作" fixed="right" width="180">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.state == 0"
              type="warning"
              icon="edit"
              size="small"
              @click="onEdit(scope.row,1)"
            >启用</el-button>
            <el-button
              v-else
              type="danger"
              icon="delete"
              size="small"
              @click="onEdit(scope.row,0)"
            >禁用</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-row>
        <el-col :span="24">
          <div class="pagination">
            <el-pagination
              v-if="paginations.total > 0"
              :page-sizes="paginations.page_sizes"
              :page-size="paginations.page_size"
              :layout="paginations.layout"
              :total="paginations.total"
              :current-page.sync="paginations.page_index"
              @current-change="handleCurrentChange"
              @size-change="handleSizeChange"
            ></el-pagination>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  name: "manageUser",
  data() {
    return {
      tableData: [],
      allTableData: [],
      filterTableData: [],
      form: {
        type: "",
        describe: "",
        income: "",
        expend: "",
        cash: "",
        remark: "",
        id: ""
      },
      //需要给分页组件传的信息
      paginations: {
        page_index: 1, // 当前位于哪页
        total: 0, // 总数
        page_size: 5, // 1页显示多少条
        page_sizes: [5, 10, 15, 20], //每页显示多少条
        layout: "total, sizes, prev, pager, next, jumper" // 翻页属性
      },
      search_data: {
        searchPhone: "",
        searchName: ""
      }
    };
  },
  created() {
    this.getUser();
  },
  methods: {
    getUser() {
      // 获取表格数据
      this.$axios("/api/users")
        .then(res => {
          // this.tableData = res.data;
          this.allTableData = res.data;
          this.filterTableData = res.data;
          // 设置分页数据
          this.setPaginations();
        })
        .catch(err => {
          console.dir(err);
          if (err.response.status == 404) {
            this.$message({
              message: err.response.data,
              type: "error"
            });
          }
        });
    },
    onEdit(row, option) {
      this.$axios
        .post(`/api/users/edit/${row.id}`, { state: option })
        .then(res => {
          this.$message("操作成功");
          this.getUser();
        })
        .catch(err => {
          console.dir(err);
        });
    },
    handleCurrentChange(page) {
      // 当前页
      let sortnum = this.paginations.page_size * (page - 1);
      let table = this.allTableData.filter((item, index) => {
        return index >= sortnum;
      });
      // 设置默认分页数据
      this.tableData = table.filter((item, index) => {
        return index < this.paginations.page_size;
      });
    },
    handleSizeChange(page_size) {
      // 切换size
      this.paginations.page_index = 1;
      this.paginations.page_size = page_size;
      this.tableData = this.allTableData.filter((item, index) => {
        return index < page_size;
      });
    },
    setPaginations() {
      // 总页数
      this.paginations.total = this.allTableData.length;
      this.paginations.page_index = 1;
      this.paginations.page_size = 5;
      // 设置默认分页数据
      this.tableData = this.allTableData.filter((item, index) => {
        return index < this.paginations.page_size;
      });
    },
    onScreeoutMoney() {
      // 筛选
      const searchPhone = this.search_data.searchPhone;
      const searchName = this.search_data.searchName;
      this.allTableData = this.filterTableData.filter(item => {
        return item.phone.includes(searchPhone) && item.name.includes(searchName);
      });
      // 分页数据
      this.setPaginations();
    }
  }
};
</script>
<style scoped>
.fillcontain {
  width: 100%;
  height: 100%;
  padding: 16px;
  box-sizing: border-box;
}
.btnRight {
  float: right;
}
.pagination {
  text-align: right;
  margin-top: 10px;
}
img {
  height: 60px;
  width: 60px;
  border-radius: 50%;
}
</style>