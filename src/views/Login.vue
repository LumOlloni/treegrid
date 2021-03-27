<template>
  <div class="wrapper">
    <form>
      <div class="form-group">
        <label for="exampleInputEmail1">Email address</label>
        <input
          type="email"
          v-model="email"
          class="form-control"
          id="exampleInputEmail1"
          aria-describedby="emailHelp"
          placeholder="Enter email"
        />
      </div>
      <div class="form-group">
        <label for="exampleInputPassword1">Password</label>
        <input
          v-model="password"
          type="password"
          class="form-control"
          id="exampleInputPassword1"
          placeholder="Password"
        />
      </div>

      <a @click="submitForm" type="submit" class="btn btn-primary">
        Login
      </a>
      <router-link
        :to="{ name: 'Register' }"
        @click="$router.push({ name: 'Register' })"
        type="submit"
        class="btn btn-primary mt-4 mx-auto"
      >
        Register
      </router-link>
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
    goToRegister() {
      console.log("register");
      this.$router.push({ path: "/register" });
    },
  },
};
</script>
