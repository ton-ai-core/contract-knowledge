# TheOpenNetwork

### basedontheworkofDr.NikolaiDurov

### July26, 2021

```
Abstract
TheaimofthistextistoprovidearstdescriptionoftheTheOp en
Network(TON)andrelatedblo ckchain,p eer-to-p eer,distributedstor-
ageandservicehostingtechnologies. Toreducethesizeofthisdo c-
umenttoreasonableprop ortions,wefo cusmainlyontheuniqueand
deningfeatures oftheTON platformthatare imp ortantforitto
achieveitsstatedgoals.
```
## Intro duction

TheTheOpenNetwork(TON)isafast,secureandscalableblo ckchainand
networkpro ject, capableofhandlingmillionsoftransactionsp ersecondif
necessary,andb othuser-friendlyandserviceprovider-friendly. Weaimfor
ittob eabletohostallreasonableapplicationscurrentlyprop osedandcon-
ceived. Onemightthinkab outTONasahugedistributedsup ercomputer,
or rathera hugesup erserver, intendedto hostandprovidea varietyof
services.
Thistext isnotintended tob e theultimatereference withresp ectto
allimplementationdetails. Someparticularsarelikelytochangeduringthe
developmentandtestingphases.


## Intro duction

- 1 BriefDescriptionofTONComp onents Contents
- 2 TONBlo ckchain
   - 2.1 TONBlo ckchainasaCollectionof2-Blo ckchains
   - 2.2 GeneralitiesonBlo ckchains
   - 2.3 Blo ckchainState,AccountsandHashmaps
   - 2.4 MessagesBetweenShardchains
   - 2.5 GlobalShardchainState.BagofCellsPhilosophy.
   - 2.6 CreatingandValidatingNewBlo cks
   - 2.7 SplittingandMergingShardchains
   - 2.8 ClassicationofBlo ckchainPro jects
   - 2.9 ComparisontoOtherBlo ckchainPro jects
- 3 TONNetworking
   - 3.1 AbstractDatagramNetworkLayer
   - 3.2 TONDHT:Kademlia-likeDistributedHashTable.
   - 3.3 OverlayNetworksandMulticastingMessages
- 4 TONServicesandApplications
   - 4.1 TONServiceImplementationStrategies
   - 4.2 ConnectingUsersandServiceProviders.
   - 4.3 AccessingTONServices
- 5 TONPayments
   - 5.1 PaymentChannels
   - 5.2 PaymentChannelNetwork,orLightningNetwork
- Conclusion
- A TheTONCoin


```
Chapter1. BriefDescriptionofTONComponents
```
## 1 Brief Description of TON Comp onents

TheTheOpenNetwork(TON)isacombinationofthefollowingcomp onents:

```
 Aexiblemulti-blo ckchainplatform(TONBlockchain;cf.Chapter 2 ),
capableofpro cessingmillionsoftransactionsp ersecond,withTuring-
completesmartcontracts,upgradableformalblo ckchainsp ecications,
multi-crypto currencyvaluetransfer,supp ortformicropayment chan-
nelsando-chainpaymentnetworks. TONBlockchainpresentssome
newanduniquefeatures,suchastheself-healingverticalblo ckchain
mechanism(cf.2.1.17)andInstantHyp ercub eRouting(cf.2.4.20),
whichenableittob efast,reliable,scalableandself-consistentatthe
sametime.
```
```
 Ap eer-to-p eernetwork(TONP2PNetwork,orjustTONNetwork;cf.
Chapter 3 ),usedforaccessingtheTONBlo ckchain,sendingtransac-
tioncandidates,andreceivingup datesab outonlythosepartsofthe
blo ckchainaclientisinterestedin(e.g.,thoserelatedto theclient's
accountsandsmartcontracts),butalsoabletosupp ortarbitrarydis-
tributedservices,blo ckchain-relatedornot.
```
```
 Adistributedlestoragetechnology(TONStorage;cf.4.1.7),acces-
sible throughTON Network, used by the TON Blo ckchain to store
archivecopiesof blo cksandstatusdata(snapshots),butalsoavail-
ableforstoringarbitrarylesforusersorotherservicesrunningonthe
platform,withtorrent-likeaccesstechnology.
```
```
 Anetworkproxy/anonymizerlayer(TONProxy;cf.4.1.10and3.1.6),
similartotheI^2 P (InvisibleInternetPro ject),usedtohidetheiden-
tityandIPaddressesofTONNetwork no desifnecessary(e.g.,no des
committingtransactions fromaccounts withlargeamounts of cryp-
to currency,orhigh-stakeblo ckchainvalidatorno deswhowishtohide
theirexactIPaddressandgeographicallo cationasameasureagainst
DDoSattacks).
```
```
 AKademlia-likedistributedhashtable(TONDHT;cf.3.2),usedas
atorrenttrackerforTONStorage(cf.3.2.10),asaninputtunnel
lo catorforTONProxy(cf.3.2.14),andasaservicelo catorforTON
Services(cf.3.2.12).
```

```
Chapter1. BriefDescriptionofTONComponents
```
```
 Aplatformforarbitraryservices(TONServices; cf.Chapter 4 ),re-
sidinginandavailablethroughTONNetwork andTONProxy,with
formalizedinterfaces(cf.4.3.14)enablingbrowser-likeorsmartphone
applicationinteraction. Theseformalinterfacesandp ersistentservice
entryp ointscanb epublishedintheTONBlo ckchain(cf.4.3.17);ac-
tualno desproviding serviceatany givenmoment canb elo okedup
through the TON DHT starting frominformationpublished inthe
TONBlo ckchain(cf.3.2.12). Servicesmaycreatesmartcontractsin
theTONBlo ckchaintooersomeguaranteestotheirclients(cf.4.1.6).
```
```
 TONDNS (cf.4.3.1),aserviceforassigninghuman-readablenames
toaccounts,smartcontracts,servicesandnetworkno des.
```
```
 TONPayments(cf.Chapter 5 ),aplatformformicropayments,micro-
paymentchannelsandamicropaymentchannelnetwork.Itcanb eused
forfasto-chainvaluetransfers,andforpayingforservicesp owered
byTONServices.
```
```
 TON willallow easyintegrationwiththird-partymessaging andso-
cialnetworkingapplications,thusmakingblo ckchaintechnologiesand
distributedservicesnallyavailable andaccessibletoordinary users
(cf. 4.3.23), rather than just to a handful of early crypto currency
adopters.
```
While the TON Blo ckchain is the core of the TON pro ject, and the
othercomp onentsmightb econsideredasplayingasupp ortiveroleforthe
blo ckchain, they turn outto haveuseful andinteresting functionalityby
themselves. Combined,theyallowtheplatformto hostmoreversatileap-
plications than it would b e p ossible by just using the TON Blo ckchain
(cf.2.9.13and4.1).


### 2.1 TONBlo ckchainasaCollectionof2-Blo ckchains

## 2 TONBlo ckchain

WestartwithadescriptionoftheTheOp enNetwork(TON) Blo ckchain,
thecorecomp onentofthepro ject.Ourapproachhereistop-down:wegive
ageneraldescriptionofthewholerst,andthenprovidemoredetailoneach
comp onent.
Forsimplicity,wesp eakhereab outthe TONBlo ckchain,eventhough
inprinciple severalinstances of this blo ckchainproto col may b e running
indep endently(forexample,asaresultofhardforks).Weconsideronlyone
ofthem.

### 2.1 TONBlo ckchainas aCollectionof2-Blo ckchains

TheTONBlo ckchainisactuallyacol lectionofblo ckchains(evenacollection
ofblockchains ofblockchains, or 2-blockchainsthisp ointwill b eclaried
laterin2.1.17),b ecausenosingleblo ckchainpro jectiscapableofachieving
ourgoalofpro cessingmillionsoftransactionsp ersecond,asopp osedtothe
now-standarddozensoftransactionsp ersecond.

2.1.1.Listofblo ckchaintyp es.Theblo ckchainsinthiscollectionare:

```
 The unique masterblockchain, or masterchain for short, containing
general informationab outtheproto colandthe currentvaluesof its
parameters,thesetofvalidatorsandtheirstakes,thesetofcurrently
activeworkchainsandtheirshards,and,mostimp ortantly,thesetof
hashesofthemostrecentblo cksofallworkchainsandshardchains.
```
```
 Several(upto 232 )workingblockchains,orworkchainsforshort,which
areactuallytheworkhorses,containingthevalue-transferandsmart-
contracttransactions. Dierentworkchainsmayhavedierentrules,
meaning dierentformats of account addresses, dierent formatsof
transactions,dierentvirtualmachines(VMs)forsmartcontracts,dif-
ferentbasiccrypto currenciesandsoon.However,theyallmustsatisfy
certainbasicinterop erabilitycriteriatomakeinteractionb etweendif-
ferentworkchainsp ossibleandrelativelysimple. Inthisresp ect,the
TON Blo ckchain isheterogeneous (cf.2.8.8), similarly to the EOS
(cf.2.9.7)andPolkaDot(cf.2.9.8)pro jects.
```
```
 Eachworkchainisinturnsub dividedintoupto 260 shardblockchains,
or shardchains forshort,havingthesame rulesandblo ckformatas
```

```
2.1.TONBlockchainasaCollectionof2-Blockchains
```
```
theworkchainitself,butresp onsibleonlyforasubsetofaccounts,de-
p endingonseveralrst(mostsignicant)bitsoftheaccountaddress.
Inotherwords,aformofshardingisbuiltintothesystem(cf.2.8.12).
Becausealltheseshardchainsshareacommonblo ckformatandrules,
theTONBlo ckchainishomogeneousinthisresp ect(cf.2.8.8),simi-
larlytowhathasb eendiscussedinoneofEthereumscalingprop osals.^1
```
```
 Eachblo ckinashardchain(andinthemasterchain)isactuallynotjust
ablo ck,butasmallblo ckchain. Normally,thisblo ckblo ckchainor
verticalblo ckchainconsistsofexactlyoneblo ck,andthenwemight
thinkthisisjustthecorresp ondingblo ckoftheshardchain(alsocalled
horizontalblo ckchaininthissituation). However,ifitb ecomesnec-
essarytoxincorrectshardchainblo cks,anewblo ckiscommittedinto
theverticalblo ckchain,containingeitherthereplacementforthein-
validhorizontalblo ckchainblo ck,orablo ckdierence,containing
onlyadescriptionofthosepartsofthepreviousversionofthisblo ck
thatneedtob echanged.ThisisaTON-sp ecicmechanismtoreplace
detectedinvalidblo ckswithoutmakingatrueforkofallshardchains
involved; itwillb eexplained inmoredetailin2.1.17. Fornow,we
justremarkthateachshardchain(andthemasterchain)isnotacon-
ventionalblo ckchain,butablockchainofblockchains,or2D-blockchain,
orjusta2-blockchain.
```
2.1.2.InniteShardingParadigm.Almostallblo ckchainshardingpro-
p osalsaretop-down: onerstimaginesasingleblo ckchain,andthendis-
cusseshowtosplititintoseveralinteractingshardchainstoimprovep erfor-
manceandachievescalability.
TheTONapproachtoshardingisb ottom-up,explainedasfollows.
Imaginethatshardinghasb eentakentoitsextreme,sothatexactlyone
accountorsmartcontractremainsineachshardchain.Thenwehaveahuge
numb erofaccount-chains,eachdescribingthestateandstatetransitions
ofonlyoneaccount,andsendingvalue-b earing messagesto eachotherto
transfervalueandinformation.
Ofcourse,itisimpracticaltohavehundredsofmillionsofblo ckchains,
withup dates (i.e., new blo cks) usually app earing quiterarelyin each of
them.Inordertoimplementthemmoreeciently,wegrouptheseaccount-
chainsintoshardchains,sothateachblo ckoftheshardchainisessentiallya

(^1) https://github.com/ethereum/wiki/wiki/Sharding- FAQ


```
2.1.TONBlockchainasaCollectionof2-Blockchains
```
collectionofblo cksofaccount-chainsthathaveb eenassignedtothisshard.
Thusthe account-chains haveonly apurely virtual or logicalexistence
insidetheshardchains.
Wecallthisp ersp ectivetheInniteShardingParadigm.Itexplainsmany
ofthedesigndecisionsfortheTONBlo ckchain.

2.1.3.Messages. InstantHyp ercub eRouting. TheInniteSharding
Paradigminstructs usto regardeach account(orsmart contract) asif it
wereinitsownshardchainbyitself. Thentheonlywayoneaccountmight
aectthestateofanotherisbysending amessage toit(thisisasp ecial
instanceof theso-calledActormo del,withaccountsasActors; cf.2.4.2).
Therefore,asystemofmessagesb etweenaccounts(andshardchains,b ecause
thesourceanddestinationaccountsare,generallysp eaking,lo catedindif-
ferentshardchains)isofparamountimp ortancetoascalablesystemsuchas
theTONBlo ckchain.Infact,anovelfeatureoftheTONBlo ckchain,called
InstantHypercubeRouting(cf.2.4.20),enablesittodeliverandpro cessa
messagecreatedinablo ckofoneshardchainintotheverynextblo ckofthe
destinationshardchain,regard lessofthetotalnumberofshardchainsinthe
system.

2.1.4. Quantity of masterchains, workchains and shardchains. A
TON Blo ckchain containsexactly onemasterchain. However, thesystem
canp otentiallyaccommo dateupto 232 workchains,eachsub dividedintoup
to 260 shardchains.

2.1.5.Workchainscanb evirtualblo ckchains,nottrueblo ckchains.
Becauseaworkchainisusuallysub dividedintoshardchains,theexistenceof
theworkchainisvirtual, meaningthat itisnotatrueblo ckchaininthe
senseofthegeneraldenitionprovidedin2.2.1b elow,butjustacollection
ofshardchains. Whenonlyoneshardchaincorresp ondstoaworkchain,this
uniqueshardchainmayb eidentiedwiththeworkchain,whichinthiscase
b ecomesatrueblo ckchain,atleastforsometime,thusgainingasup er-
cialsimilaritytocustomarysingle-blo ckchaindesign. However,theInnite
ShardingParadigm(cf.2.1.2)tellsusthatthissimilarityisindeedsup er-
cial: itisjustacoincidencethatthep otentiallyhugenumb erofaccount-
chainscantemp orarilyb egroup edintooneblo ckchain.

2.1.6.Identicationofworkchains. Eachworkchainisidentiedbyits
numberorworkchainidentier (workchain_id:uint 32 ),whichissimplyan


```
2.1.TONBlockchainasaCollectionof2-Blockchains
```
unsigned32-bitinteger. Workchainsarecreatedbysp ecialtransactionsin
themasterchain,deningthe(previouslyunused)workchain identierand
theformaldescriptionoftheworkchain,sucientatleastfortheinteraction
ofthisworkchainwithotherworkchainsandforsup ercialvericationofthis
workchain'sblo cks.

2.1.7.Creationandactivationofnewworkchains. Thecreationofa
newworkchainmayb einitiatedbyessentiallyanymemb erofthecommunity,
readytopaythe(high)masterchaintransactionfeesrequiredtopublishthe
formalsp ecication of a new workchain. However, in orderfor the new
workchaintob ecomeactive,atwo-thirdsconsensusofvalidatorsisrequired,
b ecausetheywillneedtoupgradetheirsoftwaretopro cessblo cksofthenew
workchain,andsignal theirreadinessto workwiththenewworkchain by
sp ecialmasterchaintransactions. Thepartyinterestedintheactivationof
thenewworkchainmightprovidesomeincentiveforthevalidatorstosupp ort
thenewworkchainbymeansofsomerewardsdistributedbyasmartcontract.

2.1.8.Identicationofshardchains. Eachshardchainisidentiedbya
couple(w,s) = (workchain_id,shard_prex),whereworkchain_id:uint 32
identies the corresp onding workchain, and shard_prex : 20 ...^60 isa bit
stringoflengthatmost60,deningthesubsetofaccountsforwhichthis
shardchainis resp onsible. Namely, all accountswithaccount_id starting
withshard_prex(i.e.,havingshard_prexasmostsignicantbits)willb e
assignedtothisshardchain.

2.1.9.Identicationofaccount-chains. Recallthataccount-chainshave
onlyavirtualexistence(cf.2.1.2).However,theyhaveanaturalidentier
namely, (workchain_id,account_id)b ecause any account-chain contains
information ab outthe stateandup datesof exactlyoneaccount (eithera
simpleaccountorsmartcontractthedistinctionisunimp ortanthere).

2.1.10. Dynamic splittingand merging of shardchains; cf.2.7. A
lesssophisticated systemmightusestaticshardingforexample, byusing
thetopeightbitsoftheaccount_idtoselectoneof 256 pre-denedshards.
Animp ortantfeatureoftheTONBlo ckchainisthatitimplementsdy-
namicsharding,meaningthatthenumb erofshardsisnotxed. Instead,
shard(w,s)canb eautomaticallysub dividedintoshards(w,s.0)and(w,s.1)
ifsomeformalconditionsaremet(essentially,ifthetransactionloadonthe
originalshardishighenough foraprolongedp erio doftime). Conversely,


```
2.1.TONBlockchainasaCollectionof2-Blockchains
```
iftheload staysto olowforsome p erio doftime, theshards(w,s.0) and
(w,s.1)canb eautomaticallymergedbackintoshard(w,s).
Initially,onlyoneshard(w,∅)iscreatedforworkchain w. Later,itis
sub dividedintomoreshards,ifandwhenthisb ecomesnecessary(cf.2.7.
and2.7.8).

2.1.11.BasicworkchainorWorkchainZero.Whileupto 232 workchains
canb edenedwiththeirsp ecicrulesandtransactions,weinitiallydene
onlyone,withworkchain_id= 0.Thisworkchain,calledWorkchainZeroor
thebasicworkchain,istheoneusedtoworkwithTONsmartcontractsand
transferTONcoins(cf.App endixA).Mostapplicationsarelikelytorequire
onlyWorkchainZero.Shardchainsofthebasicworkchainwillb ecalledbasic
shardchains.

2.1.12.Blo ckgenerationintervals. Weexp ectanewblo cktob egener-
atedineachshardchainandthemasterchainapproximatelyonceeveryve
seconds. Thiswillleadtoreasonablysmalltransactionconrmationtimes.
Newblo cksofallshardchainsaregeneratedapproximatelysimultaneously;
anewblo ckofthemasterchainisgeneratedapproximatelyonesecondlater,
b ecauseitmustcontainthehashesofthelatestblo cksofallshardchains.

2.1.13.Usingthemasterchaintomakeworkchainsandshardchains
tightlycoupled. Oncethehashofablo ckofashardchainisincorp orated
intoablo ckofthemasterchain,thatshardchainblo ckandallitsancestors
areconsideredcanonical,meaningthattheycanb ereferencedfromthesub-
sequentblo cksofallshardchainsassomethingxedandimmutable.Infact,
eachnewshardchainblo ckcontainsahashofthemostrecentmasterchain
blo ck,andallshardchainblo cksreferencedfromthatmasterchainblo ckare
consideredimmutablebythenewblo ck.
Essentially,thismeansthatatransactionoramessagecommittedina
shardchainblo ckmay b esafelyusedintheverynext blo cksofthe other
shardchains, withoutneeding to wait for, say, twenty conrmations (i.e.,
twentyblo cksgeneratedaftertheoriginalblo ckinthesameblo ckchain)b e-
foreforwardingamessageortakingotheractionsbasedonaprevioustrans-
action,asiscommoninmostprop osedlo osely-coupledsystems(cf.2.8.14),
suchasEOS.Thisabilitytousetransactionsandmessagesinothershard-
chainsamerevesecondsafterb eingcommittedisoneofthereasonswe
b elieveour tightly-coupled system, the rst of its kind,will b e ableto
deliverunprecedentedp erformance(cf.2.8.12and2.8.14).


```
2.1.TONBlockchainasaCollectionof2-Blockchains
```
2.1.14.Masterchainblo ckhashasaglobalstate.Accordingto2.1.13,
thehashofthelastmasterchainblo ckcompletelydeterminestheoverallstate
ofthesystemfromthep ersp ectiveofanexternalobserver.Onedo esnotneed
tomonitorthestateofallshardchainsseparately.

2.1.15. Generation ofnew blo cks by validators; cf.2.6. TheTON
Blo ckchainusesaPro of-of-Stake(PoS)approachforgeneratingnewblo cksin
theshardchainsandthemasterchain.Thismeansthatthereisasetof,say,
upto afewhundred validatorssp ecialno desthat havedep ositedstakes
(largeamounts ofTON coins)byasp ecial masterchaintransaction tob e
eligiblefornewblo ckgenerationandvalidation.
Thenasmallersubsetofvalidatorsisassignedtoeachshard(w,s)ina
deterministicpseudorandomway,changingapproximatelyevery 1024 blo cks.
Thissubsetofvalidatorssuggestsandreachesconsensusonwhatthenext
shardchainblo ckwouldb e,bycollectingsuitableprop osedtransactionsfrom
theclientsintonewvalidblo ckcandidates.Foreachblo ck,thereisapseudo-
randomlychosenorderonthevalidatorstodeterminewhoseblo ckcandidate
hasthehighestprioritytob ecommittedateachturn.
Validatorsandotherno descheckthevalidityoftheprop osedblo ckcandi-
dates;ifavalidatorsignsaninvalidblo ckcandidate,itmayb eautomatically
punishedbylosingpartorallofitsstake,orbyb eingsusp endedfromthe
setofvalidatorsforsometime. Afterthat,thevalidatorsshouldreachcon-
sensusonthechoiceofthenextblo ck,essentiallybyanecientvariantof
theBFT(ByzantineFaultTolerant;cf.2.8.4)consensusproto col,similarto
PBFT[4]orHoneyBadgerBFT[11]. Ifconsensusisreached,anewblo ck
iscreated,andvalidatorsdivideb etweenthemselvesthetransactionfeesfor
thetransactionsincluded,plussomenewly-created(minted)coins.
Eachvalidatorcanb eelectedtoparticipateinseveralvalidatorsubsets;
inthiscase,itisexp ectedtorunallvalidationandconsensusalgorithmsin
parallel.
Afterallnewshardchainblo cksaregeneratedoratimeoutispassed,a
newmasterchainblo ckisgenerated,includingthehashesofthelatestblo cks
ofallshardchains. ThisisdonebyBFTconsensusofal lvalidators.^2
MoredetailontheTONPoSapproachanditseconomicalmo delispro-
videdinsection2.6.

(^2) Actually,two-thirdsbystakeisenoughtoachieveconsensus,butaneortismadeto
collectasmanysignaturesasp ossible.


```
2.1.TONBlockchainasaCollectionof2-Blockchains
```
2.1.16.Forksofthemasterchain. Acomplicationthatarisesfromour
tightly-coupledapproachisthatswitchingtoadierentforkinthemaster-
chainwill almostnecessarily requireswitching toanother forkinat least
someoftheshardchains. Ontheotherhand,aslongastherearenoforks
inthemasterchain,noforksintheshardchainareevenp ossible,b ecauseno
blo cksinthealternativeforksoftheshardchainscanb ecomecanonicalby
havingtheirhashesincorp oratedintoamasterchainblo ck.
The generalruleisthat ifmasterchain blockB′ is apredecessor ofB,
B′includeshashHash(B′w,s)of(w,s)-shardchainblockBw,s′ ,andBincludes
hashHash(Bw,s),thenB′w,smustbeapredecessor ofBw,s;otherwise,the
masterchainblockBisinvalid.
We exp ectmasterchainforksto b erare, nextto non-existent,b ecause
inthe BFT paradigm adoptedby the TON Blo ckchain they canhapp en
onlyinthecaseofincorrectb ehaviorbyamajorityofvalidators(cf.2.6.
and2.6.15),whichwould imply signicantstake lossesby the oenders.
Therefore, no trueforksinthe shardchainsshouldb e exp ected. Instead,
ifaninvalidshardchainblo ckisdetected,itwillb ecorrectedbymeansof
theverticalblo ckchainmechanismofthe2-blo ckchain(cf.2.1.17),which
canachievethisgoalwithoutforkingthe horizontalblo ckchain(i.e.,the
shardchain). Thesamemechanismcanb eusedtoxnon-fatalmistakesin
themasterchainblo cksaswell.

2.1.17. Correcting invalid shardchain blo cks. Normally, only valid
shardchain blo cks will b e committed, b ecause validators assigned to the
shardchainmustreachatwo-thirdsByzantineconsensusb eforeanewblo ck
canb ecommitted. However,thesystemmustallowfordetectionofprevi-
ouslycommittedinvalidblo cksandtheircorrection.
Ofcourse,onceaninvalidshardchainblo ckisfoundeitherbyavalidator
(notnecessarilyassignedtothisshardchain)orbyasherman (anyno de
ofthesystemthatmadeacertaindep osittob eabletoraisequestionsab out
blo ckvalidity;cf.2.6.4)theinvalidityclaimanditspro ofarecommitted
intothemasterchain,andthevalidatorsthathavesignedtheinvalidblo ckare
punishedbylosingpartoftheirstakeand/orb eingtemp orarilysusp ended
fromthesetofvalidators(thelattermeasureisimp ortantforthecaseofan
attackerstealingtheprivatesigningkeysofanotherwiseb enignvalidator).
However, this isnotsucient,b ecausethe overallstateof thesystem
(TONBlo ckchain)turnsouttob einvalidb ecauseoftheinvalidshardchain
blo ckpreviouslycommitted.Thisinvalidblo ckmustb ereplacedbyanewer


```
2.1.TONBlockchainasaCollectionof2-Blockchains
```
validversion.
Mostsystemswouldachievethisbyrollingbacktothelastblo ckb efore
theinvalidoneinthisshardchainandthelastblo cksunaectedbymessages
propagated fromthe invalid blo ck ineach of the othershardchains, and
creatinganewforkfromtheseblo cks. Thisapproachhasthedisadvantage
that alargenumb erof otherwise correctandcommittedtransactions are
suddenlyrolledback,anditisunclearwhethertheywillb eincludedlaterat
all.
The TON Blo ckchain solves this problemby making each blo ck of
eachshardchain andofthe masterchain(horizontal blo ckchains)asmall
blo ckchain(verticalblo ckchain)by itself,containingdierentversions of
thisblo ck,ortheirdierences.Normally,theverticalblo ckchainconsists
ofexactly oneblo ck, andtheshardchainlo okslikeaclassical blo ckchain.
However,oncetheinvalidityofablo ckisconrmedandcommittedintoa
masterchainblo ck,theverticalblo ckchainoftheinvalidblo ckisallowedto
growbyanewblo ckintheverticaldirection,replacingoreditingtheinvalid
blo ck. Thenewblo ckisgenerated bythecurrentvalidatorsubsetforthe
shardchaininquestion.
Therulesforanewverticalblo cktob evalidarequitestrict. Inpar-
ticular,ifavirtualaccount-chainblo ck(cf.2.1.2)containedintheinvalid
blo ckisvalidbyitself,itmustb eleftunchangedbythenewverticalblo ck.
Onceanewverticalblo ckiscommittedontopoftheinvalidblo ck,its
hashispublishedinanewmasterchainblo ck(orratherinanewvertical
blo ck,lyingab ovetheoriginalmasterchainblo ckwherethehashoftheinvalid
shardchainblo ckwasoriginallypublished),andthechangesarepropagated
furthertoanyshardchainblo cksreferringtothepreviousversionofthisblo ck
(e.g.,thosehavingreceivedmessagesfromtheincorrectblo ck).Thisisxed
by committingnew vertical blo cksinverticalblo ckchains for all blo cks
previouslyreferringto theincorrect blo ck; newverticalblo ckswillrefer
tothe mostrecent(corrected)versionsinstead. Again, strictrulesforbid
changingaccount-chainsthat arenotreallyaected (i.e.,that receivethe
samemessagesasinthepreviousversion). Inthisway,xinganincorrect
blo ckgeneratesripples thatareultimatelypropagatedtowardsthe most
recentblo cksofallaectedshardchains;thesechangesarereectedinnew
verticalmasterchainblo cksaswell.
Oncethehistoryrewritingripplesreachthemostrecentblo cks,thenew
shardchainblo cksaregeneratedinoneversiononly,b eingsuccessorsofthe
newestblo ckversionsonly. Thismeansthattheywillcontainreferencesto


```
2.1.TONBlockchainasaCollectionof2-Blockchains
```
thecorrect(mostrecent)verticalblo cksfromtheveryb eginning.
Themasterchainstateimplicitlydenesamaptransformingthehashof
therstblo ckofeachverticalblo ckchainintothehashofitslatestversion.
Thisenablesaclienttoidentifyandlo cateanyverticalblo ckchainbythe
hashofitsveryrst(andusuallytheonly)blo ck.

2.1.18.TONcoinsandmulti-currencyworkchains.TheTONBlo ck-
chainsupp orts up to 232 dierent crypto currencies, coins, or tokens,
distinguishedbya32-bitcurrency_id. Newcrypto currenciescanb eadded
bysp ecialtransactionsinthemasterchain.Eachworkchainhasabasiccryp-
to currency,andcanhaveseveraladditionalcrypto currencies.
Thereisonesp ecialcrypto currencywithcurrency_id = 0,namely,the
TONcoin (cf.App endixA).Itisthe basic crypto currencyof Workchain
Zero.Itisalsousedfortransactionfeesandvalidatorstakes.
Inprinciple, otherworkchainsmay collecttransactionfeesinotherto-
kens. Inthiscase,somesmart contractforautomatedconversionofthese
transactionfeesintoTONcoinsshouldb eprovided.

2.1.19. Messaging and value transfer. Shardchainsb elongingto the
sameordierentworkchainsmaysendmessages toeachother. Whilethe
exactformofthemessagesalloweddep endsonthereceivingworkchainand
receivingaccount (smartcontract),therearesome commoneldsmaking
inter-workchainmessagingp ossible. Inparticular, eachmessagemayhave
somevalueattached,intheformofacertainamountofTONcoinsand/or
otherregisteredcrypto currencies,providedtheyaredeclaredasacceptable
crypto currenciesbythereceivingworkchain.
Thesimplestformofsuchmessagingisavaluetransferfromone(usually
notasmart-contract)accounttoanother.

2.1.20. TON Virtual Machine. The TON Virtual Machine, alsoab-
breviatedas TONVM or TVM, isthe virtual machine usedto execute
smart-contractco deinthemasterchainandinthebasicworkchain. Other
workchainsmayuseothervirtualmachinesalongsideorinsteadoftheTVM.
Herewelistsomeofitsfeatures. Theyarediscussedfurtherin2.3.12,
2.3.14andelsewhere.

```
 TVMrepresentsalldataas acollectionof(TVM) cel ls(cf.2.3.14).
Eachcellcontainsupto 128 databytesandupto 4 referencestoother
cells.Asaconsequenceoftheeverythingisabagofcells philosophy
```

```
2.1.TONBlockchainasaCollectionof2-Blockchains
```
```
(cf.2.5.14),thisenablesTVMtoworkwithalldatarelatedtotheTON
Blo ckchain,includingblo cksandblo ckchainglobalstateifnecessary.
```
 TVMcanworkwithvaluesofarbitraryalgebraicdatatyp es(cf.2.3.12),
representedastreesordirectedacyclicgraphsofTVMcells.However,
itisagnostictowardstheexistenceofalgebraicdatatyp es;itjustworks
withcells.

 TVMhasbuilt-insupp ortforhashmaps(cf.2.3.7).

 TVMisastackmachine. Itsstackkeepseither64-bitintegersorcell
references.

 64-bit,128-bitand256-bitarithmeticissupp orted. Alln-bitarithmetic
op erationscomeinthreeavors: forunsignedintegers,forsignedinte-
gersandforintegersmo dulo 2 n(noautomaticoverowchecksinthe
lattercase).

 TVMhasunsignedandsignedintegerconversionfromn-bittom-bit,
forall 0 ≤m,n≤ 256 ,withoverowchecks.

 Allarithmeticop erationsp erformoverowchecksbydefault,greatly
simplifyingthedevelopmentofsmartcontracts.

 TVMhasmultiply-then-shiftandshift-then-dividearithmeticop er-
ationswithintermediatevaluescomputedinalargerintegertyp e;this
simpliesimplementingxed-p ointarithmetic.

 TVMoerssupp ortforbitstringsandbytestrings.

 Supp ortfor256-bitEllipticCurveCryptography(ECC)forsomepre-
denedcurves,includingCurve25519,ispresent.

 Supp ortforWeilpairingsonsomeellipticcurves,usefulforfastimple-
mentationofzk-SNARKs,isalsopresent.

 Supp ortforp opularhashfunctions,includingsha256,ispresent.

 TVMcanworkwithMerklepro ofs(cf.5.1.9).

 TVMoerssupp ortforlargeorglobalsmartcontracts.Suchsmart
contractsmustb eawareofsharding(cf.2.3.18and2.3.16). Usual
(lo cal)smartcontractscanb esharding-agnostic.


### 2.2 GeneralitiesonBlo ckchains

```
 TVMsupp ortsclosures.
```
```
 AspinelesstaglessG-machine[13]canb eeasilyimplementedinside
TVM.
```
Severalhigh-levellanguages canb edesignedforTVM,inaddition tothe
TVMassembly.Alltheselanguageswillhavestatictyp esandwillsupp ort
algebraicdatatyp es.Weenvisionthefollowingp ossibilities:

```
 AJava-likeimp erativelanguage,witheachsmartcontractresembling
aseparateclass.
```
```
 Alazyfunctionallanguage(thinkofHaskell).
```
```
 Aneagerfunctionallanguage(thinkofML).
```
2.1.21. Congurable parameters. An imp ortant feature of the TON
Blo ckchainisthatmanyofitsparametersarecongurable. Thismeansthat
theyarepartofthemasterchainstate,andcanb echangedbycertainsp ecial
prop osal/vote/resulttransactionsinthemasterchain,withoutanyneedfor
hardforks. Changingsuch parameterswillrequirecollectingtwo-thirdsof
validatorvotesandmorethanhalfofthevotesofallotherparticipantswho
wouldcaretotakepartinthevotingpro cessinfavoroftheprop osal.

### 2.2 Generalities onBlo ckchains

2.2.1.Generalblo ckchain denition. Ingeneral,any(true)blockchain
isasequenceofblocks,eachblo ckBcontainingareferenceblk-prev(B)to
thepreviousblo ck(usuallybyincludingthehashofthepreviousblo ckinto
theheaderofthecurrentblo ck),andalistoftransactions.Eachtransaction
describ essometransformationoftheglobalblockchainstate;thetransactions
listedinablo ckareappliedsequentiallytocomputethenewstatestarting
fromthe oldstate,whichistheresultingstateafterthe evaluationofthe
previousblo ck.

2.2.2.RelevancefortheTONBlo ckchain.RecallthattheTONBlock-
chain is nota true blo ckchain, buta collection of 2-blo ckchains (i.e., of
blo ckchainsofblo ckchains;cf.2.1.1),sotheab oveisnotdirectlyapplicable
toit. However, westartwiththesegeneralitiesontrueblo ckchainstouse
themasbuildingblo cksforourmoresophisticatedconstructions.


```
2.2.GeneralitiesonBlockchains
```
2.2.3. Blo ckchaininstanceand blo ckchain typ e. Oneoftenusesthe
wordblockchain to denoteb oth ageneral blockchaintype andits sp ecic
blockchaininstances,denedassequencesofblo ckssatisfyingcertaincondi-
tions.Forexample,2.2.1referstoblo ckchaininstances.
Inthisway,ablo ckchaintyp eisusuallyasubtyp eofthetyp eBlock∗of
lists(i.e.,nitesequences)ofblo cks,consistingofthosesequencesofblo cks
thatsatisfycertaincompatibilityandvalidityconditions:

```
Blockchain⊂Block∗ (1)
```
Ab etterwaytodeneBlockchainwouldb etosaythatBlockchainisa
dependentcoupletype,consistingofcouples(B,v),withrstcomp onentB:
Block∗b eingoftyp eBlock∗(i.e.,alistofblo cks),andthesecondcomp onent
v:isValidBc(B)b eingapro oforawitnessofthevalidityofB.Inthisway,

```
Blockchain≡Σ(B:Block∗)isValidBc(B) (2)
```
Weuseherethenotationfordep endentsumsoftyp esb orrowedfrom[16].

2.2.4. Dep endenttyp e theory, Co qand TL.Note thatweareusing
(Martin-Löf )dep endenttyp etheoryhere,similartothatusedintheCo q^3
pro ofassistant.Asimpliedversionofdep endenttyp etheoryisalsousedin
TL(TypeLanguage),^4 whichwillb eusedintheformalsp ecicationofthe
TONBlo ckchaintodescrib etheserializationofalldatastructuresandthe
layoutsofblo cks,transactions,andthelike.
Infact,dep endenttyp etheorygivesausefulformalizationofwhatapro of
is,andsuchformalpro ofs(ortheirserializations)mightb ecomehandywhen
oneneedstoprovidepro ofofinvalidityforsomeblo ck,forexample.

2.2.5. TL,or theTyp e Language. SinceTL(Typ eLanguage)willb e
usedintheformalsp ecicationsofTONblo cks,transactions,andnetwork
datagrams,itwarrantsabriefdiscussion.
TLisalanguagesuitablefordescriptionof dep endentalgebraictypes,
whichareallowedto have numeric(natural)and typ eparameters. Each
typ eisdescrib edbymeansofseveralconstructors. Eachconstructorhasa
(human-readable)identierandaname,whichisabitstring(32-bitinteger
bydefault). Apartfromthat,thedenitionofaconstructorcontainsalist
ofeldsalongwiththeirtyp es.

(^3) https://coq.inria.fr
(^4) https://core.telegram.org/mtproto/TL


```
2.2.GeneralitiesonBlockchains
```
Acollectionofconstructorandtyp edenitionsiscalledaTL-scheme. It
isusuallykeptinoneorseveralleswiththesux.tl.
Animp ortantfeatureofTL-schemesisthattheydetermineanunambigu-
ouswayofserializinganddeserializingvalues(orob jects)ofalgebraictyp es
dened.Namely,whenavalueneedstob eserializedintoastreamofbytes,
rstthenameoftheconstructorusedforthisvalueisserialized.Recursively
computedserializationsofeacheldfollow.
ThedescriptionofapreviousversionofTL,suitableforserializingarbi-
traryob jectsintosequencesof32-bitintegers,isavailableathttps://core.
telegram.org/mtproto/TL. AnewversionofTL,calledTL-B,isb eingde-
velop edforthepurp oseofdescribingtheserializationofob jectsusedbythe
TONPro ject. Thisnewversioncanserializeob jectsintostreamsofbytes
andevenbits(notjust32-bitintegers),andoerssupp ortforserialization
intoatreeofTVMcells(cf.2.3.14). AdescriptionofTL-Bwillb eapart
oftheformalsp ecicationoftheTONBlo ckchain.

2.2.6. Blo cks and transactions asstate transformation op erators.
Normally,anyblo ckchain(typ e)Blockchainhasanasso ciatedglobalstate
(typ e)State, and a transaction (typ e)Transaction. The semantics of a
blo ckchainareto alargeextentdeterminedbythetransactionapplication
function:
ev_trans′:Transaction×State→State? (3)

HereX? denotes MaybeX,the resultofapplying theMaybemonad to
typ eX. Thisissimilartoouruseof X∗ forListX. Essentially,avalue
oftyp eX?iseitheravalueoftyp eX orasp ecialvalue ⊥indicatingthe
absenceofanactualvalue(thinkab outanullp ointer). Inourcase,weuse
State?insteadofStateastheresulttyp eb ecauseatransactionmayb einvalid
ifinvokedfromcertainoriginalstates(thinkab outattemptingtowithdraw
fromanaccountmoremoneythanitisactuallythere).
Wemightpreferacurriedversionofev_trans′:

```
ev_trans:Transaction→State→State? (4)
```
Becauseablo ckisessentiallyalistoftransactions,theblo ckevaluation
function
ev_block:Block→State→State? (5)

canb ederivedfromev_trans. Ittakesablo ckB:Blockandtheprevious
blo ckchainstates : State (whichmightinclude the hash of the previous


```
2.2.GeneralitiesonBlockchains
```
blo ck)andcomputesthenextblo ckchainstates′=ev_block(B)(s) :State,
whichiseitheratruestateor asp ecial value⊥ indicatingthatthe next
statecannotb ecomputed(i.e.,thattheblo ckisinvalidifevaluatedfromthe
startingstategivenforexample,theblo ckincludesatransactiontryingto
debitanemptyaccount.)

2.2.7.Blo cksequencenumb ers.Eachblo ckBintheblo ckchaincanb e
referredtobyitssequencenumberblk-seqno(B),startingfromzeroforthe
veryrstblo ck,andincrementedbyonewheneverpassingtothenextblo ck.
Moreformally,

```
blk-seqno(B) =blk-seqno
```
#### (

```
blk-prev(B)
```
#### )

#### + 1 (6)

Noticethatthesequencenumb erdo esnotidentifyablo ckuniquelyinthe
presenceofforks.

2.2.8.Blo ckhashes.Anotherwayofreferringtoablo ckBisbyitshash
blk-hash(B),whichisactuallythehashoftheheaderofblo ckB(however,
theheaderoftheblo ckusuallycontainshashesthatdep endonallcontentof
blo ckB). Assumingthattherearenocollisionsforthehashfunctionused
(oratleastthattheyareveryimprobable),ablo ckisuniquelyidentiedby
itshash.

2.2.9.Hashassumption. Duringformalanalysisofblo ckchainalgorithms,
weassumethatthereareno collisionsforthek-bithashfunctionHash:
Bytes∗→ 2 kused:

```
Hash(s) =Hash(s′)⇒s=s′ foranys,s′∈Bytes∗ (7)
```
HereBytes= { 0 ... 255 }= 28 isthetyp e of bytes,orthe setof allbyte
values,andBytes∗isthetyp eorsetofarbitrary(nite)listsofbytes;while
2 ={ 0 , 1 }isthebittyp e,and 2 kistheset(oractuallythetyp e)ofallk-bit
sequences(i.e.,ofk-bitnumb ers).
Ofcourse,(7)isimp ossiblemathematically,b ecauseamapfromanin-
nitesettoanitesetcannotb einjective.Amorerigorousassumptionwould
b e
∀s,s′:s 6 =s′,P

#### (

```
Hash(s) =Hash(s′)
```
#### )

```
= 2−k (8)
```
However,thisisnotsoconvenientforthepro ofs. If(8)isusedatmostN
timesinapro ofwith 2 −kN < forsomesmall(say,= 10−^18 ),wecan


### 2.3 Blo ckchainState,AccountsandHashmaps

reasonasif(7)weretrue,providedweacceptafailureprobability(i.e.,the
nalconclusionswillb etruewithprobabilityatleast 1 −).
Final remark: inorderto maketheprobabilitystatementof (8)really
rigorous,onemustintro duceaprobabilitydistributiononthesetBytes∗of
allbytesequences. Awayofdoingthisisbyassumingallbytesequences
ofthesamelengthlequiprobable,andsettingtheprobabilityofobservinga
sequenceoflengthlequaltopl−pl+1forsomep→ 1 −.Then(8)shouldb e
understo o dasalimitofconditionalprobabilityP

#### (

Hash(s) =Hash(s′)|s 6 =
s′

#### )

```
whenptendstoonefromb elow.
```
2.2.10.Hashusedfor theTONBlo ckchain. Weareusingthe256-bit
sha256hashfortheTONBlo ckchainforthetimeb eing. Ifitturnsoutto
b eweakerthanexp ected,itcanb ereplacedbyanotherhashfunctioninthe
future. Thechoiceofthehashfunctionisacongurableparameterofthe
proto col,soitcanb echangedwithouthardforksasexplainedin2.1.21.

### 2.3 Blo ckchainState, AccountsandHashmaps

Wehavenotedab ovethatanyblo ckchaindenesacertainglobalstate,and
eachblo ckandeachtransactiondenesatransformationofthisglobalstate.
Herewedescrib etheglobalstateusedbyTONblo ckchains.

2.3.1. AccountIDs. ThebasicaccountIDsusedbyTONblo ckchains
or at least by its masterchainand Workchain Zeroare256-bit integers,
assumedtob epublickeysfor256-bitEllipticCurveCryptography(ECC)
forasp ecicellipticcurve.Inthisway,

```
account_id:Account=uint 256 = 2256 (9)
```
HereAccount istheaccount type,whileaccount_id :Accountisasp ecic
variableoftyp eAccount.
OtherworkchainscanuseotheraccountIDformats,256-bitorotherwise.
Forexample,onecanuseBitcoin-styleaccountIDs,equaltosha256ofan
ECCpublickey.
However, the bit lengthl of an account ID must b exed during the
creationoftheworkchain(inthemasterchain),anditmustb eatleast64,
b ecausetherst 64 bitsofaccount_id areusedforshardingandmessage
routing.


```
2.3.BlockchainState,AccountsandHashmaps
```
2.3.2. Main comp onent: Hashmaps. Theprincipalcomp onentofthe
TONblo ckchainstateisahashmap. Insomecases weconsider(partially
dened)mapsh: 2 n99K 2 m. Moregenerally,wemightb einterestedin
hashmapsh: 2 n 99KX foracomp ositetyp eX. However, thesource(or
index)typ eisalmostalways 2 n.
Sometimes,wehaveadefaultvalue empty:X,andthehashmaph:
2 n→Xisinitializedbyitsdefaultvaluei7→empty.

2.3.3.Example:TONaccountbalances.Animp ortantexampleisgiven
byTONaccountbalances.Itisahashmap

```
balance:Account→uint 128 (10)
```
mappingAccount = 2256 intoaTONcoinbalanceof typ euint 128 = 2128.
Thishashmaphasadefaultvalueofzero,meaningthatinitially(b eforethe
rstblo ckispro cessed)thebalanceofallaccountsiszero.

2.3.4.Example:smart-contractp ersistentstorage. Anotherexample
isgivenby smart-contractp ersistentstorage,whichcanb e(veryapproxi-
mately)representedasahashmap

```
storage: 2256 99K 2256 (11)
```
Thishashmapalsohasadefaultvalueof zero,meaningthatuninitialized
cellsofp ersistentstorageareassumedtob ezero.

2.3.5.Example: p ersistentstorage ofallsmartcontracts. Because
wehavemorethanonesmart contract,distinguishedbyaccount_id,each
havingitsseparatep ersistentstorage,wemustactuallyhaveahashmap

```
Storage:Account99K( 2256 99K 2256 ) (12)
```
mappingaccount_idofasmartcontractintoitsp ersistentstorage.

2.3.6. Hashmap typ e. The hashmapis notjust anabstract (partially
dened)function 2 n99KX;ithasasp ecicrepresentation. Therefore,we
supp osethatwehaveasp ecialhashmaptyp e

```
Hashmap(n,X) :Type (13)
```
corresp ondingtoadatastructureenco dinga(partial)map 2 n99KX. We
canalsowrite
Hashmap(n:nat)(X:Type) :Type (14)


```
2.3.BlockchainState,AccountsandHashmaps
```
or
Hashmap:nat→Type→Type (15)

Wecanalwaystransformh:Hashmap(n,X)intoamaphget(h) : 2 n→X?.
Henceforth,weusuallywriteh[i]insteadofhget(h)(i):

```
h[i] :≡hget(h)(i) :X? foranyi: 2 n,h:Hashmap(n,X) (16)
```
2.3.7.Denition ofhashmaptyp easaPatriciatree. Logically,one
mightdeneHashmap(n,X)asan(incomplete)binarytreeofdepthnwith
edgelab els 0 and 1 andwithvaluesoftyp eXintheleaves.Anotherwayto
describ ethesamestructurewouldb easa(bitwise)trieforbinarystringsof
lengthequalton.
Inpractice, wepreferto usea compactrepresentationofthis trie,by
compressingeachvertexhavingonlyonechildwithitsparent. Theresult-
ingrepresentationisknownasaPatriciatree orabinaryradixtree. Each
intermediatevertexnowhasexactlytwochildren,lab eledbytwonon-empty
binarystrings,b eginningwithzerofortheleftchildandwithoneforthe
rightchild.
Inotherwords,therearetwotyp esof(non-ro ot)no desinaPatriciatree:

```
 Leaf(x),containingvaluexoftyp eX.
```
```
 Node(l,sl,r,sr),wherelisthe(referencetothe)leftchildorsubtree,
slisthebitstringlab elingtheedgeconnectingthisvertextoits left
child(alwaysb eginningwith0),r istherightsubtree, andsristhe
bitstringlab elingtheedgetotherightchild(alwaysb eginningwith1).
```
Athirdtyp eofno de,tob eusedonlyonceatthero otofthePatriciatree,
isalsonecessary:

```
 Root(n,s 0 ,t),where nisthe commonlengthof indexbitstrings of
Hashmap(n,X),s 0 isthecommonprexofallindexbitstrings,andt
isareferencetoaLeaforaNode.
```
Ifwewantto allowthePatriciatreetob eempty,afourthtyp e of(ro ot)
no dewouldb eused:

```
 EmptyRoot(n),wherenisthecommonlengthofallindexbitstrings.
```

```
2.3.BlockchainState,AccountsandHashmaps
```
```
WedenetheheightofaPatriciatreeby
height(Leaf(x)) = 0 (17)
height
```
#### (

```
Node(l,sl,r,sr)
```
#### )

```
=height(l) +len(sl) =height(r) +len(sr)
(18)
height
```
#### (

```
Root(n,s 0 ,t)
```
#### )

```
=len(s 0 ) +height(t) =n (19)
```
Thelasttwoexpressionsineachofthelasttwoformulasmustb eequal.We
usePatriciatreesofheightntorepresentvaluesoftyp eHashmap(n,X).
IfthereareN leavesinthetree(i.e.,ourhashmapcontainsN values),
thenthereareexactlyN− 1 intermediatevertices. Insertinganewvalue
alwaysinvolvessplittinganexisting edgebyinserting anewvertexinthe
middleandaddinganewleafastheotherchildofthisnewvertex.Deleting
avaluefromahashmapdo estheopp osite:aleafanditsparentaredeleted,
andtheparent'sparentanditsotherchildb ecomedirectlylinked.

2.3.8.Merkle-Patricia trees. Whenworkingwithblo ckchains,wewant
tob e abletocomparePatricia trees(i.e.,hash maps)andtheirsubtrees,
by reducingthemto a singlehash value. The classical wayof achieving
thisisgivenbytheMerkletree. Essentially,wewanttodescrib eawayof
hashingob jectshoftyp e Hashmap(n,X)withtheaidofahashfunction
Hashdenedforbinarystrings,providedweknowhowtocomputehashes
Hash(x)ofob jectsx:X(e.g., byapplyingthehashfunctionHashto a
binaryserializationofob jectx).
OnemightdeneHash(h)recursivelyasfollows:
Hash

#### (

```
Leaf(x)
```
#### )

```
:=Hash(x) (20)
Hash
```
#### (

```
Node(l,sl,r,sr)
```
#### )

```
:=Hash
```
#### (

```
Hash(l).Hash(r).code(sl).code(sr)
```
#### )

#### (21)

```
Hash
```
#### (

```
Root(n,s 0 ,t)
```
#### )

```
:=Hash
```
#### (

```
code(n).code(s 0 ).Hash(t)
```
#### )

#### (22)

Heres.tdenotestheconcatenationof(bit)stringssandt,andcode(s)is
aprexco deforallbitstringss. Forexample,onemightenco de 0 by10, 1
by11,andtheendofthestringby0.^5

(^5) Onecanshowthatthisenco dingisoptimalforapproximatelyhalfofalledgelab els
ofaPatriciatreewithrandomorconsecutiveindices.Remainingedgelab elsarelikelyto
b elong(i.e.,almost 256 bitslong).Therefore,anearlyoptimalenco dingforedgelab els
istousetheab oveco dewithprex 0 forshortbitstrings,andenco de1,thenninebits
containinglengthl=|s|ofbitstrings,andthenthelbitsofsforlongbitstrings(with
l≥ 10 ).


```
2.3.BlockchainState,AccountsandHashmaps
```
Wewillseelater(cf.2.3.12and2.3.14)thatthisisa(slightlytweaked)
versionofrecursivelydenedhashesforvaluesofarbitrary(dep endent)al-
gebraictyp es.

2.3.9.RecomputingMerkletreehashes.Thiswayofrecursivelyden-
ingHash(h),calledaMerkletreehash,hastheadvantagethat,ifoneexplic-
itlystoresHash(h′)alongwitheachno deh′(resultinginastructurecalleda
Merkletree,or,inourcase,aMerklePatriciatree),oneneedstorecompute
onlyatmostnhasheswhenanelementisaddedto,deletedfromorchanged
inthehashmap.
Inthisway, ifonerepresentstheglobalblo ckchainstateby asuitable
Merkletreehash,itiseasytorecomputethisstatehashaftereachtransac-
tion.

2.3.10. Merklepro ofs. Undertheassumption(7)ofinjectivity ofthe
chosenhashfunctionHash,onecanconstructapro ofthat,foragivenvalue
z ofHash(h), h:Hashmap(n,X),onehashget(h)(i) =xforsomei: 2 n
andx:X. Suchapro ofwillconsistofthepathintheMerklePatriciatree
fromtheleafcorresp ondingtoitothero ot,augmentedbythehashesofall
siblingsofallno deso ccurringonthispath.
Inthisway,alightno de^6 knowingonlythevalueofHash(h)forsome
hashmaph(e.g.,smart-contractp ersistentstorageorglobalblo ckchainstate)
mightrequestfromafullno de^7 notonlythevaluex=h[i] =hget(h)(i),but
suchavaluealongwithaMerklepro ofstartingfromthealreadyknownvalue
Hash(h). Then,underassumption(7),thelightno decancheckforitself
thatxisindeedthecorrectvalueofh[i].
Insomecases,theclientmaywanttoobtainthevaluey=Hash(x) =
Hash(h[i])insteadforexample, ifxitself isverylarge(e.g., ahashmap
itself ). ThenaMerklepro offor(i,y)canb eprovided instead. Ifxis a
hashmapas well,thenasecondMerklepro ofstartingfromy =Hash(x)
mayb eobtainedfromafullno de,toprovideavaluex[j] =h[i][j]orjustits
hash.

(^6) Alightnodeisano dethatdo esnotkeeptrackofthefullstateofashardchain;
instead,itkeepsminimalinformationsuchasthehashesoftheseveralmostrecentblo cks,
andreliesoninformationobtainedfromfullno deswhenitb ecomesnecessarytoinsp ect
somepartsofthefullstate.
(^7) Aful lnodeisano dekeepingtrackofthecompleteup-to-datestateoftheshardchain
inquestion.


```
2.3.BlockchainState,AccountsandHashmaps
```
2.3.11.Imp ortanceofMerklepro ofsforamulti-chainsystemsuch
asTON.Noticethatano denormallycannotb eafullno deforallshard-
chainsexistingintheTONenvironment. Itusuallyisafullno deonlyfor
someshardchainsforinstance,thosecontainingitsownaccount,asmart
contractitisinterestedin,orthosethatthisno dehasb eenassignedtob e
avalidatorof. Forothershardchains, itmustb ealightno deotherwise
thestorage,computingandnetworkbandwidthrequirementswouldb epro-
hibitive.Thismeansthatsuchano decannotdirectlycheckassertionsab out
thestateofothershardchains;itmustrelyonMerklepro ofsobtainedfrom
fullno desforthoseshardchains,whichisassafeascheckingbyitselfunless
(7)fails(i.e.,ahashcollisionisfound).

2.3.12.PeculiaritiesofTONVM.TheTONVMorTVM(TONVirtual
Machine),usedtorunsmartcontractsinthe masterchainandWorkchain
Zero,isconsiderablydierentfromcustomarydesignsinspiredbytheEVM
(EthereumVirtualMachine):itworksnotjustwith256-bitintegers,butac-
tuallywith(almost)arbitraryrecords,structures,orsum-pro ducttyp es,
makingitmoresuitabletoexecuteco dewritteninhigh-level(esp eciallyfunc-
tional)languages.Essentially,TVMusestaggeddatatyp es,notunlikethose
usedinimplementationsofPrologorErlang.
OnemightimaginerstthatthestateofaTVMsmartcontractisnot
justa hashmap 2256 → 2256 , or Hashmap(256, 2256 ), but(asarst step)
Hashmap(256,X),whereXisatyp ewithseveralconstructors,enablingit
tostore,apartfrom256-bitintegers,otherdatastructures,includingother
hashmapsHashmap(256,X)inparticular. Thiswouldmeanthatacellof
TVM(p ersistentortemp orary)storageoravariableoranelementofan
arrayinaTVMsmart-contractco demaycontainnotonlyaninteger,but
awholenewhashmap. Ofcourse,thiswouldmeanthatacellcontainsnot
just 256 bits,butalso,say,an8-bittag,describinghowthese 256 bitsshould
b einterpreted.
Infact, valuesdonot needto b eprecisely 256-bit. The valueformat
usedbyTVMconsistsof asequenceofrawbytesandreferencesto other
structures, mixed inarbitrary order, withsome descriptor bytesinserted
insuitablelo cationstob eabletodistinguishp ointersfromrawdata(e.g.,
stringsorintegers);cf.2.3.14.
Thisrawvalueformatmayb eusedtoimplementarbitrarysum-pro duct
algebraictyp es. Inthiscase,thevaluewouldcontainarawbyterst,de-
scribingtheconstructorb eingused(fromthep ersp ectiveof ahigh-level


```
2.3.BlockchainState,AccountsandHashmaps
```
language),andthenothereldsorconstructorarguments,consistingof
rawbytesandreferencestootherstructuresdep endingontheconstructor
chosen(cf.2.2.5).However,TVMdo esnotknowanythingab outthecorre-
sp ondenceb etweenconstructorsandtheirarguments; themixtureofbytes
andreferencesisexplicitlydescrib edbycertaindescriptorbytes.^8
The Merkle treehashing is extendedto arbitrary such structures: to
computethehashofsuchastructure,allreferencesarerecursivelyreplaced
byhashesofob jectsreferredto,andthenthehashoftheresultingbytestring
(descriptorbytesincluded)iscomputed.
Inthisway,theMerkletreehashingforhashmaps,describ edin2.3.8,is
justasp ecialcaseofhashingforarbitrary(dep endent)algebraicdatatyp es,
appliedtotyp eHashmap(n,X)withtwoconstructors.^9

2.3.13.PersistentstorageofTONsmartcontracts.Persistentstorage
ofaTON smartcontractessentiallyconsists ofits globalvariables,pre-
servedb etweencallstothesmartcontract. Assuch,itisjustapro duct,
tuple,orrecordtyp e,consistingofeldsofthecorrecttyp es,corresp ond-
ingtooneglobalvariableeach.Ifthereareto omanyglobalvariables,they
cannottintooneTONcellb ecauseoftheglobalrestrictiononTONcell
size.Insuchacase,theyaresplitintoseveralrecordsandorganizedintoa
tree,essentiallyb ecomingapro ductofpro ductsorpro ductofpro ductsof
pro ductstyp einsteadofjustapro ducttyp e.

2.3.14.TVMCells. Ultimately,theTONVMkeepsalldatainacollection
of(TVM)cel ls.Eachcellcontainstwodescriptorbytesrst,indicatinghow
manybytesofrawdataarepresentinthiscell(upto128)andhowmany
referencestoothercellsarepresent(uptofour).Thentheserawdatabytes
andreferencesfollow.Eachcellisreferencedexactlyonce,sowemighthave
includedineachcellareferencetoitsparent(theonlycellreferencingthis
one).However,thisreferenceneednotb eexplicit.
Inthisway,the p ersistentdatastoragecellsofaTONsmartcontract
areorganizedintoatree,^10 withareferencetothero otofthistreekeptin

(^8) Thesetwodescriptorbytes,presentinanyTVMcell,describ eonlythetotalnumb er
ofreferencesandthetotalnumb erofrawbytes;referencesarekepttogethereitherb efore
orafterallrawbytes.
(^9) Actually,LeafandNodeareconstructorsofanauxiliarytyp e,HashmapAux(n, X).
Typ eHashmap(n, X)hasconstructorsRootandEmptyRoot,withRootcontaininga
valueoftyp eHashmapAux(n, X).
(^10) Logically;thebagofcellsrepresentationdescrib edin2.5.5identiesallduplicate


```
2.3.BlockchainState,AccountsandHashmaps
```
thesmart-contractdescription.Ifnecessary,aMerkletreehashofthisentire
p ersistentstorageisrecursivelycomputed,startingfromtheleavesandthen
simplyreplacingallreferencesinacellwiththerecursivelycomputedhashes
of thereferenced cells,and subsequently computingthe hash of thebyte
stringthusobtained.

2.3.15.GeneralizedMerklepro ofsforvaluesofarbitraryalgebraic
typ es.BecausetheTONVMrepresentsavalueofarbitraryalgebraictyp e
bymeansofatreeconsistingof(TVM)cells,andeachcellhasawell-dened
(recursivelycomputed)Merklehash,dep endinginfactonthewholesubtree
ro otedinthiscell,wecanprovidegeneralizedMerklepro ofsfor(partsof )
valuesofarbitraryalgebraictyp es,intendedtoprovethatacertainsubtree
ofatreewithaknownMerklehashtakesasp ecicvalueoravaluewitha
sp ecichash. Thisgeneralizestheapproachof 2.3.10,whereonlyMerkle
pro ofsforx[i] =yhaveb eenconsidered.

2.3.16.Supp ortforshardinginTONVMdatastructures.Wehave
just outlinedhow the TON VM,without b eingoverlycomplicated, sup-
p ortsarbitrary(dep endent)algebraicdatatyp esinhigh-levelsmart-contract
languages. However, shardingoflarge(orglobal)smartcontractsrequires
sp ecial supp ort on the level of TON VM.To thisend, a sp ecial version
ofthehashmaptyp ehasb eenaddedtothesystem,amountingtoamap
Account99KX. ThismapmightseemequivalenttoHashmap(m,X),where
Account = 2 m. However, whenashardissplit intwo, or twoshardsare
merged,suchhashmapsareautomaticallysplitintwo,ormergedback,soas
tokeeponlythosekeysthatb elongtothecorresp ondingshard.

2.3.17. Paymentfor p ersistent storage. Anoteworthyfeature ofthe
TONBlo ckchain isthepaymentexactedfromsmartcontractsforstoring
theirp ersistentdata(i.e.,forenlargingthetotalstateoftheblo ckchain). It
worksasfollows:
Each blo ckdeclares two rates,nominated intheprincipal currencyof
theblo ckchain(usuallytheTONcoin):thepriceforkeepingonecellinthe
p ersistentstorage,andthepriceforkeepingonerawbyteinsomecellofthe
p ersistentstorage.Statisticsonthetotalnumb ersofcellsandbytesusedby
eachaccountarestoredaspartofitsstate,sobymultiplyingthesenumb ers
bythetworatesdeclaredintheblo ckheader,wecancomputethepayment

cells,transformingthistreeintoadirectedacyclicgraph(dag)whenserialized.


```
2.3.BlockchainState,AccountsandHashmaps
```
tob edeductedfromtheaccountbalance forkeepingits datab etweenthe
previousblo ckandthecurrentone.
However, paymentforp ersistentstorageusageisnotexactedforevery
accountandsmartcontractineachblo ck;instead,thesequencenumb erof
theblo ckwherethispaymentwaslastexactedisstoredintheaccountdata,
andwhenany actionisdonewiththe account(e.g., avalue transferor a
messageisreceivedandpro cessedbyasmartcontract),thestorageusage
paymentforall blo ckssincethe previoussuch paymentisdeducted from
theaccountbalanceb eforep erforminganyfurtheractions. Iftheaccount's
balancewouldb ecomenegativeafterthis,theaccountisdestroyed.
Aworkchain maydeclaresome numb erofrawdatabytesp eraccount
to b efree (i.e., notparticipatinginthe p ersistentstoragepayments) in
ordertomakesimpleaccounts,whichkeeponlytheirbalanceinoneortwo
crypto currencies,exemptfromtheseconstantpayments.
Noticethat,ifnob o dysendsanymessagestoanaccount,itsp ersistent
storagepaymentsarenotcollected,anditcanexistindenitely. However,
anyb o dycansend,forinstance,anemptymessagetodestroysuchanaccount.
Asmallincentive,collectedfrompartoftheoriginalbalanceoftheaccount
tob edestroyed,canb egiventothesenderofsuchamessage. Weexp ect,
however,thatthevalidatorswoulddestroysuchinsolventaccountsforfree,
simplytodecreasetheglobalblo ckchainstatesizeandtoavoidkeepinglarge
amountsofdatawithoutcomp ensation.
Paymentscollectedforkeepingp ersistentdataaredistributedamongthe
validatorsoftheshardchainorthemasterchain(prop ortionallytotheirstakes
inthelattercase).

2.3.18.Lo calandglobalsmartcontracts;smart-contractinstances.
Asmartcontractnormallyresidesjustinoneshard,selectedaccordingtothe
smartcontract'saccount_id,similarlytoanordinaryaccount.Thisisusu-
allysucientformostapplications. However,somehigh-load smartcon-
tractsmaywanttohaveaninstanceineachshardchainofsomeworkchain.
Toachievethis,theymustpropagatetheircreatingtransactionintoallshard-
chains,forinstance,bycommittingthistransactionintothero otshardchain
(w,∅)^11 oftheworkchainwandpayingalargecommission.^12

(^11) Amoreexp ensivealternativeistopublishsuchaglobalsmartcontractinthemas-
terchain.
(^12) Thisisasortofbroadcastfeatureforallshards,andassuch,itmustb equite
exp ensive.


```
2.3.BlockchainState,AccountsandHashmaps
```
This action eectivelycreates instancesof the smart contract ineach
shard, with separate balances. Originally, thebalance transferred inthe
creatingtransaction isdistributed simplyby giving theinstanceinshard
(w,s)the 2 −|s|partofthetotalbalance.Whenashardsplitsintotwochild
shards,balancesofallinstancesofglobalsmartcontractsaresplitinhalf;
whentwoshardsmerge,balancesareaddedtogether.
Insomecases,splitting/merginginstancesofglobalsmartcontractsmay
involve(delayed)executionofsp ecialmetho dsofthesesmartcontracts.By
default,the balances aresplit andmerged as describ edab ove, andsome
sp ecialaccount-indexedhashmapsarealsoautomaticallysplitandmerged
(cf.2.3.16).

2.3.19.Limitingsplittingofsmartcontracts.Aglobalsmartcontract
maylimititssplittingdepthdup onitscreation,inordertomakep ersistent
storageexp ensesmorepredictable.Thismeansthat,ifshardchain(w,s)with
|s|≥dsplitsintwo,onlyoneoftwonewshardchainsinheritsaninstanceof
thesmartcontract. Thisshardchainischosendeterministically: eachglobal
smartcontracthassomeaccount_id,whichisessentiallythehash ofits
creatingtransaction,anditsinstanceshavethesameaccount_id withthe
rst≤dbitsreplacedbysuitablevaluesneededtofallintothecorrectshard.
Thisaccount_idselectswhichshardwillinheritthesmart-contractinstance
aftersplitting.

2.3.20. Account/Smart-contract state. We cansummarizeallof the
ab oveto concludethat anaccount orsmart-contractstateconsists ofthe
following:

```
 Abalanceintheprincipalcurrencyoftheblo ckchain
```
```
 Abalanceinothercurrenciesoftheblo ckchain
```
```
 Smart-contractco de(oritshash)
```
```
 Smart-contractp ersistentdata(oritsMerklehash)
```
```
 Statisticsonthenumb erofp ersistentstoragecellsandrawbytesused
```
```
 Thelasttime(actually,themasterchainblo cknumb er)whenpayment
forsmart-contractp ersistentstoragewascollected
```

### 2.4 MessagesBetweenShardchains

```
 Thepublickeyneededtotransfercurrencyandsendmessagesfromthis
account(optional;bydefaultequaltoaccount_iditself ).Insomecases,
moresophisticatedsignaturecheckingco demayb elo catedhere,similar
towhatisdoneforBitcointransactionoutputs;thentheaccount_id
willb eequaltothehashofthisco de.
```
Wealsoneedtokeepsomewhere,eitherintheaccountstateorinsomeother
account-indexedhashmap,thefollowingdata:

```
 Theoutputmessagequeueoftheaccount(cf.2.4.17)
```
 Thecollectionof(hashesof )recentlydeliveredmessages(cf.2.4.23)
Notallofthesearereallyrequiredforeveryaccount;forexample,smart-
contractco deisneededonlyforsmartcontracts,butnotforsimple ac-
counts.Furthermore,whileanyaccountmusthaveanon-zerobalanceinthe
principalcurrency(e.g.,TONcoinsforthemasterchainandshardchainsof
thebasicworkchain),itmayhavebalancesofzeroinothercurrencies. In
ordertoavoidkeepingunuseddata,asum-pro ducttyp e(dep endingonthe
workchain)isdened(duringtheworkchain'screation),whichusesdierent
tagbytes(e.g.,TLconstructors;cf.2.2.5)todistinguishb etweendierent
constructorsused.Ultimately,theaccountstateisitselfkeptasacollection
ofcellsoftheTVMp ersistentstorage.

### 2.4 MessagesBetweenShardchains

Animp ortantcomp onentoftheTON Blo ckchainisthemessagingsystem
b etween blo ckchains. Theseblo ckchains may b eshardchainsof the same
workchain,orofdierentworkchains.

2.4.1.Messages,accountsandtransactions: abird'seyeviewofthe
system. Messagesaresentfromoneaccounttoanother. Eachtransaction
consistsofanaccountreceivingonemessage,changingitsstateaccordingto
certainrules,andgeneratingseveral(mayb eoneorzero)newmessagesto
otheraccounts. Eachmessageisgeneratedandreceived(delivered)exactly
once.
Thismeansthatmessagesplayafundamentalroleinthesystem,com-
parabletothatofaccounts(smartcontracts). Fromthep ersp ectiveofthe
InniteShardingParadigm(cf.2.1.2),eachaccountresidesinitsseparate
account-chain,andtheonlywayitcanaectthestateofsomeotheraccount
isbysendingamessage.


```
2.4.MessagesBetweenShardchains
```
2.4.2.Accountsaspro cessesoractors;Actormo del.Onemightthink
ab outaccounts(and smartcontracts) as pro cesses,or actors,that are
abletopro cessincomingmessages,changetheirinternalstateandgenerate
someoutb oundmessagesasaresult.Thisiscloselyrelatedtotheso-called
Actormodel,usedinlanguagessuchasErlang(however,actorsinErlangare
usuallycalledpro cesses). Sincenewactors(i.e.,smartcontracts)arealso
allowedtob ecreatedbyexistingactorsasaresultofpro cessinganinb ound
message,thecorresp ondencewiththeActormo delisessentiallycomplete.

2.4.3.Messagerecipient.Anymessagehasitsrecipient,characterizedby
thetargetworkchainidentierw(assumedbydefaulttob ethesameasthat
oftheoriginatingshardchain),andthe recipientaccountaccount_id. The
exactformat(i.e.,numb erofbits)ofaccount_iddep endsonw;however,the
shardisalwaysdeterminedbyitsrst(mostsignicant) 64 bits.

2.4.4. Messagesender. Inmostcases,amessagehasasender, charac-
terizedagainbya(w′,account_id′)pair. Ifpresent,itislo catedafterthe
messagerecipientandmessagevalue.Sometimes,thesenderisunimp ortant
oritissomeb o dyoutsidetheblo ckchain(i.e.,notasmartcontract),inwhich
casethiseldisabsent.
Noticethatthe Actormo deldo esnotrequirethemessagestohavean
implicitsender. Instead,messagesmaycontainareferencetotheActorto
whichananswertotherequestshouldb esent;usuallyitcoincideswiththe
sender.However,itisusefultohaveanexplicitunforgeablesendereldina
messageinacrypto currency(Byzantine)environment.

2.4.5. Messagevalue. Anotherimp ortant characteristicof amessageis
itsattachedvalue,inoneorseveralcrypto currenciessupp ortedb othbythe
sourceandbythetargetworkchain.Thevalueofthemessageisindicatedat
itsveryb eginningimmediatelyafterthemessagerecipient;itisessentiallya
listof(currency_id,value)pairs.
Noticethatsimple valuetransfersb etweensimple accountsarejust
empty(no-op)messageswithsome valueattachedtothem. Ontheother
hand,aslightlymorecomplicatedmessageb o dymightcontainasimpletext
orbinarycomment(e.g.,ab outthepurp oseofthepayment).

2.4.6. Externalmessages, ormessages fromnowhere. Somemes-
sagesarriveintothesystemfromnowherethatis,theyarenotgenerated
byanaccount(smartcontractornot)residingintheblo ckchain.Themost


```
2.4.MessagesBetweenShardchains
```
typical exampleariseswhenauserwantsto transfer somefundsfroman
accountcontrolledbyhertosomeotheraccount.Inthiscase,theusersends
amessagefromnowhere toherownaccount,requestingittogeneratea
messagetothereceivingaccount,carryingthesp eciedvalue. Ifthismes-
sageiscorrectlysigned,heraccountreceivesitandgeneratestherequired
outb oundmessages.
Infact,onemightconsiderasimpleaccountasasp ecialcaseofasmart
contractwithpredenedco de.Thissmartcontractreceivesonlyonetyp eof
message.Suchaninb oundmessagemustcontainalistofoutb oundmessages
tob egeneratedasaresultofdelivering(pro cessing)theinb oundmessage,
alongwithasignature. Thesmartcontractchecksthesignature,and,ifitis
correct,generatestherequiredmessages.
Of course, thereisa dierenceb etween messagesfromnowhere and
normalmessages,b ecausethemessagesfromnowhere cannotb earvalue,
sotheycannotpayfortheirgas(i.e.,theirpro cessing)themselves.Instead,
theyaretentativelyexecutedwithasmallgaslimitb eforeevenb eingsug-
gestedforinclusionina newshardchainblo ck; if theexecution fails(the
signatureisincorrect),themessagefromnowhereisdeemedincorrectand
isdiscarded.Iftheexecutiondo esnotfailwithinthesmallgaslimit,themes-
sagemayb eincludedinanewshardchainblo ckandpro cessedcompletely,
withthepaymentforthegas(pro cessingcapacity)consumedexactedfrom
thereceiver'saccount.Messagesfromnowherecanalsodenesometrans-
actionfeewhichisdeductedfromthereceiver'saccountontopofthegas
paymentforredistributiontothevalidators.
Inthissense,messagesfromnowhereor externalmessagestakethe
roleoftransactioncandidatesusedinotherblo ckchainsystems(e.g.,Bitcoin
andEthereum).

2.4.7.Logmessages,ormessagestonowhere.Similarly,sometimesa
sp ecialmessagecanb egeneratedandroutedtoasp ecicshardchainnotto
b edeliveredtoitsrecipient,buttob eloggedinordertob eeasilyobservable
byanyb o dyreceiving up datesab outtheshardinquestion. Theselogged
messagesmayb eoutputinauser'sconsole,ortriggeranexecutionofsome
scriptonano-chainserver. Inthissense,theyrepresenttheexternalout-
putoftheblo ckchainsup ercomputer,justasthemessagesfromnowhere
representtheexternalinputoftheblo ckchainsup ercomputer.

2.4.8.Interactionwitho-chainservicesandexternalblo ckchains.
Theseexternalinputandoutputmessagescanb eusedforinteractingwith


```
2.4.MessagesBetweenShardchains
```
o-chainservicesandother(external)blo ckchains,suchasBitcoinorEthe-
reum. Onemightcreatetokensorcrypto currenciesinsidetheTONBlo ck-
chainp eggedtoBitcoins,EthersoranyERC-20tokensdenedintheEthe-
reumblo ckchain,andusemessagesfromnowhereandmessagestonowhere,
generated andpro cessedby scriptsresidingon some third-partyo-chain
servers,toimplementthenecessaryinteractionb etweentheTONBlo ckchain
andtheseexternalblo ckchains.

2.4.9. Message b o dy. The messagebody issimplyasequenceofbytes,
themeaningofwhichisdeterminedonlybythereceivingworkchainand/or
smartcontract. Forblo ckchainsusingTONVM,thiscould b etheserial-
izationofanyTVMcell,generatedautomaticallyviatheSend()op eration.
Suchaserializationisobtainedsimplybyrecursivelyreplacingallreferences
inaTONVMcellwiththecellsreferredto.Ultimately,astringofrawbytes
app ears,whichisusuallyprep endedbya4-bytemessagetyp eormessage
constructor,usedtoselectthecorrectmetho dofthereceivingsmartcon-
tract.
Anotheroptionwouldb etouseTL-serializedob jects(cf.2.2.5)asmes-
sageb o dies. This mightb eesp ecially usefulfor communicationb etween
dierentworkchains,oneorb othofwhicharenotnecessarilyusingtheTON
VM.

2.4.10. Gas limit and other workchain/VM-sp ecic parameters.
Sometimesamessageneedsto carryinformation ab outthegaslimit, the
gasprice,transactionfeesandsimilarvaluesthatdep endonthereceiving
workchainandarerelevantonlyforthereceivingworkchain,butnotnecessar-
ilyfortheoriginatingworkchain.Suchparametersareincludedinorb efore
themessageb o dy,sometimes(dep endingontheworkchain)withsp ecial4-
byteprexesindicatingtheirpresence(whichcanb edenedbyaTL-scheme;
cf.2.2.5).

2.4.11.Creatingmessages: smartcontractsandtransactions.There
aretwosourcesofnewmessages. Mostmessagesarecreatedduringsmart-
contractexecution(viatheSend()op erationinTONVM),whensomesmart
contract isinvoked to pro cessan incoming message. Alternatively, mes-
sagesmaycomefromtheoutsideasexternalmessagesormessagesfrom
nowhere(cf.2.4.6).^13

(^13) Theab oveneedstob eliterallytrueonlyforthebasicworkchainanditsshardchains;
otherworkchainsmayprovideotherwaysofcreatingmessages.


```
2.4.MessagesBetweenShardchains
```
2.4.12.Deliveringmessages. Whenamessagereachestheshardchaincon-
tainingitsdestinationaccount,^14 itisdeliveredtoitsdestinationaccount.
Whathapp ensnextdep endsontheworkchain;fromanoutsidep ersp ective,
itisimp ortantthatsuchamessagecanneverb eforwardedfurtherfromthis
shardchain.
Forshardchainsofthebasic workchain,deliveryconsistsinaddingthe
messagevalue(minusanygaspayments)tothebalanceofthereceivingac-
count,andp ossiblyininvokingamessage-dep endentmetho dofthereceiving
smartcontractafterwards,ifthereceivingaccountisasmartcontract. In
fact,asmartcontracthasonlyoneentryp ointforpro cessingallincoming
messages, anditmust distinguishb etween dierent typ esof messagesby
lo okingat theirrst fewbytes(e.g., the rstfour bytescontaininga TL
constructor;cf.2.2.5).

2.4.13.Deliveryofamessageisatransaction.Becausethedeliveryof
amessagechangesthestateofanaccountorsmartcontract,itisasp ecial
transactioninthereceivingshardchain,andisexplicitlyregisteredassuch.
Essentially,al lTONBlo ckchaintransactionsconsistinthedeliveryofone
inb oundmessagetoitsreceivingaccount(smartcontract),neglectingsome
minortechnicaldetails.

2.4.14. Messages b etween instances of the same smart contract.
Recallthatasmartcontractmayb elocal(i.e.,residinginoneshardchainas
anyordinaryaccountdo es)orglobal(i.e.,havinginstancesinallshards,or
atleastinallshardsuptosomeknowndepthd;cf.2.3.18). Instancesofa
globalsmartcontractmayexchangesp ecialmessagestotransferinformation
andvalue b etweeneach otherifrequired. Inthiscase, the(unforgeable)
senderaccount_idb ecomesimp ortant(cf.2.4.4).

2.4.15.Messagestoanyinstanceofasmartcontract;wildcardad-
dresses.Sometimesamessage(e.g.,aclientrequest)needsb edeliveredto
anyinstanceofaglobalsmartcontract,usuallytheclosestone(ifthereisone
residinginthesameshardchainasthesender,itistheobviouscandidate).
Onewayof doingthisisbyusingawildcard recipientaddress, withthe
rstdbitsofthedestinationaccount_idallowedtotakearbitraryvalues. In
practice,onewillusuallysetthesedbitstothesamevaluesasinthesender's
account_id.

(^14) Asadegeneratecase,thisshardchainmaycoincidewiththeoriginatingshardchain
forexample,ifweareworkinginsideaworkchainwhichhasnotyetb eensplit.


```
2.4.MessagesBetweenShardchains
```
2.4.16. Input queue is absent. Allmessagesreceivedby ablo ckchain
(usuallyashardchain; sometimes themasterchain)or, essentially, by an
account-chainresidinginsidesomeshardchainareimmediatelydelivered
(i.e.,pro cessedbythereceivingaccount).Therefore,thereisnoinputqueue
assuch. Instead,ifnotallmessagesdestinedforasp ecicshardchaincan
b epro cessedb ecauseoflimitationsonthetotalsizeofblo cksandgasusage,
some messagesaresimplyleftto accumulateintheoutput queuesof the
originatingshardchains.

2.4.17. Output queues. Fromthe p ersp ective of the InniteSharding
Paradigm(cf.2.1.2),eachaccount-chain(i.e.,eachaccount)hasitsownout-
putqueue,consistingofallmessagesithasgenerated,butnotyetdelivered
totheirrecipients. Ofcourse,account-chainshaveonlyavirtualexistence;
theyaregroup edintoshardchains,andashardchainhasanoutputqueue,
consistingoftheunionoftheoutputqueuesofallaccountsb elongingtothe
shardchain.
Thisshardchainoutputqueueimp osesonlypartialorderonitsmemb er
messages.Namely,amessagegeneratedinaprecedingblo ckmustb edeliv-
eredb eforeanymessagegeneratedinasubsequentblo ck,andanymessages
generated bythe sameaccount andhavingthesame destinationmustb e
deliveredintheorderoftheirgeneration.

2.4.18. Reliableand fast inter-chain messaging. Itisof paramount
imp ortanceforascalablemulti-blo ckchainpro jectsuchasTONtob eableto
forwardanddelivermessagesb etweendierentshardchains(cf.2.1.3),even
iftherearemillionsoftheminthesystem.Themessagesshouldb edelivered
reliably(i.e.,messagesshouldnotb elostordeliveredmorethanonce)and
quickly. TheTONBlo ckchainachievesthisgoalbyusingacombinationof
twomessageroutingmechanisms.

2.4.19.Hyp ercub erouting:slowpath formessageswithassured
delivery. TheTON Blo ckchain useshyp ercub erouting as aslow, but
safeandreliablewayofdeliveringmessagesfromoneshardchaintoanother,
usingseveralintermediateshardchainsfortransitifnecessary.Otherwise,the
validatorsofanygivenshardchainwouldneedtokeeptrackofthestateof
(theoutputqueuesof )allothershardchains,whichwouldrequireprohibitive
amountsofcomputingp owerandnetworkbandwidthasthetotalquantity
ofshardchainsgrows,thuslimitingthescalabilityofthesystem. Therefore,
itisnotp ossibletodelivermessagesdirectlyfromanyshardtoeveryother.


```
2.4.MessagesBetweenShardchains
```
Instead,each shard isconnected onlyto shardsdieringinexactly one
hexadecimaldigitoftheir(w,s)shardidentiers(cf.2.1.8).Inthisway,all
shardchainsconstituteahyp ercub e graph,andmessagestravelalongthe
edgesofthishyp ercub e.
Ifamessageissenttoasharddierentfromthecurrentone,oneofthe
hexadecimaldigits(chosendeterministically)ofthecurrentshardidentier
isreplacedbythecorresp ondingdigitofthetargetshard,andtheresulting
identierisusedastheproximatetargettoforwardthemessageto.^15
Themainadvantageofhyp ercub eroutingisthattheblo ckvaliditycon-
ditionsimplythatvalidatorscreatingblo cksofashardchainmustcollectand
pro cessmessagesfromtheoutputqueuesof neighb oringshardchains,on
painoflosingtheirstakes.Inthisway,anymessagecanb eexp ectedtoreach
itsnaldestinationso onerorlater;amessagecannotb elostintransitor
deliveredtwice.
Noticethathyp ercub eroutingintro ducessomeadditionaldelaysandex-
p enses,b ecauseofthenecessitytoforwardmessagesthroughseveralinterme-
diateshardchains. However,thenumb eroftheseintermediateshardchains
growsveryslowly,asthelogarithmlogN(moreprecisely,dlog 16 Ne− 1 )of
thetotal numb erof shardchainsN. Forexample, ifN ≈ 250 , therewill
b eatmostoneintermediatehop;andforN ≈ 4000 shardchains,at most
two. Withfourintermediatehops,wecansupp ortuptoonemillionshard-
chains.Wethinkthisisaverysmallpricetopayfortheessentiallyunlimited
scalabilityofthesystem.Infact,itisnotnecessarytopayeventhisprice:

2.4.20. Instant Hyp ercub eRouting: fast path for messages. A
novelfeatureoftheTONBlo ckchainisthatitintro ducesafastpathfor
forwardingmessagesfromoneshardchaintoanyother,allowinginmostcases
tobypasstheslowhyp ercub eroutingof2.4.19altogetheranddeliverthe
messageintotheverynextblo ckofthenaldestinationshardchain.
Theideaisasfollows.Duringtheslowhyp ercub erouting,themessage
travels(inthenetwork)alongtheedgesofthehyp ercub e,butitisdelayed
(forapproximatelyveseconds)ateachintermediatevertextob ecommitted
intothecorresp ondingshardchainb eforecontinuingitsvoyage.
Toavoidunnecessarydelays,onemightinsteadrelaythemessagealong
withasuitableMerklepro ofalongtheedgesofthehyp ercub e,withoutwait-

(^15) Thisisnotnecessarilythenalversionofthealgorithmusedtocomputethenexthop
forhyp ercub erouting.Inparticular,hexadecimaldigitsmayb ereplacedbyr-bitgroups,
withracongurableparameter,notnecessarilyequaltofour.


```
2.4.MessagesBetweenShardchains
```
ingtocommititintotheintermediateshardchains.Infact,thenetworkmes-
sageshouldb eforwardedfromthevalidatorsofthetaskgroup(cf.2.6.8)
oftheoriginalshardtothedesignatedblo ckpro ducer(cf.2.6.9)ofthetask
group ofthedestinationshard;thismightb edonedirectlywithoutgoing
alongtheedgesofthehyp ercub e.WhenthismessagewiththeMerklepro of
reachesthevalidators(moreprecisely,thecollators;cf.2.6.5)ofthedestina-
tionshardchain,theycancommititintoanewblo ckimmediately,without
waitingforthemessagetocompleteitstravelalongtheslowpath.Thena
conrmationofdeliveryalongwithasuitableMerklepro ofissentbackalong
thehyp ercub eedges,anditmayb eusedtostopthetravelofthemessage
alongtheslowpath,bycommittingasp ecialtransaction.
Notethatthisinstantdeliverymechanismdo esnotreplacetheslow
butfailpro ofmechanismdescrib edin2.4.19.Theslowpathisstillneeded
b ecausethevalidatorscannotb epunishedforlosingorsimplydecidingnot
tocommitthefastpathmessagesintonewblo cksoftheirblo ckchains.^16
Therefore,b othmessageforwardingmetho dsareruninparallel,andthe
slowmechanismisab ortedonlyifapro ofofsuccessofthefastmechanism
iscommittedintoanintermediateshardchain.^17

2.4.21.Collectinginputmessagesfromoutputqueuesofneighb or-
ingshardchains. Whenanewblo ckforashardchainisprop osed,some
oftheoutputmessagesoftheneighb oring(inthesenseoftheroutinghy-
p ercub e of 2.4.19)shardchainsareincluded inthe new blo ckas input
messagesandimmediatelydelivered(i.e.,pro cessed). Therearecertainrules
astotheorderinwhichtheseneighb ors'outputmessagesmustb epro cessed.
Essentially,anoldermessage(comingfromashardchainblo ckreferringto
anoldermasterchainblo ck)mustb edeliveredb eforeanynewer message;
andformessagescomingfromthesameneighb oringshardchain,thepartial
orderoftheoutputqueuedescrib edin2.4.17mustb eobserved.

2.4.22.Deletingmessagesfromoutputqueues. Onceanoutputqueue
messageisobservedashavingb eendeliveredbyaneighb oringshardchain,
itisexplicitlydeletedfromtheoutputqueuebyasp ecialtransaction.

(^16) However,thevalidatorshavesomeincentivetodosoasso onasp ossible,b ecausethey
willb eabletocollectallforwardingfeesasso ciatedwiththemessagethathavenotyet
b eenconsumedalongtheslowpath.
(^17) Infact,onemighttemp orarilyorp ermanentlydisabletheinstantdeliverymecha-
nismaltogether,andthesystemwouldcontinueworking,alb eitmoreslowly.


```
2.4.MessagesBetweenShardchains
```
2.4.23. Preventing double deliveryof messages. Toprevent double
deliveryofmessagestakenfromtheoutputqueuesoftheneighb oringshard-
chains,eachshardchain(moreprecisely,eachaccount-chaininsideit)keeps
thecollectionofrecentlydeliveredmessages(orjusttheirhashes)aspartof
itsstate. Whenadeliveredmessageisobservedtob edeletedfromtheout-
putqueuebyitsoriginatingneighb oringshardchain(cf.2.4.22),itisdeleted
fromthecollectionofrecentlydeliveredmessagesaswell.

2.4.24. Forwarding messagesintendedfor other shardchains. Hy-
p ercub erouting(cf.2.4.19)meansthatsometimesoutb oundmessagesare
deliverednottotheshardchaincontainingtheintendedrecipient,buttoa
neighb oringshardchainlyingonthehyp ercub epathtothedestination. In
thiscase,deliveryconsistsinmovingtheinb oundmessagetotheoutb ound
queue.Thisisreectedexplicitlyintheblo ckasasp ecialforwardingtrans-
action,containingthemessageitself.Essentially,thislo oksasifthemessage
hadb eenreceivedbysomeb o dyinsidetheshardchain,andoneidenticalmes-
sagehadb eengeneratedasresult.

2.4.25. Payment for forwarding and keeping amessage. The for-
wardingtransactionactuallysp endssomegas(dep endingonthesizeofthe
messageb eingforwarded),soagaspaymentisdeductedfromthevalueof
themessageb eingforwardedonb ehalfofthevalidatorsofthisshardchain.
Thisforwardingpaymentisnormallyconsiderablysmallerthanthegaspay-
mentexactedwhenthemessageisnallydeliveredtoitsrecipient,evenif
themessagehasb eenforwardedseveraltimesb ecauseofhyp ercub erouting.
Furthermore,aslongasamessageiskeptintheoutputqueueofsomeshard-
chain,itispartoftheshardchain'sglobalstate,soapaymentforkeeping
globaldataforalongtimemayb ealsocollectedbysp ecialtransactions.

2.4.26.Messagestoandfromthemasterchain. Messagescanb esent
directlyfromanyshardchaintothemasterchain,andviceversa. However,
gaspricesforsendingmessagestoandforpro cessingmessagesinthemaster-
chainarequitehigh,sothisabilitywillb eusedonlywhentrulynecessary
for example, by the validators to dep osittheir stakes. Insome cases, a
minimaldep osit(attachedvalue)formessagessenttothemasterchainmay
b edened,whichisreturnedonlyifthemessageisdeemedvalid bythe
receivingparty.
Messagescannot b eautomaticallyroutedthrough themasterchain. A
messagewithworkchain_id 6 =− 1 (− 1 b eingthesp ecialworkchain_idindi-


### 2.5 GlobalShardchainState.BagofCellsPhilosophy.

catingthemasterchain)cannotb edeliveredtothemasterchain.
Inprinciple,onecancreateamessage-forwardingsmartcontractinside
themasterchain,butthepriceofusingitwouldb eprohibitive.

2.4.27.Messagesb etweenaccountsinthesameshardchain.Insome
cases,amessageisgeneratedbyanaccountb elongingtosomeshardchain,
destinedtoanotheraccountinthesameshardchain. Forexample,thishap-
p ensinanew workchainwhichhasnot yetsplit intoseveralshardchains
b ecausetheloadismanageable.
Suchmessagesmightb eaccumulatedintheoutputqueueoftheshard-
chainandthenpro cessedasincomingmessagesinsubsequentblo cks(any
shardisconsideredaneighb orofitselfforthispurp ose). However,inmost
cases itisp ossible to deliverthese messageswithinthe originatingblo ck
itself.
Inordertoachievethis, apartialorderisimp osed onall transactions
includedinashardchainblo ck,andthetransactions(eachconsistinginthe
deliveryofamessagetosomeaccount)arepro cessedresp ectingthispartial
order.Inparticular,atransactionisallowedtopro cesssomeoutputmessage
ofaprecedingtransactionwithresp ecttothispartialorder.
Inthiscase,themessageb o dyisnotcopiedtwice.Instead,theoriginating
andthepro cessingtransactionsrefertoasharedcopyofthemessage.

### 2.5 Global Shardchain State. Bag of CellsPhilosophy.

Nowwearereadytodescrib etheglobalstateof aTONblo ckchain,orat
leastofashardchainofthebasicworkchain.
We start withahigh-level or logical description, whichconsists in
sayingthattheglobalstateisavalueofalgebraictyp eShardchainState.

2.5.1.Shardchainstateasacollectionofaccount-chainstates. Ac-
cordingtotheInniteShardingParadigm(cf.2.1.2),anyshardchainisjust
a(temp orary)collectionofvirtualaccount-chains,containingexactlyone
accounteach.Thismeansthat,essentially,theglobalshardchainstatemust
b eahashmap

```
ShardchainState:= (Account99KAccountState) (23)
```
whereallaccount_idapp earingasindicesofthishashmapmustb eginwith
prexs,ifwearediscussingthestateofshard(w,s)(cf.2.1.8).


```
2.5.GlobalShardchainState. BagofCellsPhilosophy.
```
Inpractice,wemightwanttosplitAccountStateintoseveralparts(e.g.,
keeptheaccountoutputmessagequeueseparatetosimplifyitsexamination
bytheneighb oringshardchains),andhaveseveralhashmaps(Account99K
AccountStateParti)insidetheShardchainState. Wemightalsoaddasmall
numb erofglobalorintegralparameterstotheShardchainState,(e.g.,the
totalbalanceofallaccountsb elongingtothisshard,orthetotalnumb erof
messagesinalloutputqueues).
However,(23)isago o drstapproximationofwhattheshardchainglobal
statelo okslike,atleastfromalogical(high-level)p ersp ective.Theformal
descriptionofalgebraictyp esAccountStateandShardchainStatecanb edone
withtheaidofaTL-scheme(cf.2.2.5),tob eprovidedelsewhere.

2.5.2.Splittingandmergingshardchainstates. NoticethattheInnite
ShardingParadigmdescriptionoftheshardchainstate(23)showshowthis
stateshouldb epro cessedwhenshardsaresplitormerged. Infact,these
statetransformationsturnouttob everysimpleop erationswithhashmaps.

2.5.3.Account-chainstate. The(virtual)account-chainstateisjustthe
stateofoneaccount,describ edbytyp eAccountState. Usuallyithasallor
someoftheeldslistedin2.3.20,dep endingonthesp ecicconstructorused.

2.5.4.Globalworkchainstate.Similarlyto(23),wemaydenetheglobal
workchainstatebythesameformula,butwithaccount_id'sallowedtotake
anyvalues,notjustthoseb elongingtooneshard.Remarkssimilartothose
madein2.5.1applyinthiscaseaswell:wemightwanttosplitthishashmap
intoseveralhashmaps,andwemightwanttoaddsomeintegralparameters
suchasthetotalbalance.
Essentially,theglobalworkchainstatemust b egivenbythesametyp e
ShardchainStateastheshardchainstate,b ecauseitistheshardchainstate
wewouldobtainifallexistingshardchainsofthisworkchainsuddenlymerged
intoone.

2.5.5.Low-levelp ersp ective: bag ofcells. Thereisalow-levelde-
scriptionof theaccount-chain orshardchainstateas well,complementary
tothehigh-leveldescriptiongivenab ove. Thisdescriptionisquiteimp or-
tant,b ecauseitturnsouttob eprettyuniversal,providingacommonbasis
forrepresenting, storing,serializingandtransferringbynetworkalmostall
datausedbytheTONBlo ckchain(blo cks,shardchainstates,smart-contract
storage,Merklepro ofs,etc.). Atthesametime,suchauniversallow-level


```
2.5.GlobalShardchainState. BagofCellsPhilosophy.
```
description,onceundersto o dandimplemented,allowsustoconcentrateour
attentiononthehigh-levelconsiderationsonly.
RecallthattheTVMrepresentsvaluesofarbitraryalgebraictyp es(in-
cluding,forinstance,ShardchainStateof (23))bymeansofatreeofTVM
cel ls,orcel lsforshort(cf.2.3.14and2.2.5).
Anysuchcellconsistsoftwodescriptorbytes,deningcertainagsand
values 0 ≤b≤ 128 ,thequantityofrawbytes,and 0 ≤c≤ 4 ,thequantity
ofreferencestoothercells.Thenbrawbytesandccellreferencesfollow.^18
Theexactformatofcellreferencesdep endsontheimplementationandon
whetherthecellislo catedinRAM,ondisk,inanetworkpacket,inablo ck,
andsoon. Ausefulabstractmo delconsistsinimaginingthatallcellsare
keptincontent-addressablememory,withtheaddressofacellequaltoits
(sha256)hash. Recallthatthe(Merkle)hashofacelliscomputedexactly
byreplacingthereferencestoitschildcellsbytheir(recursivelycomputed)
hashesandhashingtheresultingbytestring.
Inthisway,ifweusecellhashestoreferencecells(e.g.,insidedescriptions
ofothercells),thesystemsimpliessomewhat,andthehashofacellstarts
tocoincidewiththehashofthebytestringrepresentingit.
NowweseethatanyobjectrepresentablebyTVM,theglobalshardchain
stateincluded,canberepresentedasabagofcel lsi.e.,acol lectionofcel ls
alongwith aroot referencetoone ofthem (e.g., byhash). Noticethat
duplicatecellsareremovedfromthisdescription(thebagofcells isaset
ofcells,notamultiset ofcells), so theabstracttreerepresentationmight
actuallyb ecomeadirectedacyclicgraph(dag)representation.
OnemightevenkeepthisstateondiskinaB-orB+-tree,containingall
cellsinquestion(mayb ewithsomeadditionaldata,suchassubtreeheightor
referencecounter),indexedbycellhash. However,anaiveimplementation
ofthisideawouldresultinthestateofonesmartcontractb eingscattered
amongdistantpartsofthediskle,somethingwewouldratheravoid.^19

(^18) Onecanshowthat,ifMerklepro ofsforalldatastoredinatreeofcellsareneeded
equallyoften,oneshouldusecellswithb+ch≈2(h+r)tominimizeaverageMerklepro of
size,whereh= 32isthehashsizeinbytes,andr≈ 4 isthebytesizeofacellreference.
Inotherwords,acellshouldcontaineithertworeferencesandafewrawbytes,orone
referenceandab out 36 rawbytes,ornoreferencesatallwith 72 rawbytes.
(^19) Ab etterimplementationwouldb etokeepthestateofthesmartcontractasaserialized
string,ifitissmall,orinaseparateB-tree,ifitislarge;thenthetop-levelstructure
representingthestateofablo ckchainwouldb eaB-tree,whoseleavesareallowedto
containreferencestootherB-trees.


```
2.5.GlobalShardchainState. BagofCellsPhilosophy.
```
Nowwearegoingtoexplaininsomedetailhowalmostallob jectsusedby
theTONBlo ckchaincanb erepresentedasbagsofcells,thusdemonstrating
theuniversalityofthisapproach.

2.5.6.Shardchain blo ckasabag ofcells. Ashardchainblo ckitself
canb ealsodescrib edby analgebraictyp e,andstoredas abagof cells.
Thenanaivebinaryrepresentationoftheblo ckmayb eobtainedsimplyby
concatenatingthebytestringsrepresentingeachofthecellsinthebagof
cells,inarbitraryorder. Thisrepresentationmightb eimprovedandopti-
mized,forinstance,byprovidingalistofosetsofallcellsattheb eginning
oftheblo ck,andreplacinghashreferencestoothercellswith32-bitindices
inthislistwhenever p ossible. However, oneshould imaginethatablo ck
isessentiallyabagofcells,andallothertechnicaldetailsarejustminor
optimizationandimplementationissues.

2.5.7.Up datetoanob jectasabagofcells.Imaginethatwehavean
oldversionofsomeob jectrepresentedasabagofcells,andthatwewant
torepresentanewversionofthesameob ject,supp osedlynotto odierent
fromthepreviousone.Onemightsimplyrepresentthenewstateasanother
bagof cells withits ownro ot, andremovefrom it al lcel lsoccurringin
theoldversion. Theremainingbagofcells isessentiallyanupdatetothe
ob ject. Everyb o dywhohastheoldversionof thisob jectandtheup date
cancomputethenewversion,simplybyunitingthetwobagsofcells,and
removingtheoldro ot(decreasingitsreferencecounterandde-allo catingthe
cellifthereferencecounterb ecomeszero).

2.5.8.Up datestothestateofanaccount.Inparticular,up datestothe
stateofanaccount,ortotheglobalstateofashardchain,ortoanyhashmap
canb erepresentedusingtheideadescrib edin2.5.7. Thismeansthatwhen
wereceiveanewshardchainblo ck(whichisabagof cells),weinterpret
thisbagofcellsnotjustbyitself,butbyunitingitrstwiththebagof
cells representingthepreviousstateof theshardchain. Inthissenseeach
blo ckmaycontainthewholestateoftheblo ckchain.

2.5.9. Up datestoablo ck. Recallthatablo ckitselfisabagofcells,
so,ifitb ecomesnecessarytoeditablo ck,onecansimilarlydeneablo ck
up date asabagofcells,interpretedinthepresenceofthebagofcells
whichisthepreviousversionofthisblo ck. Thisisroughlytheideab ehind
theverticalblo cksdiscussedin2.1.17.


```
2.5.GlobalShardchainState. BagofCellsPhilosophy.
```
2.5.10. Merkle pro of asa bag ofcells. Noticethat a(generalized)
Merklepro offorexample,oneassertingthatx[i] =ystartingfromaknown
value ofHash(x) = h (cf.2.3.10and2.3.15)mayalsob erepresented
asabagof cells. Namely, onesimplyneedsto provideasubsetof cells
corresp ondingtoapathfromthero otofx:Hashmap(n,X)toitsdesired
leafwithindexi: 2 nandvaluey:X.Referencestochildrenofthesecellsnot
lyingonthispathwillb eleftunresolvedinthispro of,representedbycell
hashes. OnecanalsoprovideasimultaneousMerklepro ofof,say,x[i] =y
andx[i′] =y′,byincludinginthebagofcellsthecellslyingontheunionof
thetwopathsfromthero otofxtoleavescorresp ondingtoindicesiandi′.

2.5.11.Merklepro ofsasqueryresp onsesfromfullno des. Inessence,
afullno de withacompletecopyofashardchain(oraccount-chain)state
canprovideaMerklepro ofwhenrequestedbyalightno de(e.g.,anetwork
no derunningalight versionofthe TONBlo ckchain client), enablingthe
receivertop erform somesimplequeries withoutexternal help,usingonly
thecellsprovidedinthisMerklepro of. Thelightno decansenditsqueries
inaserializedformattothefullno de,andreceivethecorrectanswerswith
Merklepro ofsorjusttheMerklepro ofs,b ecausetherequestershouldb e
abletocomputetheanswersusingonlythecellsincludedintheMerklepro of.
ThisMerklepro ofwouldconsistsimplyofabagofcells,containingonly
thosecellsb elongingtotheshardchain'sstatethathaveb eenaccessedby
thefullno dewhileexecutingthelightno de'squery. Thisapproachcanb e
usedinparticularforexecutinggetqueriesofsmartcontracts(cf.4.3.12).

2.5.12.Augmentedup date, or stateup datewith Merklepro of of
validity. Recall(cf.2.5.7)thatwecandescrib ethechangesinanob ject
statefromanoldvaluex:Xtoanewvaluex′:Xbymeansofanup date,
whichissimplyabagofcells,containingthosecellsthatlieinthesubtree
representingnewvaluex′,butnotinthesubtreerepresentingoldvaluex,
b ecausethereceiverisassumedtohaveacopyoftheoldvaluexandallits
cells.
However, ifthereceiverdo esnothaveafullcopyofx,butknowsonly
its(Merkle)hashh=Hash(x),itwillnotb eabletocheckthevalidityof
theup date(i.e.,thatalldanglingcellreferencesintheup datedoreferto
cellspresentinthetreeofx). Onewouldliketohaveveriableup dates,
augmentedbyMerklepro ofsofexistenceofallreferredcellsintheoldstate.
Thenanyb o dyknowingonlyh=Hash(x)wouldb eabletocheckthevalidity
oftheup dateandcomputethenewh′=Hash(x′)byitself.


```
2.5.GlobalShardchainState. BagofCellsPhilosophy.
```
BecauseourMerklepro ofsarebagsofcellsthemselves(cf.2.5.10),one
canconstructsuchanaugmentedupdateasabagofcells,containingthe
oldro otofx,someofitsdescendantsalongwithpathsfromthero otofxto
them,andthenewro otofx′andallitsdescendantsthatarenotpartofx.

2.5.13.Account stateup datesin ashardchainblo ck. Inparticular,
accountstateup dates inashardchainblo ckshouldb e augmentedas dis-
cussedin2.5.12. Otherwise,someb o dy mightcommit ablo ckcontaining
aninvalidstateup date,referringtoacellabsentintheoldstate;proving
theinvalidityofsuchablo ckwouldb eproblematic(howisthechallengerto
provethatacellisnot partofthepreviousstate?).
Now,ifallstateup datesincludedinablo ckareaugmented,theirvalidity
iseasily checked,andtheirinvalidityisalsoeasilyshownasaviolationof
therecursivedeningprop ertyof(generalized)Merklehashes.

2.5.14.Everythingisabagofcells philosophy. Previousconsidera-
tionsshowthateverythingweneedtostoreortransfer,eitherintheTON
Blo ckchainorinthenetwork, isrepresentableas abagofcells. Thisis
animp ortantpartoftheTONBlo ckchaindesignphilosophy. Oncethebag
ofcellsapproachisexplainedandsomelow-levelserializationsofbagsof
cellsaredened,onecansimplydeneeverything(blo ckformat,shardchain
andaccountstate,etc.)onthehighlevelofabstract(dep endent)algebraic
datatyp es.
Theunifyingeectoftheeverythingisabagofcellsphilosophyconsid-
erablysimpliestheimplementationofseeminglyunrelatedservices;cf.5.1.9
foranexampleinvolvingpaymentchannels.

2.5.15. Blo ckheaders for TON blo ckchains. Usually,ablo ckina
blo ckchainb eginswithasmallheader,containingthehashoftheprevious
blo ck,itscreationtime,theMerklehashofthetreeofalltransactionscon-
tainedintheblo ck,andsoon.Thentheblo ckhashisdenedtob ethehash
ofthissmallblo ckheader.Becausetheblo ckheaderultimatelydep endson
alldataincludedintheblo ck,onecannotaltertheblo ckwithoutchanging
itshash.
Inthebagof cells approachusedby theblo cksof TONblo ckchains,
thereisnodesignatedblo ckheader.Instead,theblo ckhashisdenedasthe
(Merkle)hashofthero otcelloftheblo ck. Therefore,thetop(ro ot)cellof
theblo ckmightb econsideredasmallheaderofthisblo ck.


### 2.6 CreatingandValidatingNewBlo cks

However, thero otcellmightnotcontainall thedatausuallyexp ected
fromsuchaheader.Essentially,onewantstheheadertocontainsomeofthe
eldsdenedintheBlockdatatyp e.Normally,theseeldswillb econtained
inseveralcells,includingthero ot. Thesearethecellsthattogetherconstitute
aMerklepro of  forthevaluesoftheeldsinquestion. Onemightinsist
thatablo ckcontaintheseheadercells intheveryb eginning,b eforeany
othercells.Thenonewouldneedtodownloadonlytherstseveralbytesof
ablo ckserializationinordertoobtainalloftheheadercells,andtolearn
alloftheexp ectedelds.

### 2.6 Creatingand ValidatingNewBlo cks

The TON Blo ckchain ultimately consists of shardchain and masterchain
blo cks. Theseblo cksmustb e created, validatedand propagatedthrough
the networkto all partiesconcerned,in orderforthe system tofunction
smo othlyandcorrectly.

2.6.1.Validators. Newblo cksarecreatedandvalidatedbysp ecialdesig-
natedno des, calledvalidators. Essentially,any no dewishingto b ecomea
validatormayb ecomeone,provideditcandep ositasucientlylargestake
(inTONcoins,i.e.,TONcoins;cf.App endixA)intothemasterchain.Val-
idatorsobtainsomerewardsforgo o dwork,namely,thetransaction,storage
andgasfeesfromalltransactions(messages)committedintonewlygener-
atedblo cks,andsomenewlymintedcoins,reectingthegratitudeofthe
wholecommunitytothevalidatorsforkeepingtheTONBlo ckchainworking.
Thisincomeisdistributedamongallparticipatingvalidatorsprop ortionally
totheirstakes.
However, b eingavalidatorisahighresp onsibility. Ifavalidatorsigns
aninvalidblo ck,itcanb epunishedby losingpartorall ofitsstake, and
byb eingtemp orarilyorp ermanentlyexcludedfromthesetofvalidators. If
avalidatordo esnotparticipateincreatingablo ck,itdo esnotreceiveits
shareoftherewardasso ciatedwiththatblo ck. Ifavalidatorabstainsfrom
creatingnew blo cksforalong time,it maylose partof its stakeandb e
susp endedorp ermanentlyexcludedfromthesetofvalidators.
Allthismeansthatthevalidatordo esnotgetitsmoney fornothing.
Indeed, itmust keeptrackof the statesof all or someshardchains(each
validatorisresp onsible forvalidatingandcreatingnewblo cksinacertain
subsetof shardchains),p erform allcomputationsrequestedbysmart con-


```
2.6.CreatingandValidatingNewBlocks
```
tractsintheseshardchains,receiveup datesab outothershardchainsandso
on. Thisactivityrequires considerable diskspace,computing p ower and
networkbandwidth.

2.6.2.Validatorsinsteadofminers.RecallthattheTONBlo ckchainuses
thePro of-of-Stakeapproach,insteadofthePro of-of-Workapproachadopted
byBitcoin,thecurrentversionofEthereum,andmostothercrypto currencies.
Thismeansthatonecannotmineanewblo ckbypresentingsomepro of-of-
work(computingalotofotherwiseuselesshashes)andobtainsomenewcoins
asaresult.Instead,onemustb ecomeavalidatorandsp endone'scomputing
resourcestostoreandpro cessTONBlo ckchainrequestsanddata. Inshort,
onemustbeavalidatortominenewcoins.Inthisresp ect,validatorsarethe
newminers.
However, therearesomeotherways to earncoins apart fromb einga
validator.

2.6.3. Nominators and mining p o ols. To b ecome avalidator, one
wouldnormallyneedtobuyandinstallseveralhigh-p erformanceserversand
acquireago o dInternetconnectionforthem.Thisisnotsoexp ensiveasthe
ASICequipmentcurrentlyrequiredtomineBitcoins.However,onedenitely
cannotminenewTONcoinsonahomecomputer,letaloneasmartphone.
IntheBitcoin,EthereumandotherPro of-of-Workcrypto currencymining
communitiesthereisanotionofminingpools,wherealotofno des,having
insucientcomputing p ower to minenew blo cksby themselves,combine
theireortsandsharetherewardafterwards.
Acorresp ondingnotioninthePro of-of-Stakeworldisthatofanominator.
Essentially,thisisano delendingitsmoneytohelpavalidatorincreaseits
stake; thevalidatorthendistributesthecorresp ondingshareofits reward
(orsomepreviouslyagreedfractionofitsay,50%)tothenominator.
Inthisway,anominatorcanalsotakepartintheminingandobtain
somerewardprop ortionaltotheamountofmoneyitiswillingtodep ositfor
thispurp ose. Itreceivesonlyafraction ofthecorresp ondingshareofthe
validator'sreward,b ecauseitprovidesonlythecapital,butdo esnotneed
tobuycomputingp ower,storageandnetworkbandwidth.
However,ifthevalidatorlosesitsstakeb ecauseofinvalidb ehavior,the
nominatorlosesitsshareofthestakeas well. Inthissensethenominator
sharestherisk. Itmustcho oseitsnominatedvalidatorwisely,otherwiseit
canlosemoney. Inthis sense, nominatorsmakea weighteddecision and
voteforcertainvalidatorswiththeirfunds.


```
2.6.CreatingandValidatingNewBlocks
```
Onthe otherhand,this nominatingor lendingsystem enablesoneto
b ecomeavalidatorwithoutinvestingalargeamountof moneyintoTON
coinsrst. Inotherwords,itpreventsthosekeepinglargeamountsofTON
coinsfrommonop olizingthesupplyofvalidators.

2.6.4. Fishermen: obtaining moneyby p ointing out others' mis-
takes. Anotherwayto obtainsome rewardswithoutb eingavalidator is
byb ecomingasherman. Essentially,anyno decanb ecomeashermanby
makingasmalldep ositinthemasterchain. Thenitcanusesp ecialmas-
terchaintransactionstopublish(Merkle)invaliditypro ofsofsome(usually
shardchain)blo ckspreviouslysignedandpublishedbyvalidators. Ifother
validatorsagreewiththisinvaliditypro of,theoendingvalidatorsarepun-
ished(bylosingpartoftheirstake),andtheshermanobtainssomereward
(afractionofcoinsconscatedfromtheoendingvalidators). Afterwards,
theinvalid(shardchain)blo ckmustb ecorrectedasoutlinedin2.1.17. Cor-
rectinginvalidmasterchainblo cksmayinvolvecreatingverticalblo ckson
topofpreviouslycommittedmasterchainblo cks(cf.2.1.17);thereisnoneed
tocreateaforkofthemasterchain.
Normally,ashermanwouldneedtob ecomeafullno deforatleastsome
shardchains,andsp endsomecomputingresourcesby runningtheco deof
atleastsomesmartcontracts. Whileashermando esnotneedtohaveas
muchcomputing p oweras avalidator, we thinkthat anaturalcandidate
tob ecomeashermanisawould-b evalidatorthatisreadytopro cessnew
blo cks,buthasnotyetb eenelectedasavalidator(e.g.,b ecauseofafailure
todep ositasucientlylargestake).

2.6.5.Collators: obtainingmoneybysuggestingnewblo ckstoval-
idators.Yetanotherwaytoobtainsomerewardswithoutb eingavalidator
isby b ecoming acol lator. Thisis ano de that preparesand suggeststo
avalidatornewshardchainblo ckcandidates,complemented(collated)with
datatakenfromthestateofthisshardchainandfromother(usuallyneigh-
b oring)shardchains,alongwithsuitableMerklepro ofs. (Thisisnecessary,
forexample, whensome messagesneedto b eforwardedfromneighb oring
shardchains.) Thenavalidatorcaneasilychecktheprop osedblo ckcandi-
dateforvalidity,withouthavingtodownloadthecompletestateofthisor
othershardchains.
Becauseavalidatorneedstosubmitnew(collated)blo ckcandidatesto
obtainsome (mining) rewards, it makes senseto pay some part of the
rewardtoacollatorwillingtoprovidesuitableblo ckcandidates.Inthisway,


```
2.6.CreatingandValidatingNewBlocks
```
avalidatormay freeitself fromthenecessityof watchingthe stateofthe
neighb oringshardchains,byoutsourcingittoacollator.
However, we exp ectthat duringthe system'sinitialdeploymentphase
therewillb enoseparatedesignatedcollators,b ecauseallvalidatorswillb e
abletoactascollatorsforthemselves.

2.6.6.Collators orvalidators: obtainingmoneyforincludinguser
transactions. Userscanop enmicropaymentchannelstosomecollatorsor
validatorsandpaysmallamountsofcoinsinexchangefortheinclusionof
theirtransactionsintheshardchain.

2.6.7. Global validator set election. Theglobal set ofvalidators is
electedonceeachmonth(actually,every 219 masterchainblo cks).Thissetis
determinedanduniversallyknownonemonthinadvance.
Inordertob ecomeavalidator,ano demusttransfersome TONcoins
intothemasterchain,andthensendthemtoasp ecialsmartcontractasits
suggestedstakes. Anotherparameter,sentalongwiththestake,isl ≥ 1 ,
themaximumvalidating loadthisno deiswillingtoacceptrelativetothe
minimalp ossible. Thereisalsoaglobalupp erb ound(anothercongurable
parameter)Lonl,equalto,say,10.
Thentheglobalsetofvalidatorsiselectedbythissmartcontract,simply
byselectinguptoTcandidateswithmaximalsuggestedstakesandpublishing
theiridentities. Originally,the totalnumb erof validatorsisT = 100; we
exp ectittogrowto 1000 astheloadincreases.Itisacongurableparameter
(cf.2.1.21).
Theactualstakeofeachvalidatoriscomputedasfollows: IfthetopT
prop osedstakesares 1 ≥s 2 ≥ ··· ≥sT,theactualstakeofi-thvalidatoris
settos′i:= min(si,li·sT).Inthisway,s′i/s′T≤li,sothei-thvalidatordo es
notobtainmorethanli≤Ltimestheloadoftheweakestvalidator(b ecause
theloadisultimatelyprop ortionaltothestake).
Thenelected validatorsmay withdrawthe unusedpart of theirstake,
si−s′i.Unsuccessfulvalidatorcandidatesmaywithdrawalloftheirprop osed
stake.
Eachvalidatorpublishesitspublicsigningkey,notnecessarilyequalto
thepublickeyoftheaccountthestakecamefrom.^20
The stakesofthe validatorsarefrozenuntiltheend ofthe p erio dfor
whichthey haveb eenelected,andonemonthmore,incasenew disputes

(^20) Itmakessensetogenerateanduseanewkeypairforeveryvalidatorelection.


```
2.6.CreatingandValidatingNewBlocks
```
arise(i.e.,aninvalidblo cksignedbyoneofthesevalidatorsisfound).After
that,thestakeisreturned,alongwiththevalidator'sshareofcoinsminted
andfeesfromtransactionspro cessedduringthistime.

2.6.8.Electionofvalidatortaskgroups.Thewholeglobalsetofval-
idators(whereeachvalidatorisconsideredpresentwithmultiplicityequalto
itsstakeotherwiseavalidatormightb etemptedtoassumeseveralidenti-
tiesandsplititsstakeamongthem)isusedonlytovalidatenewmasterchain
blo cks. Theshardchainblo cksarevalidatedonlybysp eciallyselectedsub-
setsofvalidators,takenfromtheglobalsetofvalidatorschosenasdescrib ed
in2.6.7.
Thesevalidatorsubsets ortaskgroups,dened foreveryshard, are
rotated each hour (actually, every 210 masterchainblo cks), and they are
knownonehourinadvance,sothateveryvalidatorknowswhichshardsit
willneedtovalidate,andcanprepareforthat(e.g.,bydownloadingmissing
shardchaindata).
Thealgorithmusedtoselectvalidatortaskgroupsforeachshard(w,s)
isdeterministicpseudorandom. Itusespseudorandomnumb ersemb edded
byvalidatorsintoeachmasterchainblo ck(generatedbyaconsensususing
thresholdsignatures)to createarandomseed,andthencomputesforex-
ampleHash(code(w).code(s).validator_id.rand_seed)foreachvalidator.
Thenvalidatorsaresortedbythevalueofthishash,andtherstseveralare
selected,soastohaveatleast 20 /Tofthetotalvalidatorstakesandconsist
ofatleast 5 validators.
Thisselectioncouldb edonebyasp ecialsmartcontract. Inthatcase,
theselectionalgorithmwouldeasilyb eupgradablewithouthardforksbythe
votingmechanismmentionedin2.1.21. Allotherconstantsmentionedso
far(suchas 219 , 210 ,T,20,and5)arealsocongurableparameters.

2.6.9.Rotatingpriorityorderoneachtaskgroup.Thereisacertain
priorityorderimp osedonthememb ersofashardtaskgroup,dep endingon
thehashofthepreviousmasterchainblo ckand(shardchain)blo cksequence
numb er.Thisorderisdeterminedbygeneratingandsortingsomehashesas
describ edab ove.
Whenanewshardchainblo ckneedstob egenerated,theshardtaskgroup
validatorselectedtocreatethisblo ckisnormallytherstonewithresp ect
tothisrotatingpriorityorder.Ifitfailstocreatetheblo ck,thesecondor
thirdvalidatormaydoit. Essentially,allofthemmaysuggesttheirblo ck
candidates,butthecandidatesuggestedbythevalidatorhavingthehighest


```
2.6.CreatingandValidatingNewBlocks
```
priorityshouldwinastheresultofByzantineFaultTolerant(BFT)consensus
proto col.

2.6.10.Propagationofshardchainblo ckcandidates. Becauseshard-
chaintaskgroupmemb ershipisknownonehourinadvance,theirmemb ers
canusethattimetobuildadedicatedshardvalidatorsmulticastoverlaynet-
work,usingthegeneralmechanismsoftheTONNetwork(cf.3.3). When
anewshardchainblo ckneedstob egeneratednormallyoneortwoseconds
afterthemostrecent masterchainblo ck hasb eenpropagatedeveryb o dy
knowswhohasthehighest prioritytogeneratethenextblo ck(cf.2.6.9).
Thisvalidatorwillcreateanewcollatedblo ckcandidate,eitherbyitselfor
withtheaidofacollator(cf.2.6.5).Thevalidatormustcheck(validate)this
blo ckcandidate(esp eciallyifithasb eenpreparedbysomecollator)andsign
itwithits(validator)privatekey. Thentheblo ckcandidateispropagated
totheremainderofthetaskgroupusingtheprearrangedmulticastoverlay
network(thetaskgroupcreatesitsownprivateoverlaynetworkasexplained
in3.3,andthenusesaversionofthestreamingmulticastproto coldescrib ed
in3.3.15topropagateblo ckcandidates).
AtrulyBFTwayofdoingthiswouldb etouseaByzantinemulticast
proto col,suchastheoneusedinHoneyBadgerBFT[11]: enco detheblo ck
candidate by an (N, 2 N/3)-erasure co de, send 1 /N of the resulting data
directlytoeachmemb erofthegroup,andexp ectthemtomulticastdirectly
theirpartofthedatatoallothermemb ersofthegroup.
However, afasterandmore straightforwardwayofdoingthis(cf.also
3.3.15)istosplittheblo ckcandidateintoasequenceofsignedone-kilobyte
blo cks(chunks),augmenttheirsequencebyaReedSolomonorafountain
co de(suchastheRaptorQco de[9][14]),andstarttransmittingchunkstothe
neighb orsinthemulticastmesh(i.e.,theoverlaynetwork),exp ectingthem
topropagatethesechunksfurther. Onceavalidatorobtainsenoughchunks
toreconstructtheblo ckcandidatefromthem,itsignsaconrmationreceipt
andpropagatesitthroughits neighb orstothewhole ofthe group. Then
itsneighb orsstopsendingnewchunkstoit,butmaycontinuetosendthe
(original)signaturesofthesechunks,b elievingthatthisno decangeneratethe
subsequentchunksbyapplyingtheReedSolomonorfountainco debyitself
(havingalldatanecessary),combinethemwithsignatures,andpropagateto
itsneighb orsthatarenotyetready.
Ifthemulticastmesh(overlaynetwork)remainsconnectedafterremov-
ingallbad no des(recallthatuptoone-thirdofno desareallowedtob e


```
2.6.CreatingandValidatingNewBlocks
```
badina Byzantineway, i.e., b ehaveinarbitrary maliciousfashion),this
algorithmwillpropagatetheblo ckcandidateasquicklyasp ossible.
Not only the designated high-priority blo ckcreator may multicast its
blo ckcandidatetothewholeofthegroup. Thesecondandthirdvalidator
byprioritymaystartmulticastingtheirblo ckcandidates,eitherimmediately
orafterfailingtoreceiveablo ckcandidatefromthetoppriorityvalidator.
However,normallyonlytheblo ckcandidatewithmaximalprioritywillb e
signedbyall(actually, byatleasttwo-thirdsofthetaskgroup)validators
andcommittedasanewshardchainblo ck.

2.6.11.Validation ofblo ck candidates. Onceablo ckcandidateisre-
ceivedbyavalidatorandthesignatureofitsoriginatingvalidatorischecked,
thereceivingvalidatorchecksthe validityofthisblo ckcandidate,byp er-
formingalltransactionsinitandcheckingthattheirresultcoincideswith
theoneclaimed.Allmessagesimp ortedfromotherblo ckchainsmustb esup-
p ortedbysuitableMerklepro ofsinthecollateddata,otherwisetheblo ck
candidateisdeemedinvalid(and,ifapro ofofthisiscommittedtothemas-
terchain,thevalidatorshavingalreadysignedthisblo ckcandidatemayb e
punished).Ontheotherhand,iftheblo ckcandidateisfoundtob evalid,the
receivingvalidatorsignsitandpropagatesitssignaturetoothervalidatorsin
thegroup,eitherthroughthemeshmulticastnetwork,orbydirectnetwork
messages.
Wewouldliketoemphasizethatavalidatordoesnotneedaccesstothe
statesofthis or neighboring shardchains in orderto checkthe validity of
a(col lated)blockcandidate.^21 Thisallows thevalidation to pro ceed very
quickly(withoutdiskaccesses),andlightensthecomputationalandstorage
burdenonthevalidators(esp eciallyiftheyarewillingtoaccepttheservices
ofoutsidecollatorsforcreatingblo ckcandidates).

2.6.12.Electionofthenextblo ckcandidate. Onceablo ckcandidate
collectsatleasttwo-thirds(bystake)ofthevaliditysignaturesofvalidators
inthetaskgroup,itiseligibletob ecommittedasthenextshardchainblo ck.
ABFTproto colisruntoachieveconsensusontheblo ckcandidatechosen
(theremayb emorethanoneprop osed),withallgo o dvalidatorspreferring
theblo ckcandidatewiththehighestpriorityforthisround. Asaresultof

(^21) Ap ossibleexceptionisthestateofoutputqueuesoftheneighb oringshardchains,
neededtoguaranteethemessageorderingrequirementsdescrib edin2.4.21,b ecausethe
sizeofMerklepro ofsmightb ecomeprohibitiveinthiscase.


```
2.6.CreatingandValidatingNewBlocks
```
runningthisproto col,theblo ckisaugmentedbysignaturesofatleasttwo-
thirdsofthevalidators(bystake). Thesesignaturestestifynotonlytothe
validityoftheblo ckinquestion,butalsoto itsb eingelectedbytheBFT
proto col. Afterthat,the blo ck(without collateddata) iscombined with
thesesignatures,serializedinadeterministicway,andpropagatedthrough
thenetworktoallpartiesconcerned.

2.6.13.Validators mustkeep theblo cks theyhave signed. During
theirmemb ership inthe task group andfor at least onehour (orrather
210 blo cks)afterward,thevalidatorsareexp ectedtokeeptheblo cksthey
havesignedandcommitted. Thefailuretoprovideasignedblo cktoother
validatorsmayb epunished.

2.6.14.Propagatingtheheadersandsignaturesofnewshardchain
blo ckstoallvalidators.Validatorspropagatetheheadersandsignatures
ofnewly-generatedshardchainblo ckstotheglobalsetofvalidators,usinga
multicastmeshnetworksimilartotheonecreatedforeachtaskgroup.

2.6.15.Generationofnewmasterchainblo cks.Afterall(oralmostall)
newshardchainblo ckshaveb eengenerated,anewmasterchainblo ckmay
b egenerated.Thepro cedureisessentiallythesameasforshardchainblo cks
(cf.2.6.12),withthedierencethatal lvalidators(oratleasttwo-thirdsof
them)mustparticipateinthispro cess.Becausetheheadersandsignaturesof
newshardchainblo cksarepropagatedtoallvalidators,hashesofthenewest
blo cksineachshardchaincanandmustb eincludedinthenewmasterchain
blo ck.Oncethesehashesarecommittedintothemasterchainblo ck,outside
observersand othershardchainsmay consider thenew shardchain blo cks
committedandimmutable(cf.2.1.13).

2.6.16.Validatorsmustkeepthestateofmasterchain. Anoteworthy
dierenceb etweenthemasterchainandtheshardchainsisthatallvalidators
areexp ectedtokeeptrackofthemasterchainstate,withoutrelyingoncol-
lateddata.Thisisimp ortantb ecausetheknowledgeofvalidatortaskgroups
isderivedfromthemasterchainstate.

2.6.17.Shardchainblo cksaregeneratedandpropagatedinparallel.
Normally,eachvalidatorisamemb erofseveralshardchaintaskgroups;their
quantity(hencetheloadonthevalidator)isapproximatelyprop ortionalto
thevalidator'sstake. Thismeansthatthevalidatorrunsseveralinstancesof
newshardchainblo ckgenerationproto colinparallel.


```
2.6.CreatingandValidatingNewBlocks
```
2.6.18.Mitigationofblo ckretentionattacks. Becausethetotalsetof
validatorsinsertsanewshardchainblo ck'shashintothemasterchainafter
havingseenonlyitsheaderandsignatures,thereisasmallprobabilitythat
thevalidatorsthathavegeneratedthisblo ckwillconspireandtrytoavoid
publishingthenewblo ckinitsentirety. Thiswouldresultintheinability
ofvalidatorsofneighb oringshardchainstocreatenewblo cks,b ecausethey
mustknowatleasttheoutputmessagequeueofthenewblo ck,onceitshash
hasb eencommittedintothemasterchain.
Inordertomitigatethis,thenewblo ckmustcollectsignaturesfromsome
othervalidators(e.g.,two-thirdsoftheunionoftaskgroupsofneighb oring
shardchains)testifyingthatthesevalidatorsdohavecopiesofthisblo ckand
arewilling to send themto any other validatorsif required. Only after
thesesignaturesarepresentedmaythenewblo ck'shashb eincludedinthe
masterchain.

2.6.19. Masterchain blo cks are generated later than shardchain
blo cks. Masterchain blo cksaregenerated approximately onceevery ve
seconds,as areshardchainblo cks. However, whilethe generationof new
blo cksinallshardchainsrunsessentiallyatthe sametime(normallytrig-
gered by the releaseof a newmasterchain blo ck),the generation of new
masterchainblo cksisdelib eratelydelayed,toallowtheinclusionofhashes
ofnewly-generatedshardchainblo cksinthemasterchain.

2.6.20. Slow validators may receive lower rewards. If avalidator
isslow, itmay fail to validatenew blo ck candidates, andtwo-thirds of
thesignaturesrequiredtocommitthenewblo ckmayb egatheredwithout
its participation. Inthiscase, itwillreceive alowershareof the reward
asso ciatedwiththisblo ck.
Thisprovidesanincentiveforthevalidatorstooptimizetheirhardware,
software,andnetworkconnectioninordertopro cessusertransactionsasfast
asp ossible.
However, ifavalidatorfailstosignablo ckb eforeitiscommitted,its
signaturemayb eincludedinoneofthenextblo cks,andthenapartofthe
reward(exp onentiallydecreasingdep endingonhowmanyblo ckshaveb een
generatedsincee.g., 0. 9 kifthevalidatoriskblo ckslate)willb estillgiven
tothisvalidator.

2.6.21. Depth of validator signatures. Normally,whenavalidator
signsablo ck,thesignaturetestiesonlytotherelativevalidityofablo ck:


```
2.6.CreatingandValidatingNewBlocks
```
thisblo ckisvalidprovidedallpreviousblo cksinthisandothershardchains
arevalid. Thevalidatorcannot b epunishedfortakingforgrantedinvalid
datacommittedintopreviousblo cks.
However, the validator signature of ablo ck has an integerparameter
called depth. If it isnon-zero, it means that the validator asserts the
(relative)validityofthesp eciednumb erofpreviousblo cksaswell.Thisis
awayforslowortemp orarilyoinevalidatorstocatchupandsignsome
oftheblo cksthathaveb eencommittedwithouttheirsignatures.Thensome
partoftheblo ckrewardwillstillb egiventothem(cf.2.6.20).

2.6.22. Validators are resp onsible for relative validity of signed
shardchainblo cks;absolutevalidityfollows.Wewouldliketoempha-
sizeonceagainthatavalidator'ssignatureonashardchainblo ckBtesties
to onlytherelative validityof that blo ck(ormayb e of dpreviousblo cks
aswell,ifthesignaturehasdepth d,cf.2.6.21; butthisdo esnotaect
thefollowingdiscussionmuch). Inotherwords, thevalidatorassertsthat
thenextstates′oftheshardchainisobtainedfromthepreviousstatesby
applyingtheblo ckevaluationfunctionev_blockdescrib edin2.2.6:

```
s′=ev_block(B)(s) (24)
```
Inthisway, the validatorthat signedblo ck B cannot b epunishedifthe
originalstatesturnsouttob eincorrect(e.g.,b ecauseoftheinvalidityof
oneofthepreviousblo cks).Asherman(cf.2.6.4)shouldcomplainonlyifit
ndsablo ckthatisrelativelyinvalid.ThePoSsystemasawholeendeavors
to makeeveryblo ck relatively valid,not recursively (orabsolutely) valid.
Notice,however,thatifal lblocksinablockchainarerelativelyvalid,thenal l
ofthemandtheblockchainasawholeareabsolutelyvalid;thisstatementis
easilyshownusingmathematicalinductiononthelengthoftheblo ckchain.
Inthisway,easilyveriableassertionsofrelativevalidityofblo ckstogether
demonstratethemuchstrongerabsolutevalidityofthewholeblo ckchain.
Note that bysigningablo ckB thevalidatorassertsthat theblo ck is
validgiventheoriginalstates(i.e.,thattheresultof(24)isnotthevalue⊥
indicatingthatthenextstatecannotb ecomputed).Inthisway,thevalidator
mustp erformminimalformalchecksofthecellsoftheoriginalstatethatare
accessedduringtheevaluationof(24).
Forexample,imaginethatthecellexp ectedtocontaintheoriginalbal-
anceofanaccountaccessedfromatransactioncommittedintoablo ckturns
outtohavezerorawbytesinsteadoftheexp ected 8 or16.Thentheoriginal


```
2.6.CreatingandValidatingNewBlocks
```
balancesimplycannotb eretrievedfromthecell,andanunhandledexcep-
tionhapp enswhiletryingtopro cesstheblo ck. Inthiscase,thevalidator
shouldnotsignsuchablo ckonpainofb eingpunished.

2.6.23.Signingmasterchainblo cks.Thesituationwiththemasterchain
blo cksissomewhatdierent: bysigning amasterchainblo ck, thevalida-
torassertsnotonlyitsrelativevalidity,butalsotherelativevalidityofall
precedingblo cksuptotheveryrstblo ckwhenthisvalidatorassumedits
resp onsibility(butnotfurtherback).

2.6.24.Thetotalnumb erofvalidators.Theupp erlimitTforthetotal
numb erofvalidatorstob eelected(cf.2.6.7)cannotb ecome,inthesystem
describ edsofar,morethan,say,severalhundredorathousand,b ecauseall
validatorsareexp ectedtoparticipateinaBFTconsensusproto colto cre-
ateeachnewmasterchainblo ck,anditisnotclearwhethersuchproto cols
canscaletothousandsofparticipants.Evenmoreimp ortantly,masterchain
blo cksmustcollectthesignaturesofatleasttwo-thirdsofallthevalidators
(bystake),andthesesignaturesmustb eincludedinthenewblo ck(other-
wiseallotherno desinthesystemwould havenoreasontotrustthenew
blo ckwithoutvalidatingitbythemselves).Ifmorethan,say,onethousand
validatorsignatureswould havetob eincludedineach masterchainblo ck,
thiswouldimplymoredataineachmasterchainblo ck,tob estoredbyall
fullno desandpropagatedthroughthenetwork,andmorepro cessingp ower
sp enttocheckthesesignatures(inaPoSsystem,fullno desdonotneedto
validateblo cksbythemselves,buttheyneedtocheckthevalidators'signa-
turesinstead).
WhilelimitingTtoathousandvalidatorsseemsmorethansucientfor
therstphaseofthedeploymentoftheTONBlo ckchain,aprovisionmust
b emadeforfuturegrowth,whenthetotalnumb erofshardchainsb ecomes
so large that severalhundred validators will not suce to pro cess all of
them.Tothisend,weintro duceanadditionalcongurableparameterT′≤T
(originallyequaltoT),andonlythetopT′electedvalidators(bystake)are
exp ectedtocreateandsignnewmasterchainblo cks.

2.6.25.Decentralizationofthesystem.Onemightsusp ectthataPro of-
of-StakesystemsuchastheTONBlo ckchain,relyingonT≈ 1000 validators
tocreateallshardchainandmasterchainblo cks,isb oundto b ecometo o
centralized,asopp osedtoconventionalPro of-of-Workblo ckchainslikeBit-
coinorEthereum,whereeveryb o dy(inprinciple)mightmineanewblo ck,


```
2.6.CreatingandValidatingNewBlocks
```
withoutanexplicitupp erlimitonthetotalnumb erofminers.
However,p opularPro of-of-Workblo ckchains,suchasBitcoinandEther-
eum,currentlyrequirevastamountsofcomputingp ower(highhashrates)
to minenewblo ckswithnon-negligible probabilityof success. Thus, the
miningofnewblo ckstendstob econcentratedinthehandsofseverallarge
players,whoinvesthugeamountsmoneyintodatacenterslledwithcustom-
designedhardwareoptimizedformining; andinthehandsofseverallarge
miningp o ols,whichconcentrateandco ordinatetheeortsoflargergroups
ofp eoplewhoarenotabletoprovideasucienthashratebythemselves.
Therefore,asof2017,morethan75%ofnewEthereumorBitcoinblo cks
arepro ducedby lessthanten miners. Infact, the twolargestEthereum
miningp o olspro ducetogethermore thanhalfof allnew blo cks! Clearly,
suchasystemismuchmorecentralizedthanonerelyingonT≈ 1000 no des
topro ducenewblo cks.
One mightalso note that the investment required to b ecomea TON
Blo ckchainvalidatori.e.,tobuythehardware(say,severalhigh-p erformance
servers)andthestake(whichcanb eeasilycollectedthroughap o olofnom-
inatorsifnecessary;cf.2.6.3)ismuchlowerthanthatrequiredtob ecome
asuccessfulstand-aloneBitcoinor Ethereumminer. Infact, theparame-
terLof 2.6.7will forcenominatorsnotto jointhelargestminingp o ol
(i.e.,thevalidatorthathasamassedthelargeststake),butrathertolo ok
forsmallervalidatorscurrentlyacceptingfundsfromnominators,orevento
createnewvalidators,b ecausethiswouldallowahigherprop ortions′i/siof
thevalidator'sandbyextensionalsothenominator'sstake tob eused,
henceyieldinglargerrewardsfrommining. Inthisway,theTONPro of-of-
Stakesystemactuallyencouragesdecentralization(creatingandusingmore
validators)andpunishescentralization.

2.6.26.Relativereliabilityofablo ck.The(relative)reliabilityofablo ck
issimplythetotalstakeofallvalidatorsthathavesignedthisblo ck.Inother
words,thisistheamountofmoney certainactorswouldloseifthisblo ck
turnsoutto b einvalid. Ifoneisconcernedwithtransactionstransferring
valuelowerthanthereliabilityoftheblo ck,onecanconsiderthemtob esafe
enough.Inthissense,therelativereliabilityisameasureoftrustanoutside
observercanhaveinaparticularblo ck.
Notethatwesp eakoftherelative reliabilityofablo ck,b ecauseitisa
guaranteethattheblo ckisvalid providedthepreviousblockandal lother
shardchains'blocksreferredtoarevalid(cf.2.6.22).


```
2.6.CreatingandValidatingNewBlocks
```
The relativereliability ofa blo ckcangrow afterit iscommittedfor
example,whenb elatedvalidators'signaturesareadded(cf.2.6.21).Onthe
otherhand,ifoneof thesevalidatorslosespartorallof itsstakeb ecause
ofitsmisb ehaviorrelatedtosomeotherblo cks,therelativereliabilityofa
blo ckmaydecrease.

2.6.27.Strengthening theblo ckchain. Itisimp ortanttoprovidein-
centivesforvalidatorstoincreasetherelativereliabilityofblo cksasmuchas
p ossible.Onewayofdoingthisisbyallo catingasmallrewardtovalidators
foraddingsignaturestoblo cksofothershardchains.Evenwould-b evalida-
tors,whohavedep ositedastakeinsucienttogetintothetopT validators
bystakeandtob eincludedintheglobalsetofvalidators(cf.2.6.7),might
participateinthisactivity(iftheyagreetokeeptheirstakefrozeninstead
ofwithdrawingitafterhavinglosttheelection). Suchwould-b evalidators
mightdoubleasshermen(cf.2.6.4): iftheyhavetocheckthevalidityof
certainblo cksanyway,theymightas wellopttorep ortinvalidblo cksand
collecttheasso ciatedrewards.

2.6.28.Recursivereliabilityofablo ck.Onecanalsodenetherecursive
reliability of ablo ckto b etheminimum of itsrelativereliabilityandthe
recursivereliabilitiesofallblo cksitrefersto(i.e.,themasterchainblo ck,the
previousshardchainblo ck,andsomeblo cksofneighb oringshardchains). In
otherwords,iftheblo ckturnsouttob einvalid,eitherb ecauseitisinvalidby
itselforb ecauseoneoftheblo cksitdep endsonisinvalid,thenatleastthis
amountofmoneywouldb elostbysomeone. Ifoneistrulyunsurewhether
totrustasp ecictransactioninablo ck,oneshouldcomputetherecursive
reliabilityofthisblo ck,notjusttherelativeone.
It do es not makesense to goto o farback when computingrecursive
reliability, b ecause, ifwe lo ok to ofar back,we will seeblo cks signedby
validatorswhosestakeshavealreadyb eenunfrozenandwithdrawn.Inany
case,wedonotallowthevalidatorstoautomaticallyreconsiderblo cksthat
arethatold(i.e.,createdmore thantwomonths ago,ifcurrentvaluesof
congurableparametersareused),andcreateforksstartingfromthemor
correctthemwiththeaidofverticalblo ckchains(cf.2.1.17),evenifthey
turnoutto b einvalid. Weassumethatap erio doftwo monthsprovides
ampleopp ortunitiesfordetectingandrep ortinganyinvalidblo cks,sothat
ifablo ckisnotchallengedduringthisp erio d,itisunlikelytob echallenged
atall.


### 2.7 SplittingandMergingShardchains

2.6.29.ConsequenceofPro of-of-Stakeforlightno des.Animp ortant
consequenceofthePro of-of-StakeapproachusedbytheTONBlo ckchainis
thatalightno de(runninglightclientsoftware)fortheTONBlo ckchaindo es
notneedtodownload theheaders of allshardchainorevenmasterchain
blo cksinorderto b eableto checkby itself thevalidityof Merklepro ofs
providedtoitbyfullno desasanswerstoitsqueries.
Indeed,b ecausethemostrecentshardchainblo ckhashesareincludedin
themasterchainblo cks,afullno decaneasilyprovideaMerklepro ofthata
givenshardchainblo ckisvalidstartingfromaknownhashofamasterchain
blo ck. Next,thelightno deneedstoknowonlytheveryrstblo ckofthe
masterchain(wheretheveryrstsetofvalidatorsisannounced),which(or
atleast thehashofwhich) mightb ebuilt-inintothe clientsoftware, and
onlyonemasterchainblo ckapproximatelyeverymonthafterwards,where
newly-electedvalidatorsetsareannounced,b ecausethisblo ckwillhaveb een
signedbytheprevioussetofvalidators.Startingfromthat,itcanobtainthe
severalmostrecentmasterchainblo cks,oratleasttheirheadersandvalidator
signatures,andusethemasabaseforcheckingMerklepro ofsprovidedby
fullno des.

### 2.7 SplittingandMerging Shardchains

OneofthemostcharacteristicanduniquefeaturesoftheTONBlo ckchainis
itsabilitytoautomaticallysplitashardchainintwowhentheloadb ecomes
to ohigh,andmergethembackiftheloadsubsides(cf.2.1.10). Wemust
discussitinsomedetailb ecauseofitsuniquenessanditsimp ortancetothe
scalabilityofthewholepro ject.

2.7.1. Shard conguration. Recallthat,atanygivenmomentoftime,
eachworkchainwissplitintooneorseveralshardchains(w,s)(cf.2.1.8).
Theseshardchainsmayb erepresentedbyleavesofabinarytree,withro ot
(w,∅),andeachnon-leafno de(w,s)havingchildren(w,s.0) and(w,s.1).
Inthisway,everyaccountb elongingtoworkchainwisassignedtoexactly
oneshard,andeveryb o dywhoknowsthecurrentshardchainconguration
candeterminetheshard(w,s)containingaccountaccount_id:itistheonly
shardwithbinarystringsb eingaprexofaccount_id.
The shard congurationi.e., thisshard binary tree, or the collection
ofallactive(w,s)foragivenw (corresp ondingto theleavesoftheshard
binarytree)ispartofthemasterchainstateandisavailabletoeveryb o dy


```
2.7.SplittingandMergingShardchains
```
whokeepstrackofthemasterchain.^22

2.7.2.Mostrecentshardcongurationandstate. Recallthathashes
ofthemostrecentshardchainblo cksareincludedineachmasterchainblo ck.
Thesehashesareorganizedinashardbinarytree(actually,acollectionof
trees,oneforeachworkchain). Inthisway,eachmasterchainblo ckcontains
themostrecentshardconguration.

2.7.3.Announcingandp erformingchangesintheshardcongura-
tion. Theshardcongurationmayb echangedintwoways:eitherashard
(w,s)canb esplitintotwoshards(w,s.0)and(w,s.1),ortwosiblingshards
(w,s.0)and(w,s.1)canb emerged intooneshard(w,s).
These split/mergeop erations areannouncedseveral(e.g., 26 ; thisis a
congurableparameter)blo cksinadvance,rstintheheaders ofthecor-
resp ondingshardchainblo cks,andtheninthemasterchainblo ckthatrefers
tothese shardchainblo cks. Thisadvanceannouncementisneededforall
partiesconcernedtopreparefortheplannedchange(e.g.,buildanoverlay
multicastnetworktodistributenewblo cksofthenewly-createdshardchains,
asdiscussedin3.3).Thenthechangeiscommitted,rstintothe(headerof
the)shardchainblo ck(incaseofasplit;foramerge,blo cksofb othshard-
chainsshouldcommitthechange),andthenpropagatedtothemasterchain
blo ck. Inthisway,themasterchainblo ckdenesnotonlythemostrecent
shardcongurationbefore itscreation, butalsothenextimmediateshard
conguration.

2.7.4. Validator task groups for new shardchains. Recall thateach
shard,i.e., eachshardchain, normallyisassignedasubsetofvalidators(a
validatortaskgroup)dedicatedtocreatingandvalidatingnewblo cksinthe
corresp ondingshardchain(cf.2.6.8).Thesetaskgroupsareelectedforsome
p erio doftime(approximatelyonehour)andareknownsometimeinadvance
(alsoapproximatelyonehour),andareimmutableduringthisp erio d.^23
However, theactualshardcongurationmaychangeduringthisp erio d
b ecauseof split/mergeop erations. Onemustassigntask groupsto newly
createdshards.Thisisdoneasfollows:

(^22) Actually,theshardcongurationiscompletelydeterminedbythelastmasterchain
blo ck;thissimpliesgettingaccesstotheshardconguration.
(^23) Unlesssomevalidatorsaretemp orarilyorp ermanentlybannedb ecauseofsigning
invalidblo cksthentheyareautomaticallyexcludedfromalltaskgroups.


```
2.7.SplittingandMergingShardchains
```
Noticethatanyactiveshard(w,s)willeitherb eadescendantofsome
uniquelydeterminedoriginalshard(w,s′),meaningthats′isaprexofs,
oritwillb ethero otofasubtreeoforiginalshards(w,s′),whereswillb e
aprexofeverys′. Intherstcase,wesimplytakethetaskgroupofthe
originalshard(w,s′)todoubleasthetaskgroupofthenewshard(w,s). In
thelattercase,thetaskgroupofthenewshard(w,s)willb etheunionof
taskgroupsofalloriginalshards(w,s′)thataredescendantsof(w,s)inthe
shardtree.
Inthisway,everyactiveshard(w,s)getsassignedawell-denedsubset
ofvalidators(taskgroup). Whenashardissplit,b othchildreninheritthe
wholeofthetaskgroupfromtheoriginalshard.Whentwoshardsaremerged,
theirtaskgroupsarealsomerged.
Anyonewhokeepstrackofthemasterchainstatecancomputevalidator
taskgroupsforeachoftheactiveshards.

2.7.5.Limitonsplit/mergeop erationsduringthep erio dofresp on-
sibilityoforiginaltaskgroups. Ultimately,thenewshardconguration
willb etakenintoaccount,andnewdedicatedvalidatorsubsets(taskgroups)
willautomaticallyb eassignedtoeachshard.Beforethathapp ens,onemust
imp oseacertainlimitonsplit/mergeop erations;otherwise,anoriginaltask
groupmayendupvalidating 2 kshardchainsforalargekatthesametime,
iftheoriginalshardquicklysplitsinto 2 knewshards.
Thisisachievedbyimp osinglimitsonhowfartheactiveshardcongu-
rationmayb eremovedfromtheoriginalshardconguration(theoneused
toselectvalidatortaskgroupscurrentlyincharge).Forexample,onemight
requirethatthedistanceintheshardtreefromanactiveshard(w,s)toan
originalshard(w,s′)mustnotexceed3,ifs′isapredecessorofs(i.e.,s′isa
prexofbinarystrings),andmustnotexceed2,ifs′isasuccessorofs(i.e.,
sisaprexofs′).Otherwise,thesplitormergeop erationisnotp ermitted.
Roughly sp eaking, oneis imp osinga limit on the numb erof times a
shardcanb e split(e.g.,three)ormerged (e.g.,two)duringthep erio dof
resp onsibility of a givencollection of validator task groups. Apart from
that,afterashardhasb eencreatedbymergingorsplitting,itcannotb e
reconguredforsomep erio doftime(somenumb erofblo cks).

2.7.6.Determiningthenecessityofsplit op erations.Thesplitop er-
ationforashardchainistriggeredbycertainformalconditions(e.g.,iffor
64 consecutiveblo cksthe shardchainblo cksareatleast 90%full). These
conditionsaremonitored bythe shardchaintask group. Ifthey aremet,


```
2.7.SplittingandMergingShardchains
```
rstasplitpreparationagisincludedintheheaderofanewshardchain
blo ck(andpropagatedtothemasterchainblo ckreferringtothisshardchain
blo ck).Then,severalblo cksafterwards,thesplitcommitagisincludedin
theheaderoftheshardchainblo ck(andpropagatedtothenextmasterchain
blo ck).

2.7.7.Performingsplit op erations. Afterthesplitcommit agisin-
cludedinablo ckBofshardchain(w,s),therecannotb easubsequentblo ck
B′inthatshardchain.Instead,twoblo cksB 0 ′andB′ 1 ofshardchains(w,s.0)
and(w,s.1),resp ectively,willb ecreated,b othreferringtoblo ckBastheir
previousblo ck(andb othofthemwillindicatebyaagintheheaderthatthe
shardhasb eenjustsplit). Thenextmasterchainblo ckwillcontainhashes
ofblo cksB′ 0 andB′ 1 ofthenewshardchains;itisnotallowedtocontainthe
hashofanewblo ckB′ofshardchain(w,s),b ecauseasplitcommitevent
hasalreadyb eencommittedintothepreviousmasterchainblo ck.
Noticethatb othnewshardchainswillb evalidatedbythesamevalidator
taskgroupastheoldone,sotheywillautomaticallyhaveacopyoftheir
state.Thestatesplittingop erationitselfisquitesimplefromthep ersp ective
oftheInniteShardingParadigm(cf.2.5.2).

2.7.8.Determiningthenecessityofmergeop erations.Thenecessity
ofshardmergeop erationsisalsodetectedbycertainformalconditions(e.g.,
iffor 64 consecutiveblo cksthesumofthesizesofthetwoblo cksofsibling
shardchainsdo esnotexceed60%ofmaximalblo cksize).Theseformalcon-
ditionsshouldalsotakeintoaccountthetotalgassp entbytheseblo cksand
compareittothecurrentblo ckgaslimit,otherwisetheblo cksmayhapp en
tob esmallb ecausetherearesomecomputation-intensivetransactionsthat
preventtheinclusionofmoretransactions.
Theseconditionsaremonitoredbyvalidatortaskgroupsofb othsibling
shards(w,s.0)and(w,s.1). Noticethatsiblingsarenecessarily neighb ors
withresp ecttohyp ercub erouting(cf.2.4.19),sovalidatorsfromthetask
groupofanyshardwillb emonitoringthesiblingshardtosomeextentany-
ways.
Whentheseconditionsaremet,eitheroneofthevalidatorsubgroupscan
suggesttotheotherthatthey mergebysendingasp ecialmessage. Then
theycombineintoaprovisionalmergedtaskgroup,withcombinedmem-
b ership,capableofrunningBFTconsensusalgorithmsandofpropagating
blo ckup datesandblo ckcandidatesifnecessary.


```
2.8.ClassificationofBlockchainProjects
```
Iftheyreachconsensusonthenecessityandreadinessofmerging,merge
prepareagsarecommittedintotheheadersofsomeblo cksofeachshard-
chain,along withthe signaturesof atleasttwo-thirds ofthevalidatorsof
thesibling'staskgroup(andarepropagatedtothenextmasterchainblo cks,
sothat everyb o dycangetreadyforthe imminentreconguration). How-
ever,theycontinuetocreateseparateshardchainblo cksforsomepredened
numb erofblo cks.

2.7.9. Performing mergeop erations. Afterthat,whenthe validators
fromtheunionofthetwooriginaltaskgroupsarereadytob ecomevalidators
forthemergedshardchain(thismightinvolveastatetransferfromthesibling
shardchainandastatemergeop eration), they commitamerge commit
agintheheaders ofblo cksoftheir shardchain(thiseventispropagated
tothenextmasterchainblo cks),andstopcreatingnewblo cksinseparate
shardchains(oncethemergecommitagapp ears,creatingblo cksinseparate
shardchainsisforbidden).Instead,amergedshardchainblo ckiscreated(by
theunionofthetwooriginaltaskgroups),referringtob othofitspreceding
blo cksinitsheader.Thisisreectedinthenextmasterchainblo ck,which
willcontainthehashofthenewlycreatedblo ckofthemergedshardchain.
Afterthat,themergedtaskgroupcontinuescreatingblo cksinthemerged
shardchain.

### 2.8 ClassicationofBlo ckchainPro jects

WewillconcludeourbriefdiscussionoftheTONBlo ckchainbycomparingit
withexistingandprop osedblo ckchainpro jects. Beforedoingthis,however,
wemustintro duceasucientlygeneralclassicationofblo ckchainpro jects.
Thecomparisonofparticularblo ckchainpro jects,basedonthisclassication,
isp ostp oneduntil2.9.

2.8.1.Classicationofblo ckchainpro jects.Asarststep,wesuggest
someclassicationcriteriaforblo ckchains(i.e.,forblo ckchainpro jects).Any
suchclassicationissomewhatincompleteandsup ercial,b ecauseitmust
ignoresomeofthemostsp ecicanduniquefeaturesofthepro jectsunder
consideration. However,wefeelthatthisisanecessaryrststepinprovid-
ingatleast averyroughandapproximatemapoftheblo ckchainpro jects
territory.
Thelistofcriteriaweconsideristhefollowing:


```
2.8.ClassificationofBlockchainProjects
```
```
 Single-blo ckchainvs.multi-blo ckchainarchitecture(cf.2.8.2)
```
```
 Consensusalgorithm:Pro of-of-Stakevs.Pro of-of-Work(cf.2.8.3)
```
```
 ForPro of-of-Stakesystems,theexactblo ckgeneration,validationand
consensusalgorithmused(thetwoprincipaloptionsareDPOSvs.BFT;
cf.2.8.4)
```
```
 Supp ortforarbitrary(Turing-complete)smartcontracts(cf.2.8.6)
```
Multi-blo ckchainsystemshaveadditionalclassicationcriteria(cf.2.8.7):

```
 Typ eandrulesofmemb erblo ckchains: homogeneous,heterogeneous
(cf.2.8.8),mixed(cf.2.8.9).Confederations(cf.2.8.10).
```
```
 Absenceorpresenceofamasterchain,internalorexternal(cf.2.8.11)
```
```
 Nativesupp ortforsharding(cf.2.8.12). Staticordynamicsharding
(cf.2.8.13).
```
```
 Interactionb etweenmemb erblo ckchains:lo osely-coupledandtightly-
coupledsystems(cf.2.8.14)
```
2.8.2.Single-blo ckchainvs.multi-blo ckchainpro jects.Therstclas-
sicationcriterionisthequantityofblo ckchainsinthesystem. Theoldest
andsimplestpro jectsconsistof asingleblockchain (singlechainpro jects
forshort);moresophisticatedpro jectsuse(or,rather,plantouse)multiple
blockchains(multichainpro jects).
Singlechainpro jectsaregenerallysimplerandb ettertested;theyhave
withsto o dthetestoftime. Theirmaindrawbackislowp erformance,orat
leasttransactionthroughput,whichisonthelevelof ten(Bitcoin)to less
thanonehundred^24 (Ethereum)transactionsp ersecondforgeneral-purp ose
systems.Somesp ecializedsystems(suchasBitshares)arecapableofpro cess-
ingtensofthousandsofsp ecializedtransactionsp ersecond,attheexp ense
ofrequiringtheblo ckchainstatetotintomemory,andlimitingthepro-
cessingtoapredenedsp ecialsetoftransactions,whicharethenexecuted
byhighly-optimizedco dewritteninlanguageslikeC++(noVMshere).
Multichainpro jectspromisethescalabilityeveryb o dycraves. Theymay
supp ortlargertotalstatesandmoretransactionsp ersecond,attheexp ense

(^24) Morelike15,forthetimeb eing.However,someupgradesareb eingplannedtomake
Ethereumtransactionthroughputseveraltimeslarger.


```
2.8.ClassificationofBlockchainProjects
```
ofmakingthepro jectmuchmorecomplex,anditsimplementationmorechal-
lenging.Asaresult,therearefewmultichainpro jectsalreadyrunning,but
mostprop osedpro jectsaremultichain. Web elievethatthefutureb elongs
tomultichainpro jects.

2.8.3.Creatingandvalidatingblo cks: Pro of-of-Workvs.Pro of-of-
Stake. Anotherimp ortantdistinctionisthealgorithm andproto colused
tocreateandpropagatenewblo cks,checktheirvalidity,andselectoneof
severalforksiftheyapp ear.
ThetwomostcommonparadigmsareProof-of-Work(PoW)andProof-of-
Stake(PoS).ThePro of-of-Workapproachusuallyallowsanyno detocreate
(mine)a newblo ck (and obtainsome reward asso ciatedwith mining a
blo ck)ifitisluckyenoughtosolveanotherwiseuselesscomputationalprob-
lem(usuallyinvolvingthecomputationofalargeamountofhashes)b efore
othercomp etitorsmanagetodothis.Inthecaseofforks(forexample,iftwo
no despublishtwootherwisevalidbutdierentblo ckstofollowtheprevious
one)thelongestforkwins.Inthisway,theguaranteeofimmutabilityofthe
blo ckchainisbasedontheamountofwork(computationalresources)sp ent
togeneratetheblo ckchain:anyb o dywhowouldliketocreateaforkofthis
blo ckchainwouldneedtore-dothisworktocreatealternativeversionsofthe
alreadycommittedblo cks. Forthis, onewouldneedto controlmorethan
50%ofthetotalcomputingp owersp entcreatingnewblo cks,otherwisethe
alternativeforkwillhaveexp onentiallylowchancesofb ecomingthelongest.
ThePro of-of-Stakeapproachisbasedonlargestakes(nominatedincryp-
to currency)madebysomesp ecialno des(validators)toassertthattheyhave
checked(validated)some blo cksandhave foundthemcorrect. Validators
signblo cks,andreceivesomesmallrewardsforthis;however,ifavalidator
isevercaughtsigninganincorrectblo ck,andapro ofofthisispresented,
partorallofitsstakeisforfeit. Inthisway,theguaranteeofvalidityand
immutabilityoftheblo ckchainisgivenbythetotalvolumeofstakesputby
validatorsonthevalidityoftheblo ckchain.
ThePro of-of-Stakeapproachismorenaturalintheresp ectthatitincen-
tivizesthevalidators(whichreplacePoWminers)top erformusefulcompu-
tation(neededtocheckorcreatenewblo cks,inparticular,byp erformingall
transactionslistedinablo ck)insteadofcomputingotherwiseuselesshashes.
Inthisway,validatorswouldpurchasehardwarethat isb etteradaptedto
pro cessingusertransactions,inordertoreceiverewardsasso ciatedwiththese
transactions,whichseemsquiteausefulinvestmentfromthep ersp ectiveof


```
2.8.ClassificationofBlockchainProjects
```
thesystemasawhole.
However,Pro of-of-Stakesystemsaresomewhatmorechallengingtoim-
plement,b ecauseonemustprovideformanyrarebutp ossibleconditions.
Forexample,somemaliciousvalidatorsmightconspiretodisruptthesystem
toextractsomeprot(e.g.,byalteringtheirowncrypto currencybalances).
Thisleadstosomenon-trivialgame-theoreticproblems.
Inshort,Pro of-of-Stakeismorenaturalandmorepromising,esp ecially
for multichain pro jects (b ecausePro of-of-Work would require prohibitive
amountsofcomputationalresourcesiftherearemanyblo ckchains),butmust
b emore carefullythoughtoutandimplemented. Mostcurrently running
blo ckchainpro jects,esp eciallytheoldestones(suchasBitcoinandatleast
theoriginalEthereum),usePro of-of-Work.

2.8.4. Variants of Pro of-of-Stake. DPOS vs. BFT.WhilePro of-of-
Workalgorithmsareverysimilartoeachotheranddiermostlyinthehash
functionsthat must b ecomputed for miningnew blo cks, there aremore
p ossibilitiesforPro of-of-Stakealgorithms.Theymeritasub-classicationof
theirown.
Essentially, onemustanswerthefollowingquestionsab outaPro of-of-
Stakealgorithm:

```
 Whocanpro duce(mine)anewblo ckanyfullno de,oronlyamem-
b erof a(relatively) smallsubsetof validators? (Most PoSsystems
requirenewblo ckstob egeneratedandsignedbyoneofseveraldesig-
natedvalidators.)
```
```
 Dovalidatorsguaranteethevalidityoftheblo cksbytheirsignatures,or
areallfullno desexp ectedtovalidateallblo cksbythemselves?(Scal-
ablePoSsystemsmustrelyonvalidatorsignaturesinsteadofrequiring
allno destovalidateallblo cksofallblo ckchains.)
```
```
 Isthereadesignatedpro ducerforthenextblo ckchainblo ck,knownin
advance,suchthatnob o dyelsecanpro ducethatblo ckinstead?
```
```
 Isa newly-createdblo ck originallysignedby onlyonevalidator(its
pro ducer),or mustitcollectama jorityof validatorsignatures from
theveryb eginning?
```
Whilethereseemtob e 24 p ossibleclassesofPoSalgorithmsdep endingon
theanswerstothesequestions,thedistinctioninpracticeb oilsdowntotwo


```
2.8.ClassificationofBlockchainProjects
```
ma jorapproachestoPoS.Infact,mostmo dernPoSalgorithms,designedto
b eusedinscalablemulti-chainsystems,answerthersttwoquestionsinthe
samefashion: onlyvalidatorscanpro ducenewblo cks,andtheyguarantee
blo ckvalidity withoutrequiringall fullno des to checkthe validityof all
blo cksbythemselves.
Astothetwolastquestions,theiranswersturnouttob ehighlycorre-
lated,leavingessentiallyonlytwobasicoptions:

```
 DelegatedProof-of-Stake(DPOS):Thereisauniversallyknowndesig-
natedpro ducerforeveryblo ck;nooneelsecanpro ducethatblo ck;the
newblo ckisoriginallysignedonlybyitspro ducingvalidator.
```
```
 ByzantineFault Tolerant(BFT)PoS algorithms: There isaknown
subsetofvalidators,anyofwhichcansuggestanewblo ck;thechoice
of the actualnext blo ckamong severalsuggested candidates, which
mustb evalidatedandsignedbyama jorityofvalidatorsb eforeb eing
releasedtotheotherno des,isachievedbyaversionofByzantineFault
Tolerantconsensusproto col.
```
2.8.5. Comparison of DPOS and BFT PoS.TheBFT approachhas
theadvantagethatanewly-pro ducedblo ckhasfromtheverybeginningthe
signaturesofama jorityofvalidatorstestifyingtoitsvalidity.Anotheradvan-
tageisthat,ifama jorityofvalidatorsexecutestheBFTconsensusproto col
correctly,noforkscanapp earatall. Ontheotherhand,BFTalgorithms
tendtob equiteconvolutedandrequiremoretimeforthesubsetofvalida-
torsto reachconsensus. Therefore, blo ckscannot b egeneratedto ooften.
Thisiswhyweexp ecttheTONBlo ckchain(whichisaBFTpro jectfrom
thep ersp ectiveofthisclassication)topro duceablo ckonlyonceeveryve
seconds.Inpractice,thisintervalmightb edecreasedto23seconds(though
wedonotpromisethis),butnotfurther,ifvalidatorsarespreadacrossthe
glob e.
TheDPOSalgorithmhastheadvantageofb eingquitesimpleandstraight-
forward.Itcangeneratenewblo cksquiteoftensay,onceeverytwoseconds,
ormayb eevenonceeverysecond,^25 b ecauseofitsrelianceondesignatedblo ck
pro ducersknowninadvance.
However,DPOSrequiresallno desoratleastallvalidatorstovalidate
allblo cksreceived,b ecauseavalidatorpro ducingandsigninganewblo ck

(^25) Somep eopleevenclaimDPOSblo ckgenerationtimesofhalfasecond,whichdo es
notseemrealisticifvalidatorsarescatteredacrossseveralcontinents.


```
2.8.ClassificationofBlockchainProjects
```
conrmsnotonlytherelativevalidityofthisblo ck,butalsothevalidityof
thepreviousblo ckitrefersto,andalltheblo cksfurtherbackinthechain
(mayb eupto the b eginningofthe p erio dof resp onsibilityof the current
subsetofvalidators). Thereisapredeterminedorderonthecurrentsubset
of validators, so that foreach blo ck there isa designated pro ducer (i.e.,
validatorexp ectedto generatethat blo ck);thesedesignatedpro ducersare
rotatedinaround-robinfashion.Inthisway,ablo ckisatrstsignedonlyby
itspro ducingvalidator;then,whenthenextblo ckismined,anditspro ducer
cho osestorefertothisblo ckandnottooneofitspredecessors(otherwise
itsblo ckwould lieinashorterchain, whichmightlosethe longestfork
comp etitioninthefuture),thesignatureofthenextblo ckisessentiallyan
additionalsignatureonthepreviousblo ckaswell. Inthisway,anewblo ck
graduallycollectsthesignaturesofmorevalidatorssay,twentysignatures
inthe timeneeded to generatethe next twentyblo cks. Afullno de will
either need to waitfor these twenty signatures, or validatethe blo ck by
itself,startingfromasucientlyconrmedblo ck(say,twentyblo cksback),
whichmightb enotsoeasy.
The obviousdisadvantageof theDPOSalgorithmisthat anewblo ck
(andtransactionscommittedintoit) achievesthesame levelof trust(re-
cursivereliabilityasdiscussedin2.6.28)onlyaftertwentymoreblo cksare
mined, comparedto theBFT algorithms,whichdeliverthislevelof trust
(say,twentysignatures)immediately. AnotherdisadvantageisthatDPOS
usesthelongestforkwinsapproachforswitchingtootherforks;thismakes
forksquiteprobableifat leastsome pro ducersfailto pro ducesubsequent
blo cksaftertheoneweareinterestedin(orwefailtoobservetheseblo cks
b ecauseofanetworkpartitionorasophisticatedattack).
Web elievethattheBFTapproach,whilemoresophisticatedto imple-
mentandrequiringlongertimeintervalsb etweenblo cksthanDPOS,isb et-
ter adaptedto tightly-coupled (cf.2.8.14)multichain systems, b ecause
otherblo ckchains canstartactingalmostimmediatelyafterseeingacom-
mittedtransaction(e.g.,generatingamessageintendedforthem)inanew
blo ck, withoutwaiting fortwenty conrmationsof validity (i.e.,the next
twentyblo cks),orwaitingforthenextsixblo ckstob esurethat noforks
app earandverifyingthenewblo ckbythemselves(verifyingblo cksofother
blo ckchainsmayb ecomeprohibitiveinascalablemulti-chainsystem).Thus
theycanachievescalabilitywhilepreservinghighreliabilityandavailability
(cf.2.8.12).
Ontheotherhand,DPOSmightb eago o dchoiceforalo osely-coupled


```
2.8.ClassificationofBlockchainProjects
```
multi-chainsystem, wherefastinteraction b etween blo ckchains isnot re-
quired  e.g., if each blo ckchain(workchain) represents a separate dis-
tributedexchange,andinter-blo ckchaininteractionislimitedtoraretransfers
oftokensfromoneworkchain intoanother(or,rather, tradingonealtcoin
residinginoneworkchainfor anotherata rateapproaching1 : 1). This
iswhatisactuallydoneintheBitSharespro ject, whichusesDPOSquite
successfully.
Tosummarize,whileDPOScangeneratenewblo cksandincludetrans-
actionsintothemfaster(withsmallerintervalsb etweenblo cks),thesetrans-
actionsreachtheleveloftrustrequiredtousetheminotherblo ckchainsand
o-chainapplications as committed andimmutable much more slow ly
thaninthe BFTsystemssay,inthirty seconds^26 instead ofve. Faster
transactioninclusion do esnotmeanfaster transactioncommitment. This
couldb ecomeahugeproblemiffastinter-blo ckchaininteractionisrequired.
Inthatcase,onemustabandonDPOSandoptforBFTPoSinstead.

2.8.6. Supp ort for Turing-complete co dein transactions, i.e., es-
sentiallyarbitrarysmartcontracts. Blo ckchainpro jectsnormallycol-
lectsome transactionsintheirblo cks, whichalter theblo ckchainstatein
away deemed useful(e.g., transfer some amountof crypto currency from
oneaccounttoanother). Someblo ckchainpro jectsmightallowonlysome
sp ecicpredenedtyp esoftransactions(suchasvaluetransfersfromoneac-
counttoanother,providedcorrectsignaturesarepresented). Othersmight
supp ortsome limitedformofscripting inthetransactions. Finally, some
blo ckchainssupp orttheexecutionofarbitrarilycomplexco deintransactions,
enablingthesystem(atleastinprinciple)tosupp ortarbitraryapplications,
providedthep erformanceofthesystemp ermits. Thisisusuallyasso ciated
withTuring-completevirtualmachinesandscriptinglanguages (meaning
thatanyprogramthatcanb ewritteninanyothercomputinglanguagemay
b ere-writtentob ep erformedinsidetheblo ckchain),andsmartcontracts
(whichareprogramsresidingintheblo ckchain).
Ofcourse,supp ortforarbitrarysmartcontractsmakesthesystemtruly
exible.Ontheotherhand,thisexibilitycomesatacost: theco deofthese
smartcontractsmustb eexecutedonsome virtualmachine,andthismust
b edoneeverytimeforeachtransactionintheblo ckwhensomeb o dywants

(^26) Forinstance,EOS,oneoftheb estDPOSpro jectsprop oseduptothisdate,promises
a45-secondconrmationandinter-blo ckchaininteractiondelay(cf.[5],TransactionCon-
rmationandLatencyofInterchainCommunicationsections).


```
2.8.ClassificationofBlockchainProjects
```
tocreateorvalidateablo ck.Thisslowsdownthep erformanceofthesystem
comparedtothecaseofapredenedandimmutablesetoftyp esofsimple
transactions,whichcanb eoptimizedbyimplementingtheirpro cessingina
languagesuchasC++(insteadofsomevirtualmachine).
Ultimately,supp ortforTuring-completesmartcontractsseemstob ede-
sirableinanygeneral-purp oseblo ckchainpro ject;otherwise, thedesigners
ofthe blo ckchainpro ject mustdecideinadvancewhichapplicationstheir
blo ckchainwillb eusedfor. Infact,thelackofsupp ortforsmartcontracts
inthe Bitcoinblo ckchainwasthe principalreasonwhyanew blo ckchain
pro ject,Ethereum,hadtob ecreated.
Ina(heterogeneous;cf.2.8.8)multi-chainsystem,onemighthavethe
b estofb othworldsbysupp ortingTuring-completesmartcontractsinsome
blo ckchains(i.e.,workchains),andasmallpredenedsetofhighly-optimized
transactionsinothers.

2.8.7. Classication of multichain systems. Sofar, theclassication
wasvalidb othforsingle-chainandmulti-chainsystems. However, multi-
chainsystemsadmitseveralmoreclassicationcriteria,reectingtherela-
tionshipb etweenthedierent blo ckchainsinthesystem. We nowdiscuss
thesecriteria.

2.8.8.Blo ckchaintyp es: homogeneousandheterogeneoussystems.
Inamulti-chainsystem,allblo ckchainsmayb eessentiallyofthesametyp e
andhavethesamerules(i.e.,usethesameformatoftransactions,thesame
virtualmachineforexecutingsmart-contractco de,sharethesamecrypto cur-
rency,andsoon),andthissimilarityisexplicitlyexploited,butwithdierent
dataineachblo ckchain.Inthiscase,wesaythatthesystemishomogeneous.
Otherwise,dierentblo ckchains(whichwillusuallyb ecalledworkchains in
thiscase)canhavedierentrules. Thenwesaythatthesystemishetero-
geneous.

2.8.9. Mixed heterogeneous-homogeneous systems. Sometimeswe
have a mixed system, where there are several sets of typ es or rules for
blo ckchains,butmanyblo ckchainswiththesamerulesarepresent,andthis
factisexplicitlyexploited. Thenitisamixedheterogeneous-homogeneous
system.Toourknowledge,theTONBlo ckchainistheonlyexampleofsuch
asystem.

2.8.10.Heterogeneoussystemswithseveralworkchainshavingthe
samerules,orconfederations.Insomecases,severalblo ckchains(work-


```
2.8.ClassificationofBlockchainProjects
```
chains)withthesamerulescanb epresentinaheterogeneoussystem,butthe
interactionb etweenthemisthesameasb etweenblo ckchainswithdierent
rules(i.e.,theirsimilarityisnotexploitedexplicitly). Eveniftheyapp ear
tousethesamecrypto currency,theyinfactusedierentaltcoins(inde-
p endentincarnationsofthecrypto currency).Sometimesonecanevenhave
certainmechanismstoconvertthesealtcoinsataratenearto1 : 1. How-
ever,thisdo esnotmakethesystemhomogeneousinourview; itremains
heterogeneous. Wesaythatsuchaheterogeneouscollectionofworkchains
withthesamerulesisaconfederation.
Whilemakingaheterogeneoussystemthatallowsonetocreateseveral
workchainswiththesamerules(i.e.,aconfederation)mayseemacheapway
of buildingascalablesystem, this approach hasalot ofdrawbacks, to o.
Essentially,ifsomeonehosts alargepro jectinmanyworkchainswiththe
samerules, she do es notobtainalargepro ject, butratheralotof small
instancesofthispro ject. Thisislikehavingachatapplication(oragame)
thatallowshavingat most 50 memb ersinany chat(or game)ro om,but
scalesbycreatingnewro omstoaccommo datemoreuserswhennecessary.
Asaresult,alotofuserscanparticipateinthechatsorinthegame,but
canwesaythatsuchasystemistrulyscalable?

2.8.11.Presenceofamasterchain, externalorinternal. Sometimes,
amulti-chainpro jecthas adistinguishedmasterchain (sometimescalled
controlblo ckchain),whichisused,forexample,tostoretheoverallcong-
urationofthesystem(thesetofallactiveblo ckchains,orratherworkchains),
thecurrentsetofvalidators(foraPro of-of-Stakesystem),andsoon.Some-
timesotherblo ckchainsareb oundtothemasterchain,forexamplebycom-
mittingthehashesoftheirlatestblo cksintoit(thisissomethingtheTON
Blo ckchaindo es,to o).
Insomecases,themasterchainisexternal,meaningthatitisnotapart
ofthepro ject,butsomeotherpre-existingblo ckchain,originallycompletely
unrelatedtoitsusebythenewpro jectandagnosticofit.Forexample,one
cantryto use theEthereum blo ckchainasamasterchain foran external
pro ject,andpublishsp ecialsmartcontractsintotheEthereumblo ckchain
forthispurp ose(e.g.,forelectingandpunishingvalidators).

2.8.12. Sharding supp ort. Someblo ckchainpro jects(orsystems)have
nativesupp ortforsharding,meaningthatseveral(necessarilyhomogeneous;
cf. 2.8.8)blo ckchains are thoughtof as shards of a single(from ahigh-
levelp ersp ective)virtualblo ckchain.Forexample,onecancreate 256 shard


```
2.8.ClassificationofBlockchainProjects
```
blo ckchains(shardchains)withthesame rules, andkeepthestateof an
account in exactly oneshard selected dep ending on the rst byte of its
account_id.
Shardingisanaturalapproach toscalingblo ckchainsystems,b ecause,
ifitisprop erlyimplemented,usersandsmartcontractsinthesystemneed
notb eawareoftheexistenceofshardingatall. Infact,oneoftenwantsto
addshardingto anexistingsingle-chainpro ject(suchasEthereum)when
theloadb ecomesto ohigh.
Analternativeapproachtoscalingwouldb etouseaconfederation of
heterogeneousworkchainsasdescrib edin2.8.10,allowingeachusertokeep
heraccountinoneor severalworkchainsofherchoice, andtransfer funds
fromheraccount inoneworkchain toanother workchainwhennecessary,
essentiallyp erforminga1 : 1altcoinexchangeop eration. Thedrawbacksof
thisapproachhavealreadyb eendiscussedin2.8.10.
However,shardingisnotsoeasytoimplementinafastandreliablefash-
ion,b ecauseitimpliesalotofmessagesb etweendierentshardchains. For
example,ifaccountsareevenlydistributedb etweenN shards,andtheonly
transactionsaresimplefundtransfersfromoneaccounttoanother,thenonly
asmallfraction( 1 /N)ofalltransactionswillb ep erformedwithinasingle
blo ckchain;almostall( 1 − 1 /N)transactionswillinvolvetwoblo ckchains,
requiringinter-blo ckchaincommunication. Ifwewantthesetransactionsto
b efast,weneedafastsystemfortransferringmessagesb etweenshardchains.
Inotherwords,theblo ckchainpro jectneedstob etightly-coupledinthe
sensedescrib edin2.8.14.

2.8.13.Dynamic and static sharding. Shardingmightb edynamic(if
additionalshardsareautomaticallycreatedwhennecessary)orstatic(when
thereisapredenednumb erofshards,whichischangeableonlythrougha
hardforkatb est).Mostshardingprop osalsarestatic;theTONBlo ckchain
usesdynamicsharding(cf.2.7).

2.8.14.Interactionb etweenblo ckchains: lo osely-coupledandtightly-
coupledsystems. Multi-blo ckchainpro jectscanb eclassiedaccordingto
thesupp ortedlevelofinteractionb etweentheconstituentblo ckchains.
Theleastlevelofsupp ortistheabsenceofanyinteractionb etweendif-
ferentblo ckchainswhatso ever. Wedonotconsiderthiscasehere,b ecause
wewouldrathersaythattheseblo ckchainsarenotpartsofoneblo ckchain
system,butjustseparateinstancesofthesameblo ckchainproto col.


```
2.8.ClassificationofBlockchainProjects
```
The next level of supp ort is the absence of any sp ecic supp ort for
messaging b etween blo ckchains, making interaction p ossible in principle,
butawkward. We callsuch systemslo osely-coupled; inthemonemust
sendmessagesandtransfervalueb etweenblo ckchains asiftheyhadb een
blo ckchainsb elongingtocompletelyseparateblo ckchainpro jects(e.g.,Bit-
coinandEthereum; imaginetwopartieswantto exchangesome Bitcoins,
keptintheBitcoinblo ckchain,intoEthers,keptintheEthereumblo ckchain).
Inotherwords,onemustincludetheoutb oundmessage(oritsgenerating
transaction)inablo ckofthesourceblo ckchain. Thenshe(orsomeother
party)mustwaitforenoughconrmations(e.g.,agivennumb erofsubse-
quentblo cks)toconsidertheoriginatingtransactiontob ecommitted and
immutable,soas tob eableto p erformexternalactionsbasedonitsex-
istence. Onlythenmayatransactionrelayingthemessageintothetarget
blo ckchain(p erhapsalongwithareferenceandaMerklepro ofofexistence
fortheoriginatingtransaction)b ecommitted.
Ifonedo esnotwaitlongenough b eforetransferringthemessage,or if
aforkhapp ensanywayforsomeotherreason,thejoinedstateofthetwo
blo ckchains turnsoutto b e inconsistent: a messageis deliveredintothe
secondblo ckchainthathasneverb eengeneratedin(theultimatelychosen
forkof )therstblo ckchain.
Sometimespartialsupp ortformessagingisadded,bystandardizingthe
formatofmessagesandthelo cationofinputandoutputmessagequeuesin
theblo cksofall workchains(this isesp eciallyusefulinheterogeneoussys-
tems).Whilethisfacilitatesmessagingtoacertainextent,itisconceptually
notto odierentfromthepreviouscase, sosuchsystemsarestilllo osely-
coupled.
Bycontrast,tightly-coupledsystemsincludesp ecialmechanismstopro-
videfastmessagingb etweenallblo ckchains. Thedesiredb ehavioristob e
abletodeliveramessageintoanotherworkchainimmediatelyafterithas
b eengeneratedinablo ckoftheoriginatingblo ckchain.Ontheotherhand,
tightly-coupledsystemsarealsoexp ectedtomaintainoverallconsistency
inthecaseofforks.Whilethesetworequirementsapp eartob econtradictory
atrstglance,web elievethatthemechanismsusedbytheTONBlo ckchain
(theinclusionof shardchainblo ckhashes intomasterchainblo cks;theuse
ofverticalblo ckchainsforxinginvalidblo cks,cf.2.1.17;hyp ercub erout-
ing,cf. 2.4.19; Instant Hyp ercub eRouting, cf. 2.4.20)enableittob e a
tightly-coupledsystem,p erhapstheonlyonesofar.
Ofcourse,buildingalo osely-coupledsystemismuchsimpler;however,


```
2.8.ClassificationofBlockchainProjects
```
fastandecientsharding(cf.2.8.12)requiresthe systemto b etightly-
coupled.

2.8.15.Simpliedclassication. Generationsofblo ckchainpro jects.
Theclassicationwehavesuggestedsofarsplitsallblo ckchainpro jectsinto
alargenumb erofclasses.However,theclassicationcriteriaweusehapp en
tob equitecorrelatedinpractice. Thisenablesusto suggestasimplied
generationalapproachtotheclassicationofblo ckchainpro jects,asavery
roughapproximationofreality,withsomeexamples.Pro jectsthathavenot
b eenimplementedanddeployedyetareshowninitalics;themostimp ortant
characteristicsofagenerationareshowninb old.

```
 Firstgeneration:Single-chain,PoW,nosupp ortforsmartcontracts.
Examples:Bitcoin(2009)andalotofotherwiseuninterestingimitators
(Litecoin,Monero,... ).
```
```
 Secondgeneration:Single-chain,PoW,smart-contractsupp ort.Ex-
ample:Ethereum(2013;deployedin2015),atleastinitsoriginalform.
```
```
 Thirdgeneration: Single-chain,PoS,smart-contractsupp ort. Exam-
ple: futureEthereum(2018orlater).
```
```
 Alternativethird( 3 ′)generation: Multi-chain, PoS,nosupp ortfor
smartcontracts,lo osely-coupled.Example:Bitshares(20132014;uses
DPOS).
```
```
 Fourthgeneration: Multi-chain, PoS, smart-contract supp ort,
lo osely-coupled.Examples:EOS(2017;usesDPOS),PolkaDot(2016;
usesBFT).
```
```
 Fifthgeneration:Multi-chain,PoSwithBFT,smart-contractsupp ort,
tightly-coupled,withsharding. Examples:TON(2017).
```
Whilenotallblo ckchainpro jectsfallpreciselyintooneofthesecategories,
mostofthemdo.

2.8.16. Complications of changing the genome of a blo ckchain
pro ject. The ab ove classicationdenes the genome of a blo ckchain
pro ject. Thisgenomeisquiterigid: itisalmostimp ossibletochangeit
oncethepro jectisdeployedandisusedbyalotofp eople.Onewouldneeda
seriesofhardforks(whichwouldrequiretheapprovalofthema jorityofthe


```
2.9.ComparisontoOtherBlockchainProjects
```
community),andeventhenthechangeswouldneedtob everyconservative
inorderto preservebackwardcompatibility(e.g., changing thesemantics
ofthevirtualmachinemightbreakexistingsmartcontracts). Analterna-
tivewouldb etocreatenewsidechainswiththeirdierentrules,andbind
themsomehowtotheblo ckchain(ortheblo ckchains)oftheoriginalpro ject.
Onemightusetheblo ckchainoftheexistingsingle-blo ckchainpro jectasan
externalmasterchainforanessentiallynewandseparatepro ject.^27
Our conclusionisthatthe genomeofapro jectisveryhardto change
onceithasb eendeployed.EvenstartingwithPoWandplanningtoreplace
itwithPoSinthefutureisquitecomplicated.^28 Addingshardstoapro ject
originallydesignedwithoutsupp ortforthemseemsalmostimp ossible.^29 In
fact, adding supp ort forsmart contractsinto apro ject (namely,Bitcoin)
originallydesignedwithoutsupp ortforsuchfeatureshasb eendeemedim-
p ossible(oratleastundesirablebythema jorityoftheBitcoincommunity)
andeventuallyledtothecreationofanewblo ckchainpro ject,Ethereum.

2.8.17. Genome of theTON Blo ckchain. Therefore, ifonewantsto
builda scalableblo ckchainsystem, onemustcho ose its genome carefully
fromtheveryb eginning. Ifthesystemismeanttosupp ortsomeadditional
sp ecicfunctionalityinthefuturenotknownatthetimeofitsdeployment,
itshouldsupp ort heterogeneous workchains(having p otentiallydierent
rules)fromthestart. Forthesystemtob etrulyscalable,itmustsupp ort
shardingfromtheveryb eginning;shardingmakessenseonlyifthesystem
istightly-coupled(cf.2.8.14),sothisinturn impliestheexistenceof a
masterchain,afastsystemofinter-blo ckchainmessaging,usageofBFTPoS,
andsoon.
Whenonetakesintoaccountalltheseimplications,mostofthedesign
choicesmade fortheTONBlo ckchainpro jectapp earnatural, andalmost
theonlyonesp ossible.

(^27) Forexample,thePlasmapro jectplanstousetheEthereumblo ckchainasits(external)
masterchain;itdo esnotinteractmuchwithEthereumotherwise,anditcouldhaveb een
suggestedandimplementedbyateamunrelatedtotheEthereumpro ject.
(^28) As of2017, Ethereumisstill struggling totransition fromPoWto acombined
PoW+PoSsystem;wehop eitwillb ecomeatrulyPoSsystemsomeday.
(^29) Thereareshardingprop osalsforEthereumdatingbackto2015;itisunclearhow
theymightb eimplementedanddeployedwithoutdisruptingEthereumorcreatingan
essentiallyindep endentparallelpro ject.


### 2.9 ComparisontoOtherBlo ckchainPro jects

```
Pro ject Year G. Cons. Sm. Ch. R. Sh. Int.
Bitcoin 2009 1 PoW no 1
Ethereum 2013, 2015 2 PoW yes 1
NXT 2014 2+ PoS no 1
Tezos 2017,? 2+ PoS yes 1
Casp er 2015,(2017) 3 PoW/PoS yes 1
BitShares 2013, 2014 3 ′ DPoS no m ht. no L
EOS 2016,(2018) 4 DPoS yes m ht. no L
PolkaDot 2016,(2019) 4 PoSBFT yes m ht. no L
Cosmos 2017,? 4 PoSBFT yes m ht. no L
TON 2017,(2018) 5 PoSBFT yes m mix dyn. T
```
Table1:Asummaryofsomenotableblo ckchainpro jects. Thecolumnsare:Projectpro jectname;
Yearyearannouncedandyeardeployed;G.generation(cf.2.8.15);Cons. consensusalgorithm
(cf.2.8.3and2.8.4);Sm.supp ortforarbitraryco de(smartcontracts;cf.2.8.6);Ch.single/multiple
blo ckchainsystem(cf.2.8.2);R.heterogeneous/homogeneousmultichainsystems(cf.2.8.8);Sh. 
shardingsupp ort(cf.2.8.12);Int.interactionb etweenblo ckchains,(L)o oseor(T)ight(cf.2.8.14).

### 2.9 ComparisontoOther Blo ckchainPro jects

WeconcludeourbriefdiscussionoftheTONBlo ckchainanditsmostimp or-
tantanduniquefeaturesbytryingtondaplaceforitonamapcontaining
existingandprop osedblo ckchainpro jects. Weusetheclassicationcriteria
describ edin2.8todiscuss dierentblo ckchainpro jectsinauniform way
andconstructsuchamapofblo ckchainpro jects.Werepresentthismapas
Table1,andthenbrieydiscussafewpro jectsseparatelytop ointouttheir
p eculiaritiesthatmaynottintothegeneralscheme.

2.9.1.Bitcoin[12];https://bitcoin.org/.Bitcoin(2009)istherstand
themostfamousblo ckchainpro ject.Itisatypicalrst-generationblo ckchain
pro ject: itissingle-chain,itusesPro of-of-Workwithalongest-fork-wins
forkselectionalgorithm,anditdo esnothaveaTuring-completescripting
language(however,simplescriptswithoutlo opsaresupp orted). TheBit-
coinblo ckchainhasno notionof anaccount;itusestheUTXO(Unsp ent
TransactionOutput)mo delinstead.

2.9.2. Ethereum [2]; https://ethereum.org/. Ethereum (2015)isthe
rstblo ckchainwithsupp ortforTuring-completesmartcontracts.Assuch,
itisatypicalsecond-generationpro ject,andthemostp opularamongthem.
ItusesPro of-of-Workonasingleblo ckchain,buthassmartcontractsand
accounts.


```
2.9.ComparisontoOtherBlockchainProjects
```
2.9.3. NXT;https://nxtplatform.org/. NXT (2014)istherst PoS-
basedblo ckchainand currency. Itisstill single-chain,and hasno smart
contractsupp ort.

2.9.4. Tezos; https://www.tezos.com/. Tezos (2018or later)isapro-
p osedPoS-basedsingle-blo ckchainpro ject. Wementionithereb ecauseof
itsuniquefeature: itsblo ckinterpretationfunctionev_block(cf.2.2.6)is
notxed,butisdeterminedbyanOCamlmo dule,whichcanb eupgraded
bycommittinganewversionintotheblo ckchain(andcollectingsomevotes
forthe prop osedchange). Inthisway, onewillb e abletocreatecustom
single-chainpro jectsbyrstdeployingavanillaTezosblo ckchain,andthen
graduallychangingtheblo ckinterpretationfunctioninthedesireddirection,
withoutanyneedforhardforks.
Thisidea,whileintriguing,hastheobviousdrawbackthatitforbidsany
optimizedimplementationsinotherlanguageslikeC++,soaTezos-based
blo ckchainisdestinedtohavelowerp erformance. Wethinkthatasimilar
resultmighthaveb eenobtainedbypublishingaformalspecicationofthe
prop osedblo ckinterpretationfunctionev_trans,withoutxingaparticular
implementation.

2.9.5.Casp er.^30 Casper isanup comingPoSalgorithmforEthereum;its
gradualdeploymentin 2017 (or2018),ifsuccessful,willchangeEthereuminto
asingle-chainPoSormixedPoW+PoSsystemwithsmartcontractsupp ort,
transformingEthereumintoathird-generationpro ject.

2.9.6.BitShares[8];https://bitshares.org.BitShares(2014)isaplat-
formfordistributedblo ckchain-basedexchanges.Itisaheterogeneousmulti-
blo ckchainDPoSsystemwithoutsmartcontracts;itachievesitshighp er-
formancebyallowingonlyasmallsetofpredenedsp ecializedtransaction
typ es,whichcanb eecientlyimplementedinC++,assumingtheblo ckchain
statetsintomemory.Itisalsotherstblo ckchainpro jecttouseDelegated
Pro of-of-Stake(DPoS),demonstratingitsviabilityatleastforsomesp ecial-
izedpurp oses.

2.9.7.EOS [5];https://eos.io. EOS (2018orlater)isaprop osedhet-
erogeneousmulti-blo ckchainDPoSsystemwithsmartcontractsupp ortand
withsomeminimalsupp ortformessaging(stilllo osely-coupledinthesense
describ edin2.8.14).Itisanattemptbythesameteamthathaspreviously

(^30) https://blog.ethereum.org/2015/08/01/introducing- casper- friendly- ghost/


```
2.9.ComparisontoOtherBlockchainProjects
```
successfullycreatedtheBitSharesandSteemItpro jects,demonstratingthe
strongp ointsoftheDPoSconsensusalgorithm. Scalabilitywillb eachieved
bycreatingsp ecializedworkchainsforpro jectsthatneedit(e.g.,adistributed
exchangemightuseaworkchainsupp ortingasp ecialsetofoptimizedtrans-
actions,similarlytowhatBitSharesdid)andbycreatingmultipleworkchains
withthesamerules(confederations inthesensedescrib edin2.8.10). The
drawbacksandlimitationsofthisapproachtoscalabilityhaveb eendiscussed
inloc.cit. Cf.also2.8.5,2.8.12,and2.8.14foramoredetaileddiscussion
ofDPoS,sharding,interactionb etweenworkchainsandtheirimplicationsfor
thescalabilityofablo ckchainsystem.
At the sametime, evenif onewillnot b eableto create aFaceb o ok
insideablo ckchain(cf.2.9.13),EOSorotherwise,wethinkthatEOSmight
b ecomeaconvenientplatformforsomehighly-sp ecializedweaklyinteracting
distributedapplications,similartoBitShares(decentralizedexchange)and
SteemIt(decentralizedblogplatform).

2.9.8.PolkaDot [17];https://polkadot.io/. PolkaDot (2019orlater)
isoneoftheb estthought-outandmostdetailedprop osedmultichainPro of-
of-Stakepro jects;itsdevelopmentisledbyoneoftheEthereumco-founders.
Thispro jectisoneoftheclosestpro jectstotheTONBlo ckchainonourmap.
(Infact,weareindebtedforourterminologyforshermenandnominators
tothePolkaDotpro ject.)
PolkaDot is aheterogeneous lo osely-coupled multichainPro of-of-Stake
pro ject, withByzantine FaultTolerant(BFT) consensusforgenerationof
newblo cksandamasterchain(whichmightb eexternale.g.,theEthereum
blo ckchain).Italsouseshyp ercub erouting,somewhatlike(theslowversion
of )TON'sasdescrib edin2.4.19.
Itsuniquefeatureisitsabilitytocreatenotonlypublic,butalsoprivate
blo ckchains. Theseprivateblo ckchainswouldalsob eabletointeractwith
otherpublicblo ckchains,PolkaDotorotherwise.
Assuch,PolkaDotmightb ecomeaplatformforlarge-scaleprivateblo ck-
chains,whichmightb eused,forexample,bybankconsortiumstoquickly
transferfundstoeachother,orforanyotherusesalargecorp orationmight
haveforprivateblo ckchaintechnology.
However, PolkaDothasnoshardingsupp ortandisnottightly-coupled.
Thissomewhathamp ersitsscalability,whichissimilartothatofEOS.(Per-
hapsabitb etter,b ecausePolkaDotusesBFTPoSinsteadofDPoS.)

2.9.9.Universa;https://universa.io.Theonlyreasonwementionthis


```
2.9.ComparisontoOtherBlockchainProjects
```
unusualblo ckchainpro jecthere isb ecauseitistheonlypro jectso farto
makeinpassing anexplicit reference tosomething similartoour Innite
ShardingParadigm(cf.2.1.2). Itsotherp eculiarityisthatitbypassesall
complicationsrelatedtoByzantineFaultTolerancebypromisingthatonly
trustedandlicensedpartnersofthepro jectwillb eadmittedasvalidators,
hencetheywillnevercommitinvalidblo cks.Thisisaninterestingdecision;
however, itessentially makesablo ckchainpro jectdelib eratelycentralized,
somethingblo ckchainpro jectsusuallywanttoavoid(whydo esoneneeda
blo ckchainatalltoworkinatrustedcentralizedenvironment?).

2.9.10. Plasma; https://plasma.io). Plasma (2019?) isan unconven-
tionalblo ckchainpro jectfromanotherco-founderofEthereum. Itissup-
p osedtomitigatesomelimitationsofEthereumwithoutintro ducingshard-
ing. Inessence,itisaseparatepro jectfromEthereum,intro ducingahier-
archyof(heterogeneous)workchains,b oundtotheEthereumblo ckchain(to
b eusedasanexternalmasterchain)atthetoplevel. Fundscanb etrans-
ferredfromanyblo ckchainupinthehierarchy(startingfromtheEthereum
blo ckchainasthero ot),alongwithadescriptionofajobtob edone. Then
the necessarycomputationsaredone inthe child workchain (p ossiblyre-
quiringforwardingofpartsoftheoriginaljobfurtherdownthetree),their
resultsarepassedup,andarewardiscollected. Theproblemofachieving
consistencyandvalidatingtheseworkchainsiscircumventedbya(payment
channel-inspired)mechanismallowingusers to unilaterallywithdrawtheir
fundsfromamisb ehavingworkchaintoitsparentworkchain(alb eitslowly),
andre-allo catetheirfundsandtheirjobstoanotherworkchain.
In thisway, Plasmamight b ecomea platformfor distributed compu-
tationsb oundtotheEthereumblo ckchain,somethinglikeamathematical
co-pro cessor.However,thisdo esnotseemlikeawaytoachievetruegeneral-
purp osescalability.

2.9.11.Sp ecializedblo ckchainpro jects.Therearealsosomesp ecialized
blo ckchainpro jects,suchasFileCoin(asystemthatincentivizesuserstooer
theirdiskspaceforstoringthelesofotheruserswhoarewillingtopayfor
it),Golem(ablo ckchain-basedplatformforrentingandlendingcomputing
p owerforsp ecializedapplicationssuchas3D-rendering)orSONM(another
similarcomputingp ower-lendingpro ject). Such pro jectsdonotintro duce
anythingconceptuallynew onthelevelof blo ckchainorganization; rather,
theyareparticularblo ckchainapplications,whichcouldb eimplementedby
smart contractsrunningina general-purp ose blo ckchain, providedit can


```
2.9.ComparisontoOtherBlockchainProjects
```
delivertherequiredp erformance. Assuch,pro jectsofthiskindarelikely
touseoneoftheexistingorplannedblo ckchainpro jectsastheirbase,such
asEOS,PolkaDotor TON.Ifapro jectneedstruescalability (basedon
sharding),itwouldb etteruseTON;ifitiscontenttoworkinaconfederated
contextbydening afamilyofworkchainsofitsown,explicitlyoptimized
foritspurp ose,itmightoptforEOSorPolkaDot.

2.9.12. The TONBlo ckchain. TheTON (TheOp enNetwork) Blo ck-
chain(planned2018)isthepro jectwearedescribinginthisdo cument.Itis
designedtob etherstfth-generationblo ckchainpro jectthatis,aBFT
PoS-multichain pro ject, mixed homogeneous/heterogeneous, with supp ort
for(shardable)customworkchains,withnativeshardingsupp ort,andtightly-
coupled(inparticular,capableofforwardingmessagesb etweenshardsalmost
instantlywhilepreservingaconsistentstateofall shardchains). As such,
itwill b ea truly scalablegeneral-purp ose blo ckchainpro ject, capable of
accommo datingessentiallyanyapplications thatcanb eimplementedina
blo ckchainatall. Whenaugmentedbytheothercomp onentsoftheTON
Pro ject(cf. 1 ),itsp ossibilitiesexpandevenfurther.

2.9.13.Isitp ossibletouploadFaceb o okintoablo ckchain?Some-
timesp eopleclaimthatitwillb ep ossibletoimplementaso cialnetworkon
thescaleofFaceb o okasadistributedapplicationresidinginablo ckchain.
Usuallyafavoriteblo ckchainpro jectiscitedasap ossiblehostforsuchan
application.
Wecannotsaythatthisisatechnicalimp ossibility.Ofcourse,oneneeds
atightly-coupledblo ckchainpro jectwithtruesharding(i.e.,TON)inorder
forsuchalargeapplicationnotto workto oslowly(e.g., delivermessages
andup datesfromusersresidinginoneshardchaintotheirfriendsresidingin
anothershardchainwithreasonabledelays). However,wethinkthatthisis
notneededandwillneverb edone,b ecausethepricewouldb eprohibitive.
LetusconsideruploadingFaceb o okintoablo ckchainasathoughtex-
p eriment;anyotherpro jectofsimilarscalemightserveasanexampleaswell.
OnceFaceb o okisuploadedintoablo ckchain,allop erationscurrentlydone
byFaceb o ok'sserverswillb eserializedastransactionsincertainblo ckchains
(e.g.,TON'sshardchains),andwillb ep erformedbyallvalidatorsofthese
blo ckchains.Eachop erationwillhavetob ep erformed,say,atleasttwenty
times,ifweexp ecteveryblo cktocollectatleasttwentyvalidatorsignatures
(immediatelyoreventually,asinDPOSsystems).Similarly,alldatakeptby


```
2.9.ComparisontoOtherBlockchainProjects
```
Faceb o ok'sserversontheirdiskswillb ekeptonthedisksofallvalidators
forthecorresp ondingshardchain(i.e.,inatleasttwentycopies).
Becausethevalidatorsareessentiallythesameservers(orp erhapsclus-
tersofservers,butthisdo esnotaectthevalidityofthisargument)asthose
currentlyusedbyFaceb o ok,weseethatthetotalhardwareexp ensesasso ci-
atedwithrunningFaceb o okinablo ckchainareatleasttwentytimeshigher
thanifitwereimplementedintheconventionalway.
Infact,theexp enseswouldb emuchhigherstill,b ecausetheblo ckchain's
virtualmachineisslowerthanthebareCPU runningoptimizedcompiled
co de,anditsstorageisnotoptimizedforFaceb o ok-sp ecicproblems. One
mightpartiallymitigatethisproblembycraftingasp ecicworkchainwith
some sp ecial transactions adapted for Faceb o ok; this is the approach of
BitShares andEOStoachieving high p erformance, availableinthe TON
Blo ckchainaswell. However, thegeneralblo ckchaindesignwouldstillim-
p osesomeadditionalrestrictionsbyitself,suchasthenecessitytoregister
allop erationsastransactionsinablo ck,toorganizethesetransactionsina
Merkletree,tocomputeandchecktheirMerklehashes,topropagatethis
blo ckfurther,andsoon.
Therefore,aconservativeestimateisthatonewouldneed 100 timesmore
serversofthesamep erformanceasthoseusedbyFaceb o oknowinorderto
validateablo ckchainpro jecthostingaso cialnetworkofthatscale. Some-
b o dywillhavetopayfortheseservers,eitherthecompanyowningthedis-
tributedapplication(imagineseeing 700 adsoneachFaceb o okpageinstead
of7)oritsusers.Eitherway,thisdo esnotseemeconomicallyviable.
Web elievethatitisnottruethateverythingshouldbeuploadedintothe
blockchain.Forexample,itisnotnecessarytokeepuserphotographsinthe
blo ckchain;registeringthehashesofthesephotographsintheblo ckchainand
keepingthephotographsinadistributedo-chainstorage(suchasFileCoin
orTONStorage)wouldb eab etteridea.ThisisthereasonwhyTONisnot
justablo ckchainpro ject,butacollectionofseveralcomp onents(TONP2P
Network,TONStorage,TONServices)centeredaroundtheTONBlo ckchain
asoutlinedinChapters 1 and 4.


### 3.1 AbstractDatagramNetworkLayer

## 3 TONNetworking

Anyblo ckchainpro jectrequiresnotonlyasp ecicationofblo ckformatand
blo ckchainvalidationrules, butalsoanetworkproto colusedtopropagate
new blo cks,send andcollecttransaction candidatesand so on. In other
words,asp ecializedp eer-to-p eernetworkmustb esetupbyeveryblo ckchain
pro ject.Thisnetworkmustb ep eer-to-p eer,b ecauseblo ckchainpro jectsare
normallyexp ectedtob edecentralized,soonecannotrelyonacentralized
groupofserversanduseconventionalclient-serverarchitecture,as,forin-
stance,classicalonlinebankingapplicationsdo.Evenlightclients(e.g.,light
crypto currencywalletsmartphoneapplications),whichmustconnecttofull
no desinaclient-serverlikefashion,areactuallyfreetoconnecttoanother
fullno de iftheirpreviousp eergo esdown, provided the proto colusedto
connecttofullno desisstandardizedenough.
Whilethenetworkingdemandsofsingle-blo ckchainpro jects,suchasBit-
coinorEthereum,canb emetquiteeasily(oneessentiallyneedstoconstruct
arandomp eer-to-p eeroverlaynetwork,andpropagateallnewblo cksand
transactioncandidatesbyagossipproto col),multi-blo ckchainpro jects,such
astheTONBlo ckchain,aremuchmoredemanding(e.g.,onemustb eableto
subscrib etoup datesofonlysomeshardchains,notnecessarilyallofthem).
Therefore,thenetworkingpartoftheTONBlo ckchainandtheTONPro ject
asawholemeritsatleastabriefdiscussion.
Ontheotherhand,oncethemoresophisticatednetworkproto colsneeded
tosupp orttheTONBlo ckchainareinplace,itturnsoutthattheycaneasily
b eusedforpurp osesnotnecessarilyrelatedtotheimmediatedemandsofthe
TONBlo ckchain,thusprovidingmorep ossibilitiesandexibilityforcreating
newservicesintheTONecosystem.

### 3.1 Abstract DatagramNetworkLayer

Thecornerstoneinbuildingthe TON networkingproto colsisthe (TON)
Abstract(Datagram)NetworkLayer. Itenablesallno destoassumecertain
networkidentities,representedby256-bitabstractnetworkaddresses,and
communicate(senddatagramstoeachother,asarststep)usingonlythese
256-bitnetworkaddressestoidentifythesenderandthereceiver. Inpartic-
ular,onedo esnotneedtoworryab outIPv4orIPv6addresses,UDPp ort
numb ers,andthelike;theyarehiddenbytheAbstractNetworkLayer.


```
3.1.AbstractDatagramNetworkLayer
```
3.1.1.Abstractnetworkaddresses. Anabstractnetworkaddress,oran
abstractaddress, orjust address forshort, isa256-bitinteger,essentially
equaltoa256-bitECCpublickey. Thispublickeycanb egeneratedarbi-
trarily,thuscreatingasmanydierentnetworkidentitiesastheno delikes.
However,onemustknowthecorresp ondingprivate keyinordertoreceive
(anddecrypt)messagesintendedforsuchanaddress.
Infact, theaddressisnot the publickeyitself;instead,itisa256-bit
hash(Hash=sha256)ofaserializedTL-ob ject(cf.2.2.5)thatcandescrib e
severaltyp esofpublickeysandaddressesdep endingonitsconstructor(rst
fourbytes).Inthesimplestcase,thisserializedTL-ob jectconsistsjustofa
4-bytemagicnumb eranda256-bitellipticcurvecryptography(ECC)public
key;inthiscase,theaddresswillequalthehashofthis36-bytestructure.
Onemightuse,however,2048-bitRSAkeys,oranyotherschemeofpublic-
keycryptographyinstead.
Whenano delearnsanotherno de'sabstractaddress,itmustalsoreceive
itspreimage(i.e.,theserializedTL-ob ject,thehashofwhichequalsthat
abstractaddress)orelseitwillnotb eabletoencryptandsenddatagrams
tothataddress.

3.1.2. Lower-level networks. UDP implementation. Fromthep er-
sp ectiveof almost all TON Networkingcomp onents, the only thingthat
existsisanetwork(theAbstractDatagramNetworkingLayer)ableto(un-
reliably)senddatagramsfromoneabstractaddresstoanother. Inprinciple,
theAbstractDatagramNetworkingLayer(ADNL)canb eimplementedover
dierentexistingnetworktechnologies.However,wearegoingtoimplement
itoverUDPinIPv4/IPv6networks(suchastheInternetorintranets),with
anoptionalTCPfallbackifUDPisnotavailable.

3.1.3.SimplestcaseofADNLoverUDP.Thesimplestcaseofsending
adatagramfromasender'sabstractaddresstoanyotherabstractaddress
(withknownpreimage)canb eimplementedasfollows.
Supp osethat thesendersomehowknowsthe IP-addressandthe UDP
p ortof the receiverwhoowns the destinationabstractaddress, andthat
b oththereceiverandthesenderuseabstractaddressesderivedfrom256-bit
ECCpublickeys.
Inthiscase,thesendersimplyaugmentsthedatagramtob esentbyits
ECCsignature(donewithits private key)andits sourceaddress(orthe
preimageofthe sourceaddress,ifthereceiverisnotknowntoknowthat


```
3.1.AbstractDatagramNetworkLayer
```
preimageyet). Theresultisencryptedwiththerecipient'spublickey,em-
b eddedintoaUDPdatagramandsentto theknown IPandp ortof the
recipient.Becausetherst 256 bitsoftheUDPdatagramcontaintherecip-
ient'sabstractaddress,therecipientcanidentifywhichprivatekeyshould
b eusedtodecrypttheremainderofthedatagram. Onlyafterthat isthe
sender'sidentityrevealed.

3.1.4.Lesssecureway,withthesender'saddressinplaintext.Some-
timesalesssecureschemeissucient,whentherecipient'sandthesender's
addressesarekeptinplaintextintheUDPdatagram;thesender'sprivate
keyandtherecipient'spublickeyarecombinedtogetherusingECDH(Ellip-
ticCurveDieHellman)togeneratea256-bitsharedsecret,whichisused
afterwards,alongwitharandom256-bitnoncealsoincludedintheunen-
cryptedpart,toderiveAESkeysusedforencryption.Theintegritymayb e
provided,forinstance,by concatenatingthehashofthe originalplaintext
datatotheplaintextb eforeencryption.
This approach has the advantage that,if more than onedatagram is
exp ectedtob eexchangedb etweenthetwoaddresses,thesharedsecretcan
b ecomputedonlyonceandthencached;thenslowerellipticcurveop erations
willnolongerb erequiredforencryptingordecryptingthenextdatagrams.

3.1.5.Channelsandchannelidentiers. Inthesimplestcase,therst
256 bitsofaUDPdatagramcarryinganemb eddedTONADNLdatagram
willb eequaltotherecipient'saddress.However,ingeneraltheyconstitute
achannelidentier. Therearedierent typ esofchannels. Someofthem
arep oint-to-p oint;theyarecreatedbytwopartieswhowishtoexchangea
lotofdatainthefutureandgenerateasharedsecretbyexchangingseveral
packets encrypted asdescrib ed in3.1.3or 3.1.4, byrunningclassical or
ellipticcurveDieHellman(ifextrasecurityisrequired),orsimplybyone
partygeneratingarandomsharedsecretandsendingittotheotherparty.
Afterthat,achannelidentierisderivedfromthesharedsecretcombined
withsomeadditionaldata(suchasthesender'sandrecipient'saddresses),
forinstanceby hashing,andthatidentierisusedasthe rst 256 bitsof
UDPdatagramscarryingdataencryptedwiththeaidofthatsharedsecret.

3.1.6.Channelasatunnelidentier.Ingeneral,achannel,orchan-
nelidentiersimplyselectsawayofpro cessinganinb oundUDPdatagram,
knowntothereceiver. Ifthechannelisthereceiver'sabstractaddress,the
pro cessingisdoneasoutlinedin3.1.3or3.1.4;ifthechannelisanestab-


```
3.1.AbstractDatagramNetworkLayer
```
lishedp oint-to-p ointchanneldiscussedin3.1.5,thepro cessing consistsin
decryptingthedatagramwiththeaidofthesharedsecretasexplained in
loc.cit.,andsoon.
In particular, achannelidentier canactuallyselectatunnel, when
theimmediaterecipientsimplyforwardsthereceivedmessagetosomeb o dy
elsetheactualrecipientoranotherproxy. Someencryptionordecryption
steps(reminiscentofonionrouting[6]orevengarlicrouting^31 )mightb e
donealong the way, andanotherchannelidentier mightb eusedfor re-
encryptedforwardedpackets(forexample,ap eer-to-p eerchannelcouldb e
employedtoforwardthepackettothenextrecipientonthepath).
Inthisway,somesupp ortfortunnelingandproxyingsomewhatsim-
ilartothatprovidedbytheTORorI^2 Ppro jectscanb eaddedonthelevel
oftheTONAbstractDatagramNetworkLayer,withoutaectingthefunc-
tionalityofallhigher-levelTONnetworkproto cols,whichwouldb eagnostic
ofsuchanaddition.Thisopp ortunityisexploitedbytheTONProxyservice
(cf.4.1.10).

3.1.7. Zero channel and the b o otstrap problem. Normally,aTON
ADNLno dewillhavesomeneighb ortable,containinginformationab out
otherknownno des,suchastheirabstractaddressesandtheirpreimages(i.e.,
publickeys)andtheirIPaddressesandUDPp orts. Thenitwillgradually
extendthistableby usinginformationlearnedfromtheseknownno desas
answerstosp ecialqueries,andsometimespruneobsoleterecords.
However,whenaTONADNLno dejuststartsup,itmayhapp enthatit
do esnotknowanyotherno de,andcanlearnonlytheIPaddressandUDP
p ortofano de,butnotitsabstractaddress. Thishapp ens,forexample,if
alightclientisnotabletoaccessanyofthepreviouslycachedno desand
anyno deshardco dedintothesoftware,andmustasktheusertoenteranIP
addressoraDNSdomainofano de,tob eresolvedthroughDNS.
Inthiscase,theno dewillsendpacketstoasp ecialzerochannelofthe
no deinquestion. Thisdo esnotrequireknowledgeoftherecipient'spublic
key(butthemessageshouldstillcontainthesender'sidentityandsignature),
sothemessageistransferredwithoutencryption.Itshouldb enormallyused
onlytoobtainanidentity(mayb eaone-timeidentitycreatedesp eciallyfor
thispurp ose)ofthereceiver,andthentostartcommunicatinginasaferway.
Once atleast oneno deisknown, itiseasyto p opulatetheneighb or
table androutingtable by moreentries,learningthemfromanswersto

(^31) https://geti2p.net/en/docs/how/garlic- routing


### 3.2 TONDHT:Kademlia-likeDistributedHashTable.

sp ecialqueriessenttothealreadyknownno des.
Notallno desarerequiredtopro cessdatagramssenttothezerochannel,
butthoseusedtob o otstraplightclientsshouldsupp ortthisfeature.

3.1.8.TCP-likestreamproto coloverADNL.TheADNL,b einganun-
reliable(small-size)datagramproto colbasedon256-bitabstractaddresses,
canb eusedas abase formoresophisticatednetworkproto cols. Onecan
build,forexample,aTCP-likestreamproto col,usingADNLasanabstract
replacementforIP.However,mostcomp onentsoftheTONPro jectdonot
needsuchastreamproto col.

3.1.9.RLDP,orReliableLargeDatagramProto coloverADNL.A
reliablearbitrary-sizedatagramproto colbuiltup ontheADNL,calledRLDP,
isusedinsteadofaTCP-likeproto col. Thisreliabledatagramproto colcan
b eemployed,forinstance,tosendRPCqueriestoremotehostsandreceive
answersfromthem(cf.4.1.5).

### 3.2 TONDHT:Kademlia-like DistributedHash Table

The TONDistributed Hash Table (DHT) plays acrucial roleinthe net-
workingpartoftheTONPro ject,b eingusedtolo cateotherno desinthe
network.Forexample,aclientwantingtocommitatransactionintoashard-
chainmightwanttondavalidatororacollatorofthatshardchain,orat
leastsomeno dethatmightrelaytheclient'stransactiontoacollator. This
canb edonebylo okingupasp ecialkeyintheTONDHT.Anotherimp or-
tantapplicationoftheTONDHTisthatitcanb eusedtoquicklyp opulate
anewno de'sneighb ortable(cf.3.1.7),simplybylo okinguparandomkey,
orthenewno de'saddress. Ifano deusesproxyingandtunnelingforitsin-
b ounddatagrams,itpublishesthetunnelidentieranditsentryp oint(e.g.,
IPaddressandUDPp ort)intheTONDHT;thenallno deswishingtosend
datagramstothatno dewillobtainthiscontactinformationfromtheDHT
rst.
TheTON DHTisamemb erofthefamilyofKademlia-likedistributed
hashtables[10].

3.2.1.KeysoftheTONDHT.ThekeysoftheTONDHTaresimply256-
bitintegers.Inmostcases,theyarecomputedassha256ofaTL-serialized
ob ject(cf.2.2.5),calledpreimage ofthekey,or keydescription. Insome
cases,theabstractaddressesoftheTONNetworkno des(cf.3.1.1)canalso


```
3.2.TONDHT:Kademlia-likeDistributedHashTable
```
b eusedaskeysoftheTONDHT,b ecausetheyarealso256-bit,andtheyare
alsohashesofTL-serializedob jects. Forexample,ifano deisnotafraidof
publishingitsIPaddress,itcanb efoundbyanyb o dywhoknowsitsabstract
addressbysimplylo okingupthataddressasakeyintheDHT.

3.2.2.ValuesoftheDHT.Thevaluesassignedtothese256-bitkeysare
essentially arbitrarybytestrings of limitedlength. The interpretationof
suchbytestringsisdeterminedbythepreimageofthecorresp ondingkey;it
isusuallyknownb othbytheno dethatlo oksupthekey,andbytheno de
thatstoresthekey.

3.2.3.No desoftheDHT.Semi-p ermanentnetworkidentities.The
key-value mappingof theTONDHT iskepton thenodes of the DHT
essentially,allmemb ersoftheTONNetwork. Tothisend,anyno deofthe
TONNetwork(p erhapswiththeexceptionofsomeverylightno des),apart
fromanynumb erofephemeralandp ermanentabstractaddressesdescrib ed
in3.1.1,hasatleastonesemi-p ermanentaddress,whichidentiesitasa
memb eroftheTONDHT.Thissemi-permanentorDHTaddressshouldnot
tob echangedto ooften,otherwiseotherno deswouldb eunabletolo catethe
keystheyarelo okingfor.Ifano dedo esnotwanttorevealitstrueidentity,
itgeneratesaseparateabstractaddresstob eusedonlyforthepurp oseof
participatinginthe DHT.However, thisabstractaddressmustb epublic,
b ecauseitwillb easso ciatedwiththeno de'sIPaddressandp ort.

3.2.4. Kademlia distance. Nowwe haveb oth256-bitkeysand256-bit
(semi-p ermanent)no deaddresses.Weintro ducetheso-calledXORdistance
orKademliadistancedKonthesetof256-bitsequences,givenby

```
dK(x,y) := (x⊕y) interpretedasanunsigned256-bitinteger (25)
```
Herex⊕ydenotesthebitwiseeXclusiveOR(XOR)oftwobitsequencesof
thesamelength.
TheKademliadistanceintro ducesametricontheset 2256 ofall256-bit
sequences.Inparticular,wehavedK(x,y) = 0ifandonlyifx=y,dK(x,y) =
dK(y,x),anddK(x,z)≤dK(x,y) +dK(y,z).Anotherimp ortantprop ertyis
thatthereisonlyonepointatanygivendistancefromx:dK(x,y) =dK(x,y′)
impliesy=y′.

3.2.5. Kademlia-likeDHTs and theTON DHT.Wesay thatadis-
tributedhashtable(DHT)with256-bitkeysand256-bitno deaddressesisa


```
3.2.TONDHT:Kademlia-likeDistributedHashTable
```
Kademlia-likeDHTifitisexp ectedtokeepthevalueofkeyKonsKademlia-
nearestno destoK(i.e.,thesno deswithsmallestKademliadistancefrom
theiraddressestoK.)
Heresisasmallparameter,say,s= 7,neededtoimprovereliabilityof
theDHT(ifwewouldkeepthekeyonlyononeno de,thenearestonetoK,
thevalueofthatkeywouldb elostifthatonlyno dego esoine).
TheTONDHTisaKademlia-likeDHT,accordingtothisdenition. It
isimplementedovertheADNLproto coldescrib edin3.1.

3.2.6. Kademliaroutingtable. Anyno departicipatinginaKademlia-
likeDHTusuallymaintainsaKademlia routingtable. InthecaseofTON
DHT,itconsistsofn= 256buckets,numb eredfrom 0 ton− 1. Thei-th
bucketwillcontaininformationab outsomeknownno des(axednumb ert
ofb est no des,andmayb esomeextracandidates)thatlieataKademlia
distancefrom 2 ito 2 i+1− 1 fromtheno de'saddressa.^32 Thisinformation
includestheir(semi-p ermanent)addresses,IPaddressesandUDPp orts,and
someavailabilityinformationsuchasthetimeandthedelayofthelastping.
WhenaKademliano delearnsab outanyotherKademliano deasaresult
ofsomequery,itincludesitintoasuitablebucketofitsroutingtable,rst
asacandidate.Then,ifsomeoftheb estno desinthatbucketfail(e.g.,do
notresp ondtopingqueriesforalongtime),theycanb ereplacedbysome
ofthecandidates. InthiswaytheKademliaroutingtablestaysp opulated.
New no des fromthe Kademlia routing table arealso included inthe
ADNLneighb ortabledescrib edin3.1.7. Ifab estno defromabucketof
theKademliaroutingtableisusedoften,achannelinthesensedescrib ed
in3.1.5canb eestablishedtofacilitatetheencryptionofdatagrams.
Asp ecialfeatureoftheTONDHTisthatittriestoselectno deswiththe
smallestround-tripdelaysastheb estno desforthebucketsoftheKademlia
routingtable.

3.2.7.(Kademlianetworkqueries.) AKademliano deusuallysupp ortsthe
followingnetworkqueries:

```
 PingChecksno deavailability.
```
(^32) Iftherearesucientlymanyno desinabucket,itcanb esub dividedfurtherinto,say,
eightsub-bucketsdep endingonthetopfourbitsoftheKademliadistance. Thiswould
sp eedupDHTlo okups.


```
3.2.TONDHT:Kademlia-likeDistributedHashTable
```
```
 Store(key,value)Askstheno detokeepvalueas avalueforkey
key. ForTONDHT,theStorequeriesareslightlymorecomplicated
(cf.3.2.9).
```
```
 Find_Node(key,l) Asks the no de to return l Kademlia-nearest
knownno des(fromitsKademliaroutingtable)tokey.
```
```
 Find_Value(key,l)Thesameasab ove,butiftheno deknowsthe
valuecorresp ondingtokeykey,itjustreturnsthatvalue.
```
Whenanyno de wantstolo okupthevalueofakeyK, itrstcreates
asetS ofs′ no des(forsome smallvalueof s′,say,s′ = 5),nearestto K
withresp ecttotheKademliadistanceamongallknownno des(i.e.,theyare
takenfromtheKademliaroutingtable).ThenaFind_Valuequeryissent
toeachof them,andno desmentionedintheiranswersareincludedinS.
Thenthes′no desfromS,nearesttoK,arealsosentaFind_Valuequery
ifthishasn'tb eendoneb efore,andthepro cesscontinuesuntilthevalueis
foundorthesetSstopsgrowing.Thisisasortofb eamsearchoftheno de
nearesttoKwithresp ecttoKademliadistance.
Ifthevalueof somekeyK istob eset,thesamepro cedureisrunfor
s′≥s,withFind_NodequeriesinsteadofFind_Value,tondsnearest
no destoK.Afterwards,Storequeriesaresenttoallofthem.
Therearesomelessimp ortantdetailsintheimplementationofaKademlia-
likeDHT(forexample,anyno deshouldlo okupsnearestno destoitself,say,
onceeveryhour,andre-publishallstoredkeystothembymeansofStore
queries).Wewillignorethemforthetimeb eing.

3.2.8. Bo otingaKademliano de. WhenaKademliano dego esonline,
itrstp opulatesitsKademliaroutingtablebylo okingupitsownaddress.
Duringthispro cess,itidentiesthesnearestno destoitself.Itcandownload
fromthemall(key,value)pairsknowntothemtop opulateitspartofthe
DHT.

3.2.9. Storing values in TON DHT.Storing values inTON DHT is
slightlydierentfromageneralKademlia-likeDHT.Whensomeonewishes
tostoreavalue,shemustprovidenotonlythekeyK itselftotheStore
query,butalsoitspreimagei.e.,aTL-serializedstring(withoneofseveral
predenedTL-constructors attheb eginning)containingadescription of
thekey. Thiskeydescriptionislaterkeptbytheno de,alongwiththekey
andthevalue.


```
3.2.TONDHT:Kademlia-likeDistributedHashTable
```
Thekeydescriptiondescrib esthetyp e oftheob jectb eingstored,its
owner, and its up date rules in caseof futureup dates. Theowner is
usuallyidentiedby apublickeyincludedinthekey description. Ifitis
included,normallyonlyup datessignedbythecorresp ondingprivatekeywill
b eaccepted. Thetyp eofthestoredob jectisnormallyjustabytestring.
However,insomecasesitcanb emoresophisticatedforexample,aninput
tunneldescription(cf.3.1.6),oracollectionofno deaddresses.
The up date rules canalsob e dierent. Insome cases, they simply
p ermitreplacingtheoldvaluewiththenewvalue,providedthenewvalue
issignedbytheowner(thesignaturemustb ekeptaspartofthevalue,to
b echeckedlaterbyanyotherno desaftertheyobtainthevalueofthiskey).
Inothercases,theoldvaluesomehowaectsthenewvalue.Forexample,it
cancontainasequencenumb er,andtheoldvalueisoverwrittenonlyifthe
newsequencenumb erislarger(topreventreplayattacks).

3.2.10.Distributedtorrenttrackersandnetworkinterestgroups
inTON DHT.Yetanotherinterestingcaseiswhenthevaluecontainsa
listofno desp erhapswiththeirIPaddressesandp orts,orjustwiththeir
abstractaddressesandtheup dateruleconsistsinincludingtherequester
inthislist,providedshecanconrmheridentity.
Thismechanismmightb eusedtocreateadistributedtorrenttracker,
whereallno desinterestedinacertaintorrent(i.e.,acertainle)cannd
otherno desthatareinterestedinthesametorrent,oralreadyhaveacopy.
TONStorage(cf.4.1.7)usesthistechnologytondtheno desthathave
acopyofarequiredle(e.g.,asnapshotofthestateofashardchain,oran
oldblo ck). However,itsmoreimp ortantuseistocreateoverlaymulticast
subnetworksandnetworkinterestgroups(cf.3.3). Theideaisthatonly
some no desareinterestedinthe up datesof asp ecicshardchain. Ifthe
numb erofshardchainsb ecomesverylarge,ndingevenoneno deinterestedin
thesameshardmayb ecomecomplicated.Thisdistributedtorrenttracker
provides a convenientway to nd some of these no des. Another option
wouldb etorequestthemfromavalidator,butthiswouldnotb eascalable
approach,andvalidatorsmightcho osenottoresp ondtosuchqueriescoming
fromarbitraryunknownno des.

3.2.11.Fall-backkeys. Mostofthekeytyp esdescrib edsofarhavean
extra 32-bitintegereld intheir TLdescription, normally equalto zero.
However,ifthekeyobtainedbyhashingthatdescriptioncannotb eretrieved
fromorup datedintheTONDHT,thevalueinthiseldisincreased,and


```
3.2.TONDHT:Kademlia-likeDistributedHashTable
```
anew attempt ismade. Inthis way, onecannot capture and censor
akey (i.e., p erform akey retention attack) bycreating alot of abstract
addresseslyingnearthekeyunderattackandcontrollingthecorresp onding
DHTno des.

3.2.12. Lo catingservices. Some services,lo catedintheTONNetwork
andavailablethroughthe(higher-levelproto colsbuiltup onthe)TONADNL
describ edin3.1,maywanttopublishtheirabstractaddressessomewhere,
sothattheirclientswouldknowwheretondthem.
However,publishingtheservice'sabstractaddressintheTONBlo ckchain
maynotb etheb estapproach,b ecausetheabstractaddressmightneedto
b echangedquiteoften,andb ecauseitcouldmakesensetoprovideseveral
addresses,forreliabilityorloadbalancingpurp oses.
AnalternativeistopublishapublickeyintotheTONBlo ckchain,and
useasp ecialDHTkeyindicatingthatpublickeyasitsownerintheTL
descriptionstring (cf.2.2.5)to publishan up-to-datelistof theservice's
abstractaddresses.ThisisoneoftheapproachesexploitedbyTONServices.

3.2.13.Lo catingownersofTONblo ckchainaccounts. Inmostcases,
ownersof TONblo ckchainaccounts wouldnot liketo b easso ciated with
abstractnetworkaddresses,and esp eciallyIPaddresses, b ecause thiscan
violatetheirprivacy. Insomecases,however,theownerofaTONblo ckchain
accountmay wantto publishoneorseveralabstractaddresseswhereshe
couldb econtacted.
Atypicalcaseisthatofano deintheTONPaymentslightningnetwork
(cf.5.2),theplatformforinstantcrypto currencytransfers. ApublicTON
Paymentsno demaywantnotonlytoestablishpaymentchannelswithother
p eers,butalsoto publishanabstractnetworkaddressthat couldb eused
to contactitat alater timefortransferringpaymentsalong thealready-
establishedchannels.
Oneoptionwouldb etoincludeanabstractnetworkaddressinthesmart
contractcreatingthepaymentchannel.Amoreexibleoptionistoincludea
publickeyinthesmartcontract,andthenuseDHTasexplainedin3.2.12.
Themostnaturalwaywouldb etousethesameprivate keythatcon-
trolstheaccountintheTONBlo ckchaintosignandpublishup datesinthe
TONDHTab outtheabstractaddressesasso ciatedwiththataccount.This
isdonealmostinthesamewayasdescrib edin3.2.12;however,theDHT
keyemployedwouldrequire asp ecial keydescription,containingonlythe


### 3.3 OverlayNetworksandMulticastingMessages

account_iditself,equaltosha256oftheaccountdescription,whichcon-
tainsthepublickeyoftheaccount.Thesignature,includedinthevalueof
thisDHTkey,wouldcontaintheaccountdescriptionaswell.
Inthisway,amechanismforlo catingabstractnetworkaddressesofsome
ownersoftheTONBlo ckchainaccountsb ecomesavailable.

3.2.14.Lo catingabstractaddresses.NoticethattheTONDHT,while
b eingimplementedoverTONADNL,isitselfusedbytheTONADNLfor
severalpurp oses.
Themostimp ortantofthemistolo cateano deoritscontactdatastarting
fromits256-bitabstractaddress.Thisisnecessaryb ecausetheTONADNL
shouldb eableto senddatagramsto arbitrary256-bitabstractaddresses,
evenifnoadditionalinformationisprovided.
Tothisend,the256-bitabstractaddressissimplylo okedupasakeyin
theDHT.Eitherano dewiththisaddress(i.e.,usingthisaddressasapublic
semi-p ersistentDHTaddress)isfound,inwhichcaseitsIPaddressandp ort
canb elearned;or,aninputtunneldescriptionmayb eretrievedasthevalue
ofthekeyinquestion,signedbythecorrectprivatekey,inwhichcasethis
tunneldescriptionwouldb eusedtosendADNLdatagramstotheintended
recipient.
Noticethatinordertomakeanabstractaddresspublic(reachablefrom
anyno desinthenetwork),itsownermusteitheruseitasasemi-p ermanent
DHT address, orpublish (in the DHTkey equal to theabstract address
underconsideration)aninputtunneldescriptionwithanotherofitspublic
abstractaddresses(e.g.,thesemi-p ermanentaddress)asthetunnel'sentry
p oint. Anotheroptionwouldb etosimplypublishitsIPaddressandUDP
p ort.

### 3.3 Overlay NetworksandMulticasting Messages

Inamulti-blo ckchainsystemliketheTONBlo ckchain,evenfullno deswould
normallyb e interestedinobtainingup dates(i.e., newblo cks) onlyab out
someshardchains.Tothisend,asp ecialoverlay(sub)networkmustb ebuilt
insidetheTONNetwork,ontopoftheADNLproto coldiscussedin3.1,one
foreachshardchain.
Therefore,theneedtobuildarbitraryoverlaysubnetworks,op entoany
no des willingto participate, arises. Sp ecial gossip proto cols, built up on
ADNL,will b erunintheseoverlay networks. Inparticular, these gossip


```
3.3.OverlayNetworksandMulticastingMessages
```
proto colsmayb eusedtopropagate(broadcast)arbitrarydatainsidesucha
subnetwork.

3.3.1. Overlaynetworks. Anoverlay(sub)network issimplya(virtual)
networkimplementedinsidesomelargernetwork. Usuallyonlysomeno des
ofthelargernetworkparticipateintheoverlaysubnetwork,andonlysome
linksb etweentheseno des,physicalorvirtual,arepartoftheoverlaysub-
network.
Inthisway,iftheencompassingnetworkisrepresentedasagraph(p er-
hapsafullgraphinthecaseofadatagramnetworksuchasADNL,where
anyno decaneasilycommunicatetoanyother),theoverlaysubnetworkisa
subgraphofthisgraph.
Inmostcases,theoverlaynetworkisimplementedusingsomeproto col
builtup onthenetworkproto colofthelargernetwork.Itmayusethesame
addressesasthelargernetwork,orusecustomaddresses.

3.3.2. Overlay networks in TON.OverlaynetworksinTON arebuilt
up ontheADNLproto coldiscussedin3.1;theyuse256-bitADNLabstract
addressesas addressesintheoverlaynetworksaswell. Eachno deusually
selectsoneofitsabstractaddressestodoubleas itsaddressintheoverlay
network.
IncontrasttoADNL,theTONoverlaynetworksusuallydonotsupp ort
sendingdatagramstoarbitraryotherno des. Instead,somesemip ermanent
linksareestablishedb etweensomeno des(calledneighb orswithresp ectto
theoverlaynetworkunderconsideration),andmessagesareusuallyforwarded
alongtheselinks(i.e.,fromano detooneofitsneighb ors). Inthisway,a
TONoverlaynetworkisa(usuallynotfull)subgraphinsidethe(full)graph
oftheADNLnetwork.
Linkstoneighb orsinTONoverlaynetworkscanb eimplementedusing
dedicatedp eer-to-p eerADNLchannels(cf.3.1.5).
Eachno deofanoverlaynetworkmaintainsalistofneighb ors(withre-
sp ect to the overlaynetwork), containingtheir abstractaddresses(which
theyusetoidentifythemintheoverlaynetwork)andsomelinkdata(e.g.,
theADNLchannelusedtocommunicatewiththem).

3.3.3. Private and public overlaynetworks. Some overlaynetworks
arepublic,meaningthatanyno decanjointhematwill. Otherareprivate,
meaningthatonlycertainno descanb eadmitted(e.g.,thosethatcanprove


```
3.3.OverlayNetworksandMulticastingMessages
```
theiridentitiesasvalidators.)Someprivateoverlaynetworkscanevenb eun-
knowntothegeneralpublic. Theinformationab outsuchoverlaynetworks
ismadeavailableonlytocertaintrusted no des;forexample,itcanb een-
cryptedwithapublickey,andonlyno deshavingacopyofthecorresp onding
privatekeywillb eabletodecryptthisinformation.

3.3.4. Centrallycontrolledoverlaynetworks. Someoverlaynetworks
arecentral lycontrol led,by oneor severalno des, orby theownerof some
widely-knownpublickey. Othersaredecentralized,meaningthatthereare
nosp ecicno desresp onsibleforthem.

3.3.5.Joininganoverlaynetwork.Whenano dewantstojoinanover-
laynetwork,itrstmustlearnits256-bitnetworkidentier,usuallyequal
tosha256ofthedescriptionoftheoverlaynetworkaTL-serializedob ject
(cf.2.2.5)whichmaycontain,forinstance,thecentralauthorityoftheover-
laynetwork(i.e.,itspublickeyandp erhapsitsabstractaddress,^33 )astring
withthenameoftheoverlaynetwork,aTONBlo ckchainshardidentierif
thisisanoverlaynetworkrelatedtothatshard,andsoon.
Sometimesitisp ossibletorecovertheoverlaynetworkdescriptionstart-
ingfromthenetworkidentier,simplybylo okingitupintheTONDHT.In
othercases(e.g.,forprivateoverlaynetworks),onemustobtainthenetwork
descriptionalongwiththenetworkidentier.

3.3.6. Lo cating one memb erof theoverlay network. Afterano de
learnsthenetworkidentierandthenetworkdescriptionoftheoverlaynet-
workitwantsto join, itmust lo cateat leastoneno de b elongingto that
network.
Thisisalsoneededforno desthatdonotwanttojointheoverlaynetwork,
butwantjusttocommunicatewithit;forexample,theremightb eanoverlay
networkdedicatedtocollectingandpropagatingtransactioncandidatesfor
asp ecicshardchain,andaclientmightwanttoconnecttoanyno deofthis
networktosuggestatransaction.
Themetho dusedforlo catingmemb ersofanoverlaynetworkisdenedin
thedescriptionofthatnetwork.Sometimes(esp eciallyforprivatenetworks)
onemustalreadyknowamemb erno detob eabletojoin. Inothercases,the
abstractaddressesofsomeno desarecontainedinthenetworkdescription.
Amoreexibleapproachistoindicateinthenetworkdescriptiononlythe

(^33) Alternatively,theabstractaddressmightb estoredintheDHTasexplainedin3.2.12.


```
3.3.OverlayNetworksandMulticastingMessages
```
centralauthorityresp onsibleforthenetwork,andthentheabstractaddresses
willb eavailablethroughvaluesofcertainDHTkeys,signedbythatcentral
authority.
Finally, truly decentralizedpublic overlay networks canuse the dis-
tributedtorrent-trackermechanismdescrib edin3.2.10,alsoimplemented
withtheaidoftheTONDHT.

3.3.7. Lo cating morememb ers ofthe overlay network. Creating
links.Onceoneno deoftheoverlaynetworkisfound,asp ecialquerymayb e
senttothatno derequestingalistofothermemb ers,forinstance,neighb ors
oftheno deb eingqueried,orarandomselectionthereof.
Thisenablesthejoiningmemb ertop opulateheradjacencyorneighb or
listwithresp ectto theoverlaynetwork,by selectingsome newly-learned
networkno desandestablishinglinkstothem(i.e.,dedicatedADNLp oint-
to-p ointchannels,as outlinedin3.3.2). Afterthat,sp ecial messagesare
senttoallneighb orsindicatingthatthenewmemb erisreadytoworkinthe
overlaynetwork. Theneighb orsincludetheirlinkstothe newmemb erin
theirneighb orlists.

3.3.8. Maintaining the neighb or list. An overlaynetworkno demust
up dateitsneighb orlistfromtimetotime.Someneighb ors,oratleastlinks
(channels)tothem,maystopresp onding;inthiscase,theselinksmustb e
markedassusp ended,someattemptstoreconnecttosuchneighb orsmust
b emade,and,iftheseattemptsfail,thelinksmustb edestroyed.
Ontheotherhand,everyno desometimesrequestsfromarandomlycho-
senneighb oritslistofneighb ors(orsomerandomselectionthereof ),anduses
ittopartiallyup dateitsownneighb orlist,byaddingsomenewly-discovered
no destoit,andremovingsomeoftheoldones,eitherrandomlyordep ending
ontheirresp onsetimesanddatagramlossstatistics.

3.3.9. Theoverlaynetworkis arandomsubgraph. Inthisway,the
overlaynetworkb ecomesarandomsubgraphinsidetheADNLnetwork. If
thedegreeofeachvertexisatleastthree(i.e.,ifeachno deisconnectedto
atleastthreeneighb ors),thisrandomgraphisknowntob econnectedwitha
probabilityalmostequaltoone.Moreprecisely,theprobabilityofarandom
graphwith nvertices b eingdisconnectedisexp onentially small,andthis
probabilitycanb ecompletelyneglectedif,say,n≥ 20 .(Ofcourse,thisdo es
notapplyinthecaseofaglobalnetworkpartition,whenno desondierent
sidesof thepartitionhaveno chancetolearn ab outeachother.) Onthe


```
3.3.OverlayNetworksandMulticastingMessages
```
otherhand,ifnissmallerthan20,itwouldsucetorequireeachvertexto
have,say,atleasttenneighb ors.

3.3.10.TONoverlaynetworksareoptimizedforlowerlatency.TON
overlaynetworksoptimizetherandomnetworkgraphgeneratedbythepre-
viousmetho dasfollows. Everyno detriestoretainatleastthreeneighb ors
withtheminimalround-triptime,changingthislistoffastneighb orsvery
rarely.Atthesametime,italsohasatleastthreeotherslowneighb orsthat
arechosencompletelyrandomly,sothattheoverlaynetworkgraphwouldal-
wayscontainarandomsubgraph.Thisisrequiredtomaintainconnectivity
andpreventsplittingoftheoverlaynetworkintoseveralunconnectedregional
subnetworks.Atleastthreeintermediateneighb ors,whichhaveintermedi-
ateround-triptimes,b oundedbyacertainconstant(actually,afunctionof
theround-triptimesofthefastandtheslowneighb ors),arealsochosenand
retained.
Inthisway,thegraphofanoverlaynetworkstillmaintainsenoughran-
domness to b e connected, but is optimized for lowerlatency and higher
throughput.

3.3.11.Gossip proto colsinanoverlaynetwork. Anoverlaynetwork
isoftenusedtorunoneoftheso-calledgossipprotocols,whichachievesome
globalgoalwhileletting everyno deinteract onlywithitsneighb ors. For
example,therearegossipproto colstoconstructanapproximatelistofall
memb ersofa(notto olarge)overlaynetwork,ortocomputeanestimateof
thenumb erofmemb ersofan(arbitrarilylarge)overlaynetwork,usingonly
ab oundedamountofmemoryateachno de(cf.[15,4.4.3]or[1]fordetails).

3.3.12. Overlay network as abroadcast domain. Themostimp or-
tantgossipproto colrunninginanoverlaynetworkisthebroadcastprotocol,
intendedtopropagatebroadcastmessagesgeneratedbyanyno deofthenet-
work,orp erhapsbyoneofthedesignatedsenderno des,toallotherno des.
Thereareinfactseveralbroadcastproto cols,optimizedfordierentuse
cases.Thesimplestofthemreceivesnewbroadcastmessagesandrelaysthem
toallneighb orsthathavenotyetsentacopyofthatmessagethemselves.

3.3.13. More sophisticated broadcast proto cols. Some applications
maywarrantmoresophisticatedbroadcastproto cols.Forinstance,forbroad-
castingmessagesofsubstantialsize,itmakessensetosendtotheneighb ors
notthenewly-receivedmessageitself,butitshash(oracollectionofhashes


```
3.3.OverlayNetworksandMulticastingMessages
```
ofnewmessages).Theneighb ormayrequestthemessageitselfafterlearning
apreviouslyunseenmessagehash,tob etransferred,say,usingthereliable
largedatagramproto col(RLDP)discussedin3.1.9. Inthisway,thenew
messagewillb edownloadedfromoneneighb oronly.

3.3.14.Checkingtheconnectivityofanoverlaynetwork. Thecon-
nectivityofanoverlaynetworkcanb echeckedifthereisaknownno de(e.g.,
theowner orthe creatorof the overlaynetwork)that mustb e inthis
overlaynetwork. Thentheno deinquestionsimplybroadcastsfromtime
totimeshortmessagescontainingthecurrenttime,asequencenumb erand
itssignature. Anyotherno de canb esurethat itisstillconnectedtothe
overlaynetworkifithasreceivedsuchabroadcast notto olongago. This
proto colcanb eextendedtothecaseofseveralwell-knownno des;forexam-
ple,they allwillsendsuch broadcasts, andall otherno deswillexp ectto
receivebroadcastsfrommorethanhalfofthewell-knownno des.
Inthecaseof anoverlaynetworkusedforpropagatingnewblo cks(or
justnewblo ckheaders)ofasp ecicshardchain,ago o dwayforano deto
checkconnectivityistokeeptrackofthemostrecentblo ckreceivedsofar.
Becauseablo ckisnormallygenerated everyveseconds,ifnonewblo ck
isreceivedformorethan,say,thirtyseconds,theno deprobablyhasb een
disconnectedfromtheoverlaynetwork.

3.3.15. Streaming broadcast proto col. Finally, there is a streaming
broadcastprotocol forTONoverlaynetworks,used,forexample,topropa-
gateblo ckcandidatesamongvalidatorsofsomeshardchain(shardchaintask
group),who,ofcourse,createaprivateoverlaynetworkforthatpurp ose.
Thesameproto colcanb eusedtopropagatenewshardchainblo ckstoall
fullno desforthatshardchain.
Thisproto colhasalreadyb eenoutlinedin2.6.10:thenew(large)broad-
castmessageissplitinto,say,N one-kilobytechunks;thesequenceofthese
chunksisaugmentedtoM≥Nchunksbymeansofanerasureco desuchas
theReedSolomonorafountainco de(e.g.,theRaptorQco de[9][14]),and
theseM chunksarestreamedto allneighb orsinascending chunknumb er
order. Theparticipatingno descollectthesechunksuntiltheycanrecover
theoriginallargemessage(onewouldhavetosuccessfullyreceiveatleastN
ofthechunksforthis),andtheninstructtheirneighb orstostopsendingnew
chunksofthestream,b ecausenowtheseno descangeneratethesubsequent
chunkson theirown, havingacopy ofthe original message. Suchno des
continuetogeneratethesubsequentchunksofthestreamandsendthemto


```
3.3.OverlayNetworksandMulticastingMessages
```
theirneighb ors,unlesstheneighb orsinturnindicatethatthisisnolonger
necessary.
Inthis way,ano de do es notneedto download alargemessageinits
entirety b eforepropagating itfurther. Thisminimizesbroadcast latency,
esp eciallywhencombinedwiththeoptimizationsdescrib edin3.3.10.

3.3.16.Constructingnewoverlaynetworksbasedonexistingones.
Sometimesonedo esnotwanttoconstructanoverlaynetworkfromscratch.
Instead,oneorseveralpreviouslyexistingoverlaynetworksareknown,and
thememb ershipofthenewoverlaynetworkisexp ectedtooverlapsigni-
cantlywiththecombinedmemb ershipoftheseoverlaynetworks.
Animp ortantexampleariseswhenaTONshardchainissplitintwo,or
twosiblingshardchainsaremergedintoone(cf.2.7). Intherstcase,the
overlaynetworksusedforpropagatingnewblo ckstofullno desmustb econ-
structedforeachofthenewshardchains;however,eachofthesenewoverlay
networkscanb eexp ectedtob econtainedintheblo ckpropagationnetwork
oftheoriginalshardchain(andcompriseapproximatelyhalfitsmemb ers).
Inthesecondcase,theoverlaynetworkforpropagatingnewblo cksofthe
mergedshardchainwillconsistapproximatelyoftheunionofmemb ersofthe
twooverlaynetworksrelatedtothetwosiblingshardchainsb eingmerged.
Insuchcases,thedescriptionofthenewoverlaynetworkmaycontainan
explicitorimplicitreferencetoalistofrelatedexistingoverlaynetworks.A
no dewishingtojointhenewoverlaynetworkmaycheckwhetheritisalready
amemb erofoneoftheseexistingnetworks,andqueryitsneighb orsinthese
networkswhethertheyareinterestedinthenew networkas well. Incase
ofap ositiveanswer,newp oint-to-p ointchannelscanb eestablishedtosuch
neighb ors,andtheycanb eincludedintheneighb orlistforthenewoverlay
network.
This mechanism do es nottotally supplant the general mechanism de-
scrib edin3.3.6and3.3.7;rather,b othareruninparallelandareusedto
p opulatetheneighb orlist.Thisisneededtopreventinadvertentsplittingof
thenewoverlaynetworkintoseveralunconnectedsubnetworks.

3.3.17.Overlaynetworkswithinoverlaynetworks. Anotherinterest-
ingcasearisesintheimplementationofTONPayments(alightningnet-
work forinstant o-chainvaluetransfers; cf.5.2). Inthis case, rstan
overlaynetworkcontainingalltransitno desofthelightningnetworkiscon-
structed. However,someoftheseno deshaveestablishedpaymentchannels
intheblo ckchain;theymustalwaysb eneighb orsinthisoverlaynetwork,in


```
3.3.OverlayNetworksandMulticastingMessages
```
additiontoanyrandomneighb orsselectedbythegeneraloverlaynetwork
algorithmsdescrib edin3.3.6, 3.3.7and3.3.8. Thesep ermanentlinks
totheneighb orswithestablishedpaymentchannelsareusedtorunsp ecic
lightningnetworkproto cols,thuseectivelycreatinganoverlaysubnetwork
(notnecessarilyconnected,ifthingsgoawry)insidetheencompassing(al-
mostalwaysconnected)overlaynetwork.


### 4.1 TONServiceImplementationStrategies

## 4 TONServicesandApplications

WehavediscussedtheTONBlo ckchainandTONNetworkingtechnologies
atsomelength. Nowweexplainsomewaysinwhichtheycanb ecombined
tocreateawiderangeofservicesandapplications,anddiscusssomeofthe
servicesthatwillb eprovidedbytheTONPro jectitself,eitherfromthevery
b eginningoratalatertime.

### 4.1 TONService ImplementationStrategies

Westartwithadiscussionofhowdierentblo ckchainandnetwork-related
applicationsandservicesmayb eimplementedinsidethe TONecosystem.
Firstofall,asimpleclassicationisinorder:

4.1.1. Applicationsand services. Wewill usethewordsapplication
andservice interchangeably. However, there is a subtleand somewhat
vaguedistinction: anapplicationusuallyprovidessomeservicesdirectlyto
humanusers,whileaservice isusuallyexploitedbyotherapplicationsand
services. Forexample,TONStorageisaservice, b ecauseitisdesignedto
keeplesonb ehalfofotherapplicationsandservices,eventhoughahuman
usermightuseitdirectlyaswell.Ahyp otheticalFaceb o okinablo ckchain
(cf.2.9.13),ifmadeavailablethroughtheTONNetwork(i.e.,implemented
asaton-service),wouldratherb eanapplication,eventhoughsomeb ots
mightaccessitautomaticallywithouthumanintervention.

4.1.2.Lo cationoftheapplication: on-chain,o-chainormixed. A
serviceoranapplicationdesignedfortheTONecosystemneedstokeepits
dataandpro cessthatdatasomewhere. Thisleadstothefollowingclassi-
cationofapplications(andservices):

```
 On-chain applications(cf.4.1.4): Alldataandpro cessingareinthe
TONBlo ckchain.
```
```
 O-chainapplications(cf.4.1.5):Alldataandpro cessingareoutside
theTONBlo ckchain,onserversavailablethroughtheTONNetwork.
```
```
 Mixedapplications(cf.4.1.6):Some,butnotall,dataandpro cessing
areintheTONBlo ckchain;therestareono-chainserversavailable
throughtheTONNetwork.
```

```
4.1.TONServiceImplementationStrategies
```
4.1.3.Centralization:centralizedanddecentralized,ordistributed,
applications. Anotherclassicationcriterion iswhether the application
(orservice)relieson acentralizedservercluster, orisreally distributed
(cf.4.1.8). All on-chainapplications areautomaticallydecentralizedand
distributed. O-chainandmixedapplicationsmayexhibitdierentdegrees
ofcentralization.

```
Nowletusconsidertheab ovep ossibilitiesinmoredetail.
```
4.1.4. Pure on-chain applications: distributed applications, or
dapps, residing in theblo ckchain. Oneofthe p ossibleapproaches,
mentionedin4.1.2,istodeployadistributedapplication (commonlyab-
breviatedasdapp)completelyintheTONBlo ckchain,asonesmartcon-
tractoracollectionofsmartcontracts. Alldatawillb ekeptaspartofthe
p ermanentstateofthesesmartcontracts,andallinteractionwiththepro ject
willb edonebymeansof(TONBlo ckchain)messagessenttoorreceivedfrom
thesesmartcontracts.
Wehavealreadydiscussedin2.9.13thatthisapproachhasitsdrawbacks
andlimitations. Ithasitsadvantages,to o: suchadistributedapplication
needsnoserverstorunonortostoreitsdata(itrunsintheblo ckchain
i.e.,onthevalidators'hardware),andenjoystheblo ckchain'sextremelyhigh
(Byzantine)reliabilityandaccessibility.Thedevelop erofsuchadistributed
applicationdo esnotneedtobuyorrentanyhardware;allsheneedstodois
developsomesoftware(i.e.,theco deforthesmartcontracts).Afterthat,she
willeectivelyrentthecomputingp owerfromthevalidators,andwillpay
foritinTONcoins,eitherherselforbyputtingthisburdenontheshoulders
ofherusers.

4.1.5.Purenetworkservices:ton-sitesandton-services.Another
extremeoptionistodeploytheserviceonsomeserversandmakeitavailable
totheusersthroughtheADNLproto coldescrib edin3.1,andmayb esome
higherlevelproto colsuchastheRLDPdiscussedin3.1.9,whichcanb eused
tosendRPCqueriestotheserviceinanycustomformatandobtainanswers
tothesequeries. Inthisway,theservicewillb etotallyo-chain,andwill
resideintheTONNetwork,almostwithoutusingtheTONBlo ckchain.
TheTONBlo ckchainmightb eusedonlytolo catetheabstractaddress
oraddressesoftheservice,asoutlinedin3.2.12,p erhapswiththeaidofa
servicesuchastheTONDNS(cf.4.3.1)tofacilitatetranslationofdomain-
likehuman-readablestringsintoabstractaddresses.


```
4.1.TONServiceImplementationStrategies
```
TotheextenttheADNLnetwork(i.e.,theTONNetwork)issimilarto
theInvisibleInternetPro ject(I^2 P),such(almost)purelynetworkservices
areanalogoustotheso-calledeep-services(i.e.,servicesthathaveanI^2 P-
addressastheir entryp oint, andareavailable toclients throughtheI^2 P
network).WewillsaythatsuchpurelynetworkservicesresidingintheTON
Networkareton-services.
An eep-servicemayimplementHTTPas itsclient-serverproto col; in
theTONNetworkcontext,aton-servicemightsimplyuseRLDP(cf.3.1.9)
datagramstotransferHTTPqueriesandresp onsestothem. Ifitusesthe
TONDNStoallowitsabstractaddresstob elo okedupbyahuman-readable
domainname,theanalogytoawebsiteb ecomesalmostp erfect.Onemight
evenwriteasp ecializedbrowser,orasp ecialproxy(ton-proxy)thatisrun
lo callyonauser'smachine,acceptsarbitraryHTTPqueriesfromanordinary
webbrowsertheuseremploys(oncethelo calIPaddressandtheTCPp ortof
theproxyareenteredintothebrowser'sconguration),andforwardsthese
queries throughthe TONNetworkto the abstractaddressofthe service.
Thentheuserwouldhaveabrowsingexp eriencesimilartothatoftheWorld
WideWeb(WWW).
IntheI^2 Pecosystem,sucheep-services arecalledeep-sites. Onecan
easilycreateton-sites intheTONecosystemas well. Thisisfacilitated
somewhatbytheexistenceofservicessuchastheTONDNS,whichexploit
theTONBlo ckchainandtheTONDHTtotranslate(TON)domainnames
intoabstractaddresses.

4.1.6. Mixedservices: partlyo-chain,partlyon-chain. Someser-
vicesmightuseamixedapproach:domostofthepro cessingo-chain,but
alsohavesomeon-chainpart(forexample,toregistertheirobligationsto-
wardstheirusers,andviceversa). Inthisway,partofthestatewouldstill
b ekeptintheTONBlo ckchain(i.e.,animmutablepublicledger),andany
misb ehavioroftheserviceorofits userscouldb epunishedbysmartcon-
tracts.

4.1.7. Example: keeping leso-chain;TONStorage. Anexample
ofsuch aserviceisgivenbyTONStorage. Initssimplestform,itallows
userstostoreleso-chain,bykeepingon-chainonlyahashoftheletob e
stored,andp ossiblyasmartcontractwheresomeotherpartiesagreetokeep
theleinquestionforagivenp erio doftimeforapre-negotiatedfee.Infact,
thelemayb esub dividedintochunksofsomesmallsize(e.g., 1 kilobyte),
augmentedbyanerasureco desuchasaReedSolomonorafountainco de,a


```
4.1.TONServiceImplementationStrategies
```
Merkletreehashmayb econstructedfortheaugmentedsequenceofchunks,
andthisMerkletreehashmightb epublishedinthesmartcontractinstead
oforalongwiththeusualhashofthele. Thisissomewhatreminiscentof
thewaylesarestoredinatorrent.
Anevensimplerformofstoringlesiscompletelyo-chain:onemightes-
sentiallycreateatorrentforanewle,anduseTONDHTasadistributed
torrenttrackerforthistorrent(cf.3.2.10).Thismightactuallyworkpretty
wellforp opularles.However,onedo esnotgetanyavailabilityguarantees.
Forexample,ahyp otheticalblo ckchainFaceb o ok(cf.2.9.13),whichwould
opttokeeptheprolephotographsofitsuserscompletelyo-chaininsuch
torrents,mightrisklosingphotographsofordinary(notesp eciallyp opular)
users,oratleastriskb eingunabletopresentthesephotographsforprolonged
p erio ds. TheTONStoragetechnology,whichismostlyo-chain,butuses
anon-chainsmartcontracttoenforceavailabilityofthestoredles,might
b eab ettermatchforthistask.

4.1.8.Decentralizedmixedservices,orfogservices.Sofar,wehave
discussedcentralized mixedservicesandapplications. Whiletheiron-chain
comp onent ispro cessedin adecentralized anddistributed fashion, b eing
lo catedintheblo ckchain,theiro-chaincomp onentreliesonsomeservers
controlledbytheserviceproviderintheusualcentralizedfashion. Instead
ofusingsomededicatedservers,computingp owermightb erentedfroma
cloudcomputingserviceoeredbyoneofthelargecompanies.However,this
wouldnotleadtodecentralizationoftheo-chaincomp onentoftheservice.
Adecentralizedapproachtoimplementingtheo-chaincomp onentofa
serviceconsistsincreatingamarket,whereanyb o dyp ossessingtherequired
hardwareandwillingtorenttheircomputingp owerordiskspacewouldoer
theirservicestothoseneedingthem.
Forexample,theremightexistaregistry(whichmightalsob ecalleda
marketoranexchange)whereallno desinterestedinkeepinglesofother
users publishtheircontact information,alongwiththeir availablestorage
capacity,availabilityp olicy,andprices. Thoseneedingtheseservicesmight
lo okthemupthere,and,iftheotherpartyagrees,createsmartcontractsin
theblo ckchainanduploadlesforo-chainstorage. Inthiswayaservice
likeTONStorageb ecomestrulydecentralized,b ecauseitdo esnotneedto
relyonanycentralizedclusterofserversforstoringles.

4.1.9.Example:fogcomputingplatformsasdecentralizedmixed
services.Anotherexampleofsuchadecentralizedmixedapplicationarises


### 4.2 ConnectingUsersandServiceProviders.

whenonewantstop erformsomesp eciccomputations(e.g.,3Drenderingor
trainingneuralnetworks),oftenrequiringsp ecicandexp ensivehardware.
Thenthosehavingsuchequipmentmightoertheirservicesthroughasimilar
exchange,andthoseneedingsuchserviceswouldrentthem,withtheobli-
gationsofthesidesregisteredbymeansofsmartcontracts.Thisissimilarto
whatfogcomputingplatforms,suchasGolem(https://golem.network/)
orSONM(https://sonm.io/),promisetodeliver.

4.1.10.Example:TONProxyisafogservice.TONProxyprovidesyet
anotherexampleofafogservice,whereno deswishingtooertheirservices
(withorwithoutcomp ensation)astunnelsforADNLnetworktracmight
register,andthoseneedingthemmightcho oseoneoftheseno desdep ending
on the price, latencyandbandwidth oered. Afterwards, onemightuse
paymentchannelsprovidedbyTONPaymentsforpro cessingmicropayments
fortheservicesofthoseproxies,withpaymentscollected, forinstance,for
every 128 KiBtransferred.

4.1.11.Example:TONPaymentsisafogservice.TheTONPayments
platform(cf. 5 )isalsoanexampleofsuchadecentralizedmixedapplication.

### 4.2 ConnectingUsers andService Providers

Wehaveseenin4.1.8thatfogservices(i.e.,mixeddecentralizedservices)
willusuallyneedsomemarkets,exchangesorregistries,wherethoseneeding
sp ecicservicesmightmeetthoseprovidingthem.
Suchmarketsarelikelytob eimplementedason-chain,o-chainormixed
servicesthemselves,centralizedordistributed.

4.2.1. Example: connectingtoTON Payments. Forexample,ifone
wantstouseTONPayments(cf. 5 ),therststepwouldb etondatleast
someexistingtransitno desofthelightningnetwork(cf.5.2),andestablish
paymentchannelswiththem,iftheyarewilling. Someno descanb efound
withtheaidof theencompassing overlaynetwork,whichissupp osedto
containalltransitlightningnetworkno des(cf.3.3.17). However,itisnot
clearwhethertheseno deswillb ewillingtocreatenewpaymentchannels.
Therefore,aregistryisneededwhereno desreadyto createnewlinkscan
publishtheircontactinformation(e.g.,theirabstractaddresses).

4.2.2.Example: uploadingaleintoTONStorage. Similarly,ifone
wantstoupload aleintotheTONStorage,shemustlo catesomeno des


```
4.3. AccessingTONServices
```
willingtosignasmartcontractbindingthemtokeepacopyofthatle(or
ofanyleb elowacertainsizelimit,forthatmatter). Therefore,aregistry
ofno desoeringtheirservicesforstoringlesisneeded.

4.2.3. On-chain, mixed and o-chain registries. Sucha registryof
serviceprovidersmightb eimplementedcompletelyon-chain, withtheaid
ofasmartcontractwhichwouldkeeptheregistryinitsp ermanentstorage.
However, thiswould b e quiteslow andexp ensive. A mixedapproach is
moreecient,wheretherelativelysmallandrarelychangedon-chainregistry
isusedonly to p ointoutsome no des(by theirabstractaddresses, or by
theirpublickeys,whichcanb eusedtolo cateactualabstractaddressesas
describ edin3.2.12),whichprovideo-chain(centralized)registryservices.
Finally, a decentralized, purely o-chainapproach mightconsist of a
publicoverlaynetwork(cf.3.3),wherethosewillingtooertheirservices,
orthoselo okingtobuysomeb o dy'sservices,simplybroadcasttheiroers,
signedbytheirprivatekeys.Iftheservicetob eprovidedisverysimple,even
broadcastingtheoersmightb enotnecessary:theapproximatememb ership
oftheoverlaynetworkitselfmightb eusedasaregistryofthosewillingto
provideaparticularservice. Thenaclientrequiringthisservicemightlo-
cate(cf.3.3.7)andquerysomeno desofthisoverlaynetwork,andthenquery
theirneighb ors,iftheno desalreadyknownarenotreadytosatisfyitsneeds.

4.2.4.Registryorexchangeinaside-chain.Anotherapproachtoim-
plementingdecentralizedmixed registriesconsistsincreating an indep en-
dentsp ecializedblo ckchain(side-chain),maintainedbyitsownsetofself-
pro claimedvalidators,whopublishtheiridentitiesinanon-chainsmartcon-
tractandprovidenetworkaccesstoallinterestedpartiestothissp ecialized
blo ckchain,collectingtransactioncandidatesandbroadcastingblo ckup dates
throughdedicatedoverlaynetworks(cf.3.3). Thenanyfullno de forthis
sidechaincanmaintainitsowncopyofthesharedregistry(essentiallyequal
totheglobalstateofthisside-chain),andpro cessarbitraryqueriesrelated
tothisregistry.

4.2.5. Registry or exchange in a workchain. Another optionis to
createa dedicated workchain inside the TON Blo ckchain, sp ecialized for
creatingregistries,marketsandexchanges.Thismightb emoreecientand
lessexp ensivethan usingsmart contractsresiding inthebasic workchain
(cf.2.1.11). However,thiswouldstillb emoreexp ensivethanmaintaining
registriesinside-chains(cf.4.2.4).


### 4.3 AccessingTONServices

### 4.3 AccessingTON Services

We have discussedin 4.1 the dierent approaches onemightemploy for
creatingnewservicesandapplicationsresidingintheTONecosystem. Now
wediscuss howthese servicesmightb eaccessed,andsome of thehelp er
services that will b eprovided by TON,includingTON DNS andTON
Storage.

4.3.1.TONDNS:amostlyon-chainhierarchicaldomainnameser-
vice.TheTONDNSisapredenedservice,whichusesacollectionofsmart
contractstokeepamapfromhuman-readabledomainnamesto(256-bit)ad-
dressesofADNLnetworkno desandTON Blo ckchainaccountsandsmart
contracts.
While anyb o dymightin principleimplementsuch aservice usingthe
TONBlo ckchain,itisusefultohavesuchapredenedservicewithawell-
knowninterface,tob eusedbydefaultwheneveranapplicationoraservice
wantstotranslatehuman-readableidentiersintoaddresses.

4.3.2.TONDNSusecases. Forexample,auserlo okingtotransfersome
crypto currencytoanotheruserortoamerchantmayprefertorememb era
TONDNSdomainnameoftheaccountofthatuserormerchant,insteadof
keepingtheir256-bitaccountidentiersathandandcopy-pastingtheminto
therecipienteldintheirlightwalletclient.
Similarly,TONDNSmayb eusedtolo cateaccountidentiersofsmart
contractsorentryp ointsofton-servicesandton-sites(cf.4.1.5),enabling
asp ecialized client(ton-browser), or ausual internetbrowser combined
withasp ecializedton-proxyextensionorstand-aloneapplication,todeliver
aWWW-likebrowsingexp eriencetotheuser.

4.3.3. TONDNSsmartcontracts. TheTONDNSisimplementedby
meansofatreeofsp ecial(DNS)smartcontracts.EachDNSsmartcontract
isresp onsibleforregisteringsub domainsofsomexeddomain. Thero ot
DNSsmartcontract,wherelevelonedomainsoftheTONDNSsystemwillb e
kept,islo catedinthemasterchain.Itsaccountidentiermustb ehardco ded
intoallsoftwarethatwishestoaccesstheTONDNSdatabasedirectly.
AnyDNSsmartcontractcontainsahashmap,mappingvariable-length
null-terminatedUTF-8stringsintotheirvalues. Thishashmapisimple-
mented as a binary Patriciatree, similar to that describ ed in2.3.7 but
supp ortingvariable-lengthbitstringsaskeys.


```
4.3. AccessingTONServices
```
4.3.4.ValuesoftheDNShashmap,orTONDNSrecords.Astothe
values,theyareTONDNSrecordsdescrib edbyaTL-scheme(cf.2.2.5).
Theyconsistofamagicnumb er,selectingoneof theoptionssupp orted,
andtheneither anaccountidentier, orasmart-contractidentier, oran
abstractnetworkaddress(cf.3.1),or apublickeyusedtolo cateabstract
addressesof aservice(cf.3.2.12),oradescriptionofan overlaynetwork,
andsoon.Animp ortantcaseisthatofanotherDNSsmartcontract:insuch
acase,thatsmartcontractisusedtoresolvesub domainsofitsdomain. In
thisway,onecancreateseparateregistriesfordierentdomains,controlled
bytheownersofthosedomains.
Theserecordsmayalsocontainanexpirationtime,acachingtime(usu-
allyverylarge,b ecauseup datingvaluesinablo ckchainto ooftenisexp en-
sive),andinmostcasesareferencetotheownerofthesub domaininquestion.
Theownerhastherighttochangethisrecord(inparticular,theownereld,
thustransferringthedomaintosomeb o dyelse'scontrol),andtoprolongit.

4.3.5.Registeringnewsub domainsofexistingdomains.Inorderto
registeranewsub domainofanexistingdomain,onesimplysendsamessage
tothesmartcontract,whichistheregistrarofthatdomain,containingthe
sub domain(i.e.,thekey)tob eregistered,thevalueinoneofseveralprede-
nedformats,anidentityoftheowner,anexpirationdate,andsomeamount
ofcrypto currencyasdeterminedbythedomain'sowner.
Sub domainsareregisteredonarst-come,rst-servedbasis.

4.3.6. Retrieving data from a DNS smart contract. In principle,
any fullno defor themasterchainor shardchain containingaDNS smart
contractmightb eabletolo okupanysub domaininthedatabaseofthat
smartcontract,ifthestructureandthelo cationofthehashmapinsidethe
p ersistentstorageofthesmartcontractareknown.
However,thisapproachwouldworkonlyforcertainDNSsmartcontracts.
Itwouldfailmiserablyifanon-standardDNSsmartcontractwereused.
Instead,anapproachbasedongeneralsmartcontractinterfacesandget
methods (cf.4.3.11)isused. AnyDNSsmartcontractmustdeneaget
metho dwithaknownsignature,whichisinvokedtolo okupakey.Since
thisapproachmakessenseforothersmartcontractsaswell,esp eciallythose
providingon-chainandmixedservices,weexplainitinsomedetailin4.3.11.

4.3.7.TranslatingaTONDNSdomain.Onceanyfullno de,actingby
itselforonb ehalfofsomelightclient,canlo okupentriesinthedatabase


```
4.3. AccessingTONServices
```
ofanyDNSsmartcontract,arbitraryTONDNSdomainnamescanb ere-
cursivelytranslated,startingfromthewell-knownandxedro otDNSsmart
contract(account)identier.
Forexample,ifonewantstotranslateA.B.C,onelo oksupkeys.C,.B.C,
andA.B.Cinthero otdomaindatabase.Iftherstofthemisnotfound,but
thesecondis,andits valueisareferencetoanotherDNSsmartcontract,
thenAislo okedupinthedatabaseofthatsmartcontractandthenalvalue
isretrieved.

4.3.8.Translating TONDNS domainsfor lightno des. Inthisway,
afullno deforthemasterchainandalsoforallshardchainsinvolvedinthe
domainlo ok-uppro cessmighttranslateanydomainnameintoitscurrent
valuewithoutexternalhelp.Alightno demightrequestafullno detodothis
onitsb ehalfandreturnthevalue,alongwithaMerklepro of(cf.2.5.11).
ThisMerklepro ofwouldenablethelightno detoverifythattheansweris
correct, so such TONDNS resp onsescannot b esp o ofed by amalicious
interceptor,incontrasttotheusualDNSproto col.
Becausenono de canb eexp ectedtob eafullno dewithresp ecttoall
shardchains,actualTONDNSdomaintranslationwouldinvolveacombina-
tionofthesetwostrategies.

4.3.9. Dedicated TON DNS servers. One mightprovidea simple
TONDNSserver,whichwouldreceiveRPCDNS queries(e.g.,viathe
ADNLorRLDPproto colsdescrib edin3.1),requestingthattheservertrans-
lateagivendomain,pro cessthesequeriesbyforwardingsomesub queriesto
other(full)no desifnecessary, andreturnanswersto theoriginal queries,
augmentedbyMerklepro ofsifrequired.
SuchDNSserversmightoertheirservices(forfreeornot)toanyother
no desandesp eciallylightclients,usingoneofthemetho dsdescrib edin4.2.
Noticethattheseservers,ifconsideredpartoftheTONDNSservice,would
eectivelytransformitfromadistributedon-chainserviceintoadistributed
mixedservice(i.e.,afogservice).
Thisconcludesourbriefoverview oftheTON DNSservice, ascalable
on-chainregistryforhuman-readabledomainnamesofTONBlo ckchainand
TONNetworkentities.

4.3.10.Accessingdatakeptinsmartcontracts. Wehavealreadyseen
that it issometimes necessaryto access datastored in asmart contract
withoutchangingitsstate.


```
4.3. AccessingTONServices
```
Ifoneknowsthedetailsofthesmart-contractimplementation,onecan
extractalltheneededinformationfromthesmartcontract'sp ersistentstor-
age,availabletoallfullno desoftheshardchainthesmartcontractresides
in. However,thisisquiteaninelegantwayofdoingthings,dep endingvery
muchonthesmart-contractimplementation.

4.3.11.Getmetho ds ofsmartcontracts. Ab etterwaywouldb eto
denesomegetmethodsinthesmartcontract,thatis,sometyp esofinb ound
messagesthatdonotaectthestateofthesmartcontractwhendelivered,
butgenerateoneormoreoutputmessagescontainingtheresultoftheget
metho d. Inthisway,onecanobtaindatafromasmartcontract,knowing
onlythatitimplementsagetmetho dwithaknownsignature(i.e.,aknown
format of theinb ound messageto b e sentandoutb ound messagesto b e
receivedasaresult).
Thiswayismuchmoreelegantandinlinewithob jectorientedprogram-
ming(OOP).However,ithasanobviousdefectso far: onemustactually
commitatransactionintotheblo ckchain(sendingthegetmessagetothe
smartcontract),waituntilitiscommittedandpro cessedbythevalidators,
extracttheanswerfromanewblo ck,andpayforgas(i.e.,forexecutingthe
getmetho donthevalidators'hardware). Thisisawasteofresources: get
metho dsdonotchangethestateofthesmartcontractanyways,sotheyneed
notb eexecutedintheblo ckchain.

4.3.12.Tentativeexecutionofgetmetho dsofsmartcontracts. We
havealready remarked (cf.2.4.6)that anyfullno de cantentativelyexe-
cuteanymetho dofanysmartcontract(i.e.,deliveranymessagetoasmart
contract),startingfromagivenstateofthesmartcontract,withoutactually
committingthecorresp ondingtransaction.Thefullno decansimplyloadthe
co deofthesmartcontractunderconsiderationintotheTONVM,initialize
itsp ersistentstoragefromtheglobalstateoftheshardchain(knowntoall
fullno desoftheshardchain),andexecutethesmart-contractco dewiththe
inb oundmessageasitsinputparameter. Theoutputmessagescreatedwill
yieldtheresultofthiscomputation.
Inthisway,anyfullno decanevaluatearbitrarygetmetho dsofarbitrary
smartcontracts,provided theirsignature(i.e.,theformatof inb oundand
outb oundmessages)isknown. Theno demaykeeptrackofthecellsofthe
shardchainstateaccessedduringthisevaluation,andcreateaMerklepro of
ofthevalidityofthecomputationp erformed,fortheb enetofalightno de
thatmighthaveaskedthefullno detodoso(cf.2.5.11).


```
4.3. AccessingTONServices
```
4.3.13. Smart-contract interfaces in TL-schemes. Recall that the
metho dsimplementedbyasmartcontract(i.e.,theinputmessagesaccepted
byit)areessentiallysomeTL-serializedob jects,whichcanb edescrib edby
aTL-scheme(cf.2.2.5).Theresultingoutputmessagescanb edescrib edby
thesameTL-schemeaswell. Inthisway,theinterfaceprovidedbyasmart
contracttootheraccountsandsmartcontractsmayb eformalizedbymeans
ofaTL-scheme.
Inparticular,(asubsetof )getmetho dssupp ortedbyasmartcontract
canb edescrib edbysuchaformalizedsmart-contractinterface.

4.3.14.Publicinterfacesofasmartcontract.Noticethataformalized
smart-contractinterface,eitherinformofaTL-scheme(representedasaTL
sourcele;cf.2.2.5)orinserializedform,^34 canb epublishedforexample,
inasp ecial eld inthe smart-contractaccount description, stored inthe
blo ckchain,orseparately,ifthisinterfacewillb ereferredtomanytimes.In
thelattercaseahashofthesupp ortedpublicinterfacemayb eincorp orated
intothesmart-contractdescriptioninsteadoftheinterfacedescriptionitself.
AnexampleofsuchapublicinterfaceisthatofaDNSsmartcontract,
whichissupp osedtoimplementatleastonestandardgetmetho dforlo oking
upsub domains(cf.4.3.6). Astandardmetho dforregisteringnewsub do-
mainscanb ealsoincludedinthestandardpublicinterfaceofDNSsmart
contracts.

4.3.15.User interfaceof asmartcontract. Theexistenceofapublic
interfaceforasmartcontracthasotherb enets,to o.Forexample,awallet
clientapplicationmaydownloadsuchaninterfacewhileexaminingasmart
contractontherequestofauser,anddisplayalistofpublicmetho ds(i.e.,
ofavailable actions)supp orted bythe smartcontract, p erhapswithsome
human-readablecommentsifanyareprovidedintheformalinterface.After
theuserselectsoneofthesemetho ds,aformmayb eautomaticallygenerated
accordingtotheTL-scheme,wheretheuserwillb epromptedforallelds
requiredbythechosenmetho dandforthedesiredamountofcrypto currency
(e.g.,TONcoins)tob eattachedtothisrequest. Submittingthisformwill
createanewblo ckchaintransactioncontainingthemessagejustcomp osed,
sentfromtheuser'sblo ckchainaccount.
Inthisway,theuserwillb eabletointeractwitharbitrarysmartcontracts

(^34) TL-schemes can b e TL-serialized themselves; cf. https://core.telegram.org/
mtproto/TL- tl.


```
4.3. AccessingTONServices
```
fromthewalletclientapplicationinauser-friendlywaybyllingandsub-
mittingcertainforms,providedthesesmartcontractshavepublishedtheir
interfaces.

4.3.16.Userinterfaceofaton-service.Itturnsoutthatton-services
(i.e.,servicesresidingintheTONNetworkandacceptingqueriesthrough
theADNLandRLDPproto colsof 3 ;cf.4.1.5)mayalsoprotfromhaving
publicinterfaces,describ edbyTL-schemes(cf.2.2.5).Aclientapplication,
suchasalightwalletoraton-browser,mightprompttheusertoselectone
ofthemetho dsandtollinaformwithparametersdenedbytheinterface,
similarlytowhathasjustb eendiscussedin4.3.15. Theonlydierenceis
thattheresultingTL-serializedmessageisnotsubmittedasatransactionin
theblo ckchain;instead,itissentasanRPCquerytotheabstractaddress
oftheton-serviceinquestion,andtheresp onsetothisqueryisparsedand
displayedaccordingtotheformalinterface(i.e.,aTL-scheme).

4.3.17.Lo catinguserinterfacesviaTONDNS.TheTONDNSrecord
containinganabstractaddressofaton-serviceorasmart-contractaccount
identiermightalsocontain anoptionaleld describingthe public(user)
interfaceof that entity, or several supp orted interfaces. Then the client
application(b eitawallet, a ton-browseror aton-proxy) willb e ableto
downloadtheinterfaceandinteractwiththeentityinquestion(b eitasmart
contractoraton-service)inauniformway.

4.3.18.Blurringthedistinctionb etweenon-chainando-chainser-
vices. Inthisway,thedistinctionb etweenon-chain, o-chainandmixed
services(cf.4.1.2)isblurredfortheenduser: shesimplyentersthedomain
nameofthedesiredserviceintotheaddresslineofherton-browserorwallet,
andtherestishandledseamlesslybytheclientapplication.

4.3.19. ton-sites as ton-servicessupp orting anHTTP interface.
Aton-siteissimplyaton-servicethatsupp ortsanHTTPinterface,p erhaps
alongwithsomeotherinterfaces. Thissupp ortmay b eannouncedinthe
corresp ondingTONDNSrecord.

4.3.20. Hyp erlinks. Noticethat theHTMLpagesreturnedbyton-sites
maycontainton-hyperlinksthatis,referencestootherton-sites,smartcon-
tractsandaccountsbymeansofsp eciallycraftedURIschemes(cf.4.3.21)
containingeitherabstractnetworkaddresses,accountidentiers,orhuman-
readableTON DNS domains. Thenaton-browser mightfollowsuch a


```
4.3. AccessingTONServices
```
hyp erlinkwhentheuserselectsit,detecttheinterfacetob eused,anddis-
playauserinterfaceformasoutlinedin4.3.15and4.3.16.

4.3.21.Hyp erlinkURLsmaysp ecifysomeparameters.Thehyp erlink
URLsmaycontainnotonlya(TON)DNSdomainoranabstractaddressof
theserviceinquestion,butalsothenameofthemetho dtob einvokedand
someorallofitsparameters.Ap ossibleURIschemeforthismightlo okas
follows:

```
ton://<domain>/<method>?<eld1>=<value1>&<eld2>=...
```
Whentheuserselectssuchalinkinaton-browser,eithertheactionisp er-
formed immediately(esp ecially ifitisagetmetho dof a smartcontract,
invokedanonymously),orapartiallylledformisdisplayed, tob eexplic-
itlyconrmedandsubmittedbytheuser(thismayb erequiredforpayment
forms).

4.3.22. POST actions. Aton-sitemay emb edintotheHTML pagesit
returns some usual-lo okingPOSTforms, withPOSTactionsreferring ei-
thertoton-sites,ton-servicesorsmartcontractsbymeansofsuitable(TON)
URLs. Inthatcase,oncetheuserllsandsubmitsthatcustomform,the
corresp ondingactionistaken,eitherimmediatelyorafteranexplicitconr-
mation.

4.3.23.TONWWW.Alloftheab ovewillleadtothecreationofawhole
webofcross-referencingentities,residingintheTONNetwork,whichwould
b eaccessibletotheenduserthroughaton-browser,providingtheuserwith
a WWW-likebrowsing exp erience. Forend users, thiswill nally make
blo ckchainapplicationsfundamentallysimilartothewebsitestheyareal-
readyaccustomedto.

4.3.24. Advantages of TON WWW. ThisTONWWW of on-chain
ando-chainserviceshassomeadvantagesoveritsconventionalcounterpart.
Forexample,paymentsareinherentlyintegratedinthesystem.Useridentity
canb ealwayspresentedtotheservices(bymeansofautomaticallygenerated
signaturesonthe transactionsandRPCrequestsgenerated),or hiddenat
will. Serviceswouldnotneedtocheckandre-checkusercredentials;these
credentialscanb epublishedintheblo ckchainonceandforall.Usernetwork
anonymitycanb eeasilypreservedbymeansofTONProxy,andallservices
willb eeectivelyunblo ckable. Micropaymentsarealsop ossibleandeasy,
b ecauseton-browserscanb eintegratedwiththeTONPaymentssystem.


### 5.1 PaymentChannels

## 5 TONPayments

Thelastcomp onentoftheTONPro jectwewillbrieydiscussinthistext
isTONPayments,theplatformfor(micro)paymentchannelsandlightning
networkvaluetransfers. Itwouldenableinstant payments,withoutthe
needtocommitalltransactionsintotheblo ckchain,paytheasso ciatedtrans-
actionfees(e.g.,forthegasconsumed),andwaitvesecondsuntiltheblo ck
containingthetransactionsinquestionisconrmed.
Theoveralloverheadofsuchinstantpaymentsissosmallthatonecan
usethemformicropayments.Forexample,aTONle-storingservicemight
chargetheuserforevery 128 KiBofdownloadeddata,orapaidTONProxy
mightrequiresometinymicropaymentforevery 128 KiBoftracrelayed.
WhileTONPaymentsislikelytob ereleasedlaterthanthecorecomp o-
nentsoftheTONPro ject,someconsiderationsneedtob emadeatthevery
b eginning. Forexample,theTONVirtualMachine(TONVM;cf.2.1.20),
usedtoexecutetheco deofTONBlo ckchainsmartcontracts,mustsupp ort
somesp ecialop erationswithMerklepro ofs. Ifsuchsupp ortisnotpresent
intheoriginaldesign,addingitatalaterstagemightb ecomeproblematic
(cf.2.8.16). Wewillsee, however,thattheTONVMcomeswithnatural
supp ortforsmartpaymentchannels(cf.5.1.9)outoftheb ox.

### 5.1 PaymentChannels

Westartwithadiscussionofp oint-to-p ointpaymentchannels,andhowthey
canb eimplementedintheTONBlo ckchain.

5.1.1.Theideaofapaymentchannel. Supp osetwoparties,AandB,
knowthattheywillneedtomakealotofpaymentstoeachotherinthefuture.
Insteadofcommittingeachpaymentasatransactionintheblo ckchain,they
createasharedmoneyp o ol(orp erhapsasmallprivatebankwithexactly
twoaccounts),andcontributesomefundstoit: Acontributesacoins,and
Bcontributesbcoins. Thisisachievedbycreatingasp ecialsmartcontract
intheblo ckchain,andsendingthemoneytoit.
Beforecreatingthemoneyp o ol,thetwosidesagreetoacertainproto col.
Theywillkeeptrackofthestate ofthep o olthatis,oftheirbalancesin
thesharedp o ol.Originally,thestateis(a,b),meaningthatacoinsactually
b elong to A, and bcoins b elong to B. Then, ifAwants to payd coins
toB,theycansimplyagreethatthenewstateis(a′,b′) = (a−d,b+d).


```
5.1.PaymentChannels
```
Afterwards,if, say, B wants to payd′ coins to A, thestate willb ecome
(a′′,b′′) = (a′+d′,b′−d′),andsoon.
Allthisup datingofbalancesinsidethep o olisdonecompletelyo-chain.
Whenthetwopartiesdecidetowithdrawtheirduefundsfromthep o ol,they
dosoaccordingtothenalstateofthep o ol. Thisisachievedbysendinga
sp ecialmessagetothesmartcontract,containingtheagreed-up onnalstate
(a∗,b∗)alongwiththesignaturesofb othAandB.Thenthesmartcontract
sendsa∗coinstoA,b∗coinstoBandself-destructs.
Thissmartcontract,alongwiththenetworkproto colusedbyAandBto
up datethestateofthep o ol,isasimplepaymentchannelbetweenAandB.
Accordingtotheclassicationdescrib edin4.1.2,itisamixedservice:partof
itsstateresidesintheblo ckchain(thesmartcontract),butmostofitsstate
up datesarep erformed o-chain(by thenetworkproto col). Ifeverything
go eswell,thetwopartieswillb eabletop erformasmanypaymentstoeach
otherasthey want(with theonlyrestrictionb eingthat thecapacity of
thechannelisnotoverruni.e.,theirbalancesinthepaymentchannelb oth
remainnon-negative),committingonlytwotransactionsintotheblo ckchain:
onetoop en(create)thepaymentchannel(smartcontract),andanotherto
close(destroy)it.

5.1.2.Trustlesspaymentchannels.Thepreviousexamplewassomewhat
unrealistic,b ecauseitassumesthatb othpartiesarewillingtoco op erateand
willnevercheattogainsomeadvantage. Imagine,forexample,thatAwill
cho osenottosignthenalbalance(a′,b′)witha′< a. ThiswouldputBin
adicultsituation.
Toprotect againstsuchscenarios,oneusuallytriestodeveloptrustless
paymentchannelproto cols,whichdo notrequire thepartiestotrusteach
other,andmakeprovisionsforpunishinganypartywhowouldattemptto
cheat.
Thisisusuallyachievedwiththeaidofsignatures.Thepaymentchannel
smartcontractknows thepublickeysofAandB,anditcanchecktheir
signaturesifneeded. Thepaymentchannelproto colrequiresthepartiesto
signtheintermediatestatesandsendthesignaturestoeach other. Then,
ifoneof thepartiescheatsforinstance,pretendsthatsome stateofthe
paymentchannelneverexisteditsmisb ehaviorcanb eprovedbyshowing
its signatureonthat state. Thepaymentchannelsmart contractacts as
anon-chain arbiter,ableto pro cesscomplaintsof thetwopartiesab out
eachother,andpunishtheguiltypartybyconscatingallofitsmoneyand


```
5.1.PaymentChannels
```
awardingittotheotherparty.

5.1.3.Simplebidirectionalsynchronoustrustlesspaymentchannel.
Considerthefollowing,morerealisticexample:Letthestateofthepayment
channelb edescrib edbytriple(δi,i,oi),whereiisthesequencenumb erofthe
state(itisoriginallyzero,andthenitisincreasedbyonewhenasubsequent
stateapp ears),δiisthechannelimbalance(meaningthatAandBowna+δi
andb−δi coins,resp ectively),andoiisthepartyallowedtogeneratethe
nextstate(eitherAorB). Eachstatemustb esignedb othbyAandB
b eforeanyfurtherprogresscanb emade.
Now,ifAwantstotransferdcoinstoBinsidethepaymentchannel,and
thecurrentstateisSi= (δi,i,oi)withoi=A,thenitsimplycreatesanew
stateSi+1 = (δi−d,i+ 1,oi+1),signsit,andsendsittoBalongwithits
signature.ThenBconrmsitbysigningandsendingacopyofitssignature
toA.Afterthat,b othpartieshaveacopyofthenewstatewithb othoftheir
signatures,andanewtransfermayo ccur.
IfAwantstotransfercoinstoBinastateSiwithoi=B,thenitrst
asksBtocommitasubsequentstateSi+1withthesameimbalanceδi+1=δi,
butwithoi+1=A. Afterthat,Awillb eabletomakeitstransfer.
Whenthetwopartiesagreetoclosethepaymentchannel,theyb othput
theirsp ecialnal signatureson thestateSk theyb elieveto b enal, and
invokethe clean or two-sidednalization method of thepayment channel
smartcontractbysendingitthenalstatealongwithb othnalsignatures.
Iftheotherpartydo esnotagreetoprovideitsnalsignature,orsimplyif
itstopsresp onding,itisp ossibletoclosethechannelunilaterally. Forthis,
the partywishing to do sowill invoke theunilateral nalization metho d,
sendingtothesmartcontractitsversionofthenalstate,itsnalsignature,
andthemostrecentstatehavingasignatureoftheotherparty.Afterthat,
the smart contract do esnot immediatelyact on the nal statereceived.
Instead,itwaitsforacertainp erio doftime(e.g.,oneday)fortheotherparty
topresentitsversionofthenalstate. Whentheotherpartysubmitsits
versionanditturnsouttob ecompatiblewiththealreadysubmittedversion,
thetruenalstateiscomputedbythesmartcontractandusedtodistribute
themoneyaccordingly. Iftheotherpartyfailstopresentitsversionofthe
nalstatetothesmartcontract,thenthemoneyisredistributedaccording
totheonlycopyofthenalstatepresented.
Ifoneofthe twopartiescheatsforexample, bysigningtwodierent
statesasnal,orbysigningtwodierentnextstatesSi+1andSi′+1,orby


```
5.1.PaymentChannels
```
signinganinvalidnewstateSi+1(e.g.,withimbalanceδi+1<−aor> b)
thentheotherpartymaysubmitpro ofofthismisb ehaviortoathirdmetho d
ofthesmartcontract. Theguiltypartyispunishedimmediatelybylosing
itsshareinthepaymentchannelcompletely.
Thissimplepaymentchannelproto colisfairinthesensethatanyparty
canalwaysgetitsdue,withorwithouttheco op erationoftheotherparty,
andislikelytoloseallofitsfundscommittedtothepaymentchannelifit
triestocheat.

5.1.4.Synchronouspaymentchannelasasimplevirtualblo ckchain
withtwovalidators.Theab oveexampleofasimplesynchronouspayment
channelcanb erecast asfollows. Imaginethatthesequenceof statesS 0 ,
S 1 ,... ,Sn isactuallythe sequenceof blo cksofaverysimpleblo ckchain.
Eachblo ckofthisblo ckchaincontainsessentiallyonlythecurrentstateof
theblo ckchain,andmayb eareferencetothepreviousblo ck(i.e.,itshash).
BothpartiesAandBactasvalidatorsforthisblo ckchain,soeveryblo ck
mustcollectb othoftheirsignatures.ThestateSioftheblo ckchaindenes
thedesignatedpro duceroiforthenextblo ck,sothereisnoraceb etweenA
andBforpro ducingthenextblo ck.Pro ducerAisallowedtocreateblo cks
thattransferfundsfromAtoB(i.e.,decreasetheimbalance:δi+1≤δi),and
BcanonlytransferfundsfromBtoA(i.e.,increaseδ).
Ifthetwovalidatorsagreeonthenalblo ck(andthenalstate)ofthe
blo ckchain,itisnalizedbycollectingsp ecialnal signaturesofthetwo
parties,andsubmittingthemalongwiththenalblo cktothechannelsmart
contractforpro cessingandre-distributingthemoneyaccordingly.
Ifavalidatorsignsaninvalidblo ck,orcreatesafork,orsignstwodierent
nalblo cks,itcanb epunishedbypresentingapro ofofitsmisb ehaviorto
thesmartcontract,whichactsasanon-chainarbiterforthetwovalidators;
thentheoendingpartywillloseallitsmoneykeptinthepaymentchannel,
whichisanalogoustoavalidatorlosingitsstake.

5.1.5.Asynchronouspaymentchannelasavirtualblo ckchainwith
two workchains. The synchronouspayment channeldiscussedin 5.1.3
hasacertaindisadvantage: onecannotb eginthenexttransaction(money
transferinsidethepaymentchannel)b eforethepreviousoneisconrmedby
theotherparty.Thiscanb exedbyreplacingthesinglevirtualblo ckchain
discussedin5.1.4byasystemoftwointeractingvirtualworkchains(orrather
shardchains).


```
5.1.PaymentChannels
```
The rstof theseworkchainscontains onlytransactionsbyA, andits
blo ckscanb egeneratedonlybyA; itsstates areSi = (i,φi,j,ψj),where
iisthe blo cksequencenumb er(i.e., thecount oftransactions, or money
transfers,p erformedbyAsofar),φiisthetotalamounttransferredfromA
toBsofar,jisthesequencenumb erofthemostrecentvalidblo ckinB's
blo ckchainthat Aisawareof,andψj istheamountofmoney transferred
fromBtoAinitsjtransactions. AsignatureofBputontoitsj-thblo ck
should alsob eapart of this state. Hashesof the previousblo ck ofthis
workchainandofthej-thblo ckoftheotherworkchainmayb ealsoincluded.
ValidityconditionsforSiincludeφi≥ 0 , φi≥φi− 1 ifi > 0 ,ψj ≥ 0 , and
−a≤ψj−φi≤b.
Similarly,thesecondworkchaincontainsonlytransactionsbyB,andits
blo cksaregeneratedonlybyB;itsstatesareTj= (j,ψj,i,φi),withsimilar
validityconditions.
Now,ifAwantstotransfersomemoney toB,itsimplycreatesanew
blo ckinitsworkchain,signsit,andsendstoB,withoutwaitingforconr-
mation.
ThepaymentchannelisnalizedbyAsigning(itsversionof )thenal
stateof itsblo ckchain(withits sp ecialnalsignature),Bsigningthe-
nalstateofitsblo ckchain,andpresentingthesetwonalstatestotheclean
nalizationmetho dofthepaymentchannelsmartcontract.Unilateralnal-
izationisalsop ossible,butinthatcasethesmartcontractwillhavetowait
fortheotherpartytopresentitsversionofthenalstate,atleastforsome
gracep erio d.

5.1.6.Unidirectionalpaymentchannels. IfonlyAneedstomakepay-
mentstoB(e.g.,Bisaserviceprovider,andAitsclient),thenaunilateral
paymentchannelcanb ecreated. Essentially, itisjusttherstworkchain
describ edin5.1.5withoutthesecondone. Conversely,onecansay that
theasynchronouspaymentchanneldescrib edin5.1.5consistsoftwounidi-
rectionalpaymentchannels,orhalf-channels,managedbythesamesmart
contract.

5.1.7.Moresophisticatedpaymentchannels. Promises. Wewillsee
laterin5.2.4thatthelightningnetwork(cf.5.2),whichenablesinstant
moneytransfersthroughchainsofseveralpaymentchannels,requireshigher
degreesofsophisticationfromthepaymentchannelsinvolved.
Inparticular,wewanttob eabletocommitpromises,orconditional
moneytransfers: AagreestosendccoinstoB,butBwillgetthemoney


```
5.1.PaymentChannels
```
onlyifacertaincondition isfullled,forinstance, ifBcanpresentsome
stringuwithHash(u) =vforaknownvalueofv.Otherwise,Acangetthe
moneybackafteracertainp erio doftime.
Suchapromisecouldeasilyb eimplementedon-chainbyasimplesmart
contract. However,wewantpromisesandotherkindsofconditionalmoney
transferstob ep ossibleo-chain,inthepaymentchannel,b ecausetheycon-
siderablysimplifymoneytransfersalongachainofpaymentchannelsexisting
inthelightningnetwork(cf.5.2.4).
Thepaymentchannelasasimpleblo ckchainpictureoutlinedin5.1.4
and5.1.5b ecomesconvenienthere.Nowweconsideramorecomplicatedvir-
tualblo ckchain,thestateofwhichcontainsasetofsuchunfullledpromises,
andtheamountoffundslo ckedinsuchpromises. Thisblo ckchainorthe
two workchainsinthe asynchronous casewillhave to refer explicitlyto
thepreviousblo cksbytheirhashes. Nevertheless,the generalmechanism
remainsthesame.

5.1.8.Challengesforthesophisticatedpaymentchannelsmartcon-
tracts.Noticethat,whilethenalstateofasophisticatedpaymentchannel
isstill small,and the clean nalizationissimple(if the two sideshave
agreedontheiramountsdue,andb othhavesignedtheiragreement,nothing
elseremainstob edone),theunilateralnalizationmetho dandthemetho d
forpunishingfraudulentb ehaviorneed tob emorecomplex. Indeed, they
mustb eabletoacceptMerklepro ofsofmisb ehavior,andtocheckwhether
themoresophisticatedtransactionsofthepaymentchannelblo ckchainhave
b eenpro cessedcorrectly.
In otherwords, the paymentchannel smart contractmust b e ableto
workwithMerklepro ofs,to checktheirhash validity,andmustcontain
an implementationof ev_trans andev_block functions(cf.2.2.6)forthe
paymentchannel(virtual)blo ckchain.

5.1.9.TON VMsupp ortfor smart payment channels. TheTON
VM,usedtoruntheco deofTONBlo ckchainsmartcontracts,isuptothe
challengeofexecutingthesmartcontractsrequiredforsmart,orsophisti-
cated,paymentchannels(cf.5.1.8).
Atthisp ointtheeverythingisabagofcellsparadigm(cf.2.5.14)b e-
comesextremelyconvenient. Sinceallblo cks(includingthe blo cksofthe
ephemeralpaymentchannelblo ckchain)arerepresentedasbagsofcells(and
describ edby somealgebraicdatatyp es),andthesameholdsformessages
andMerklepro ofsaswell,aMerklepro ofcaneasilyb eemb eddedintoan


```
5.1.PaymentChannels
```
inb oundmessagesentto thepaymentchannelsmartcontract. Thehash
conditionoftheMerklepro ofwillb echeckedautomatically,andwhenthe
smartcontractaccessestheMerklepro of  presented,itwillworkwithit
asifitwereavalueofthecorresp ondingalgebraicdatatyp ealb eitincom-
plete,withsomesubtreesofthetreereplacedbysp ecialno descontainingthe
Merklehashoftheomittedsubtree.Thenthesmartcontractwillworkwith
thatvalue,whichmightrepresent,forinstance,ablo ckofthepaymentchan-
nel(virtual)blo ckchainalongwithitsstate,andwillevaluatetheev_block
function(cf.2.2.6)ofthatblo ckchainonthisblo ckandthepreviousstate.
Theneitherthecomputationnishes,andthenalstatecanb ecompared
withthatassertedintheblo ck,oranabsentno deexceptionisthrownwhile
attemptingtoaccessanabsentsubtree,indicatingthattheMerklepro ofis
invalid.
Inthisway,theimplementationofthevericationco deforsmartpay-
mentchannelblo ckchainsturnsouttob equitestraightforwardusingTON
Blo ckchain smart contracts. One mightsay that the TON Virtual Ma-
chinecomes with built-insupport for checking thevalidity ofothersimple
blockchains. TheonlylimitingfactoristhesizeoftheMerklepro oftob e
incorp oratedintotheinb oundmessagetothesmartcontract(i.e.,intothe
transaction).

5.1.10.Simplepaymentchannelwithin asmartpaymentchannel.
Wewouldliketodiscussthep ossibilityofcreatingasimple(synchronousor
asynchronous)paymentchannelinsideanexistingpaymentchannel.
Whilethismayseemsomewhatconvoluted,itisnotmuchhardertoun-
derstandandimplementthanthepromisesdiscussedin5.1.7.Essentially,
insteadofpromisingtopayccoinstotheotherpartyifasolutiontosome
hashproblemispresented,ApromisestopayuptoccoinstoBaccording
tothenalsettlementofsomeother(virtual)paymentchannelblo ckchain.
Generallysp eaking,thisotherpaymentchannelblo ckchainneednotevenb e
b etweenAandB;itmightinvolvesomeotherparties,say,CandD,will-
ingtocommitcanddcoinsintotheirsimplepaymentchannel,resp ectively.
(Thisp ossibilityisexploitedlaterin5.2.5.)
Iftheencompassingpaymentchannelisasymmetric,twopromisesneed
tob ecommittedintothetwoworkchains: Awillpromisetopay−δcoins
toBifthenalsettlementoftheinternalsimplepaymentchannelyields
anegativenalimbalanceδwith 0 ≤ −δ≤c;andBwillhavetopromise
to pay δ to Aif δ is p ositive. On the otherhand, if the encompassing


### 5.2 PaymentChannelNetwork,orLightningNetwork

payment channelis symmetric, this canb e done by committinga single
simple paymentchannelcreation transactionwithparameters(c,d)into
the singlepayment channelblo ckchainby A (which would freezec coins
b elongingtoA),andthencommittingasp ecialconrmationtransaction
byB(whichwouldfreezedcoinsofB).
Weexp ecttheinternalpaymentchanneltob eextremelysimple(e.g.,the
simplesynchronouspaymentchanneldiscussedin5.1.3),to minimizethe
sizeofMerklepro ofstob esubmitted. Theexternalpaymentchannelwill
havetob esmartinthesensedescrib edin5.1.7.

### 5.2 PaymentChannelNetwork,orLightningNetwork

NowwearereadytodiscussthelightningnetworkofTONPaymentsthat
enablesinstantmoneytransfersb etweenanytwoparticipatingno des.

5.2.1.Limitationsofpaymentchannels.Apaymentchannelisusefulfor
partieswhoexp ectalotofmoneytransfersb etweenthem. However,ifone
needstotransfermoneyonlyonceortwicetoaparticularrecipient,creating
apaymentchannelwithherwouldb eimpractical. Amongotherthings,this
wouldimplyfreezingasignicantamountofmoneyinthepaymentchannel,
andwouldrequireatleasttwoblo ckchaintransactionsanyway.

5.2.2.Paymentchannelnetworks,orlightningnetworks.Payment
channelnetworksovercomethelimitationsofpaymentchannelsbyenabling
moneytransfersalongchainsofpaymentchannels. IfAwantstotransfer
moneytoE,shedo esnotneedtoestablishapaymentchannelwithE. It
wouldb esucienttohaveachainof paymentchannelslinkingAwithE
throughseveralintermediateno dessay,fourpaymentchannels:fromAto
B,fromBtoC,fromCtoDandfromDtoE.

5.2.3.Overviewofpaymentchannelnetworks. Recallthatapayment
channelnetwork,knownalsoasalightningnetwork,consistsofacollection
ofparticipatingno des,someof whichhaveestablishedlong-lived payment
channelsb etweenthem.Wewillseeinamomentthatthesepaymentchannels
willhavetob esmartinthesenseof 5.1.7. Whenaparticipatingno deA
wantstotransfermoneytoanyotherparticipatingno deE,shetriestond
apath linkingAtoEinsidethepaymentchannelnetwork. Whensuch a
pathisfound,shep erformsachainmoneytransferalongthispath.


```
5.2.PaymentChannelNetwork,orLightningNetwork
```
5.2.4.Chainmoneytransfers.Supp osethatthereisachainofpayment
channelsfromAtoB,fromBtoC,fromCtoD,andfromDtoE.Supp ose,
further,thatAwantstotransferxcoinstoE.
Asimplisticapproachwouldb etotransferxcoinstoBalongtheexisting
paymentchannel,andaskhimtoforwardthemoneyfurthertoC.However,
itisnotevidentwhyBwouldnotsimplytakethemoneyforhimself. There-
fore,onemustemployamoresophisticatedapproach,notrequiringallparties
involvedtotrusteachother.
Thiscanb eachievedasfollows. Ageneratesalargerandomnumb eru
andcomputesitshash v= Hash(u). Thenshecreatesapromisetopay
xcoinstoBifanumb eruwithhashvispresented(cf.5.1.7),insideher
paymentchannelwithB. Thispromisecontainsv,butnotu,whichisstill
keptsecret.
Afterthat,BcreatesasimilarpromisetoCintheirpaymentchannel.He
isnotafraidtogivesuchapromise,b ecauseheisawareoftheexistenceofa
similarpromisegiventohimbyA.IfCeverpresentsasolutionofthehash
problemtocollectxcoinspromisedbyB,thenBwillimmediatelysubmit
thissolutiontoAtocollectxcoinsfromA.
Then similarpromises of C to D andof D to E arecreated. When
thepromisesareallinplace,Atriggersthetransferbycommunicatingthe
solutionutoallpartiesinvolvedorjusttoE.
Someminordetailsareomittedinthisdescription. Forexample,these
promises must havedierent expiration times,and the amountpromised
mightslightlydieralongthechain(B mightpromiseonlyx−coinsto
C,whereisasmallpre-agreedtransitfee). Weignoresuchdetailsforthe
timeb eing,b ecausetheyarenotto orelevantforunderstandinghowpayment
channelsworkandhowtheycanb eimplementedinTON.

5.2.5.Virtualpaymentchannelsinsideachainofpaymentchannels.
Nowsupp osethatAandEexp ecttomakealotofpaymentstoeachother.
Theymightcreateanewpaymentchannelb etweenthemintheblo ckchain,
butthiswouldstillb equiteexp ensive,b ecausesomefundswouldb elo ckedin
thispaymentchannel.Anotheroptionwouldb etousechainmoneytransfers
describ edin5.2.4foreachpayment. However,thiswouldinvolvealotof
networkactivityandalotof transactionsinthevirtualblo ckchains ofall
paymentchannelsinvolved.
An alternativeistocreateavirtualpayment channelinside thechain
linkingAtoEinthepaymentchannelnetwork. Forthis,AandEcreate


```
5.2.PaymentChannelNetwork,orLightningNetwork
```
a(virtual)blo ckchainfortheirpayments,asiftheyweregoingtocreatea
paymentchannelintheblo ckchain.However,insteadofcreatingapayment
channelsmartcontractintheblo ckchain,theyaskallintermediatepayment
channelsthoselinkingAto B, B to C, etc.to createsimplepayment
channelsinsidethem,b oundtothevirtualblo ckchaincreatedbyAandE
(cf.5.1.10). Inotherwords,now apromisetotransfer money according
to thenal settlementb etween Aand Eexists inside everyintermediate
paymentchannel.
Ifthe virtualpaymentchannelisunidirectional, such promises canb e
implementedquiteeasily,b ecausethenalimbalanceδisgoingtob enon-
p ositive,sosimplepaymentchannelscanb ecreatedinsideintermediatepay-
mentchannels inthesame orderas describ edin5.2.4. Their expiration
timescanalsob esetinthesameway.
Ifthevirtualpaymentchannelisbidirectional, thesituationisslightly
morecomplicated. Inthatcase,oneshouldsplitthepromisetotransferδ
coinsaccordingtothenalsettlementintotwohalf-promises,asexplained
in5.1.10:totransferδ−= max(0,−δ)coinsintheforwarddirection,andto
transferδ+= max(0,δ)inthebackwarddirection. Thesehalf-promisescan
b ecreatedintheintermediatepaymentchannelsindep endently,onechain
ofhalf-promises inthedirectionfromAto E, andthe otherchaininthe
opp ositedirection.

5.2.6. Finding paths in the lightning network. Onep oint remains
undiscussedsofar: how willAandEndapathconnectingtheminthe
paymentnetwork? Ifthepaymentnetworkisnotto olarge,anOSPF-like
proto colcanb eused: allno desofthepaymentnetworkcreateanoverlay
network(cf.3.3.17),andtheneveryno depropagatesallavailablelink(i.e.,
participatingpaymentchannel)informationtoitsneighb orsbyagossippro-
to col.Ultimately,allno deswillhaveacompletelistofallpaymentchannels
participatinginthepaymentnetwork,andwillb eabletondtheshortest
pathsbythemselvesforexample,byapplyingaversionofDijkstra'salgo-
rithmmo diedtotakeintoaccountthecapacitiesofthepaymentchannels
involved(i.e.,the maximalamountsthat canb etransferredalong them).
Onceacandidatepathisfound,itcanb eprob edbyasp ecialADNLdata-
gramcontainingthefullpath,andaskingeachintermediateno detoconrm
theexistenceofthepaymentchannelinquestion,andtoforwardthisdata-
gramfurtheraccordingtothepath.Afterthat,achaincanb econstructed,
andaproto colforchaintransfers(cf.5.2.4),orforcreatingavirtualpayment


```
5.2.PaymentChannelNetwork,orLightningNetwork
```
channelinsideachainofpaymentchannels(cf.5.2.5),canb erun.

5.2.7.Optimizations. Someoptimizationsmightb edonehere.Forexam-
ple,onlytransitno desofthelightningnetworkneedtoparticipateinthe
OSPF-likeproto coldiscussedin5.2.6.Twoleaf no deswishingtoconnect
throughthelightningnetworkwouldcommunicatetoeachotherthelistsof
transitno destheyareconnectedto(i.e.,withwhichtheyhaveestablished
paymentchannelsparticipatinginthepaymentnetwork). Thenpathscon-
nectingtransitno desfromonelisttotransitno desfromtheotherlistcan
b einsp ectedasoutlinedab ovein5.2.6.

5.2.8. Conclusion. We have outlinedhow the blo ckchainand network
technologiesoftheTONpro jectareadequatetothetaskofcreatingTON
Payments,aplatformforo-chaininstantmoney transfersandmicropay-
ments. Thisplatformcanb eextremelyusefulforservicesresidinginthe
TONecosystem, allowingthemto easilycollectmicropaymentswhenand
whererequired.


## Conclusion

## Conclusion

Wehaveprop osedascalablemulti-blo ckchainarchitecturecapableofsup-
p ortingamassivelyp opularcrypto currencyanddecentralizedapplications
withuser-friendlyinterfaces.
To achievethenecessaryscalability,we prop osedtheTONBlockchain,
atightly-coupledmulti-blo ckchainsystem(cf.2.8.14)withb ottom-upap-
proachtosharding(cf.2.8.12and2.1.2).Tofurtherincreasep otentialp er-
formance,weintro ducedthe2-blo ckchain mechanismforreplacing invalid
blo cks(cf.2.1.17)andInstantHyp ercub eRoutingforfastercommunication
b etweenshards(cf.2.4.20). AbriefcomparisonoftheTONBlo ckchainto
existingandprop osedblo ckchainpro jects(cf.2.8and2.9)highlightsthe
b enetsofthisapproachforsystemsthatseektohandlemillionsoftransac-
tionsp ersecond.
The TONNetwork,describ edinChapter 3 ,coversthenetworking de-
mandsoftheprop osedmulti-blo ckchaininfrastructure. Thisnetworkcom-
p onentmayalsob eusedincombinationwiththeblo ckchaintocreateawide
sp ectrumofapplicationsandservices,imp ossibleusingtheblo ckchainalone
(cf.2.9.13). Theseservices,discussedinChapter 4 ,includeTONDNS,a
servicefortranslatinghuman-readableob jectidentiersintotheiraddresses;
TONStorage,adistributedplatformforstoringarbitraryles;TONProxy,
aserviceforanonymizingnetworkaccessandaccessingTON-p oweredser-
vices;andTONPayments(cf. Chapter 5 ),aplatformforinstanto-chain
money transfersacrosstheTON ecosystemthat applicationsmay usefor
micropayments.
TheTONinfrastructureallowsforsp ecializedlightclientwalletandton-
browser desktop andsmartphoneapplications that enablea browser-like
exp eriencefortheenduser(cf.4.3.23),makingcrypto currencypayments
andinteractionwithsmartcontractsandotherservicesontheTONPlatform
accessibletothemassuser.


```
References
```
## References

[1] K.Birman,ReliableDistributedSystems: Technologies,WebServices
andApplications,Springer,2005.

[2] V. Buterin, Ethereum: A next-generation smart contract and de-
centralizedapplicationplatform,https://github.com/ethereum/wiki/
wiki/White- Paper,2013.

[3] M. Ben-Or, B.Kelmer, T.Rabin, Asynchronoussecurecomputa-
tionswithoptimalresilience,inProceedingsofthethirteenthannualACM
symposium onPrinciples of distributed computing, p.183192. ACM,
1994.

[4] M. Castro, B. Liskov,et al., Practicalbyzantinefaulttolerance,
ProceedingsoftheThird SymposiumonOperatingSystemsDesignand
Implementation(1999),p.173186,availableathttp://pmg.csail.mit.
edu/papers/osdi99.pdf.

[5] EOS.IO,EOS.IOtechnicalwhitepap er, https://github.com/EOSIO/
Documentation/blob/master/TechnicalWhitePaper.md,2017.

[6] D.Goldschlag,M.Reed,P.Syverson,OnionRoutingforAnony-
mousandPrivateInternetConnections,Communications oftheACM,
42 , num. 2 (1999), [http://www.onion-](http://www.onion-) router.net/Publications/
CACM- 1999.pdf.

[7] L.Lamport,R.Shostak,M.Pease,Thebyzantinegeneralsproblem,
ACMTransactionsonProgrammingLanguagesandSystems,4/3(1982),
p.382401.

[8] S.Larimer,ThehistoryofBitShares,https://docs.bitshares.org/
bitshares/history.html,2013.

[9] M.Luby,A.Shokrollahi,etal.,RaptorQforwarderrorcorrection
schemeforob jectdelivery,IETFRFC6330,https://tools.ietf.org/
html/rfc6330,2011.

[10] P. Maymounkov, D. Mazières, Kademlia: A p eer-to-p eer infor-
mation system based on the XOR metric, in IPTPS '01 revised pa-
pers from the First International Workshopon Peer-to-Peer Systems,


```
References
```
```
p. 5365, available at http://pdos.csail.mit.edu/~petar/papers/
maymounkov- kademlia- lncs.pdf,2002.
```
[11] A. Miller, Yu Xia, et al., The honeybadger of BFT proto cols,
Cryptologye-printarchive 2016/99,https://eprint.iacr.org/2016/
199.pdf,2016.

[12] S.Nakamoto,Bitcoin:Ap eer-to-p eerelectroniccashsystem,https:
//bitcoin.org/bitcoin.pdf,2008.

[13] S.Peyton Jones,Implementinglazy functionallanguages onsto ck
hardware: theSpinelessTaglessG-machine,JournalofFunctionalPro-
gramming 2 (2),p.127202,1992.

[14] A. Shokrollahi, M. Luby, RaptorCo des, IEEE Transactions on
InformationTheory 6 ,no.34(2006),p.212322.

[15] M.vanSteen,A.Tanenbaum,DistributedSystems,3rded.,2017.

[16] TheUnivalentFoundationsProgram,HomotopyTyp eTheory:
Univalent Foundationsof Mathematics, Institute for AdvancedStudy,
2013,availableathttps://homotopytypetheory.org/book.

[17] G. Wood, PolkaDot: visionfor a heterogeneousmulti-chain frame-
work,draft1,https://github.com/w3f/polkadot- white- paper/raw/
master/PolkaDotPaper.pdf,2016.


```
AppendixA.TheTONCoin
```
## A TheTONCoin

Theprincipalcrypto currencyoftheTONBlo ckchain,andinparticularof
itsmasterchainandbasicworkchain,istheTONCoin. Itisusedtomake
dep ositsrequiredtob ecomeavalidator;transactionfees,gaspayments(i.e.,
smart-contractmessagepro cessingfees)andp ersistentstoragepaymentsare
alsousuallycollectedinTONcoins.

A.1.Sub divisionandterminology.ATONcoinissub dividedintoone
billion( 109 )smallerunits,callednanotons,ntonsorsimplynanos.Alltrans-
fersandaccountbalancesareexpressedasnon-negativeintegermultiplesof
nanos.Otherunitsinclude:

```
 Anano,ntonornanotonisthesmallestunit,equalto 10 −^9 TONcoins.
```
```
 Amicroormicrotonequalsonethousand( 103 )nanos.
```
```
 Amil liisonemillion( 106 )nanos,oronethousandthpart( 10 −^3 )ofa
TONcoin.
```
```
 ATONcoinequalsonebillion( 109 )nanos.
```
```
 Akiloton,orkTon,equalsonethousand( 103 )TONcoins.
```
```
 Amegaton,orMTon,equalsonemillion( 106 )TONcoins,or 1015 nanos.
```
```
 Finally,agigaton,orGTon,equalsonebillion( 109 )TONcoins,or 1018
nanos.
```
Therewillb enoneedforlargerunits,b ecausetheinitialsupplyofTON
coinswillb elimitedtovebillion( 5 · 109 )TONcoins(i.e., 5 Gigatons).

A.2.Smallerunitsforexpressinggasprices.Ifthenecessityforsmaller
unitsarises,sp ecksequalto 2 −^16 nanotonswillb eused. Forexample,gas
pricesmayb eindicatedinsp ecks.However,theactualfeetob epaid,com-
putedasthepro ductofthegaspriceandtheamountofgasconsumed,will
b ealwaysroundeddowntothenearestmultipleof 216 sp ecksandexpressed
asanintegernumb erofnanos.


```
AppendixA.TheTONCoin
```
A.3.Originalsupply,miningrewardsandination.Thetotalsupply
ofTONcoinsisoriginallylimitedto 5 Gigatons(i.e.,vebillionTONcoins
or 5 · 1018 nanos).
Thissupplywillincreaseveryslowly,asrewardstovalidatorsformining
newmasterchainandshardchainblo cksaccumulate. Theserewardswould
amounttoapproximately20%(theexactnumb ermayb eadjustedinfuture)
ofthevalidator'sstakep eryear,providedthevalidatordiligentlyp erforms
itsduties,signsallblo cks,nevergo esoineandneversignsinvalidblo cks.In
thisway,thevalidatorswillhaveenoughprottoinvestintob etterandfaster
hardwareneededtopro cesstheevergrowingquantityofusers'transactions.
We exp ect that at most 10%^35 of the total supplyof TON coins, on
average,willb eb oundinvalidatorstakesatanygivenmoment. Thiswill
pro duceaninationrate of2%p eryear,andas aresult,willdoublethe
totalsupplyofTON coins(totenGigatons)in 35 years. Essentially,this
inationrepresentsapaymentmadebyallmemb ersofthecommunitytothe
validatorsforkeepingthesystemupandrunning.
Ontheotherhand,ifavalidatoriscaughtmisb ehaving,apartorallof
itsstakewillb etakenawayasapunishment,andalargerp ortionofitwill
subsequentlyb eburned,decreasingthetotalsupplyofTONcoins. This
wouldleadtodeation. Asmallerp ortionofthenemayb eredistributed
to the validator or the sherman who committeda pro ofof the guilty
validator'smisb ehavior.

(^35) Themaximumtotalamountofvalidatorstakesisacongurableparameterofthe
blo ckchain,sothisrestrictioncanb eenforcedbytheproto colifnecessary.


