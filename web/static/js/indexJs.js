function to_page(pn) {
    $.ajax({
        url:"/emps",
        data:"pn="+pn,
        type:"get",
        success:function (result) {
            build_emps_table(result);
            build_page_info(result);
            build_page_nav(result);
        }
    })
}

//解析显示表格信息
function build_emps_table(result) {
    $("#emps_table tbody").empty();
    var emps = result.extend.pageInfo.list;
    $.each(emps, function (index, item) {
        var empIdTd = $("<td></td>").append(item.empId);
        var empNameTd = $("<td></td>").append(item.empName);
        var genderTd = $("<td></td>").append(item.genger == 'M' ? "男" : "女");
        var emailTd = $("<td></td>").append(item.email);
        var deptNameIdTd = $("<td></td>").append(item.department.deptName);

        var editBtn = $("<button></button>").addClass("btn btn-primary btn-sm change_btn")
            .append("<span></span>").addClass("glyphicon glyphicon-pencil");
        editBtn.attr("change_id",item.empId);
        var delBtn = $("<button></button>").addClass("btn btn-danger btn-sm del_btn")
            .append("<span></span>").addClass("glyphicon glyphicon-trash");
        var btn = $("<td></td>").append(editBtn).append(" ").append(delBtn);

        $("<tr></tr>").append(empIdTd)
            .append(empNameTd)
            .append(genderTd)
            .append(emailTd)
            .append(deptNameIdTd)
            .append(btn)
            .appendTo("#emps_table tbody");

    })
}

//解析显示分页信息
function build_page_info(result) {
    $("#page_info_area").empty();
    $("#page_info_area").append("当前第"+result.extend.pageInfo.pageNum+"页，总"
        +result.extend.pageInfo.pages+"页，总"
        +result.extend.pageInfo.total+"条记录");
    pages=result.extend.pageInfo.pages+999;
    currentPages=result.extend.pageInfo.pageNum;
}

//解析显示分页条
function build_page_nav(result) {
    $("#page_nav_area").empty();
    var url = $("<ul></ul>").addClass("pagination");

    var firstPageLi = $("<li></li>").append($("<a></a>").append("首页").attr("href","#"));
    var prePageLi = $("<li></li>").append($("<a></a>").append("&laquo;"));
    var nextPageLi = $("<li></li>").append($("<a></a>").append("&raquo;"));
    var lastPageLi = $("<li></li>").append($("<a></a>").append("尾页").attr("href","#"));

    if(result.extend.pageInfo.hasPreviousPage==false){
        firstPageLi.addClass("disabled");
        prePageLi.addClass("disabled");
    }else {
        firstPageLi.click(function () {
            to_page(1);
        });
        prePageLi.click(function () {
            to_page(result.extend.pageInfo.prePage);
        });
    }

    if(result.extend.pageInfo.hasNextPage==false){
        lastPageLi.addClass("disabled");
        nextPageLi.addClass("disabled");
    }else {
        nextPageLi.click(function () {
            to_page(result.extend.pageInfo.nextPage);
        });
        lastPageLi.click(function () {
            to_page(result.extend.pageInfo.pages);
        });
    }

    url.append(firstPageLi).append(prePageLi);

    $.each(result.extend.pageInfo.navigatepageNums, function (index, item) {
        var nameLi = $("<li></li>").append($("<a></a>").append(item));
        if(result.extend.pageInfo.pageNum == item){
            nameLi.addClass("active");
        }
        url.append(nameLi);
        nameLi.click(function () {
            to_page(item);
        });
    })

    url.append(nextPageLi).append(lastPageLi);

    var navEle = $("<nav></nav>").append(url);

    navEle.appendTo("#page_nav_area");
}

function open_modal() {
    clean();
    //发生ajax请求查询部门信息
    getDepts("#empAddModal select");
    //弹出模态框
    $("#empAddModal").modal({
        backdrop:"static"
    });
}

function getDepts (ele) {
    $.ajax({
        url:"/depts",
        async: false,
        type:"get",
        success:function (result) {
            $(ele).empty();
            //显示下拉部门信息在下拉列表中
            $.each(result.extend.depts,function () {
                var optionEle = $("<option></option>").append(this.deptName).attr("value",this.deptId);
                optionEle.appendTo(ele);
            })
        }
    })
}

