<template>
  <div class="wrapper-treegrid">
    <h1 v-if="loading">Loading</h1>

    <template v-else>
      <button
        :class="{ blockObjectState: !blockObjectState }"
        class="btn btn-danger mt-3 mb-3"
      >
        Block
      </button>

      <ejs-treegrid
        :dataSource="allDataSource"
        :treeColumnIndex="1"
        ref="treegrid"
        :allowSelection="true"
        parentIdMapping="parentID"
        :queryCellInfo="queryCellInfo"
        :rowDrop="rowDrop"
        :allowRowDragAndDrop="true"
        idMapping="id"
        :actionComplete="actionComplete"
        :dataStateChange="dataStateChange"
        :dataSourceChanged="dataSourceChanged"
   
        :editSettings="editSettings"
        :toolbar="toolbar"
      >
        <e-columns>
          <e-column
            field="id"
            v-model="test"
            headerText="Id"
            :isPrimaryKey="true"
            width="70"
            textAlign="Right"
          ></e-column>
          <e-column field="lhs" headerText="LHS" width="100"></e-column>
          <e-column
            field="description"
            headerText="Description"
            width="200"
          ></e-column>
          <e-column
            field="qty"
            headerText="QTY"
            width="90"
            textAlign="center"
          ></e-column>
          <e-column
            field="total"
            headerText="Total"
            width="90"
            textAlign="center"
          ></e-column>
          <e-column
            field="unit"
            headerText="Unit"
            width="90"
            textAlign="center"
          ></e-column>
          <e-column
            field="netwt"
            headerText="Net Wt(g)"
            width="90"
            textAlign="center"
          ></e-column>
          <e-column
            field="pricePer"
            headerText="Price per "
            width="90"
            textAlign="center"
          ></e-column>
          <e-column
            field="source"
            headerText="Source"
            width="90"
            textAlign="center"
          ></e-column>
        </e-columns>
      </ejs-treegrid>
    </template>
  </div>
</template>

<script>
import {
  Page,
  Sort,
  Edit,
  Toolbar,
  RowDD,
  Selection,
} from "@syncfusion/ej2-vue-treegrid";

import SockJS from "sockjs-client";
import Stomp from "stomp-websocket";
import Vue from "vue";

