<template>
  <div class="row" :class="{ blockObjectState: !blockObjectState }">
    <div class="col-md-6">
      <select
        @input="selectCellBlock"
        class="form-select"
        aria-label="Default select example"
      >
        <option :value="-1" selected>Select Cell</option>
        <option v-for="(column, index) in columns" :key="index" :value="column">
          {{ column }}</option
        >
      </select>
      <button
        @click="lockUnLockCell('lock')"
        class=" ml-3 btn btn-danger mt-3 mb-3"
      >
        Block Cell
      </button>
    </div>

    <div class="col-md-6 flex-class">
      <select
        @input="selectUnBlockCell"
        class="form-select"
        aria-label="Default select example"
      >
        <option :value="-1" selected>Select Cell</option>
        <option v-for="(column, index) in columns" :key="index" :value="column">
          {{ column }}</option
        >
      </select>
      <button
        @click="lockUnLockCell('unlock')"
        class=" ml-3 btn btn-success mt-3 mb-3"
      >
        UnBlock Cell
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "SelectBox",
  props: {
    lockUnLockCell: {
      type: Function,
      required: true,
    },
    blockObjectState: {
      type: Number,
      required: true,
    },
    selectUnBlockCell: {
      type: Function,
      required: true,
    },
    selectCellBlock: {
      type: Function,
      require: true,
    },
    columns: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style scoped>
.flex-class {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>
