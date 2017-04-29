'use strict'

var me = {
	name : "zmz"
}
for(var s = 0;s < 10 && me.name !== 'shabi'; s++){
	if(s === 2){
		// me.name = 'shabi'
	}
	setTimeout( item => {
		console.log(item)
	},1000,s)
}