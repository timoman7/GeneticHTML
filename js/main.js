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
let class_traits = {
  Dimpled:{
    D: 2,
    R: 19
  },
  Free:{
    D:19,
    R:2
  },
  Widow:{
    D:7,
    R:14
  },
  PTC:{
    D:13,
    R:8
  },
  Left:{
    D:16,
    R:5
  },
  Bent:{
    D:1,
    R:20
  },
  Normal:{
    D:19,
    R:2
  },
  Pigment:{
    D:18,
    R:3
  },
  Mid:{
    D:20,
    R:1
  },
  Tongue:{
    D:16,
    R:5
  }
};


String.prototype.toAllele = function(){
  let newString = [];
  let _newString = this;
  _newString = _newString.split("").sort((a,b)=>{return (a.toLowerCase() > b.toLowerCase())}).join('');
  for(var i = 0; i < _newString.length; i+=2){
    newString.push(_newString[i]+_newString[i+1]);
  }
  let __newString = "";
  newString.forEach((str)=>{
    __newString += str.split('').sort((a,b)=>{return a>b}).join('');
  });
  //a>b
  return __newString;
};

Array.prototype.expandValues = function(){
  let retArray = [];
  for(let ind = 0; ind < arguments.length; ind++){
    retArray.push(this[arguments[ind]]);
  }
  return retArray;
};
// Order  012 015 042 045
//        312 315 342 345
function flatten(array) {
   return Array.isArray(array) ? [].concat.apply([], array.map(flatten)) : array;
}

Number.prototype.constrain = function(min,max){
  return Math.max(min,Math.min(max,this));
};

Object.toArray = function(obj, key){
  let newArr = [];
  key = key ? key : "__name";
  for(let prop in obj){
    obj[prop][key] = prop;
    newArr.push(obj[prop]);
  }
  obj = newArr;
  return obj;
};

Object.removeProperty = function(obj, prop){
  let newObj = {};
  for(let i in obj){
    if(i != prop){
      newObj[i] = obj[i];
    }
  }
  obj = newObj;
  return obj;
};

Array.toObject = function(arr, key){
  let newObj = {};
  key = key ? key : "__name";
  for(let ind = 0; ind < arr.length; ind++){
    let item = arr[ind];
    newObj[item[key]] = item;
    newObj[item[key]] = Object.removeProperty(newObj[item[key]],key);
  }
  arr = newObj;
  return arr;
};

HTMLElement.prototype.clear = function(){
  for(let child = this.children.length - 1; child >= 0; child--){
    this.removeChild(this.children[child]);
  }
};

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
      traits.push(traitString);
    }
  }
  return traits;
};
// COMBAK:  Create function to get chi squared distribution
// NOTE:    Function is Summation of ((Observed - Expected)^2)/Expected
// NOTE:    Observed is given
// NOTE:    Expected is (Allele.count / freqBackup._info._size) * Summation of Observed
function chiSquare(observed, _expectedList){
  let chi_square = 0;
  let expected = getExpected(_expectedList,observed);
  for(let i = 0; i < observed.length; i++){
    chi_square+=Math.pow(observed[i]-expected[i],2)/expected[i];
  }
  return chi_square;
}

function getExpected(list, observed){
  let observedSize = observed.reduce((pv, cv) => pv+cv, 0);
  let expected = [];
  for(let i=0; i < list.length; i++){
    expected.push((list[i].count / getAlleleTotal()._size)*observedSize);
  }
  return expected;
}

function getAllele(alleleName){
  return window.freqBackup.alleles[alleleName];
}

function getAlleleTotal(){
  return window.freqBackup._info;
}

function punnettChi(observed, alleles){
  let expectedList = [];
  for(let i=0; i < alleles.length; i++){
    expectedList.push(getAllele(alleles[i]));
  }
  return chiSquare(observed, expectedList);
}

function EmptyPart(partType, extra){
  let emptyPart = document.createElement(partType);
  emptyPart.class = "empty";
  for(let attr in extra){
    emptyPart.setAttribute(attr, extra[attr]);
  }
  return emptyPart;
}

