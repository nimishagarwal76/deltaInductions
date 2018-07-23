document.addEventListener('DOMContentLoaded', function (){
const lis=document.querySelector('#menteelist ul');
const list=document.querySelectorAll('#menteelist li');
var mentee=[];
var ed=0;
var p;
init();

// loading details from local storage
function init(){
	if(localStorage.menteesRecord)
{
	mentee=JSON.parse(localStorage.menteesRecord);
	for(var i=0;i<mentee.length;i++)
	{
      var nm=mentee[i].name;
      var rt=mentee[i].rate;
      var ct=mentee[i].comment;
      var rl=mentee[i].roll;
 	  prepare(nm,rt,ct,rl);

	}
}
}


// what should happen on pressing save button
function pressSave(e){
   var addBtn = e.target.parentElement;
   var addhide = addBtn.querySelector('.addbutton');
   var show = addBtn.querySelector('#hide');

   var forsave =e.target.parentElement.parentElement;
   var saddhide=forsave.querySelector('.addbutton');
   var sshow = forsave.querySelector('#hide');

   var nm=addBtn.querySelector('.input-n').value;
   var rt=addBtn.querySelector('.input-r').value;
   var ct=addBtn.querySelector('.input-c').value;
   var rl=addBtn.querySelector('.input-roll').value;

   // getting data entered in form and used to prepare a li element
   prepare(nm,rt,ct,rl);

   // creating an object then pushing it to mentee array and storing in localStorage  
   var stuObj={"name":nm,"rate":rt,"comment":ct,"roll":rl};
   mentee.push(stuObj);
   localStorage.menteesRecord=JSON.stringify(mentee);


   // hiding the form after clicking save button 
   sshow.style.display='none';
   saddhide.style.display='block';
   
   // making values of form empty again for next entry
   addBtn.querySelector('.input-n').value="";
   addBtn.querySelector('.input-r').value="";
   addBtn.querySelector('.input-c').value="";
   addBtn.querySelector('.input-roll').value="";
}



// to remove an element which is clicked

function remove(e)
{
// removing from page
  var li = e.target.parentElement;
  var nom =li.querySelector(".name");
  li.parentNode.removeChild(li);

// removing from local storage 
  mentee=JSON.parse(localStorage.menteesRecord);

  for (var i =0; i< mentee.length; i++) 
  {
    var items = mentee[i];
    if (items.name == nom.textContent) 
    {
        mentee.splice(i, 1);
    }
  }

localStorage.menteesRecord=JSON.stringify(mentee);		

}

// making an object with given details 
function prepare(nm,rt,ct,rl)
{

	
// creating elements;
	const cli=document.createElement('li');
	const cname=document.createElement('span');
	const cdelete=document.createElement('span');
	const cdown=document.createElement('span');
	const cedit=document.createElement('span');
	const crate=document.createElement('span');
	const ccomment=document.createElement('span');
	const cbr=document.createElement('br');
	const cbr2=document.createElement('br');
	const cp=document.createElement('span');
	const croll=document.createElement('span');


// backgroundColor of li elements
var r,g,o = 0;
    if(rt == 10)
    {
    	g=255;
    	r=0;
    	o=1
    }
	else if(rt >= 5 && rt<10)
	{
		g = 255;
		r = 0;
		o = 0.2 * (rt % 5);
	}
	else if(rt < 5)
	{
		g = 0;
		r = 255;
		o = 1 - 0.2 * (rt % 5);
	}
	else if(rt>10)
	{
		g=255;
		r=0;
		o=1
	}
	

    cli.style.background= "rgba(" +[r,g,0,o].join(',')+")";;




 // addind child to elements
	cli.appendChild(cname);
	cli.appendChild(cdelete);
	cli.appendChild(cedit);
	cli.appendChild(cdown);
	cli.appendChild(cbr);
	cli.appendChild(cp);
	cli.appendChild(crate);
	cli.appendChild(cbr2);
	cli.appendChild(croll);
	cli.appendChild(ccomment);
	
	lis.appendChild(cli);  

// adding text content to elements
	cname.textContent=nm;
	cdelete.textContent="DELETE";
	cedit.textContent="EDIT";
	crate.textContent=rt;
	ccomment.textContent=ct;
	croll.textContent=rl;
	cdown.textContent="▼"
	cp.textContent="RATING: "

// adding classes to elements
	cname.classList.add('name');
	cdelete.classList.add('delete');
	cedit.classList.add('edit');
	crate.classList.add('rating');
	ccomment.classList.add('collapse');
	cdown.classList.add('down');
	cp.classList.add('para');
	croll.classList.add('rollno')


}

// sorts array by rate value
function sortArray()
{
  mentee=JSON.parse(localStorage.menteesRecord);
  mentee.sort(function compare(c,d)
{
	if ((c.rate-1)>(d.rate-1)) 
	{
		return -1;
	}
	else if((c.rate-1)<(d.rate-1))
		{
			return 1;
		}
	else{
		return 0;
	}

});

//storing new sorted array and then printing
localStorage.menteesRecord=JSON.stringify(mentee);
for(var i=0;i<mentee.length;++i)
  {
  var temp=mentee[i];
  prepare(temp.name,temp.rate,temp.comment,temp.roll);
  }

}

// adding eventlistner to sort button

var sortbtn=document.querySelector('#sort');

sortbtn.addEventListener('click',function(e){
  e.preventDefault();
  lis.innerHTML="";
  sortArray();

})


// adding event listner to delete,edit and down buttons 
lis.addEventListener('click',function(e){
	if(e.target.className=='delete')
	{
		remove(e);
    }


	else if(e.target.className=='down')
	{
		const sel=e.target.parentElement;
		var lists=document.querySelectorAll('.collapse');
		var comp=sel.querySelector('.collapse');

		if(comp.style.display == 'block')
    	{
      		comp.style.display = 'none';
    	}
    	else
    	{
      		Array.from(lists).forEach(function(l){
            l.style.display="none";
		})

    	comp.style.display = 'block';
    }
	}
    
    else if(e.target.className=='edit')
    {
    	
		var foredit =e.target.parentElement;
 		var saddhide=document.querySelector('.addbutton');
   		var sshow = document.querySelector('#hide');
   		saddhide.style.display='none';
		sshow.style.display='block';
        window.scrollTo(0,document.body.scrollHeight);

		var nm=foredit.querySelector('.name').textContent;
		var rt=foredit.querySelector('.rating').textContent;
		var rl=foredit.querySelector('.rollno').textContent;
		var ct=foredit.querySelector('.collapse').textContent;



		document.querySelector('.input-n').value=nm;
		document.querySelector('.input-r').value=rt;
		document.querySelector('.input-c').value=ct;
		document.querySelector('.input-roll').value=rl;

		remove(e);




    }

})



// adding event listner to form for adding elements
var addForm=document.querySelector('#add');
addForm.addEventListener('click',function(e){
	
	e.preventDefault();
  	var addBtn = e.target.parentElement;
  	var addhide = addBtn.querySelector('.addbutton');
   	var show = addBtn.querySelector('#hide');
    
 
// if add button is pressed changing the display
  	if(e.target.className=='addbutton')
  	{
  		addhide.style.display='none';
 		show.style.display='block';
 		window.scrollTo(0,document.body.scrollHeight);
 	}

// when save is pressed
	if(e.target.className=='savebutton')
	{
		pressSave(e);
	}

})



})