var cellTemplateVue = Vue.component("cellTemplate", {
  template: `<div class="templatewrap"><div v-if="data.type==='workCells'"><div v-html=getWorkCellText(data.date)></div></div><div v-else-if="data.type==='monthCells'"><div v-html=getMonthCellText(data.date)></div></div></div>`,
  data() {
    return {
      data: {},
    };
  },
  methods: {
    getWorkCellText: function(date) {
      let weekEnds = [0, 6];
      if (weekEnds.indexOf(date.getDay()) >= 0) {
        return "<img src='https://ej2.syncfusion.com/demos/src/schedule/images/newyear.svg' />";
      }
      return "";
    },
    getMonthCellText: function(date) {
      if (date.getMonth() === 10 && date.getDate() === 23) {
        return '<img src= "https://ej2.syncfusion.com/demos/src/schedule/images/birthday.svg"/>';
      } else if (date.getMonth() === 11 && date.getDate() === 9) {
        return '<img src= "https://ej2.syncfusion.com/demos/src/schedule/images/get-together.svg" />';
      } else if (date.getMonth() === 11 && date.getDate() === 13) {
        return '<img src= "https://ej2.syncfusion.com/demos/src/schedule/images/birthday.svg" />';
      } else if (date.getMonth() === 11 && date.getDate() === 22) {
        return '<img src= "https://ej2.syncfusion.com/demos/src/schedule/images/thanksgiving-day.svg" />';
      } else if (date.getMonth() === 11 && date.getDate() === 24) {
        return '<img src="https://ej2.syncfusion.com/demos/src/schedule/images/christmas-eve.svg" />';
      } else if (date.getMonth() === 11 && date.getDate() === 25) {
        return '<img src= "https://ej2.syncfusion.com/demos/src/schedule/images/christmas.svg" />';
      } else if (date.getMonth() === 0 && date.getDate() === 1) {
        return '<img src= "https://ej2.syncfusion.com/demos/src/schedule/images/newyear.svg" />';
      } else if (date.getMonth() === 0 && date.getDate() === 14) {
        return '<img src= "https://ej2.syncfusion.com/demos/src/schedule/images/birthday.svg" />';
      }
      return "";
    },
  },
});
export default {
  name: "Treegrid",
  data() {
    return {
      cellTemplate: function() {
        return {
          template: cellTemplateVue,
        };
      },
      // editTemplate: () => {
      //   return {
      //     template: Vue.component("inputTemp", {
      //       template: `<div class="e-input-group e-control-wrapper">
      //       <input class="e-field e-input e-defaultcell"  type="text" />
      //       <span class="e-input-group-icon e-icons e-search" v-on:click="searchClick"></span>
      //              </div>`,
      //       data: function() {
      //         return {
      //           data: {},
      //         };
      //       },
      //       methods: {
      //         searchClick: (args) => {
      //           console.log("args", args);
      //           // Icon span tag click event
      //           // Here you can perform your required actions
      //         },
      //       },
      //     }),
      //   };
      // },
      columns: [
        "description",
        "id",
        "lhs",
        "netwt",
        "parentID",
        "pricePer",
        "qty",
        "source",
        "total",
        "unit",
      ],
      test: "",
      editSettings: {
        allowEditing: true,
        allowAdding: true,
        allowDeleting: true,
        mode: "Normal",
      },
      toolbar: ["Add", "Edit", "Delete", "Update", "Cancel"],
      orderID: 0,
      blockCell: {},
      shipCountry: "",
      isDragged: false,
      customerID: "",
      dropObj: {},
      stompClient: null,
      socket: null,
      timeOut: false,
      gridData: {
        result: [],
        loading: true,
        count: 0,
      },
      allOrders: [],
      loading: true,
    };
  },

  mounted() {
    this.dataStateChange();
    setTimeout(() => {
      this.hideSpinnerMethod();
    }, 1000);
  },
  created() {
    this.loading = true;
    this.socket = new SockJS("http://localhost:8090/productInfo-websocket");
    this.stompClient = Stomp.over(this.socket);
    this.stompClient.connect({}, (frame) => {
      const { command } = frame;
      if (command === "CONNECTED") {
        this.stompClient.send("/data/all", {});
        this.stompClient.subscribe("/table/save", (data) => {
          let socketData = JSON.parse(data.body);

          let findIndex = this.gridData.result.findIndex(
            (res) => res.id === socketData.id
          );
          if (findIndex === -1) {
            this.gridData.result.push(socketData);
            this.gridData.count++;
            this.gridData = { ...this.gridData };
          } else {
            this.gridData.result[findIndex] = socketData;
            this.gridData = { ...this.gridData };
          }
        });
        this.stompClient.subscribe("/table/delete", (data) => {
          const { id } = JSON.parse(data.body);
          let index = this.gridData.result.findIndex((e) => e.id === id);

          if (index > -1) {
            this.gridData.result.splice(index, 1);
            this.gridData.count--;
          }

          this.gridData = { ...this.gridData };
          this.gridData.loading = false;
        });

        this.stompClient.subscribe("/table/all", (data) => {
          let socketData = JSON.parse(data.body);
          this.gridData.result = socketData;

          this.gridData.count = socketData.length;
          this.gridData.loading = false;

          this.loading = false;
        });
      }
    });
    // setTimeout(() => this.$refs.treegrid.showSpinner(), 0);
  },
  computed: {
    blockObjectState() {
      return Object.keys(this.blockCell).length;
    },
    allDataSource() {
      return this.gridData;
    },
  },
  methods: {
    hideSpinnerMethod() {
      let spinner = document.querySelector(".e-spinner-pane");
      if (spinner !== null) {
        document.querySelector(".e-spinner-pane").remove();
        this.$refs.treegrid.hideSpinner();
      }
    },
    // actionBegin(args) {
    //   console.log("args", args);
    //   console.log("fsafasfsa");
    // },
    updateCellFromDrag(isDragged) {
      if (isDragged) {
        this.isDragged = false;
        this.$refs.treegrid.ej2Instances.updateCell(
          this.dropObj.fromIndex,
          "order",
          this.dropObj.fromIndex + 1
        );
        this.$refs.treegrid.ej2Instances.updateCell(
          this.dropObj.dropIndex,
          "order",
          this.dropObj.dropIndex + 1
        );
      }
    },
    actionComplete(args) {
      const { requestType } = args;
      this.updateCellFromDrag(this.isDragged);
      if (requestType === "beginEdit") {
        this.blockCell = { name: "asfsa" };
      } else {
        this.blockCell = {};
      }
    },
    queryCellInfo(args) {
      let data = args.data;
      if (args.column.field === "total" && data.id === 1) {
        let i = document.createElement("i");
        i.classList.add("fa", "fa-lock");
        args.cell.style.pointerEvents = "none";
        args.cell.style.background = "rgba(236, 240, 241, 0.5)";
        args.cell.appendChild(i);
      }
    },
    rowDrop(event) {
      this.isDragged = true;
      const { data, fromIndex, dropIndex } = event;
      this.dropObj = { ...event };

      if (fromIndex !== dropIndex) {
        let findDropIndex = this.gridData.result[dropIndex];
        let dropParent = this.gridData.result[dropIndex];
        if (!findDropIndex || !dropParent) {
          return;
        }

        if (data[0].id === dropParent.parentID) {
          this.hideSpinnerMethod();
          return;
        }
        if (data[0].id === findDropIndex.id) {
          this.hideSpinnerMethod();
          return;
        }

        data[0].parentID = findDropIndex.id;

        this.stompClient.send("/data/save", {}, JSON.stringify(data[0]));
      }
    },

    sendData(state) {
      const { ...alldata } = state.data;
      let objData = {};
      for (let colomns of this.columns) {
        objData[colomns] = alldata[colomns];
      }
      if (!objData.parentID) {
        objData.parentID = null;
      }

      return objData;
    },
    dataStateChange: function() {
      // this.stompClient.send("/data/all");
    },

    dataSourceChanged: function(state) {
      if (state.action === "add") {
        let dataToSend = this.sendData(state);
        this.stompClient.send("/data/save", {}, JSON.stringify(dataToSend));
        state.endEdit();
      } else if (state.action === "edit") {
        let dataToSend = this.sendData(state);
        this.stompClient.send("/data/save", {}, JSON.stringify(dataToSend));
        state.endEdit();
      } else if (state.requestType === "delete") {
        const { id } = state.data[0];
        let objToSend = {
          id: id,
        };
        this.stompClient.send("/data/delete", {}, JSON.stringify(objToSend));
        state.endEdit();
      }
    },
  },
  provide: {
    treegrid: [Sort, Page, Edit, Toolbar, RowDD, Selection],
  },
};
</script>
<style scoped>
.row-disabled {
  background-color: rgba(236, 240, 241, 0.5) !important;
  pointer-events: none !important;
  width: 100% !important;
}
.blockObjectState {
  visibility: hidden;
}
.e-spin-show {
  display: none;
}
.wrapper-treegrid {
  width: 100%;
  height: 100%;
  padding: 15px;
}
</style>
