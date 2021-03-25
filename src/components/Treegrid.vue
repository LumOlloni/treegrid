<template>
  <div>
    <h1 v-if="loading">Loading</h1>
    <ejs-treegrid
      v-else
      :dataSource="allDataSource"
      :treeColumnIndex="1"
      ref="treegrid"
      :hasChildMapping="true"
      parentIdMapping="parentID"
      :queryCellInfo="queryCellInfo"
      :rowDrop="rowDrop"
      :allowRowDragAndDrop="true"
      idMapping="id"
      :actionComplete="actionComplete"
      :allowSorting="true"
      :dataStateChange="dataStateChange"
      :dataSourceChanged="dataSourceChanged"
      :editSettings="editSettings"
      :toolbar="toolbar"
    >
      <e-columns>
        <e-column
          field="id"
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
  </div>
</template>

<script>
// import axios from "axios";

import {
  Page,
  Sort,
  Edit,
  Toolbar,
  RowDD,
  Selection,
} from "@syncfusion/ej2-vue-treegrid";
// import axios from "axios";
import SockJS from "sockjs-client";
import Stomp from "stomp-websocket";

export default {
  name: "Treegrid",
  data() {
    return {
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
      editSettings: {
        allowEditing: true,
        allowAdding: true,
        allowDeleting: true,
        mode: "Normal",
      },
      toolbar: ["Add", "Edit", "Delete", "Update", "Cancel"],
      orderID: 0,
      shipCountry: "",
      customerID: "",
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
      let spinner = document.querySelector(".e-spinner-pane");
      if (spinner !== null || spinner !== undefined) {
        document.querySelector(".e-spinner-pane").remove();
        this.$refs.treegrid.hideSpinner();
      }
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
          console.log("run data");
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
          console.log(" this.gridData.result", this.gridData.result);
          this.gridData.count = socketData.length;
          this.gridData.loading = false;
          console.log(" this.gridData.count", this.gridData.count);
          this.loading = false;
        });
      }
    });
    // setTimeout(() => this.$refs.treegrid.showSpinner(), 0);
  },
  computed: {
    allDataSource() {
      return this.gridData;
    },
  },
  methods: {
  
    actionBegin(args) {
      // this.stompClient.send("/data/all", {});
      console.log("args", args.rowData);
      console.log("fsafasfsa");
    },
    actionComplete(args) {
      // this.stompClient.send("/data/all", {});
      console.log("state", args);
    },
    queryCellInfo(args) {
      let data = args.data;
      if (args.column.field === "total" && data.id === 63) {
        let i = document.createElement("i");
        i.classList.add("fa", "fa-lock");
        args.cell.style.pointerEvents = "none";
        args.cell.style.background = "rgba(236, 240, 241, 0.5)";
        args.cell.appendChild(i);
      }
    },
    rowDrop(event) {
      const { data, fromIndex, dropIndex } = event;
      if (fromIndex !== dropIndex) {
        let findDropIndex = this.gridData.result[dropIndex].id;
        let findDropParent = this.gridData.result[dropIndex].id;
        if (data[0].id === findDropParent) {
          return;
        }
        data[0].parentID = findDropIndex;

        this.stompClient.send("/data/save", {}, JSON.stringify(data[0]));
        // this.dataStateChange();
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
.e-spin-show {
  display: none;
}
</style>
