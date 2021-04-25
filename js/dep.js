class Dep{
    constructor(){
        //记录所有订阅者
        this.subs=[];
    }
    addSub(sub){
        //sub必须有update才是合格的订阅者
        if(sub&&sub.update){
            this.subs.push(sub);
        }
    }
    notify(){
        //通知，即执行每个sub的update()
        this.subs.forEach(sub=>{
            sub.update();
        })
    }
  }