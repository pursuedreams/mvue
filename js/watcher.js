class Watcher{
    constructor(vm,key,cb){
        this.vm=vm;
        this.key=key;
        this.cb=cb;

        //下面三行代码实现了将watcher添加到了this.subs中
        //把watcher对象记录到Dep类的静态属性target属性
        //当触发observer.js中的get()时，get()会调用addSub(Dep.target)
        Dep.target=this;
        //下面的vm[key]就触发了get()，这时watcher就被加入了this.subs中
        this.oldValue=vm[key];
        //当上面的vm[key]触发get()后，为了不重复添加设置为null
        //因为此时为null，“&&”就不会再执行addSub()
        Dep.target=null;
    }

    //当数据发生变化时，更新视图
    update(){
        let newValue=this.vm[this.key];
        if(this.oldValue===newValue){
            return;
        }
        //如果不相同，调用回调函数
        this.cb(newValue);
    }
}