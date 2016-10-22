# Chocolate Table

Initializing Chocolate Table

datagrid = new dataGrid("table_id", gridData);
datagrid.setting.showSelectCloumn = true;
datagrid.setting.showEntryList = [10, 20, 40, 100, 200];
datagrid.setting.order = [1, "asc"];
datagrid.setting.confirmDelete = true;
datagrid.setting.toolbar = {
    "add": true,
    "delete": true,
    "edit": true,
    "showcolumn": true,
    "bulkupload": false,
    "download": false
}

datagrid.setting.formConfig = {
    "form": {
        "name": "form_add_employee",
        "class": "",
        "onsubmit": "return false"
    },

    "emp_id": {
        "type": "text",
        "label": "Employee ID",
        "id": "id_txt_empId"
    },
    "emp_name": {
        "type": "text",
        "label": "Employee Name",
        "id": "id_txt_empName"
    },
    "emp_type": {
        "type": "text",
        "label": "Employee Type",
        "id": "id_txt_empType"
    },
    "emp_salary": {
        "type": "text",
        "label": "Employee Salary",
        "id": "id_txt_empSalary"
    },
    "emp_skills": {
        "type": "textarea",
        "label": "Employee Skills",
        "id": "id_txt_empSkills"
    },
    "gender": {
        "type": "radio",
        "elem": [{
            "type": "radio",
            "label": "male",
            "id": "id_gender_male"
        }, {
            "type": "radio",
            "label": "female",
            "id": "id_gender_female"
        }]
    },
    "save": {
        "type": "submit",
        "class": "btn btn-primary "
    }
}

datagrid.setting.configColumns = [{
    label: "Employee ID",
    mData: "id",
    sWidth: "20%",
    visible: true
}, {
    label: "Employee Name",
    mData: "emp_name",
    sWidth: "25%",
    visible: true
}, {
    label: "Employee Type",
    mData: "emp_type",
    sWidth: "15%",
    visible: true
}, {
    label: "Employee Salary",
    mData: "emp_salary",
    sWidth: "15%",
    visible: false
}, {
    label: "Employee Skilss",
    mData: "emp_skills",
    sWidth: "25%",
    visible: true
}];
datagrid.init();
