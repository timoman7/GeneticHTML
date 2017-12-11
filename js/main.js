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
  return this.split("").sort((a,b)=>{return a.toLowerCase()!=b.toLowerCase() ? a<b : a>b});
}

Array.prototype.punnettFOIL = function(traitCount){
  if(traitCount == 1){
    return this
  }else{

  }
  console.log(this, traitCount)
}

function EmptyPart(partType){
  let emptyPart = document.createElement(partType);
  emptyPart.class = "empty";
  return emptyPart;
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
  for(let genes = 0; genes < GeneCount.valueAsNumber; genes++){

    for (var i = 0; i < GeneCount.valueAsNumber * 2; i++) {
      par1_inputs.querySelectorAll(".par1-gene").forEach((gene)=>{
        par1_punnett.push(gene.value[i%2]);
      });
      par2_inputs.querySelectorAll(".par2-gene").forEach((gene)=>{
        par2_punnett.push(gene.value[i%2]);
      });
    }
    par1_punnett.punnettFOIL(GeneCount.valueAsNumber);
    par2_punnett.punnettFOIL(GeneCount.valueAsNumber);

    TEMP_par1_gene.content.querySelectorAll(".par1").forEach((gene)=>{
      let input_list = [...TEMP_par1_gene.content.querySelectorAll(".par1")];
      let LR = input_list.indexOf(gene);
      let respective_item = Math.floor(LR/2);
      gene.innerHTML = par1_inputs.children[genes].value[LR];
    });
    TEMP_par2_gene.content.querySelectorAll(".par2").forEach((gene)=>{
      let input_list = [...TEMP_par2_gene.content.querySelectorAll(".par2")];
      let LR = input_list.indexOf(gene);
      let respective_item = Math.floor(LR/2);
      gene.innerHTML = par2_inputs.children[genes].value[LR];
    });

    let clone1 = document.importNode(TEMP_par1_gene.content, true);
    par1_table.appendChild(clone1);
    let clone2 = document.importNode(TEMP_par2_gene.content, true);
    par2_table.appendChild(clone2);
    console.log(TEMP_par1_gene.content)
    for(let alleles = 0; alleles < Math.pow(2 * GeneCount.valueAsNumber, 2); alleles++){
      //console.log(Math.floor(alleles / (2 * GeneCount.valueAsNumber)), (alleles % (2 * GeneCount.valueAsNumber)))
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
