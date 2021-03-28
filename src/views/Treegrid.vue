<template>
  <div class="wrapper-treegrid">
    <h1 v-if="loading">Loading</h1>
    <!--   -->
    <template v-else>
      <SelectBox
        :selectUnBlockCell="selectUnBlockCell"
        :selectCellBlock="selectCellBlock"
        :blockObjectState="blockObjectState"
        :lockUnLockCell="lockUnLockCell"
        :columns="columns"
      />

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
import { groupLock } from "@/helpers/GroupLocks";

import SockJS from "sockjs-client";
import Stomp from "stomp-websocket";
import SelectBox from "@/components/SelectBox.vue";
import { mapGetters } from "vuex";

export default {
  name: "Treegrid",
  components: {
    SelectBox,
  },
  data() {
    return {
      // id , lhs , description , qty , total , unit , netwt , pricePer , source
      columns: [
        "id",
        "lhs",
        "description",
        "qty",
        "total",
        "unit",
        "netwt",
        "pricePer",
        "source",
        "unit",
        "parentID",
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
      groupCell: [],
      allUserBlockedCell: [],
      isDragged: false,
      valueOfSelect: "",
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
          this.groupCell = groupLock(socketData, this.user.userId);
          this.allUserBlockedCell = groupLock(
            socketData,
            this.user.userId,
            false
          );
          this.gridData.result = socketData;
          this.gridData.count = socketData.length;
          this.gridData.loading = false;

          this.loading = false;
        });

        this.stompClient.subscribe("/table/lock", (data) => {
          console.log("lock", JSON.parse(data));
        });

        this.stompClient.subscribe("/table/unlock", (data) => {
          // console.log("unlock", JSON.parse(data));
          console.log("unlock", data);
        });
      }
    });
  },
  computed: {
    ...mapGetters(["user"]),
    blockObjectState() {
      return Object.keys(this.blockCell).length;
    },
    allDataSource() {
      return this.gridData;
    },
  },
  methods: {
    lockUnLockCell(typeOfAction) {
      if (this.valueOfSelect === "-1" || this.valueOfSelect === "") return;

      const { id } = this.blockCell;

      let dataToSend = {
        productInfo: id,
        columnName: this.valueOfSelect,
        treeUser: this.user.userId,
      };

      if (typeOfAction === "lock") {
        this.stompClient.send("/data/lock", {}, JSON.stringify(dataToSend));
      } else if (typeOfAction === "unlock") {
        let unlockCell = this.allUserBlockedCell.find(
          (blocked) =>
            blocked.productInfo === id &&
            blocked.columName === dataToSend.columnName
        );

        if (unlockCell && unlockCell.id) {
          this.stompClient.send(
            "/data/unlock",
            {},
            JSON.stringify(Number(unlockCell.id))
          );
        }
      }

      this.blockCell = {};
    },
    selectCellBlock(e) {
      this.valueOfSelect = e.target.value;
    },
    selectUnBlockCell(e) {
      this.valueOfSelect = e.target.value;
    },

    hideSpinnerMethod() {
      let spinner = document.querySelector(".e-spinner-pane");
      if (spinner !== null) {
        document.querySelector(".e-spinner-pane").remove();
        this.$refs.treegrid.hideSpinner();
      }
    },
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
    blockCellInEdit(id) {
      let findCellToLock = this.groupCell.filter((lock) => lock.id === id);

      if (findCellToLock.length > 0) {
        let cellToBeLock = findCellToLock.map((e) => e.columName);

        for (const cell of cellToBeLock) {
          let findPosOfColum = this.columns.indexOf(cell);
          if (findPosOfColum > -1) {
            let findCell = document.querySelectorAll(
              "#_gridcontrolEditForm > table > tbody > tr > td "
            )[findPosOfColum + 1];

            findCell.style.pointerEvents = "none";
            findCell.style.background = "rgba(236, 240, 241, 0.5)";
          }
        }
      }
    },
    actionComplete(args) {
      const {
        rowData: { id },
        requestType,
      } = args;
      this.updateCellFromDrag(this.isDragged);
      if (requestType === "beginEdit") {
        this.blockCellInEdit(id);
        this.blockCell = {
          id: id,
        };
      } else {
        this.blockCell = {};
      }
    },
    queryCellInfo(args) {
      let cells = args.data;

      for (const lockCell of this.groupCell) {
        if (
          args.column.field === lockCell.columName &&
          cells.id === lockCell.productInfo
        ) {
          if (args.cell.childNodes.length > 1) return;

          let i = document.createElement("i");
          i.classList.add("fa", "fa-lock");
          args.cell.style.pointerEvents = "none";
          args.cell.style.background = "rgba(236, 240, 241, 0.5)";
          args.cell.appendChild(i);
        }
      }
    },
    rowDrop(event) {
      const { data, fromIndex, dropIndex } = event;
      this.dropObj = { ...event };

      if (fromIndex === dropIndex) return;

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

      this.isDragged = true;

      data[0].parentID = findDropIndex.id;

      this.stompClient.send("/data/save", {}, JSON.stringify(data[0]));
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
