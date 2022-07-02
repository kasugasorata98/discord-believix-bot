import MongooseClient from "../lib/MongooseClient";
import { Community } from "../models/Community";
const names = "astel,subject,kisu,chump,masvidal,migos,roby,robe,glizzy,geneva,casper,yack,harribel,feii,jungle,meat,monster,secular,misato,kixi,yusu,dawg,arktourous,neffex,julius,madly,avatar,morbius,wild,hulk,zintt,rocked,border,yoda,woopsies,hate,ulti,afkri,wasi,nerfed,chasm,tasuki,minty,angels,tasu,maik,dent,strongest,dummy,lunis,rasenku,zayvian,mruwu,markyyy,kahri,claudius,claudius,oopsies,devierge,legend,pitbull,belief,timzie,scarface,unique,manami,tasukii,wasim,karsa,jebaited,skeleton,liability,doom,gloomis,misssquash,wammy,missvalkyrie,misssquatch,merit,bemine,wolfiee,kingnotfall,kiele,sea_dreagon,cucciclawz,alffa,gamigo,astute,lady_killua,robi,crack,hellomf,rageg0n,band,suspended,uzii"
MongooseClient.connect('mongodb+srv://jeromy:PokeFan2@staging.2wi4b.mongodb.net/believix-bot').then(async () => {

    for (const name of names.split(',')) {

        try {
            await Community.create({
                name,
                isEnemy: true
            })
        }
        catch { }
        console.log('next');
    }
    console.log('Done');
})