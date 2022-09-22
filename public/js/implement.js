const SHA256=require('crypto-js/sha256')
class Block{
    constructor(index, timestamp , data , previousHash = ''){
        this.index=index;
        this.timestamp=timestamp;
        this.data=data;
        this.previousHash=previousHash;
        this.nonce=0;
        this.hash=this.calculateHashCode();
    }

    calculateHashCode(){             // using SHA-256 hash algorithm
        //  return SHA256(this.index+this.timestamp+JSON.stringify(this.data)).toString();
        return SHA256(JSON.stringify(this.data)+this.nonce).toString();
    }

    mineBlock(difficulty){
        while(this.hash.substring(0,difficulty)!==Array(difficulty+1).join('0')){
            this.nonce++;
            this.hash=this.calculateHashCode();
        }
        console.log("Block mined : "+this.hash);
    }
}

class Blockchain{
    constructor(){
        this.chain= [this.createGenesisBlock()];  //initialized array with the first block that is called the genesis block
        this.difficulty=4; //difficulty is the additional computational power to verify transaction entered on blockchain
    }

    createGenesisBlock(){
        return new Block(0 , "8/07/2021" , {Name:"Genesis Block" } , "0"); //we are manually initializing the first block and storing its preHash as 0 because it doesnot have any previous block. 
    }

    getLatestBlock(){
        return this.chain[this.chain.length-1];
    }

    addBlock(newBlock){
        newBlock.previousHash=this.getLatestBlock().hash;    // assigning the previous block hash to newly created block 
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    }

    isValid(){    //method to check whether a blockchain is valid or not.
        
        //looping from index 1 as first block is the genesis block  
         
        for(let i=1 ; i<this.chain.length; i++){  
            const prevBlock=this.chain[i-1];
            const currBlock=this.chain[i];

            if(currBlock.hash!==currBlock.calculateHashCode()){
                return false;
            }

            if(currBlock.previousHash !== prevBlock.hash){
                return false;
            }
        }

        return true;
    }
}

let coin=new Blockchain();
// console.log("Mining block 1..")
// coin.addBlock(new Block(1 , "9/07/2021" , { Name: 'Rahul' , phone: '7' ,  moistureLevel: '35'}));
// console.log("Mining Block 2..")
// coin.addBlock(new Block(2 , "11/07/2021" , {Name :  'Ajay' , phLevel:'3' , moistureLevel: '72'}));
//  console.log(coin.isValid() ? "true" : "false");
// coin.chain[1].data={Name:'xyz'};
//  console.log(coin.isValid() ? "true" : "false");
// console.log(JSON.stringify(coin , null , 5));

module.exports = {coin,Blockchain,Block}
