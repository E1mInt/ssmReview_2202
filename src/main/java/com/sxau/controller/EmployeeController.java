package com.sxau.controller;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.sxau.bean.Employee;
import com.sxau.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Controller
public class EmployeeController {

    @Autowired
    EmployeeService employeeService;

    @RequestMapping("/emps")
    public String getEmps(@RequestParam(value = "pn", defaultValue = "1") Integer pn, Model model){
        //引入Pagehelper分页插件，传入页码，每页大小
        PageHelper.startPage(pn,5);
        //startpage之后的查询即为分页查询
        List<Employee> employeeList=employeeService.getAll();
        //pageInfo封装了详细的分页信息和查询数据，传入导航页数，并将其交给页面
        PageInfo pageInfo =new PageInfo(employeeList,5);
        model.addAttribute("pageinfo",pageInfo);
        return "list";
    }
}
