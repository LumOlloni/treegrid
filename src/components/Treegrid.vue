<template>
  <div>
    <h4 v-if="loading">Loading...</h4>
    <ejs-treegrid
      v-else
      :dataSource="gridData"
      :treeColumnIndex="0"
      :hasChildMapping="true"
      :event="drag"
      parentIdMapping="parentID"
      :allowRowDragAndDrop="true"
      idMapping="id"
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
import axios from "axios";

import {
  Page,
  Sort,
  Edit,
  Toolbar,
  RowDD,
  Selection,
} from "@syncfusion/ej2-vue-treegrid";

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
      gridData: {},
      allOrders: [],
      loading: true,
    };
  },
  mounted() {
    // setInterval(() => {
    this.dataStateChange();
    // }, 1000);
  },

  methods: {
    drag(e) {
      console.log("eee", e);
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
      axios.get("http://localhost:8090/products/all").then((res) => {
        this.gridData = {
          result: res.data,
          count: res.data.length,
        };
        this.loading = false;
      });
    },

    dataSourceChanged: function(state) {
      if (state.action === "add") {
        let dataToSend = this.sendData(state);
        this.loading = true;
        axios
          .post("http://localhost:8090/products/save", dataToSend)
          .then(() => {
            this.loading = false;
            state.endEdit();
          });
      } else if (state.action === "edit") {
        let dataToSend = this.sendData(state);
        this.loading = true;
        axios
          .post("http://localhost:8090/products/save", dataToSend)
          .then(() => {
            state.endEdit();
            this.loading = false;
          });
      } else if (state.requestType === "delete") {
        const { id } = state.data[0];
        this.loading = true;
        axios
          .post(
            "http://localhost:8090/products/delete",
            {},
            {
              params: {
                TaskID: id,
              },
            }
          )
          .then(() => {
            this.loading = false;
            state.endEdit();
          });
      }
    },
  },
  provide: {
    treegrid: [Sort, Page, Edit, Toolbar, RowDD, Selection],
  },
};
</script>
