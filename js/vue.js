class Vue {
    constructor(options){
        //1.通过属性保存选项的数据
        this.$options=options||{},
        this.$data=options.data||{},
        this.$el=typeof options.el ==="string" ? document.querySelector(options.el):options.el,
        //2.把data中的属性转换成getter和setter，注入到vue实例中
        this._proxyData(this.$data)

        //3.调用observer对象，监听数据的变化
        new Observer(this.$data);
        //4.编译模板,this就是vm，即Vue实例
        new Compiler(this); // 引入Compiler实例
    }

    _proxyData(data){
        Object.keys(data).forEach((key)=>{
            console.log(data,key, "=====================> cxx查看data数据")
            //这里使用箭头函数，可以不改变this的指针，这里的this指向Vue实例，因为上面是使用this._proxyData调用
            //确保第一个参数this指向Vue实例
            //Object.defineProperty() 方法会直接在一个对象上定义一个新属性，或者修改一个对象的现有属性，并返回此对象。
            //下面就是将data属性注入到vue实例中
            Object.defineProperty(this,key,{
                configurable:true,
                enumerable:true,
                set(newValue){
                    if(data[key]===newValue){
                        return
                    }else{
                        data[key]=newValue;
                    }
                },
                get(){
                    return data[key];
                }
            })
        })
    }
}
