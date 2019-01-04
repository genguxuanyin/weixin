<template>
  <el-row class="menu_page">
    <el-col>
      <el-menu
        mode="vertical"
        background-color="#324057"
        text-color="#fff"
        active-text-color="#409eff"
        class="el-menu-vertical-demo"
      >
        <router-link to="/home">
          <el-menu-item index="0">
            <i class="el-icon-tickets"></i>
            <span slot="title">首页</span>
          </el-menu-item>
        </router-link>
        <template v-for="item in items">
          <el-submenu v-if="item.children" :index="item.path" :key="item.path">
            <template slot="title">
              <i :class="item.icon"></i>
              <span slot="title">{{item.name}}</span>
            </template>
            <router-link v-for="(citem,cindex) in item.children" :to="citem.path" :key="cindex">
              <el-menu-item :index="citem.path">
                <span slot="title">{{citem.name}}</span>
              </el-menu-item>
            </router-link>
          </el-submenu>
        </template>
      </el-menu>
    </el-col>
  </el-row>
</template>
<script>
export default {
  name: "leftmenu",
  data() {
    return {
      items: [
        {
          icon: "el-icon-menu",
          name: "统计",
          path: "statistics",
          children: [
            {
              path: "statisticsUser",
              name: "用户分析"
            },
            {
              path: "statisticsOrder",
              name: "订单分析"
            }
          ]
        },
        {
          icon: "el-icon-edit-outline",
          name: "管理",
          path: "manage",
          children: [
            {
              path: "manageUser",
              name: "用户管理"
            },
            {
              path: "manageTicket",
              name: "卡券管理"
            },
            {
              path: "manageGoods",
              name: "商品管理"
            },
            {
              path: "manageOrder",
              name: "订单管理"
            }
          ]
        },
        {
          icon: "el-icon-star-on",
          name: "开发",
          path: "develop",
          children: [
            {
              path: "developConfig",
              name: "基本配置"
            },
            {
              path: "developLimit",
              name: "接入权限"
            }
          ]
        },
        {
          icon: "el-icon-setting",
          name: "设置",
          path: "setting",
          children: [
            {
              path: "settingInfo",
              name: "平台信息"
            },
            {
              path: "personalInfo",
              name: "个人信息"
            }
          ]
        },
        {
          icon: "el-icon-news",
          name: "资金管理",
          path: "fund",
          children: [{ path: "foundlist", name: "资金流水" }]
        },
        {
          icon: "el-icon-document",
          name: "信息管理",
          path: "info",
          children: [{ path: "infoshow", name: "个人信息" }]
        }
      ]
    };
  }
};
</script>
<style scoped>
.menu_page {
  position: fixed;
  top: 71px;
  left: 0;
  min-height: 100%;
  background-color: #324057;
  z-index: 99;
}
.el-menu {
  border: none;
}
.fa-margin {
  margin-right: 5px;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 180px;
  min-height: 400px;
}
.el-menu-vertical-demo {
  width: 35px;
}
.el-submenu .el-menu-item {
  min-width: 180px;
}

.hiddenDropdown,
.hiddenDropname {
  display: none;
}
a {
  text-decoration: none;
}
</style>
