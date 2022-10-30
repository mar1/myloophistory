const express = require("express")
const bodyParser = require("body-parser")
const ethers = require("ethers");
const fetch = require('node-fetch');
const fs = require("fs")
var ffmpeg = require('ffmpeg');
const concat = require('ffmpeg-concat')
const { NFTStorage, File } = require('nft.storage')
const glob=require('glob')
const { exec } = require("child_process");
const mime = require('mime');
const path = require('path')
const dotenv = require('dotenv');
dotenv.config();

const abi = [{"inputs":[{"internalType":"string","name":"_name","type":"string"},{"internalType":"string","name":"_symbol","type":"string"},{"internalType":"string","name":"_innitBaseURI","type":"string"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"_from","type":"address"},{"indexed":false,"internalType":"address","name":"_toFollow","type":"address"}],"name":"followed","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"_from","type":"address"},{"indexed":false,"internalType":"uint256","name":"_tokenId","type":"uint256"},{"indexed":false,"internalType":"string","name":"_hash","type":"string"},{"indexed":false,"internalType":"uint256","name":"_length","type":"uint256"}],"name":"loopAdded","type":"event"},{"inputs":[{"internalType":"uint256","name":"_tokenId","type":"uint256"},{"internalType":"string","name":"_hash","type":"string"}],"name":"addLoop","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"baseExtension","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"baseURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"burn","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"cost","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_toFollow","type":"address"}],"name":"follow","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"followers","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"following","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_tokenId","type":"uint256"}],"name":"getLoop","outputs":[{"internalType":"string[]","name":"","type":"string[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"loops","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_minter","type":"address"}],"name":"mint","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"paused","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"_newBaseExtension","type":"string"}],"name":"setBaseExtension","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"_newBaseURI","type":"string"}],"name":"setBaseURI","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_newPrice","type":"uint256"}],"name":"setCost","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"tokenByIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"uint256","name":"index","type":"uint256"}],"name":"tokenOfOwnerByIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_owner","type":"address"}],"name":"walletOfOwner","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"withdrawAmount","type":"uint256"}],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"}]


const app = express()
const PORT = 3000

app.use(bodyParser.json())
app.set('json spaces', 2)

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`))

/*
app.get('/nfts/:tokenid', async (req,res) => {
    let token = (req.params.tokenid).toString()
    token = token.substring(0, token.length - 5);

    let arrToken = await getLoop(token)

    let mdata = {
    name: `MLS #${token}`,
    description: "MyLoopStory is a dynamic video NFT-based decentralized social network",
    image:	"ipfs://",
    attributes: [
        {
            trait_type: "Length",
            value: arrToken.length
        },
        {
            trait_type: "Loops",
            value: arrToken
        }
    ]
    }
    
    res.status(200).json(mdata)
})
*/
app.get('/nfts/:tokenid', async (req,res) => {
    let token = (req.params.tokenid).toString()
    token = token.substring(0, token.length - 5);

    try {
        let hashVideo = await generateLoop(token)
        let arrToken = await getLoop(token)
        let mdata = {
          name: `MLS #${token}`,
          description: "MyLoopStory is a dynamic video NFT-based decentralized social network",
          image:	`https://nftstorage.link/ipfs/${hashVideo}`,
          attributes: [
              {
                  trait_type: "Length",
                  value: arrToken.length
              },
              {
                  trait_type: "Loops",
                  value: arrToken
              }
          ]
          }
          
          res.status(200).json(mdata)
    } catch(err) {
        console.log(err)
        res.status(500).json("something wrong");
        return;
    };
})

    const provider = new ethers.providers.WebSocketProvider(
      `wss://polygon-mumbai.g.alchemy.com/v2/BydmcGLan3OujU7I8uUwDNj8tLmjEY1Y`
    );

    const contract = new ethers.Contract(process.env.contractAddress, abi, provider);

    async function getLoop(id) {
        let loopsArr = await contract.getLoop(id)
        return loopsArr
    }

    async function getOwner(id) {
        let owner = await contract.ownerOf(id)
        return owner
    }

    async function getLatestLoops() {
    let eventFilter = contract.filters.loopAdded()
    let events = await contract.queryFilter(eventFilter)
    let latestLoops = []
    for (let el of events) {
        let info = await {
            from: el.args._from,
            tokenId: el.args._tokenId.toNumber(),
            hash: el.args._hash,
            length: el.args._length.toNumber(),
          };
          latestLoops.push(info)
    }
    console.log(latestLoops)
    }

async function generateLoop(token) {
    let owner = await getOwner(token)

    let arrToken = await getLoop(token)
    let fArr = []
    for (let i = 0; i < await arrToken.length; i++) {
        let tokenURL = `https://${arrToken[i]}.ipfs.nftstorage.link`
        console.log(tokenURL)
        const response = await fetch(tokenURL);
        const buffer = await response.buffer();
        //await fs.unlinkSync(`./videos/${owner}.mp4`);
         await fs.writeFile(`./videos/${owner}-${i+1}.webm`, buffer, () => 
           console.log(`Video ${i+1} downloaded`));  
           fArr.push(`file './videos/${owner}-${i+1}.webm'`)
        }
        const videos = fArr
        const writeStream = fs.createWriteStream('file.txt');
        const pathName = writeStream.path;
        await videos.forEach(value => writeStream.write(`${value}\n`));

        await writeStream.on('finish', () => {
            console.log(`wrote to ${pathName}`);
        });
       await writeStream.end();
       await fs.unlinkSync(`./file.txt`);
       await exec(`ffmpeg -f concat -safe 0 -i file.txt -c copy ./videos/${owner}.mp4`);
       let finalHash = await storeToIPFS(`./videos/${owner}.mp4`)
       return await finalHash
}

/*
contract.on("loopAdded", (from, tokenId, hash, length) => {
  let info = {
    from: from,
    tokenId: tokenId.toNumber(),
    hash: hash,
    length: length.toNumber(),
  };
  writeTofile(info);
});
*/

async function storeToIPFS(file) {
    const client = new NFTStorage({ token: process.env.NFT_STORAGE_TOKEN })
    //let videoFile = await fs.readFileSync(file);
    //const videoFile = new File(file, { type: 'video/mp4' })
    const blobFile = await fileFromPath(file)
    const metadata = await client.storeBlob(blobFile)
    return await metadata
}

function writeTofile(data) {
    const content = {
      timestamp: new Date().toISOString(),
      data,
    };
    fs.readFile('data.json', 'utf8', (err, result) => {
      if (err) {
        console.log(err);
      } else {
        const objectifiedData = result ? JSON.parse(result) : [];
        objectifiedData.push(content);
        const json = JSON.stringify(objectifiedData);
        fs.writeFile('data.json', json, 'utf8', (error) => {
          if (error) {
            console.log(err);
          }
        });
      }
    });
  }

  async function fileFromPath(filePath) {
    const content = await fs.promises.readFile(filePath)
    const type = mime.getType(filePath)
    return new File([content], path.basename(filePath), { type })
}