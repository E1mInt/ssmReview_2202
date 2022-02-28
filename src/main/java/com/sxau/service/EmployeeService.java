package com.sxau.service;

import com.sxau.bean.Employee;
import com.sxau.dao.EmployeeMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmployeeService {
    @Autowired
    EmployeeMapper employeeMapper;

    //查询所有
    public List<Employee> getAll() {
        return employeeMapper.selectByExampleWithDept(null);
    }
}
