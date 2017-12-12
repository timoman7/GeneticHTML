let GeneCount;
let TEMP_par1_input;
let TEMP_par2_input;
let TEMP_par1_gene;
let TEMP_par2_gene;
let TEMP_allele;
let par1_inputs;
let par2_inputs;
let par1_table;
let par2_table;
let subButton;
let even= 0;
let odd = 1;

String.prototype.toAllele = function(){
  let newString = [];
  let _newString = this;
  _newString = _newString.split("").sort((a,b)=>{return (a.toLowerCase() > b.toLowerCase())}).join('');
  for(var i = 0; i < _newString.length; i+=2){
    newString.push(_newString[i]+_newString[i+1]);
  }
  let __newString = "";
  newString.forEach((str)=>{
    __newString += str.split('').sort((a,b)=>{return a.toLowerCase()<b.toLowerCase()}).join('');
  });
  //a>b
  return __newString;
}

Array.prototype.expandValues = function(){
  let retArray = [];
  for(let ind = 0; ind < arguments.length; ind++){
    retArray.push(this[arguments[ind]]);
  }
  return retArray;
}
// Order  012 015 042 045
//        312 315 342 345
function flatten(array) {
   return Array.isArray(array) ? [].concat.apply([], array.map(flatten)) : array;
}
Array.prototype.punnettFOIL = function(traitCount){
  let traits = [];
  let exclude = [];
  let whole = [];
  let firstHalf = [];
  let secondHalf = [];
  let stringCounter = {};
  if(traitCount == 1){
    return this
  }else{
    for(var i = 0; i < 2; i++){
      let baseTrait = i*traitCount;
      exclude.push(baseTrait);
      i == 0 ? firstHalf.push(this.join('').substr(0,traitCount)) : secondHalf.push(this.join('').substr(traitCount,traitCount));
    }
    for(let _ind=0;_ind<firstHalf[0].split('').length;_ind++){
      whole.push(firstHalf[0].split('')[_ind]+secondHalf[0].split('')[_ind]);
    }
    for(let _ind=0;_ind<traitCount;_ind++){
      stringCounter[firstHalf[0][_ind].toUpperCase()]=0;
    }
    for(let i = 0; i < Math.pow(2,traitCount); i++){
      //By the end of the for loop, add something to traits
      let traitString = "";
      let sStart = Math.floor(i/(Math.pow(2,traitCount)/2));
      for(let tInd = 0; tInd < traitCount; tInd++){
        let counter = Math.floor(stringCounter[whole[tInd][0].toUpperCase()]);
        let mod = (((traitCount)-tInd));
        traitString += whole[tInd][counter%2];
        stringCounter[whole[tInd][0].toUpperCase()]+=1/mod;
      }
      //console.log(sStart)
      traits.push(traitString);
    }
  }
  return traits;
};

function EmptyPart(partType){
  let emptyPart = document.createElement(partType);
  emptyPart.class = "empty";
  return emptyPart;
}

function createAllele(allele){
  let newAllele = document.createElement('td');
  newAllele.textContent = allele;
  return newAllele;
}

function CreateGenes(e){
  console.log(e)
  for(let child = par1_table.children.length - 1; child >= 0; child--){
    par1_table.removeChild(par1_table.children[child]);
  }
  for(let child = par2_table.children.length - 1; child >= 0; child--){
    par2_table.removeChild(par2_table.children[child]);
  }
  par1_table.appendChild(EmptyPart('th'));
  console.log(GeneCount.valueAsNumber)
  let alleleMatrix = [];
  let par1_punnett = [];
  let par2_punnett = [];
  for (var i = 0; i < 2; i++) {
    par1_inputs.querySelectorAll(".par1-gene").forEach((gene)=>{
      console.log(gene.value)
      par1_punnett.push(gene.value[i%2]);
    });
    par2_inputs.querySelectorAll(".par2-gene").forEach((gene)=>{
      par2_punnett.push(gene.value[i%2]);
    });
  }
  par1_punnett = par1_punnett.punnettFOIL(GeneCount.valueAsNumber);
  par2_punnett = par2_punnett.punnettFOIL(GeneCount.valueAsNumber);
  for(let genes = 0; genes < Math.pow(2,GeneCount.valueAsNumber); genes++){
    TEMP_par1_gene.content.querySelectorAll(".par1").forEach((gene)=>{
      let input_list = [...TEMP_par1_gene.content.querySelectorAll(".par1")];
      let LR = input_list.indexOf(gene);
      gene.innerHTML = par1_punnett[genes];
    });
    TEMP_par2_gene.content.querySelectorAll(".par2").forEach((gene)=>{
      let input_list = [...TEMP_par2_gene.content.querySelectorAll(".par2")];
      let LR = input_list.indexOf(gene);
      gene.innerHTML = par2_punnett[genes];
    });

    let clone1 = document.importNode(TEMP_par1_gene.content, true);
    par1_table.appendChild(clone1);
    let clone2 = document.importNode(TEMP_par2_gene.content, true);
    par2_table.appendChild(clone2);
    console.log(TEMP_par1_gene.content)
  }
  for(let alleleX = 0; alleleX < par1_punnett.length; alleleX++){
    for(let alleleY = 0; alleleY < par2_punnett.length; alleleY++){
      let allele = (par1_punnett[alleleX] + par2_punnett[alleleY]).toAllele();
      console.log(allele, par1_punnett[alleleX])
      par2_table.children[alleleY].appendChild(createAllele(allele));
    }
  }
  console.log(par1_punnett,par2_punnett)
}

window.addEventListener('load',function(){
  GeneCount = document.querySelector("#geneCount");
  TEMP_par1_input = document.querySelector("#par1-input");
  TEMP_par2_input = document.querySelector("#par2-input");
  TEMP_par1_gene  = document.querySelector("#par1-gene");
  TEMP_par2_gene  = document.querySelector("#par2-gene");
  TEMP_allele     = document.querySelector("#allele-template");
  par1_inputs     = document.querySelector("#par1-genes");
  par2_inputs     = document.querySelector("#par2-genes");
  par1_table      = document.querySelector("#par1");
  par2_table      = document.querySelector("#par2");
  subButton       = document.querySelector("#SubmitGenes");
  subButton.addEventListener('click', CreateGenes);
  GeneCount.addEventListener('change',function(e){
    console.log(e.srcElement.valueAsNumber)
    for(let child = par1_inputs.children.length - 1; child >= 0; child--){
      par1_inputs.removeChild(par1_inputs.children[child]);
    }
    for(let child = par2_inputs.children.length - 1; child >= 0; child--){
      par2_inputs.removeChild(par2_inputs.children[child]);
    }
    for(let genes = 0; genes < e.srcElement.valueAsNumber; genes++){
      // TEMP_par1_input
      let clone1 = document.importNode(TEMP_par1_input.content, true);
      par1_inputs.appendChild(clone1);
      let clone2 = document.importNode(TEMP_par2_input.content, true);
      par2_inputs.appendChild(clone2);
    }
  });
});