function saveEmp() {
    if(!validate_empName()){
        return false;
    }
    if(!validate_email($("#email_add_input"))){
        return false;
    }
    $.ajax({
        url:"/emp",
        data:$("#empAddModal form").serialize(),
        type:"post",
        success:function (result) {
            if(result.code==100){
                //关闭模态框
                $("#empAddModal").modal('hide');
                //请求显示最后一页数据
                to_page(pages);
            }else if(result.code==200){
                if(undefined !=result.extend.errorFields.empName){
                    show_validate_msg($("#empName_add_input"),"error",result.extend.errorFields.empName)
                }
                if(undefined !=result.extend.errorFields.email){
                    show_validate_msg($("#email_add_input"),"error",result.extend.errorFields.email);
                }
            }else if(result.code==300){
                show_validate_msg($("#empName_add_input"),"error",result.msg);
            }
        }
    })
}

//校验表单数据
function validate_empName() {
    var empName=$("#empName_add_input").val();
    var regName=/(^[a-zA-Z0-9_-]{6,16}$)|(^[\u2E80-\u9FFF]{2,5}$)/
    if(!regName.test(empName)){
        show_validate_msg($("#empName_add_input"),"error","用户名必须为2-5位的中文或6-12位英文数字（包括_和-）的组合")
        return false;
    }else {
        show_validate_msg($("#empName_add_input"),"success","")
    }
    $.ajax({
        url:"/checkUser",
        data:"empName="+empName,
        type:"post",
        success:function (result) {
            if(result.code==100){
                show_validate_msg($("#empName_add_input"),"success","");
            }else if(result.code==200){
                show_validate_msg($("#empName_add_input"),"error","用户名已存在");
                return false;
            }
        }
    })
    return true;
}

function validate_email(ele) {
    var email=ele.val();
    var regEmail= /^[a-z\d]+(\.[a-z\d]+)*@([\da-z](-[\da-z])?)+(\.{1,2}[a-z]+)+$/;
    if(!regEmail.test(email)){
        show_validate_msg(ele,"error","请输入正确邮箱格式");
        return false;
    }else {
        show_validate_msg(ele,"success","");
    }
    return true;
}

function show_validate_msg(ele,status,msg) {
    $(ele).parent().removeClass("has-success has-error");
    if("error"==status){
        $(ele).parent().addClass("has-error");
        $(ele).next("span").text(msg);
    }else if("success"==status){
        $(ele).parent().addClass("has-success");
        $(ele).next("span").text(msg);
    }
}
//清除表单数据
function clean() {
    $("#empAddModal form")[0].reset();
    $("#empName_add_input").parent().removeClass("has-success has-error");
    $("#empName_add_input").next("span").text("");
    $("#email_add_input").parent().removeClass("has-success has-error");
    $("#email_add_input").next("span").text("");
}
function cleanChange() {
    $("#empAddModal form")[0].reset();
    $("#email_change_input").parent().removeClass("has-success has-error");
    $("#email_change_input").next("span").text("");
}

$(document).on("click",".change_btn",function () {
    cleanChange();
    //发生ajax请求查询部门信息
    getDepts("#empChangeModal select");
    //查询员工姓名
    getEmp($(this).attr("change_id"));
    $("#emp_change_btn").attr("change_id",$(this).attr("change_id"));
    //弹出模态框
    $("#empChangeModal").modal({
        backdrop:"static"
    });
})

function getEmp(id) {
    $.ajax({
        url: "/emp/" + id,
        async: false,
        type: "get",
        success: function (result) {
            var empData = result.extend.emp;
            $("#empName_change_static").text(empData.empName);
            $("#email_change_input").val(empData.email);
            $("#empChangeModal input[name=genger]").val([empData.genger]);
            $("#empChangeModal select").val([empData.dId]);
        }
    })
}

function changeEmp() {
    if(!validate_email($("#email_change_input"))){
        return false;
    }
    $.ajax({
        url: "/emp/" + $("#emp_change_btn").attr("change_id"),
        type: "put",
        data:$("#empChangeModal form").serialize(),
        success: function (result) {
            //关闭模态框
            $("#empChangeModal").modal('hide');
            //请求显示最后一页数据
            to_page(currentPages);
        }
    })
}


