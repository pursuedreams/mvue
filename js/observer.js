class Observer{

    constructor(data){
        //在新建对象时，就调用this.walk
        this.walk(data);
    }

    //walk()用于遍历data中的所有属性，在这里调用defineReactive
    walk(data){
        //1.判断data是否是对象
        if(!data||typeof data !=='object'){
            return
        }
        Object.keys(data).forEach(key=>{
            this.defineReactive(data,key,data[key]);
        })
    }

    //定义响应式数据
    defineReactive(obj,key,val){
        //假如key的属性值也是对象，则再调用walk
        //这里之所以没有判断val是不是对象，是因为walk()内部会判断val是不是对象
        //如果不是对象会直接return
        this.walk(val);
        let that=this;
        //为对象的每个属性创建依赖，并发送通知
        let dep=new Dep();
        Object.defineProperty(obj,key,{
            enumerable:true,
            configurable:true,
            set(newValue){
                if(newValue===val){
                    return
                }
                val=newValue;
                //之所以使用that，是因为这里地set()是一个新的作用域，this不是指向observer实例
                that.walk(val);
                //set说明数据发生变化，通知订阅者
                dep.notify();
            },
            get(){
                //收集依赖,只有当存在target时才添加依赖
                //target存储的就是观察者对象
                //先不用管Dep.target是如何而来，它是在Watcher类中添加的
                Dep.target&&dep.addSub(Dep.target);
                return val;
            }
        })
    }
}
