<template>
  <div class="wrapper">
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label for="exampleInputEmail1">Email address</label>
        <input
          type="email"
          class="form-control"
          id="exampleInputEmail1"
          aria-describedby="emailHelp"
          placeholder="Enter email"
        />
      </div>
      <div class="form-group">
        <label for="exampleInputPassword1">Password</label>
        <input
          type="password"
          class="form-control"
          id="exampleInputPassword1"
          placeholder="Password"
        />
      </div>

      <button type="submit" class="btn btn-primary">Login</button>
    </form>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    submitForm() {
      localStorage.setItem("user-token", true);
      
      this.$router.push({ name: "Treegrid" });
    },
  },
};
</script>
<style lang="scss" scoped>
.wrapper {
  background: #f8f9fa;
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;

  form {
    padding: 70px;
    border: 1px solid #ccc;
    background: white;

    button {
      display: block;
      margin: 0 auto;
    }
  }
}
</style>
