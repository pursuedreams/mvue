class Compiler{
    //vm即是vue实例
    constructor(vm){
        this.el=vm.$el;
        this.vm=vm;
        this.compiler(this.el)
    }

    //编译模板，处理文本节点和元素节点
    compiler(el){
        // console.log(el, "====================> cxx 读取compiler", el.childNodes)
        let childNodes=el.childNodes;
        // console.log(childNodes, "====================> cxx 读取 childNodes")
        Array.from(childNodes).forEach((node)=>{
            if(this.isTextNode(node)){
                //如果是文本节点则编译文本
                this.compilerText(node);
            }else if(this.isElementNode(node)){
                //如果是元素节点，则编译元素
                this.compilerElement(node);
            }

            //还需判断node还有没有子节点，元素节点内的文本节点也是相当于子节点
            if(node.childNodes&&node.childNodes.length){
                //递归处理子节点
                this.compiler(node);
            }
        })
    }


    //编译元素节点。处理指令
    compilerElement(node){
        //通过node的attributes可以获取元素内的属性
        //遍历节点的所有属性，判断是否是指令
        Array.from(node.attributes).forEach((attr)=>{
            console.log(node.attributes, "====================> cxx 读取 node.attributes", attr, attr.name)
            //获取属性名
            let attrName=attr.name;
            if(this.isDirective(attrName)){
                //对v-model和v-text分别进行处理
                //从下标为2处，开始截取字符串，attrName为model或text
                attrName=attrName.substr(2);
                //获取指令绑定的属性名
                let key=attr.value;
                //将updateFunc指向textUpdater或modelUpdater函数
                //使用了这种方法就不用if进行判断是调用哪个处理函数了
                let updateFunc=this[attrName+'Updater'];
                console.log(updateFunc, "=======================>updateFunc" )
                //之所以用“&&”，是因为我们这里只处理了v-text、v-model指令
                //如果出现其它指令，那么updateFunc则为undefined,那么再执行updateFunc()就会出错，应该排除这种情况
                //调用textUpdater或modelUpdater函数
                updateFunc&&updateFunc.bind(this,node,this.vm[key],key)();
            }
        })
    }


    //处理v-text指令
    textUpdater(node,value,key){
        node.textContent=value;
         //创建watcher对象，当数据改变时更新视图
        new Watcher(this.vm,key,(newValue)=>{
            node.textContent=newValue;
        })
    }

    //处理v-model指令
    modelUpdater(node,value,key){
        node.value=value;
        //创建watcher对象，当数据改变时更新视图
        new Watcher(this.vm,key,(newValue)=>{
            node.value=newValue;
        })

        //实现视图变化，数据也变化
        node.addEventListener("input",()=>{
            //从节点node中获取输入值，赋值给数据
            this.vm[key]=node.value;
        })
    }
    
    //编译文本节点，处理差值表达式
    compilerText(node){
        //正则表达式匹配双花括号
        let reg=/\{\{(.+?)\}\}/;
        let value=node.textContent;
        if(reg.test(value)){
            //获取正则表达式里面的内容,即data属性
            let key=RegExp.$1.trim();
            //将属性对应的值插入DOM中
            node.textContent=value.replace(reg,this.vm[key]);
            //创建watcher对象，当数据改变时更新视图
            new Watcher(this.vm,key,(newValue)=>{
                node.textContent=newValue;
            })
        }
    }

    //判断元素属性是否是指令
    isDirective(attrName){
        //如果是v-开头则是指令，返回true
        return attrName.startsWith("v-");
    }

    //判断节点是否是文本节点
    isTextNode(node){
        //根据节点的nodeType来判断是什么节点
        //nodeType=3则是文本节点
        return node.nodeType===3;
    }

    //判断节点是否是元素节点
    isElementNode(node){
        //nodeType=1则是元素节点
        return node.nodeType===1;
    }
}
