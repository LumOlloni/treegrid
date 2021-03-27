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

      <a @click="register" type="submit" class="btn btn-primary">
        Register
      </a>
    </form>
  </div>
</template>

<script>
export default {
  name: "Register",
  data() {
    return {
      email: "",
      password: "",
      username: "",
      confirmPassword: "",
    };
  },
  methods: {
    register() {
      console.log("register");
    },
  },
};
</script>
