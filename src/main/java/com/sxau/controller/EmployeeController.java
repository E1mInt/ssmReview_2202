package com.sxau.controller;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.sxau.bean.Employee;
import com.sxau.bean.Msg;
import com.sxau.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
public class EmployeeController {

    @Autowired
    EmployeeService employeeService;

    @ResponseBody
    @RequestMapping("/emps")
    public Msg getEmpsWithJson(@RequestParam(value = "pn", defaultValue = "1") Integer pn){
        //引入Pagehelper分页插件，传入页码，每页大小
        PageHelper.startPage(pn,5);
        //startpage之后的查询即为分页查询
        List<Employee> employeeList=employeeService.getAll();
        //pageInfo封装了详细的分页信息和查询数据，传入导航页数，并将其交给页面
        return Msg.success().add("pageInfo", new PageInfo(employeeList,5));
    }

    @ResponseBody
    @RequestMapping(value = "/emp",method = RequestMethod.POST)
    public Msg saveEmp(@Valid Employee employee, BindingResult result){
        if(result.hasErrors()){
            Map<String, Object> map = new HashMap<>();
            List<FieldError> fieldErrors = result.getFieldErrors();
            for (FieldError fieldError : fieldErrors) {
                System.out.println("错误的字段名："+fieldError.getField());
                System.out.println("错误信息："+fieldError.getDefaultMessage());
                map.put(fieldError.getField(),fieldError.getDefaultMessage());
            }
            return Msg.fail().add("errorFields",map);
        }
        if(!employeeService.checkUser(employee.getEmpName())){
            return Msg.userHasExist();
        }
        employeeService.saveEmp(employee);
        return Msg.success();

    }

    @ResponseBody
    @RequestMapping("/checkUser")
    public Msg checkUser(@RequestParam("empName") String empName){
        boolean boo = employeeService.checkUser(empName);
        if(boo){
            return Msg.success();
        }else {
            return Msg.fail();
        }
    }

    @ResponseBody
    @RequestMapping(value = "/emp/{id}",method = RequestMethod.GET)
    public Msg getEmp(@PathVariable("id")Integer id){
        Employee employee=employeeService.getEmp(id);
        return Msg.success().add("emp",employee);
    }

    @ResponseBody
    @RequestMapping(value = "/emp/{empId}",method = RequestMethod.PUT)
    public Msg saveEmp(Employee employee){
        System.out.println(employee);
        employeeService.updateEmp(employee);
        return Msg.success();
    }
}
