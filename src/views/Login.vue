<template>
  <div class="wrapper">
    <form>
      <div class="form-group">
        <label for="exampleInputEmail1">Username</label>
        <input
          type="text"
          v-model="username"
          required
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
          required
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
import { mapActions } from "vuex";
export default {
  name: "Login",
  data() {
    return {
      username: "",
      password: "",
    };
  },
  methods: {
    ...mapActions(["login"]),
    submitForm() {
      let data = {
        username: this.username,
        password: this.password,
      };
      this.login({ data, router: this.$router });
    },
    goToRegister() {
      this.$router.push({ path: "/register" });
    },
  },
};
</script>