function styleAlleles(){
  document.querySelector('#freqList').clear();
  document.querySelector('#infoList').clear();
  let AlleleList = document.querySelectorAll('.allele');
  let AlFrequency = {
    "_info":{
      "_size": AlleleList.length,
      "_variance": 0,
      "_colorArray": []
    },
    "alleles":{

    }
  };
  AlleleList.forEach((Al)=>{
    if(!AlFrequency.alleles[Al.textContent]){
      AlFrequency.alleles[Al.textContent]={
        "count":0,
        "freq": 0,
        "freqPrc": 0,
        "name": Al.textContent,
        "id": AlFrequency._info._variance,
        "color": "hsl(0,100%,65%)"
      };
      AlFrequency._info._variance++;
    }
    AlFrequency.alleles[Al.textContent].count++;
  });
  for(let Al in AlFrequency.alleles){
    AlFrequency.alleles[Al].freq = AlFrequency.alleles[Al].count / AlFrequency._info._size;
    AlFrequency.alleles[Al].freqPrc = AlFrequency.alleles[Al].freq * 100;
  }
  for(let c = 0; c < 316; c += 315 / AlFrequency._info._variance){
    AlFrequency._info._colorArray.push(`hsl(${Math.round(c)}, 100%, 65%)`);
  }

  for(let Al in AlFrequency.alleles){
    AlFrequency.alleles[Al].color = AlFrequency._info._colorArray[AlFrequency.alleles[Al].id];
  }
  window.freqBackup = Object.assign(new Object, AlFrequency);
  AlleleList.forEach((Al)=>{
    Al.style.backgroundColor = AlFrequency.alleles[Al.textContent].color;
  });
  updateFreqList(AlFrequency);
  document.querySelector('#infoList').appendChild(createAlleleTotal(AlFrequency));
}

function createAlleleTotal(AlFreq){
  let AlTotal = document.createElement('tr');
  AlTotal.setAttribute('class', 'alleleTotal');
  AlTotal.appendChild(EmptyPart('td'));
  let AlSize = document.createElement('td');
  AlSize.textContent = AlFreq._info._size;
  AlTotal.appendChild(AlSize);
  let AlUnique = document.createElement('td');
  AlUnique.textContent = AlFreq._info._variance;
  AlTotal.appendChild(AlUnique);
  return AlTotal;
}

function createAlleleInfo(allele){
  let newAlleleInfo = document.createElement('tr');
  newAlleleInfo.setAttribute('class', 'alleleInfo');
  newAlleleInfo.style.backgroundColor = allele.color;
  let newAlleleName = document.createElement('td');
  newAlleleName.textContent = allele.name;
  newAlleleInfo.appendChild(newAlleleName);
  let newAlleleFreq = document.createElement('td');
  newAlleleFreq.textContent = allele.freqPrc+"%";
  newAlleleInfo.appendChild(newAlleleFreq);
  let newAlleleCount = document.createElement('td');
  newAlleleCount.textContent = allele.count;
  newAlleleInfo.appendChild(newAlleleCount);
  return newAlleleInfo;
}

function createAllele(allele){
  let newAllele = document.createElement('td');
  newAllele.setAttribute('class', 'allele');
  newAllele.textContent = allele;
  return newAllele;
}

function CreateGenes(e){
  par1_table.clear();
  par2_table.clear();
  window.alleleMatrix = [];
  let par1_punnett = [];
  let par2_punnett = [];
  for (var i = 0; i < 2; i++) {
    par1_inputs.querySelectorAll(".par1-gene").forEach((gene)=>{
      par1_punnett.push(gene.value[i%2]);
    });
    par2_inputs.querySelectorAll(".par2-gene").forEach((gene)=>{
      par2_punnett.push(gene.value[i%2]);
    });
  }
  par1_punnett = par1_punnett.punnettFOIL(GeneCount.valueAsNumber);
  par2_punnett = par2_punnett.punnettFOIL(GeneCount.valueAsNumber);

  let p1_header = document.querySelector('#par1-header');
  p1_header.textContent = "";
  p1_header.setAttribute('colspan', par1_punnett.length+1);
  [...document.querySelectorAll('.par1-gene')].forEach((a)=>{
    p1_header.textContent += a.value;
  });
  let headTemplate = document.querySelector('#par2-header-template');
  let p2_header = headTemplate.content.querySelector('#par2-header');
  p2_header.textContent = "";
  p2_header.setAttribute('rowspan', par2_punnett.length+1);
  [...document.querySelectorAll('.par2-gene')].forEach((a)=>{
    p2_header.textContent += a.value;
  });
  let cloneHeader = document.importNode(headTemplate.content, true);
  par2_table.appendChild(cloneHeader);
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
  }
  for(let alleleX = 0; alleleX < par1_punnett.length; alleleX++){
    for(let alleleY = 0; alleleY < par2_punnett.length; alleleY++){
      let allele = (par1_punnett[alleleX] + par2_punnett[alleleY]).toAllele();
      if(allele.length==2){
        allele = allele.split('').sort((a,b)=>{return a>b}).join('');
      }
      if(!alleleMatrix[alleleY]){
        alleleMatrix.push([]);
      }
      alleleMatrix[alleleY].push(allele);
    }
  }
  for(let x = 0; x < alleleMatrix.length; x++){
    for(let y = 0; y < alleleMatrix[x].length; y++){
      par2_table.children[x+1].appendChild(createAllele(alleleMatrix[x][y]));
    }
  }
  styleAlleles();
}

