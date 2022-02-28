package com.sxau.bean;

public class Employee {
    private Integer empId;

    private String empName;

    private String genger;

    private String email;

    private Integer dId;

    //查询员工时部门信息也查询好
    private Department department;

    public Employee() {
    }

    public Employee(Integer empId, String empName, String genger, String email, Integer dId) {
        this.empId = empId;
        this.empName = empName;
        this.genger = genger;
        this.email = email;
        this.dId = dId;
    }

    public Department getDepartment() {
        return department;
    }

    public void setDepartment(Department department) {
        this.department = department;
    }

    public Integer getEmpId() {
        return empId;
    }

    public void setEmpId(Integer empId) {
        this.empId = empId;
    }

    public String getEmpName() {
        return empName;
    }

    public void setEmpName(String empName) {
        this.empName = empName == null ? null : empName.trim();
    }

    public String getGenger() {
        return genger;
    }

    public void setGenger(String genger) {
        this.genger = genger == null ? null : genger.trim();
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email == null ? null : email.trim();
    }

    public Integer getdId() {
        return dId;
    }

    public void setdId(Integer dId) {
        this.dId = dId;
    }
}