
<template>
  <div id="app">
        <ejs-treegrid :allowSelection="true"  :allowRowDragAndDrop='true' :dataSource="data" :treeColumnIndex="1" height='100%' idMapping= 'TaskID' parentIdMapping='parentID' ref="treegrid" :editSettings="editSettings" :toolbar="toolbar">
        <e-columns>
          <e-column field="TaskID" headerText="Id" :isPrimaryKey='true' width="70" textAlign="Right"></e-column>
          <e-column field="LHS" headerText="LHS" width="100" ></e-column>
          <e-column field="description" headerText="Description" width="200" ></e-column>
          <e-column field="qty" headerText="QTY" width="90"  textAlign="center" ></e-column>
          <e-column field="total" headerText="Total" width="90"  textAlign="center" ></e-column>
          <e-column field="unit" headerText="Unit" width="90" textAlign="center"></e-column>
          <e-column field="netWt" headerText="Net Wt(g)" width="90" textAlign="center"></e-column>
          <e-column field="pricePer" headerText="Price per " width="90" textAlign="center"></e-column>
          <e-column field="source" headerText="Source" width="90" textAlign="center"></e-column>
        </e-columns>
       </ejs-treegrid>
  </div>
</template>
<script>

import {  Page, Toolbar, Edit , RowDD } from "@syncfusion/ej2-vue-treegrid";
import { projectData } from "./datasource/datasource";

import { DropDownList } from "@syncfusion/ej2-dropdowns";
import { Query } from '@syncfusion/ej2-data';

let priorityData = [
      { priorityName: 'Normal', priorityId: '1' },
      { priorityName: 'High', priorityId: '2' },
  ];

let durationData = [
    { durationValue: 2, priorityId: '1', durationId: 2 },
    { durationValue: 3, priorityId: '1', durationId: 3 },
    { durationValue: 4, priorityId: '1', durationId: 4 },
    { durationValue: 11, priorityId: '2', durationId: 11 },
    { durationValue: 15, priorityId: '2', durationId: 15 },
    { durationValue: 20, priorityId: '2', durationId: 20 }
  ];
let priorityElem, durationElem, priorityObj, durationObj;

export default {
  data() {
    return {
      data: projectData,
      editSettings: { allowAdding:true, allowDeleting:true, allowEditing: true, mode: 'Row' },
      toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
      priorityParams: {
        create: () => {
          priorityElem = document.createElement("input");
          return priorityElem;
        },
        read: () => {
          return priorityObj.text;
        },
        destroy: () => {
          priorityObj.destroy();
        },
        write: () => {
          priorityObj = new DropDownList({
            dataSource: priorityData,
            fields: { value: "priorityId", text: "priorityName" },
            floatLabelType: "Never",
            placeholder: "Select a Priority",
            change: () => {
              durationObj.enabled = true;
              let tempQuery = new Query().where(
                "priorityId",
                "equal",
                priorityObj.value
              );
              durationObj.query = tempQuery;
              durationObj.text = null;
              durationObj.dataBind();
            }
          });
          priorityObj.appendTo(priorityElem);
        }
      },
      durationParams: {
        create: () => {
          durationElem = document.createElement("input");
          return durationElem;
        },
        destroy: () => {
          durationObj.destroy();
        },
        read: () => {
          return durationObj.text;
        },
        write: () => {
          durationObj = new DropDownList({
            dataSource: durationData,
            enabled: false,
            fields: { value: "durationId", text: "durationValue" },
            floatLabelType: "Never",
            placeholder: "Select a duration"
          });
          durationObj.appendTo(durationElem);
        }
      },
    };
  },
  provide: {
    treegrid: [Page, Edit, Toolbar , RowDD]
  }
}
</script>