function updateFreqList(AlFreq){
  document.querySelector('#freqList').clear();
  for(let Al in AlFreq.alleles){
    AlFreq.alleles[Al].color = AlFreq._info._colorArray[AlFreq.alleles[Al].id];
    document.querySelector('#freqList').appendChild(createAlleleInfo(AlFreq.alleles[Al]));
  }
}

function sortAlleles(prop, dir){
  let AlFreq = Object.assign(new Object, window.freqBackup);
  AlFreq.alleles = Object.toArray(AlFreq.alleles);
  let valConvert = {
    "freq": "freq",
    "count": "count",
    "none": "none",
  };
  let sortType = valConvert[prop];
  if(sortType != "none"){
    AlFreq.alleles.sort((AlleleA, AlleleB) => {
      let AlleleAVal = AlleleA[sortType];
      let AlleleBVal = AlleleB[sortType];
      // AlleleAVal = parseFloat(AlleleAVal.replace(/[ a-zA-Z]/g,""));
      // AlleleBVal = parseFloat(AlleleBVal.replace(/[ a-zA-Z]/g,""));
      if(dir == "asc"){
        return (AlleleAVal > AlleleBVal ? 1 : (AlleleAVal == AlleleBVal ? 0 : -1));
      }else if(dir == "dec"){
        return (AlleleAVal < AlleleBVal ? 1 : (AlleleAVal == AlleleBVal ? 0 : -1));
      }
    });
  }else{
    AlFreq = Object.assign(new Object, window.freqBackup);
    AlFreq.alleles = Object.toArray(AlFreq.alleles);
  }
  AlFreq.alleles = Array.toObject(AlFreq.alleles);
  updateFreqList(AlFreq);
}

function updateGeneCount(e){
  let geneSave = {
    par1: [],
    par2: []
  };
  document.querySelectorAll('.par1-gene').forEach((g)=>{
    geneSave.par1.push(g.value);
  });
  document.querySelectorAll('.par2-gene').forEach((g)=>{
    geneSave.par2.push(g.value);
  });
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
  document.querySelectorAll('.par1-gene').forEach((g)=>{
    g.value = geneSave.par1[[...g.parentElement.parentElement.children].indexOf(g.parentElement)] || "";
  });
  document.querySelectorAll('.par2-gene').forEach((g)=>{
    g.value = geneSave.par2[[...g.parentElement.parentElement.children].indexOf(g.parentElement)] || "";
  });
}

function copyP1P2(){
  let p1List = [];
  [...document.querySelectorAll('.par1-gene')].forEach((a)=>{
    p1List.push(a.value);
  });
  [...document.querySelectorAll('.par2-gene')].forEach((a)=>{
    a.value = p1List[[...a.parentElement.parentElement.children].indexOf(a.parentElement)];
  });
}

function test(){
  return punnettChi([20,10,55,15],["AABB","AaBb","Aabb","AAbb"]);
}

window.addEventListener('load',function(){
  let sortGo      = document.querySelector('#sortGo');
  let sortProp    = document.querySelector('#sortProp');
  let sortDir     = document.querySelector('#sortDir');
  GeneCount       = document.querySelector("#geneCount");
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
  copyButton      = document.querySelector("#copyP1P2");
  copyButton.addEventListener('click', copyP1P2);
  subButton.addEventListener('click', CreateGenes);
  sortGo.addEventListener('click',function(){
    sortAlleles(sortProp.value,sortDir.value);
  });
  GeneCount.addEventListener('change',updateGeneCount);
});
