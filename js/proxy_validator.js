/**
 * [validator class:This is ]
 * @param  {[type]} order [A json object. for example: {"checkEmail":checkEmail,"checkUsername":checkUsername}
 * or {"checkUserAndMail":{checkEmail":checkEmail,"checkUsername":checkUsername},"checkPassword":checkPassword}]
 * @return {[type]}       [return itself]
 */
function validator(order){
	this.obj=order;
	this.iter=new iterator(order);
	this.next=function(){
		//Add the additional argument outer.
		arguments.outer=this;
		var func=this.iter.next();
		func.apply(func,arguments);
		return this;
	};
}

/**
 * [Json method iterator]
 * @param  {[type]} jsonObj [The target need to be init]
 * @return {[type]}         [description]
 */
function iterator(jsonObj){

	//The target
	this.target=jsonObj;

	//The key string arrray
	this.keyStringArray=[];

	//init to produce the keyStringArray
	this.init=function(target,preString){
		for(var obj in target){
			if((typeof(target[obj])).toLowerCase()=="function"){
				if(undefined!=preString&&preString!=null){
					this.keyStringArray.push(preString+","+obj);
				}
				else{
					this.keyStringArray.push(obj);
				}
			}else{
				if(preString==null){
					this.init(target[obj],obj);
				}else{
					this.init(target[obj],preString=preString+","+obj);
				}
			}
		}
	};

	//run the init method
	this.init(jsonObj);

	//get the value of a specific keyString, for example : "checkUsernameAndEmail,checkUsername"
	this.getValue=function(keyString){
		//split the keystring
		var keyArray=keyString.split(",");
		if(keyArray.length!=0){
			var result=this.target;
			for(i=0;i<keyArray.length;i++){
				result=result[keyArray[i]];
			}
			return result;
		}else{
			console.log("Target is null!");

			//return a void funciton
			return function(){};
		}
	};

	//Current index
	this.index=-1;

	//Whether has next item
	this.hasNext=function(){
		if(this.index+1<this.keyStringArray.length)
			return true;
		else 
			return false;
	};

	//Go to next
	this.next=function(){
		if(this.hasNext()){
			this.index++;
			return this.getValue(this.keyStringArray[this.index]);
		}else{
			//return a void function
			return function(){};
		}
	};
}


/**
 * [Execute proxy]
 * @param {[type]} beforefunc  []
 * @param {[type]} afterfunc   []
 * @param {[type]} errorfunc   [error handler]
 * @param {[type]} finallyfunc []
 */
function Proxy(beforefunc,afterfunc,errorfunc,finallyfunc){

	this.copy=function(func){
		this[func.name]=function(){
			if(this.before!=null){

				this.before.apply(this,arguments);

			}

			try{

				func.apply(this,arguments);

			}catch(err){

				if(this.errfunc!=null){
					this.errfunc(err);
				}

			}finally{
				if(this.finallyfunc!=null){
					this.finallyfunc.apply(this,arguments);
				}
			}

			if(this.after!=null){
				this.after.apply(this,arguments);
			}
		};
	}

	this.before=beforefunc;

	this.after=afterfunc;

	this.errfunc=errorfunc;

	this.finallyfunc=finallyfunc;

}