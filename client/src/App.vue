<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import jwt_decode from "jwt-decode";
export default {
  name: "app",
  created() {
    if (localStorage.eleToken) {
      const decode = jwt_decode(localStorage.eleToken);
      this.$axios
        .get(`/api/users/${decode.id}`)
        .then(res => {
          // 存储数据
          this.$store.dispatch("setIsAutnenticated", !this.isEmpty(res.data));
          this.$store.dispatch("setUser", res.data);
        })
        .catch(err => {
          throw err;
        });
    }
  },
  methods: {
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


<style>
html,
body,
#app {
  width: 100%;
  height: 100%;
}
</style>
