<template>
  <div class="wrapper">
    <form>
      <div class="form-group">
        <label for="exampleInputEmail1">Email address</label>
        <input
          required
          v-model="email"
          type="email"
          class="form-control"
          id="exampleInputEmail1"
          aria-describedby="emailHelp"
          placeholder="Enter email"
        />
      </div>
      <div class="form-group">
        <label for="exampleInputEmail1">Username</label>
        <input
          required
          v-model="username"
          type="text"
          class="form-control"
          id="exampleInputEmail1"
          aria-describedby="emailHelp"
          placeholder="Enter Username"
        />
      </div>
      <div class="form-group">
        <label for="exampleInputPassword1">Password</label>
        <input
          required
          v-model="password"
          type="password"
          class="form-control"
          id="exampleInputPassword1"
          placeholder="Password"
        />
      </div>

      <div class="form-group">
        <label for="confirmPassword">Confirm Password</label>
        <input
          type="password"
          required
          v-model="confirmPassword"
          class="form-control"
          id="exampleInputPassword1"
          placeholder="Password"
        />
      </div>
      <p
        :class="[notify.type ? 'text-success' : 'text-danger']"
        class="lead "
        v-if="notify.msg"
      >
        {{ notify.msg }}
      </p>

      <a @click="registerForm" type="submit" class="btn btn-primary">
        Register
      </a>
    </form>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "Register",
  data() {
    return {
      email: "",
      notify: {
        msg: "",
      },
      password: "",
      username: "",
      confirmPassword: "",
    };
  },
  methods: {
    ...mapActions(["register"]),
    async registerForm() {
      if (this.password !== this.confirmPassword) {
        this.notify.msg = "Password and Confirm Pasword not match";
        this.notify.type = false;
        return;
      }

      let data = {
        email: this.email,
        userName: this.username,
        password: this.password,
      };

      const { message, registerSuccess } = await this.register({
        data: data,
        router: this.$router,
      });

      this.notify.msg = message;
      this.notify.type = registerSuccess;
    },
  },
};
</script>
