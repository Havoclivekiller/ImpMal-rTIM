export function registerActiveEffects()
{
    //warhammer-lib allows for scripts to be saved for active effects. 
    //We merge them and just use [Script.id], where id needs to be 16 character word (best use some unique lower/upper case with numbers)

    
    foundry.utils.mergeObject(game.impmal.config.effectScripts, scripts);
}

const scripts = 
{
	//// PEERS OF THE IMPERIUM
    //Basic Tech - Desperate Measures (Check)
    "g3d0E90jMP0Vq0gK": `//Always check for exist and set max.
let flagName = "basicTech"
let flag = this.actor.getFlag("impmal-rtim", flagName); 
await this.actor.setFlag("impmal-rtim", flagName, 
{ 
	max: this.actor.system.characteristics.int.bonus, 
	value: flag?.value ?? 0
}); 
flag = this.actor.getFlag("impmal-rtim", flagName);

ui.notifications.info("Your Desperate Measures is now: " + flag.value + " of a max: " + flag.max)`,
    //Basic Tech - Desperate Measures (Use)
    "Ixj3s6Pz992gJ54f": `//Always check for exist and set max.
let flagName = "basicTech"
let flag = this.actor.getFlag("impmal-rtim", flagName); 
await this.actor.setFlag("impmal-rtim", flagName, 
{ 
	max: this.actor.system.characteristics.int.bonus, 
	value: flag?.value ?? 0
}); 
flag = this.actor.getFlag("impmal-rtim", flagName);

if (flag.value <= 0) {
    ui.notifications.warn("You have no Desperate Measures to use.");
	return;
}
else {
    flag.value--;
    ui.notifications.info("You used Desperate Measures. It is now: " + flag.value + " of a max: " + flag.max)
}

await this.actor.setFlag("impmal-rtim", flagName, 
{ 
	max: this.actor.system.characteristics.int.bonus, 
	value: flag.value
});`,
    //Basic Tech - Desperate Measures (Reset)
    "mdK4f3K6KI8Sp0tG": `//Always check for exist and set max.
let flagName = "basicTech"
await this.actor.setFlag("impmal-rtim", flagName, 
{ 
	max: this.actor.system.characteristics.int.bonus, 
	value: this.actor.system.characteristics.int.bonus
}); 
flag = this.actor.getFlag("impmal-rtim", flagName);

ui.notifications.info("You reset Desperate Measures. It is now: " + flag.value + " of a max: " + flag.max)`,
	//Basic Soldier - Revel in Slaughter (Check)
	"0bdmZ1Ugd06e5qQ5": `//Always check for exist and set max.
let flagName = "basicSoldier"
let flag = this.actor.getFlag("impmal-rtim", flagName); 
await this.actor.setFlag("impmal-rtim", flagName, 
{ 
	max: this.actor.system.characteristics.int.bonus, 
	value: flag?.value ?? 0
}); 
flag = this.actor.getFlag("impmal-rtim", flagName);

ui.notifications.info("Your Revel in Slaughter is now: " + flag.value)`,
	//Basic Soldier - Revel in Slaughter (Reset/Use)
	"hxn0haMnGbK0R8P1": `//Always check for exist and set max.
let flagName = "basicSoldier"
await this.actor.setFlag("impmal-rtim", flagName, 
{ 
	value: 0
}); 

ui.notifications.info("You reset Revel in Slaughter to 0")`,
	//Basic Soldier - Revel in Slaughter (Increase)
	"HSjDTaQADAqcDFpA": `//Always check for exist and set max.
let flagName = "basicSoldier"
let flag = this.actor.getFlag("impmal-rtim", flagName); 
await this.actor.setFlag("impmal-rtim", flagName, 
{ 
	max: this.actor.system.characteristics.int.bonus, 
	value: flag?.value ?? 0
}); 
flag = this.actor.getFlag("impmal-rtim", flagName);

flag.value += 1;
ui.notifications.info("Your Revel in Slaughter is now: " + flag.value)
await this.actor.setFlag("impmal-rtim", flagName, 
{ 
	value: flag.value
});`,
	//Basic Soldier - Revel in Slaughter (Dialog)
	"VrN4ZZdwZ8fvU3P7": `//Always check for exist and set max.
let flagName = "basicSoldier"
let flag = this.actor.getFlag("impmal-rtim", flagName); 

args.fields.damage += flag?.value ?? 0;`,
	//Basic Operative - Analyze Enemies (Check)
	"8csLUbkTPOR0ocvv": `//Always check for exist and set max.
let flagName = "basicOperative"
let flag = this.actor.getFlag("impmal-rtim", flagName); 
await this.actor.setFlag("impmal-rtim", flagName, 
{ 
	max: this.actor.system.characteristics.per.bonus + this.actor.system.characteristics.ag.bonus, 
	value: flag?.value ?? 0
}); 
flag = this.actor.getFlag("impmal-rtim", flagName);

ui.notifications.info("Your Analyze Enemies is now: " + flag.value + " of a max: " + flag.max)`,
	//Basic Operative - Analyze Enemies (Use)
	"VWWiMHVlMJKDVcMB": `//Always check for exist and set max.
let flagName = "basicOperative"
let flag = this.actor.getFlag("impmal-rtim", flagName); 
await this.actor.setFlag("impmal-rtim", flagName, 
{ 
	max: this.actor.system.characteristics.per.bonus + this.actor.system.characteristics.ag.bonus, 
	value: flag?.value ?? 0
}); 
flag = this.actor.getFlag("impmal-rtim", flagName);

if (flag.value <= 0) {
    ui.notifications.warn("You have no Analyze Enemies to use.");
	return;
}
else {
    flag.value--;
    ui.notifications.info("You used Analyze Enemies. It is now: " + flag.value + " of a max: " + flag.max)
}
await this.actor.setFlag("impmal-rtim", flagName, 
{ 
	max: this.actor.system.characteristics.per.bonus + this.actor.system.characteristics.ag.bonus, 
	value: flag.value
});`,
	//Basic Operative - Analyze Enemies (Reset)
	"ktuBDDLxlpn1e0Cp": `//Always check for exist and set max.
let flagName = "basicOperative"
await this.actor.setFlag("impmal-rtim", flagName, 
{ 
	max: this.actor.system.characteristics.per.bonus + this.actor.system.characteristics.ag.bonus, 
	value: this.actor.system.characteristics.per.bonus + this.actor.system.characteristics.ag.bonus
}); 
flag = this.actor.getFlag("impmal-rtim", flagName); 

ui.notifications.info("You reset Analyze Enemies. It is now: " + flag.value + " of a max: " + flag.max)`,
	//Basic Officer - Voice of Command (Check)
	"AavzzLk6JYAdLQja": `//Always check for exist and set max.
let flagName = "basicOfficer"
let flag = this.actor.getFlag("impmal-rtim", flagName); 
await this.actor.setFlag("impmal-rtim", flagName, 
{ 
	max: this.actor.system.characteristics.wil.bonus + this.actor.system.characteristics.fel.bonus, 
	value: flag?.value ?? 0
}); 
flag = this.actor.getFlag("impmal-rtim", flagName);

ui.notifications.info("Your Voice of Command is now: " + flag.value + " of a max: " + flag.max)`,
	//Basic Officer - Voice of Command (Use)
	"nCaupsD11OyhcUE4": `//Always check for exist and set max.
let flagName = "basicOfficer"
let flag = this.actor.getFlag("impmal-rtim", flagName); 
await this.actor.setFlag("impmal-rtim", flagName, 
{ 
	max: this.actor.system.characteristics.wil.bonus + this.actor.system.characteristics.fel.bonus, 
	value: flag?.value ?? 0
}); 
flag = this.actor.getFlag("impmal-rtim", flagName);

if (flag.value <= 0) {
    ui.notifications.warn("You have no Voice of Command to use.");
	return;
}
else {
    flag.value--;
    ui.notifications.info("You used Voice of Command. It is now: " + flag.value + " of a max: " + flag.max)
}
await this.actor.setFlag("impmal-rtim", flagName, 
{ 
	max: this.actor.system.characteristics.wil.bonus + this.actor.system.characteristics.fel.bonus, 
	value: flag.value
});`,
	//Basic Officer - Voice of Command (Reset)
	"IwDej1wHk2uaqnha": `//Always check for exist and set max.
let flagName = "basicOfficer"
await this.actor.setFlag("impmal-rtim", flagName, 
{ 
	max: this.actor.system.characteristics.wil.bonus + this.actor.system.characteristics.fel.bonus, 
	value: this.actor.system.characteristics.wil.bonus + this.actor.system.characteristics.fel.bonus
}); 
flag = this.actor.getFlag("impmal-rtim", flagName); 

ui.notifications.info("You reset Voice of Command. It is now: " + flag.value + " of a max: " + flag.max)`,
	//Basic Infighter - Nobody Leaves! (Check)
	"rP6vFCE9uldPIAsl": `//Always check for exists and set max
let flagName = "basicInfighterNobody"
let flag = this.actor.getFlag("impmal-rtim", flagName); 
await this.actor.setFlag("impmal-rtim", flagName, 
{ 
	max: this.item.system.taken, 
	value: flag?.value ?? 0
}); 
flag = this.actor.getFlag("impmal-rtim", flagName);

ui.notifications.info("Your Nobody Leaves! is now: " + flag.value + " of a max: " + flag.max)`,
	//Basic Infighter - Nobody Leaves! (Use)
	"444LRw2IxiR6wlqi": `//Always check for exists and set max
let flagName = "basicInfighterNobody"
let flag = this.actor.getFlag("impmal-rtim", flagName); 
await this.actor.setFlag("impmal-rtim", flagName, 
{ 
	max: this.item.system.taken, 
	value: flag?.value ?? 0
}); 
flag = this.actor.getFlag("impmal-rtim", flagName);

if (flagvalue <= 0) {
    ui.notifications.warn("You have no Nobody Leaves! to use.");
	return;
}
else {
    flag.value--;
    ui.notifications.info("You used Nobody Leaves! It is now: " + flag.value + " of a max: " + flag.max)
}
	
await this.actor.setFlag("impmal-rtim", flagName, 
{ 
	max: this.item.system.taken, 
	value: flag?.value ?? 0
});`,
	//Basic Infighter - Nobody Leaves! (Reset)
	"XxLEDwid9xd9qVpl": `//Always check for exists and set max
let flagName = "basicInfighterNobody"
let flag = this.actor.getFlag("impmal-rtim", flagName); 
await this.actor.setFlag("impmal-rtim", flagName, 
{ 
	max: this.item.system.taken, 
	value: this.item.system.taken
}); 
flag = this.actor.getFlag("impmal-rtim", flagName);

ui.notifications.info("You reset Nobody Leaves! It is now: " + flag.value + " of a max: " + flag.max)`,
	//Basic Infighter - Daring Breach (Add Penetrating (+2))
	"RKGM4ELTHLMuzhys": `let flag = this.actor.getFlag("impmal-rtim", "basicInfighter");
if (!flag) return;
args.traits.add("penetrating", { value: 2, modify: true })
  ui.notifications.info("Daring Breach was used!")`,
	//Basic Infighter - Daring Breach (Remove Penetrating)
	"RTq4lTxSBJZRKI5a": `this.actor.setFlag("impmal-rtim", "basicInfighter", false); 
    ui.notifications.info("Daring Breach was removed!")`,
	//Basic Infighter - Daring Breach (Add Penetrating)
	"RnBsAyL5owV3m3rn": `this.actor.setFlag("impmal-rtim", "basicInfighter", true);`,
	//Basic Infighter - Daring Breach (Manual Remove Penetrating)
	"VMbKaYit5cGD7r89": `if (!this.actor.getFlag("impmal-rtim", "basicInfighter")){  
    ui.notifications.warn("Daring Breach is already disabled!")
  return;
}
await this.actor.setFlag("impmal-rtim", "basicInfighter", false);
ui.notifications.info("Daring Breach Removed")`,
	//Basic Historitor - Knowledge is Power (Check)
	"SA3zIRp9Fd7w4DeQ": `//Always check for exists and set max
let flagName = "basicHistoritor"
let flag = this.actor.getFlag("impmal-rtim", flagName); 
await this.actor.setFlag("impmal-rtim", flagName, 
{ 
	max: this.actor.system.characteristics.int.bonus, 
	value: flag?.value ?? 0
}); 
flag = this.actor.getFlag("impmal-rtim", flagName);

ui.notifications.info("Your Knowledge is Power is now: " + flag.value + " of a max: " + flag.max)`,
	//Basic Historitor - Knowledge is Power (Use)
	"5F1dxmprDhjDdeKZ": `//Always check for exist and set max.
let flagName = "basicHistoritor"
let flag = this.actor.getFlag("impmal-rtim", flagName); 
await this.actor.setFlag("impmal-rtim", flagName, 
{ 
	max: this.actor.system.characteristics.int.bonus, 
	value: flag?.value ?? 0
}); 
flag = this.actor.getFlag("impmal-rtim", flagName);

if (flag.value <= 0) {
    ui.notifications.warn("You have no Knowledge is Power to use.");
	return;
}
else {
    flag.value--;
    ui.notifications.info("You used Knowledge is Power. It is now: " + flag.value + " of a max: " + flag.max)
}
await this.actor.setFlag("impmal-rtim", flagName, 
{ 
	max: this.actor.system.characteristics.int.bonus, 
	value: flag.value
});`,
	//Basic Historitor - Knowledge is Power (Reset)
	"gL7InGn13Xoa13bM": `//Always check for exist and set max.
let flagName = "basicHistoritor"
await this.actor.setFlag("impmal-rtim", flagName, 
{ 
	max: this.actor.system.characteristics.int.bonus, 
	value: this.actor.system.characteristics.int.bonus
}); 
flag = this.actor.getFlag("impmal-rtim", flagName); 

ui.notifications.info("You reset Knowledge is Power. It is now: " + flag.value + " of a max: " + flag.max)`,
	//Basic Historitor - Know Thy Foe (Check)
	"iI3RDe6qy5GE2w5C": `//Always check for exists and set max
let flagName = "basicHistoritorKnow"
let flag = this.actor.getFlag("impmal-rtim", flagName); 
await this.actor.setFlag("impmal-rtim", flagName, 
{ 
	max: this.actor.system.characteristics.per.bonus, 
	value: flag?.value ?? 0
}); 
flag = this.actor.getFlag("impmal-rtim", flagName);

ui.notifications.info("Your Know Thy Foe is now: " + flag.value + " of a max: " + flag.max)`,
	//Basic Historitor - Know Thy Foe (Use)
	"yxC609k7HzBNDffg": `//Always check for exist and set max.
let flagName = "basicHistoritorKnow"
let flag = this.actor.getFlag("impmal-rtim", flagName); 
await this.actor.setFlag("impmal-rtim", flagName, 
{ 
	max: this.actor.system.characteristics.per.bonus, 
	value: flag?.value ?? 0
}); 
flag = this.actor.getFlag("impmal-rtim", flagName);

if (flag.value <= 0) {
    ui.notifications.warn("You have no Know Thy Foe to use.");
	return;
}
else {
    flag.value--;
    ui.notifications.info("You used Know Thy Foe. It is now: " + flag.value + " of a max: " + flag.max)
}
await this.actor.setFlag("impmal-rtim", flagName, 
{ 
	max: this.actor.system.characteristics.per.bonus, 
	value: flag.value
});`,
	//Basic Historitor - Know Thy Foe (Reset)
	"R6FCkKeOjpWn26wV": `//Always check for exist and set max.
let flagName = "basicHistoritorKnow"
await this.actor.setFlag("impmal-rtim", flagName, 
{ 
	max: this.actor.system.characteristics.per.bonus, 
	value: this.actor.system.characteristics.per.bonus
}); 
flag = this.actor.getFlag("impmal-rtim", flagName); 

ui.notifications.info("You reset Know Thy Foe. It is now: " + flag.value + " of a max: " + flag.max)`,
	//Basic Historitor - Know Thy Foe (Dialog Hide)
	"OrmDVKgwBXpwupdg": `let flagName = "basicHistoritorKnow";
	flag = this.actor.getFlag("impmal-rtim", flagName); 
if (flag?.value > 0) {
    return !args.isAttack;
}
return true`,
	//Basic Historitor - Know Thy Foe (Dialog Submit)
	"5L2YT9XMnaF1PARp": `let flagName = "basicHistoritorKnow";
flag = this.actor.getFlag("impmal-rtim", flagName); 
flag.value--;
this.actor.setFlag("impmal-rtim", flagName, 
{ 
	max: this.actor.system.characteristics.per.bonus, 
	value: flag.value
}); 
ui.notifications.info("You used Know Thy Foe. It is now: " + flag.value + " of a max: " + flag.max)`,
	//Basic Ace - Part of the Vehicle (Check)
	"zYkZAdNPKiQZLRJE": `//Always check for exists and set max
let flagName = "basicAce"
let flag = this.actor.getFlag("impmal-rtim", flagName); 
await this.actor.setFlag("impmal-rtim", flagName, 
{ 
	max: this.actor.system.characteristics.ag.bonus, 
	value: flag?.value ?? 0
}); 
flag = this.actor.getFlag("impmal-rtim", flagName);

ui.notifications.info("Your Part of the Vehicle is now: " + flag.value + " of a max: " + flag.max)`,
	//Basic Ace - Part of the Vehicle (Use)
	"LX3dMrkmzy8Djwy9": `//Always check for exist and set max.
let flagName = "basicAce"
let flag = this.actor.getFlag("impmal-rtim", flagName); 
await this.actor.setFlag("impmal-rtim", flagName, 
{ 
	max: this.actor.system.characteristics.ag.bonus, 
	value: flag?.value ?? 0
}); 
flag = this.actor.getFlag("impmal-rtim", flagName);

if (flag.value <= 0) {
    ui.notifications.warn("You have no Part of the Vehicle to use.");
	return;
}
else {
    flag.value--;
    ui.notifications.info("You used Part of the Vehicle. It is now: " + flag.value + " of a max: " + flag.max)
}
await this.actor.setFlag("impmal-rtim", flagName, 
{ 
	max: this.actor.system.characteristics.ag.bonus, 
	value: flag.value
});`,
	//Basic Ace - Part of the Vehicle (Reset)
	"A3xo4A0Yb34xs32E": `//Always check for exist and set max.
let flagName = "basicAce"
await this.actor.setFlag("impmal-rtim", flagName, 
{ 
	max: this.actor.system.characteristics.ag.bonus, 
	value: this.actor.system.characteristics.ag.bonus
}); 
flag = this.actor.getFlag("impmal-rtim", flagName); 

ui.notifications.info("You reset Part of the Vehicle. It is now: " + flag.value + " of a max: " + flag.max)`,
	//// VOID COMBAT ITEMS
	// Deep Void Auger Arrays - Prepare Base Data
	"qAFsSQNvVgUk71S3": `this.actor.system.shields.aft.modifier -= 10;
this.actor.system.shields.fore.modifier -= 10;
this.actor.system.shields.starboard.modifier -= 10;
this.actor.system.shields.port.modifier -= 10;
this.actor.system.shields.average.modifier -= 10;`,
	// Quiet Auger Arrays - Dialog
	"ICES8NJGdVIT84s5": `args.advCount++`,
	// Quiet Auger Arrays - Dialog Hide
	"ZHZU4ID53dyVEcP5": `return args.context.type !== "silentRunning";`,
	// Quiet Auger Arrays - Dialog Activate
	"u66HczwSmiIL6aic": `return args.context.type === "silentRunning";`,
	// Xenotech Auger Arrays - Prepare Base Data
	"RbJqO8QbOoYiFW4o": `this.actor.system.evasionRating.modifier += 10;`,
	// Advanced Crew Quarters - Pre-prepare Derived Data
	"uFjad17acred8cxm": `this.actor.system.fatigue.modifier += 2;`,
	// Boosted Crew Quarters, Luxurious Crew Quarters - Pre-prepare Derived Data
	"2KPkTu434m2ztFJd": `this.actor.system.fatigue.modifier += 1;`,
	// Cramped Crew Quarters - Pre-prepare Derived Data
	"ExxZvywsNoEF0kjW": `this.actor.system.supplemental.modifier += 2;`,
	// Archeotech Plasma Drive - Pre-prepare Derived Data
	"bjYgZiOmzrZwBf35": `this.item.system.component.changes.turnRating -= 1;`,
	// Carriage Plasma Drive - Pre-prepare Derived Data
	"2EdjK2HM78yUT6g9": `this.actor.system.space.modifier += 2;`,
	// Archeotech Ship's Bridge - Pre-prepare Derived Data
	"lBZ6emDNwDtup7au": `this.actor.system.characteristics.crew.modifier += 10;`,
	// Commander Ship's Bridge - Pre-prepare Derived Data
	"nhnAWIJEPj28K1xP": `this.actor.system.characteristics.crew.modifier += 5;`,
	// War Ship's Bridge - Dialog
	"PaPAICFdY90PZPcY": `args.fields.SL += 1`,
	// War Ship's Bridge - Dialog Hide
	"xfar9ztHLlJYDmXE": `return args.context.type !== "shooting"`,
	// War Ship's Bridge - Dialog Activate
	"KaCeJthivkT7cWTc": `return args.context.type === "shooting"`,
	// Luxurious Component, Serivtor Crew, Firebrand Martyrs (Reduce Fatigue)
	"UjfcHNRYqJLahKv8": `flag = this.item.getFlag("impmal-rtim", "fatigue");
	if (!flag)
	{
		this.actor.update({"system.fatigue.value": Math.max(this.actor.system.fatigue.value-1,0) });
		this.item.setFlag("impmal-rtim", "fatigue", true)
	} `,
	// Luxurious Component, Serivtor Crew, Firebrand Martyrs (Reduce Fatigue) Hide
	"UI17DZVdtFTsKixb": `return this.item.getFlag("impmal-rtim", "fatigue")`,
	// Luxurious Component, Serivtor Crew, Firebrand Martyrs - Reset
	"qzqgyVYXDpdO2GwK": `this.item.setFlag("impmal-rtim", "fatigue", false)`,
	// Luxurious Component, Serivtor Crew, Firebrand Martyrs - Reset Hide
	"MDs9AfdCr3GPbBoL": `return !this.item.getFlag("impmal-rtim", "fatigue")`,
	// Firefighters - Start Turn
	"3MSVi0zYuJeg59ml": `await this.actor.update({"system.fire": Math.max(this.actor.system.fire-1,0)})`,
	// Plasma Slave Clans, Voidhull Packed Clans (Add Fatigue)
	"gG08QJje2coh2J7d": `flag = this.item.getFlag("impmal-rtim", "fatigue");
	if (!flag)
	{
		this.actor.update({"system.fatigue.value": this.item.system.fatigue.value+1 });
		this.item.setFlag("impmal-rtim", "fatigue", true)
	} `,
	// Plasma Slave Clans, Voidhull Packed Clans (Add Fatigue) Hide
	"Ivk6dpr4prVgotrq": `return this.item.getFlag("impmal-rtim", "fatigue")`,
	// Plasma Slave Clans, Voidhull Packed Clans - Reset
	"wUf8yWbT5iwQlgtZ": `this.item.setFlag("impmal-rtim", "fatigue", false)`,
	// Plasma Slave Clans, Voidhull Packed Clans - Reset Hide
	"l0hv3OEFBQlRat3g": `return !this.item.getFlag("impmal-rtim", "fatigue")`,
	// Plasma Slave Clans 
	"SALQnRsV9Ccc8vm4": `this.actor.system.speed.modifier += 1;`,
	// Fore Thruster Clans - Dialog
	"GXYPfacUpQ9YATSx": `args.fields.SL += 2;`,
	// Fore Thruster Clans - Dialog Hide
	"JVfkCNJbbeP9Hqol": `return args.context?.type !== "ramming";`,
	// Fore Thruster Clans - Dialog Activate
	"KFzIEfzorf3MAbC9": `return args.context?.type === "ramming";`,
	// Reactive Shield Doctrine - Manual
	"l55QWcRsxQZkT6a6": `
let sides = ["fore", "aft", "starboard", "port"]
if (this.actor.system.options.takeAvgShield) sides = ["average"];

let noShields = true;
let btns = [];
sides.map((key) => {
	if (this.actor.system.shields[key].value < this.actor.system.shields[key].max)
	{
		noShields = false;
		btns.push({action : key,
	   label : game.impmal.config.RTIM.voidship.hitLocations[key].display});
	}
}); 
       
if (noShields)
{
	ui.notifications.warn(game.i18n.localize("IMPMAL_RTIM.VoidCombat.AllShieldsFull"));
	return;
}


let location  = await foundry.applications.api.Dialog.wait({
    window : {title : "Shield Location to add 5"},
    content : \`<p>\${game.i18n.localize("IMPMAL_RTIM.VoidCombat.ChooseLocation")}</p>\`,
    buttons : btns
});

if (!location) return;
let newShield = Math.min(this.actor.system.shields[location].value + 5, this.actor.system.shields[location].max);
this.actor.update({[\`system.shields.\${location}.value\`]: newShield});`,
	//Weapon Logis, Master of War - Set Weapon - Manual
	"0xMGHJlO154imklZ": `let weaponItems = this.actor.items
	.filter(item => item.type === "impmal-rtim.voidshipPart")
	.filter(item => item.system?.partType === "weapon");
if (!weaponItems.length)
{
	ui.notifications.warn(game.i18n.localize("IMPMAL_RTIM.VoidCombat.NoWeapons"));
	return;
}
	
let items = (await ItemDialog.create(weaponItems, 1, {title : "Set to", text: "Choose 1"}));
if (!items || items.length == 0) return;  
ui.notifications.info(\`\${items[0].name} was chosen.\`);

this.item.setFlag("impmal-rtim", "weaponId", items[0].id);`,
	// Weapon Logis - Pre-Prepare Derived
	"iwwzSubIorxg2DnB": `
	if (!this.item.getFlag("impmal-rtim", "weaponId")) return;
	let item = this.actor.items.get(this.item.getFlag("impmal-rtim", "weaponId"))
if (item)
{
  item.system.weapon.range += 2;
}`,
	// Xenos Micro Laser Defence Grid - Pre Prepare
	"r3kSLleqabvpnYKJ": `this.actor.system.turretRating.modifier += 20;`,
	// Xeno Thrusters - Pre Prepare
	"nTRQow28uIvrDYrO": `this.actor.system.evasionRating.modifier += 10;`,
	// Xeno Gravity Sails - Pre Prepare
	"ViwO056bsd104f4A": `this.actor.system.turnRating.modifier -= 1;
this.actor.system.speedRating.modifier += 2;`,
	// Xeno Ghost Field - Activate Xeno Ghost Shield - Manual
	"COg1C0kxyWNnorIs": `this.effect.update({"disabled": false})
  let sides = ["aft", "fore", "starboard","port"];
sides.forEach((key) =>
  {
    this.actor.update({[\`system.shields.\${key}.value\`]: 0})
  });`,
	// Xeno Ghost Field - Activate Xeno Ghost Shield - Manual Hide
	"gtCVSERQ9nPRbqG5": `return !this.effect.disabled;`,
	// Xeno Ghost Field - Deactivate Xeno Ghost Shield - Manual
	"QxYTFAmLMgoomY0F": `this.effect.update({"disabled": true})`,
	// Xeno Ghost Field - Deactivate Xeno Ghost Shield - Manual Hide
	"o5Wx0C8I1sm3r7Lb": `return this.effect.disabled;`,
	// Xeno Ghost Field - Prepare Derived
	"fgSwM3hN5Tx5V715": `let sides = ["aft", "fore", "starboard","port","average"];
sides.forEach((key) =>
  {
    this.actor.system.shields[key].max = 0;
  });`,
	// Xeno Ghost Field - Activate - Dialog
	"4Ii440UmZcXR50nL": `args.disCount++;`,
	// Xeno Ghost Field - Activate - Dialog Hide
	"rphg5Piq7mSuhxAV": `let actions = ["boarding", "shooting"];
return !actions.includes(args.context?.type);`,
	// Xeno Ghost Field - Activate - Dialog Activate
	"nOYwBU4IzhqBaRPY": `let actions = ["boarding", "shooting"];
return actions.includes(args.context?.type);`,
	// Thrusters Housing - PrePrepare Derived
	"O65kpfmR13ZX66fa": `this.actor.system.evasionRating.modifier += 5;`,
	// Tenebro-Maze - Dialog
	"yCOBe7rpLx9jmLNd": `args.disCount++;`,
	// Tenebro-Maze - Dialog Hide
	"EnRv3TkoScvjDHnD": `return args.context?.type !== "boarding" && args.context?.type !== "assaultBoarding";`,
	// Tenebro-Maze - Dialog Activate
	"OOE5D1vHVCOUV0gv": `return args.context?.type === "boarding" || args.context?.type === "assaultBoarding";`,
	// Temple-Shrine - Dialog
	"z43DU5G1GPaNIVQc": `args.advCount++;`,
	// Temple-Shrine - Dialog Hide
	"NgThNBQh2T2M8TiH": `return args.context?.type !== "rally";`,
	// Temple-Shrine - Dialog Activate
	"EJ0FedHa99TxjVWs": `return args.context?.type === "rally";`,
	// Storm Trooper Detachment - Dialog
	"lbkkjlHkxsGOpmeR": `args.advCount++;`,
	// Storm Trooper Detachment - Dialog Hide
	"jcPBN2CwWrvCusvb": `return args.context?.type !== "boarding";`,
	// Storm Trooper Detachment - Dialog Activate
	"2LPxj5HdbRIjJmpU": `return args.context?.type === "boarding";`,
	// Power Ram - PostPrepare Derived
	"Xa0eZJ7rO8rtHVhf": `this.actor.system.options.rammingDamage += 10;
this.actor.system.weaponSlots.prow.value = 0;`,
	// Guidance Systems - Manual
	"IffycqgNxhTecXlv": `let weaponItems = this.actor.items
	.filter(item => item.type === "impmal-rtim.voidshipPart")
	.filter(item => item.system?.partType === "weapon")
	.filter(item => item.system.weapon.type === "torpedo");
if (!weaponItems.length)
{
	ui.notifications.warn(game.i18n.localize("IMPMAL_RTIM.VoidCombat.NoWeapons"));
	return;
}
	
let items = (await ItemDialog.create(weaponItems, 1, {title : "Set to", text: "Choose 1"}));
if (!items || items.length == 0) return;  
ui.notifications.info(\`\${items[0].name} was chosen.\`);

this.item.setFlag("impmal-rtim", "weapon", items[0].id);`,
	// Guidance Systems - PrePrepare Derived
	"zwgPsuDelXnSMrtJ": `if (!this.item.getFlag("impmal-rtim", "weapon")) return;
	let item = this.actor.items.get(this.item.getFlag("impmal-rtim", "weapon"))
if (item.system.weapon.type == "torpedo")
{
  item.system.weapon.rating += 20;
}`,
	// Flak Array - PrePrepare Derived
	"u8qwkUO60907cM9y": `this.actor.system.turretRating.value += 10;`,
	// Bullhead Reinforcement - PrePrepare Derived
	"oAq61SbewMILb6n7": `this.actor.system.hull.modifier += 5;`,
	// Boosted Shield Array - PrePrepare Derived
	"mPIrQxO3bmwIj7GE": `this.actor.system.shields.aft.modifier += 10;
this.actor.system.shields.fore.modifier += 10;
this.actor.system.shields.starboard.modifier += 10;
this.actor.system.shields.port.modifier += 10;
this.actor.system.shields.average.modifier += 10;`,
	// Armoured Prow - PostPrepare Derived
	"djQW4RyN8GoWAeXl": `let value = this.actor.system.size.value < 4 ? 2 : 4
this.actor.system.armour.fore.value += value;
this.actor.system.options.rammingDamage += 5;
this.actor.system.weaponSlots.prow.value = 0;`,
	// Armoured Plating - PostPrepare Derived
	"Otg9rHooQqU747Og": `let value = this.actor.system.size.value < 4 ? 1 : 2
this.actor.system.armour.aft.value += value;
this.actor.system.armour.fore.value += value;
this.actor.system.armour.starboard.value += value;
this.actor.system.armour.port.value += value;
this.actor.system.armour.average.value += value;`,
	// Archeo Regenerative Hull - PrePrepare Derived
	"3Wgtw3RnR4vwgkp5": `this.actor.system.hull.modifier += 10;`,
	// Archeo Regenerative Hull - Regenerate - Start Turn
	"7NZnwtO4vmxhAdZd": `let half = Math.floor(this.actor.system.hull.max/2);

if (this.actor.system.hull.value < half)
{
  this.actor.update({"system.hull.value": this.actor.system.hull.value + 1})
}`,
	// Archeo Regenerative Hull - PostPrepare Derived
	"NvGkmDbzoseYFNWR": `let value = this.actor.system.size.value < 4 ? 2 : 4
this.actor.system.armour.fore.value += value;
this.actor.system.options.rammingDamage += 10;
this.actor.system.weaponSlots.prow.value = 0;`,
	// Archeo Regenerative Hull - Dialog
	"2dR1OX1DVPUsWpkM": `args.advCount++;`,
	// Archeo Regenerative Hull - Dialog Hide
	"HTUisw1hW5y8kNIc": `return args.context?.type !== "ramming"`,
	// Archeo Regenerative Hull - Dialog Activate
	"f3gF2cFExwy7g5TU": `return args.context?.type === "ramming"`,
	// Archeo Castellan Shield Array - PrePrepare Derived
	"nNf9lFUKo2tHEXkX": `this.actor.system.shields.aft.modifier += 20;
this.actor.system.shields.fore.modifier += 20;
this.actor.system.shields.starboard.modifier += 20;
this.actor.system.shields.port.modifier += 20;
this.actor.system.shields.average.modifier += 20;`,
	// Specialized Ship's Bridge - Set Action
	"a3w0YCaYQaeYA07t": `
let actions = { ...game.impmal.config.RTIM.voidship.actions, ...game.impmal.config.RTIM.voidship.maneuvers };
let btns = [];
Object.keys(actions).forEach((key) => {
	btns.push({
		action : key,
		label : actions[key].display
	});
});

let items  = await foundry.applications.api.Dialog.wait({
    window : {title : "Choose an Action"},
    buttons : btns
});

if (!items || items.length == 0) return;  
ui.notifications.info(\`\${actions[items].display} was chosen.\`);

this.item.setFlag("impmal-rtim", "action", items);`,
	// Specialized Ship's Bridge - Dialog
	"6pFICQjEyE0hQLwP": `args.fields.SL += 1`,
	// Specialized Ship's Bridge - Dialog Hide
	"jtSnp98MMBOEnnyq": `return this.item.getFlag("impmal-rtim", "action") !== args.context.type`,
	// Specialized Ship's Bridge - Dialog Activate
	"c7ZXz4bUksdqB0tQ": `return this.item.getFlag("impmal-rtim", "action") === args.context.type`,
	//// VOIDCOMBAT CREW
	// Aegis Maintainers - Pre-Prepare Derived
	"VDLrPSfeJm9NNipQ": `this.actor.system.actionCosts.restartShields.modifier -= 1;`,
	// Deck-Gang Backstabbers - Dialog
	"WO12LY26RMCAbjLT": `args.fields.SL--;`,
	// Deck-Gang Backstabbers - Dialog Hide
	"X0hqO1f6tvnqMgaH": `return args.context?.type !== "boarding";`,
	// Deck-Gang Backstabbers - Dialog Activate
	"EyfiY6QoZm0LGZAu": `return args.context?.type === "boarding";`,
	// Dedicated Clans (Nova) - Dialog
	"6UWquqvPeteCxFQo": `args.fields.SL += 2;`,
	// Dedicated Clans (Nova) - Dialog Hide
	"0d4CL1jU1SXDUvxX": `return args.context?.type !== "reloadNovaCannon"`,
	// Dedicated Clans (Nova) - Dialog Activate
	"E6UIEPPIwr062zBj": `return args.context?.type === "reloadNovaCannon"`,
	// Dedicated Clans (Special) - Dialog
	"fGyjRFoNoLK3PH5t": `args.fields.SL += 2;`,
	// Dedicated Clans (Special) - Dialog Hide
	"1fuc8BQSQThCXaHc": `return args.context?.type !== "reloadSpecial"`,
	// Dedicated Clans (Special) - Dialog Activate
	"JC5wcHldaVtYKJ5w": `return args.context?.type === "reloadSpecial"`,
	// Dedicated Clans (Torpedoes) - Dialog
	"tHf7UzPYt0Gyi1wb": `args.fields.SL += 2;`,
	// Dedicated Clans (Torpedoes) - Dialog Hide
	"mtsL7JZiP6SlM0TM": `return args.context?.type !== "reloadTorpedoes"`,
	// Dedicated Clans (Torpedoes) - Dialog Activate
	"6qD8INPe0QGpTdPu": `return args.context?.type === "reloadTorpedoes"`,
	// Dedicated Clans (Voidcraft) - Dialog
	"vERvKKKuN9aH9RP8": `args.fields.SL += 2;`,
	// Dedicated Clans (Voidcraft) - Dialog Hide
	"CgJx6DbciC8epyZr": `return args.context?.type !== "reloadSquadrons"`,
	// Dedicated Clans (Voidcraft) - Dialog Activate
	"muNrUjSFYJszcE2d": `return args.context?.type === "reloadSquadrons"`,
	// Drilled Gun Crews - Dialog
	"VxYKeAhIgU1kqx1Y": `args.fields.SL++;`,
	// Drilled Gun Crews - Dialog Hide
	"FTjPdpZFMAPPleOV": `return args.context?.type !== "shooting" || this.item.getFlag("impmal-rtim", "value")`,
	// Drilled Gun Crews - Dialog Activate
	"hA9Nbk4i9d4tlprg": `return args.context?.type === "shooting" && !this.item.getFlag("impmal-rtim", "value")`,
	// Drilled Gun Crews - Dialog Submission
	"c1xvvFvBXhXrk08P": `this.item.setFlag("impmal-rtim", "value", true)`,
	// Drilled Gun Crews - Start Turn, Manual Reset
	"z8fgQq2fsItYpV0D": `this.item.setFlag("impmal-rtim", "value", false)`,
	// Drilled Gun Crews - Manual Reset Hide
	"8JUVmmE9fxGaFuDS": `return !this.item.getFlag("impmal-rtim", "value")`,
	// Duck and Cover Doctrine - Dialog
	"hUWRuvZkr51exDfY": `args.fields.damage -= 4;`,
	// Duck and Cover Doctrine - Dialog Hide
	"8o57RY4EqgZH9Cgt": `return args.context?.type !== "ramming";`,
	// Duck and Cover Doctrine - Dialog Activate
	"QJs4wcCy6s4kurvy": `return args.context?.type === "ramming";`,
	// Focused Doctrine - Dialog
	"GvmrAvZOONJGvBHd": `args.fields.SL++;`,
	// Focused Doctrine - Dialog Hide
	"QIdEi07dZIWT1yin": `return args.context?.type !== "role" 
	|| (args.context?.type === "role" && args.data?.skill === "psychic") 
	|| this.item.getFlag("impmal-rtim", "action");`,
	// Focused Doctrine - Dialog Activate
	"KnGZtkko1qKVNidH": `return args.context?.type === "role" && args.data?.skill !== "psychic" && 
	!this.item.getFlag("impmal-rtim", "action");`,
	// Focused Doctrine - Dialog Submission
	"ahnpJABd7W83PHdS": `this.item.setFlag("impmal-rtim", "action", true)`,
	// Focused Doctrine - Reset
	"gfEzjjZcj76lVYIM": `this.item.setFlag("impmal-rtim", "action", false)`,
	// Focused Doctrine - Reset Hide
	"8JOahF6H7SlSPAYM": `return !this.item.getFlag("impmal-rtim", "action")`,
	// Gun-Deck Artisans - Fix Damaged Weapon - Manual
	"1gW3b73MPRPZs9LB": `let weaponItems = this.actor.items
	.filter(item => item.type === "impmal-rtim.voidshipPart")
	.filter(item => item.system?.partType === "weapon")
	.filter(item => item.system?.status === "damaged");
if (!weaponItems.length)
{
	ui.notifications.warn(game.i18n.localize("IMPMAL_RTIM.VoidCombat.NoWeapons"));
	return;
}
	
let content = "";
let items = (await ItemDialog.create(weaponItems, 1, {title : "Damaged Weapons", text: "Choose 1"}));
if (!items || items.length == 0) return;
items.forEach(item => {
	item.update({"system.status": "default"});
	content = \`\${item.name} was repaired!\`;
});      
ui.notifications.info(content);
this.item.setFlag("impmal-rtim", "weaponId", true);`,
	// Gun-Deck Artisans - Fix Damaged Weapon - Manual Hide
	"sL65bvrJOxwo512s": `return this.item.getFlag("impmal-rtim", "weaponId")`,
	// Gun-Deck Artisans - Reset
	"CxCdvoFXLb6mG1QD": `this.item.setFlag("impmal-rtim", "weaponId", false)`,
	// Gun-Deck Artisans - Reset Hide
	"WAHxioxEckT0RTj3": `return !this.item.getFlag("impmal-rtim", "weaponId")`,
	// Haruspex Temple - Dialog
	"vz0ojuU24IgSOuj6": `args.fields.SL++;`,
	// Haruspex Temple - Dialog Hide
	"RycGAQSRhA5TaDAm": `return args.context?.type !== "scan" && args.context?.type !== "seek"`,
	// Haruspex Temple - Dialog Activate
	"wgPu9svpi75seXyq": `return args.context?.type === "scan" || args.context?.type === "seek"`,
	// Lip-less Crew - Dialog
	"fVzLLexmZ1Km0eaF": `args.fields.SL++;`,
	// Lip-less Crew - Dialog Hide
	"89uXJzfCaJ6KJ14k": `return args.context?.type !== "runningSilent"`,
	// Lip-less Crew - Dialog Activate
	"ZoBTFdV1NTHrmk1G": `return args.context?.type === "runningSilent"`,
	// Martyr-Stock PrePrepare Derived
	"Ip6TugXFNIopX2a1": `this.actor.system.fatigue.modifier += 1;`,
	// Psychic Choir - Set Role
	"4N2fATDok8TEaTsm": `let roleItems = this.actor.items
	.filter(item => item.type === "impmal-rtim.voidshipPart")
	.filter(item => item.system?.partType === "role")
	.filter(item => 
	{
		if (item.system.role.upgraded)
		{
			return item.system.role.actionUpgraded.skill.key === "psychic"
		}
		return item.system.role.action.skill.key === "psychic"		
	});
if (!roleItems.length)
{
	ui.notifications.warn(game.i18n.localize("IMPMAL_RTIM.VoidCombat.NoComponents"));
	return;
}
	
let items = (await ItemDialog.create(roleItems, 1, {title : "Set to", text: "Choose 1"}));
if (!items || items.length == 0) return;  
ui.notifications.info(\`\${items[0].name} was chosen.\`);

this.item.setFlag("impmal-rtim", "roleId", items[0].id);`,
	// Psychic Choir - Dialog
	"YacxSztrJH5744wy": `args.fields.SL++;`,
	// Psychic Choir - Dialog Hide
	"0CZf31LsmeQTHr6w": `return this.item.getFlag("impmal-rtim", "roleId") !== args.data.itemId`,
	// Psychic Choir - Dialog Activate
	"VFSkOnvKar5oa77i": `return this.item.getFlag("impmal-rtim", "roleId") === args.data.itemId`,
	// Risk Taking Doctrine - Dialog
	"n5Ave97TM0iUI5ni": `args.fields.SL++;`,
	// Risk Taking Doctrine - Dialog Hide
	"ryH9RYZXJeE5aBTS": `return args.data?.skill !== "navigation" && args.data?.skill !== "piloting"`,
	// Stimmed Crew - Preprepare Derived
	"lF4uqehl8xOqW8vt": `this.actor.system.combat.initiative += 5;`,
	// Void Ace Lineages - Dialog
	"dL5yrpQH1kdHzmOn": `args.fields.SL++;`,
	// Void Ace Lineages - Dialog Hide
	"yQMNxHmDzrySQ8Ae": `return args.context?.type !== "dogfight"`,
	// Void Ace Lineages - Dialog Activate
	"b7Y26VVNAlTfoKUm": `return args.context?.type === "dogfight"`,
	// Voidbitten Mariners - Dialog
	"hOiekuriuGEVPqyg": `args.fields.SL++;`,
	// Voidbitten Mariners - Dialog Hide
	"IeNG1egQBkNhsQnI": `return args.context?.type !== "boarding" && args.context?.type !== "rally"`,
	// Voidbitten Mariners - Dialog Activate
	"MJWtNledcnfAj0tG": `return args.context?.type === "boarding" || args.context?.type === "rally"`,
	// Voidshull Packed Clans - Pre-Prepare Derived
	"XNpAS2aQjFXfuIOD": `this.actor.system.armour.aft.modifier += 1;
this.actor.system.armour.fore.modifier += 1;
this.actor.system.armour.starboard.modifier += 1;
this.actor.system.armour.port.modifier += 1;
this.actor.system.armour.average.modifier += 1;`,
	// Automated Life Sustainers - Fix Role - Manual
	"kMhvSbFo5xeGendR": `let roleItems = this.actor.items
		.filter(item => item.type === "impmal-rtim.voidshipPart")
		.filter(item => item.system?.partType === "role")
		.filter(item => item.system.status === "damaged");

	
if (!roleItems.length)
{	
	ui.notifications.warn(game.i18n.localize("IMPMAL_RTIM.VoidCombat.NoComponents"));		
	return;
}		
	
let items = (await ItemDialog.create(roleItems, 1, 
{title : "List of Components (Roles)", text: "Choose 1"}));	

if (!items || items.length == 0) return;  
await items[0].update({"system.status": "default"});
ui.notifications.info(\`\${items[0].name} was repaired.\`);

this.item.setFlag("impmal-rtim", "repair", true);`,
	// Automated Life Sustainers - Fix Role - Manual Hide
	"6qIf9dfkfeDddnbT": `return this.item.getFlag("impmal-rtim", "repair")`,
	// Automated Life Sustainers - Reset
	"Ckw40Jo0zFN8veL9": `this.item.setFlag("impmal-rtim", "repair", false)`,
	// Automated Life Sustainers - Reset Hide
	"tnIcpXK8nTIHxAEe": `return !this.item.getFlag("impmal-rtim", "repair")`,
	// Vengeancemancers - Dialog
	"8tiJvNMj1JlOk11q": `args.fields.SL++;`,
	// Vengeancemancers - Dialog Hide
	"SVaMe8LMDFMfTXCO": `let target = args.data?.targets?.[0]?.actor;
	if (!target || !target.system.faction?.name) return true;
	if (target.system.faction?.name === this.item.getFlag("impmal-rtim", "faction")) return false;
	return true;`,
	// Vengeancemancers - Dialog Activate
	"5YgoKJvnwJaLZ1pM": `let target = args.data?.targets?.[0]?.actor;
	if (!target || !target.system.faction?.name) return false;
	if (target.system.faction?.name === this.item.getFlag("impmal-rtim", "faction")) return true;
	return false;`,
	// Vengeancemancers - Set Faction - Manual
	"1qYAswWrm9KzSR6u": `const data = await foundry.applications.api.DialogV2.input({
  window: { title: "Write chosen Faction name" },
  content: \`<input type="text" name="faction">\`,
  ok: {
	label: "Save",
	icon: "fa-solid fa-floppy-disk",
  }
})

if (!data || !data.faction) return;

this.item.setFlag("impmal-rtim", "faction", data.faction);`,
	//// VOIDCOMBAT ROLES
	//Augur Master Bonus - Voidship Options
	"yqXKmK0GqFLSlc1Y": `if (args.testType !== "scan") return;
	args.options.weaponAmount = true;
if (this.item.system.role.upgraded)
{
  args.options.weaponPerSL = true;
}
if (!args.options.comment) args.options.comment = "";
args.options.comment += "Augur Master Bonus ";`,
	//Augur Master - Skill Test Add Sides - Roll Skill Test
	"DGC0B4m5D31oUM23": `if (this.item?.id === args.context?.itemId)
{
  if (args.result?.outcome === "success")
  {
  if (!args.context.effectFlags) args.context.effectFlags = [];
if (args.context.effectFlags.includes(this.effect.id)) return;
  	let isUpgraded = this.item.system.role.upgraded;
	let sides = ["fore","aft","starboard","starboard","port","port"];
	let chosenSides = [];
	if (isUpgraded && args.result.SL >= 5)
	{
		chosenSides = [...new Set(sides)];
	}
	else
	{
		let random = Math.floor(CONFIG.Dice.randomUniform() * sides.length);
		chosenSides.push(sides[random]);
		sides = sides.filter((key) => key !== sides[random]);
		if (args.result.SL >= 3)
		{
			random = Math.floor(CONFIG.Dice.randomUniform() * sides.length);
			chosenSides.push(sides[random]);
			sides = sides.filter((key) => key !== sides[random]);
		}
	}
	
	ChatMessage.create({
			speaker : ChatMessage.getSpeaker({actor : this.actor}),
			content : 
			\`<h5>Augur Master Test</h5>
			<span>Shields are weaker at: \${chosenSides.join(", ")}</span>
			\`
		});     
    this.item.setFlag("impmal-rtim", "sides", {
  set : false,
sides : chosenSides,
targetUuid : ""})
args.context.effectFlags.push(this.effect.id);
  }
}`,
	//Augur Master - Damage on Side - Pre-Apply Damage
	"RAGnLnicg0i8KDYG": `let flag = this.item.getFlag("impmal-rtim", "sides");
if (flag?.set && flag?.targetUuid === args.actor.uuid && (flag?.sides?.includes(args.location) || args.location === "average"))
{
	args.traits["shield.mult"].value	+= args.traits["shield.mult"].value; 
	args.modifiers.push({ value : "Doubled Shield Damage", label : "Augur Master"})
}`,
	//Augur Master - Remove Flag - Start Turn, Manual
	"jOuCIZ68HOAeKyYu": `this.item.setFlag("impmal-rtim", "sides", {
  set : false,
sides : [],
targetUuid : ""})`,
	//Augur Master - Manual Remove Hide - Manual
	"kjqczWAC6UEQ38cV": `return !this.item.getFlag("impmal-rtim", "sides")?.set;`,
	//Augur Master - Set Target - Manual
	"8an8RpILEon26lER": `let flag = this.item.getFlag("impmal-rtim", "sides")
if (flag?.sides?.length === 0)
{
  ui.notifications.warn("You need to make a test first!");
  return;
}

let targetToken = game?.user?.targets?.first();
if (targetToken?.actor?.type !== "impmal-rtim.voidshipSheet"){
    ui.notifications.warn(game.i18n.localize("IMPMAL_RTIM.VoidCombat.NeedTarget"));
    return;
}

this.item.setFlag("impmal-rtim", "sides", {
  set : true,
sides : flag.sides,
targetUuid : targetToken.actor.uuid})
    ui.notifications.info(\`Target is set to: \${targetToken.name}\`);
        canvas.tokens.setTargets(game.user.targets.ids, {mode: "release"});`,
	// Aegis Enginseer - Aegis Enginseer Bonus - Pre-Prepare Derived
	"pPeesVuNHaYp7ghv": `let value = this.item.system.role.upgraded ? 10 : 5;
this.actor.system.shields.aft.modifier += value;
this.actor.system.shields.fore.modifier += value;
this.actor.system.shields.starboard.modifier += value;
this.actor.system.shields.port.modifier += value;
this.actor.system.shields.average.modifier += value;`,
	// Aegis Enginseer - Increase Shield Value - Manual
	"46isAopUDWJKmitA": `let flag = this.item.getFlag("impmal-rtim", "value");
if (!flag)
{
	ui.notifications.warn("You need to pass the test to get Shield value!");
	return;
}


let sides = ["fore", "aft", "starboard", "port"]
if (this.actor.system.options.takeAvgShield) sides = ["average"];

let noShields = true;
let btns = [];
sides.map((key) => {
	if (this.actor.system.shields[key].value < this.actor.system.shields[key].max)
	{
		noShields = false;
		btns.push({action : key,
	   label : game.impmal.config.RTIM.voidship.hitLocations[key].display});
	}
}); 
       
if (noShields)
{
	ui.notifications.warn(game.i18n.localize("IMPMAL_RTIM.VoidCombat.AllShieldsFull"));
	return;
}


let location  = await foundry.applications.api.Dialog.wait({
    window : {title : \`Shield Location to add \${flag}\`},
    content : \`<p>\${game.i18n.localize("IMPMAL_RTIM.VoidCombat.ChooseLocation")}</p>\`,
    buttons : btns
});

if (!location) return;

let funcAddShield = (actor, shield, loc) => {	
	let path = \`system.shields.\${loc}.value\`;
	actor.update({ [path]: shield });
}
let newShield = Math.min(this.actor.system.shields[location].value + flag, this.actor.system.shields[location].max);
funcAddShield(this.actor, newShield, location);

btns = btns.filter((btn) => btn.action !== location );
let upgraded = this.item.system.role.upgraded;

if (upgraded && btns.length > 0)
{
	let btnsUpgraded = []
	btnsUpgraded.push({action : "no",
	label : "No"});
	btns.map((btn) => btnsUpgraded.push(btn));
btns.filter((btn) => btn.action !== location );
	
    location = await foundry.applications.api.Dialog.wait({
    window : {title : \`Did you succeed with +5 SL on the test?\`},
    content : \`<p>\${game.i18n.localize("IMPMAL_RTIM.VoidCombat.ChooseLocation")}</p>\`,
    buttons : btnsUpgraded
	});

	if (!location && location !== "no")
	{
		funcAddShield(this.actor, newShield, location);
	}
}

this.item.setFlag("impmal-rtim", "value", false)`,
	// Aegis Enginseer - Increase Shield Value - Manual Hide
	"qjdTw2bMDlO9U483": `return !this.item.getFlag("impmal-rtim", "value")`,
	// Aegis Enginseer - Check for Shield Value - Roll Skill Test
	"oMfvuuxiOr7dNmQZ": `if (this.item?.id === args.context?.itemId)
{
  if (args.result?.outcome === "success")
  {
  if (!args.context.effectFlags) args.context.effectFlags = [];
if (args.context.effectFlags.includes(this.effect.id)) return;
  	let isUpgraded = this.item.system.role.upgraded;
	let shieldValue = Math.max(args.result.SL * 5, 5);
	
	let upgradedText = isUpgraded ? "Two" : "One";
	
	ChatMessage.create({
			speaker : ChatMessage.getSpeaker({actor : this.actor}),
			content : 
			\`<h5>Aegis Enginseer Test</h5>
			<span>\${upgradedText} of your Shields can be increased by \${shieldValue}</span>
			\`
		});   
    
		this.item.setFlag("impmal-rtim", "value", shieldValue)
args.context.effectFlags.push(this.effect.id);
  }
}`,
	// Chief Breacher Bonus - Voidship Options
	"pG8zoAjbcEsLVDQk": `if (args.testType !== "boarding") return;
if (!args.options.additionalUsages) args.options.additionalUsages = 0
args.options.additionalUsages = this.item.system.role.upgraded ? 2 : 1;

if (!args.options.comment) args.options.comment = ""
args.options.comment += "Chief Breacher Bonus ";`,
	// Chief Breacher - Deal Value - Manual
	"UXbfHxh4SCQPP5ku": `let flag = this.item.getFlag("impmal-rtim", "damage")
if (!flag)
{
  ui.notifications.warn("You need to make a test first!");
  return;
}

let targetToken = game?.user?.targets?.first();
if (targetToken?.actor?.type !== "impmal-rtim.voidshipSheet"){
    ui.notifications.warn(game.i18n.localize("IMPMAL_RTIM.VoidCombat.NeedTarget"));
    return;
}
let isUpgraded = this.item.system.role.upgraded;
	
let noFatigue = targetToken.actor.system.options.noFatigue;

let hullDamage = flag - 1; 
if (noFatigue)
{
	hullDamage += flag*2;
    targetToken.actor.system.applyDamage(hullDamage, {type: "selfDamage", ignoreShields: true, ignoreArmour: true, createCriticalMessage : true})
	ui.notifications.info(\`Target doesn't use Fatigue. Dealt: \${hullDamage} Hull damage\`);
}
else
{
    let currentFatigue = targetToken.actor.system.fatigue.value;
    if (currentFatigue < targetToken.actor.system.fatigue.max && (currentFatigue + flag) >= targetToken.actor.system.fatigue.max)
	{
		ChatMessage.create({
			speaker : ChatMessage.getSpeaker({actor: targetToken.actor}),
			content : game.i18n.localize("IMPMAL_RTIM.VoidCombat.CrewBecomesFatigued")
		});
	}

	await targetToken.actor.system.applyDamage(flag, {type: "fatigue"});
	ui.notifications.info(\`Dealt \${flag} Morale Damage to \${targetToken.name}\`);
	
	if (isUpgraded && hullDamage > 0)
	{		
        let confirm = await foundry.applications.api.DialogV2.confirm({
             window : {title : "Was Boarding Successful?"}
        });
        if (confirm) {
			targetToken.actor.system.applyDamage(hullDamage, {type: "selfDamage", createCriticalMessage : true, ignoreShields: true, ignoreArmour: true})
			ui.notifications.info(\`Dealt \${hullDamage} Hull Damage to \${targetToken.name}\`);
        }
	}
}

this.item.setFlag("impmal-rtim", "value", false)`,
	// Chief Breacher - Check for Value - Roll Skill Test
	"Ls6bPRfRCpGyITeB": `if (this.item?.id === args.context?.itemId)
{
  if (args.result?.outcome === "success")
  {
if (!args.context.effectFlags) args.context.effectFlags = [];
if (args.context.effectFlags.includes(this.effect.id)) return;
  	let isUpgraded = this.item.system.role.upgraded;
	let value = 1 + Math.floor(args.result.SL/2);
	
	let upgradedText = isUpgraded ? \`If the Boarding Action was successful, you deal additional \${value-1} Hull damage.\` : "";
	if (value-1 == 0) upgradedText = "";

	ChatMessage.create({
			speaker : ChatMessage.getSpeaker({actor : this.actor}),
			content : 
			\`<h5>Chief Breacher Test</h5>
			<span>You can deal \${value} Morale Damage to target. \${upgradedText}</span>
			\`
		});   
    
		this.item.setFlag("impmal-rtim", "value", value)
args.context.effectFlags.push(this.effect.id);
  }
}`,
	// Chief Breacher - Deal Value - Manual Hide
	"SNSaQxb8gC5Peiiw": `return !this.item.getFlag("impmal-rtim", "value")`,
	// Chief Breacher - Reset
	"Es7qKmOWRWoJiY4f": `this.item.setFlag("impmal-rtim", "value", false)`,
	// Chief Breacher - Reset Hide
	"iXcBxgMM857Kr7qA": `return !this.item.getFlag("impmal-rtim", "value")`,
	// Chief Chirurgeon Bonus - Pre-Prepare Derived
	"2q3BsCQUm84pspHX": `let value = this.item.system.role.upgraded ? 2 : 1;
this.actor.system.fatigue.modifier += value;`,
	// Chief Chirurgeon - Check for Value - Roll Skill Test
	"YsITnw0KnsMOnzyQ": `if (this.item?.id === args.context?.itemId)
{
  if (args.result?.outcome === "success")
  {
if (!args.context.effectFlags) args.context.effectFlags = [];
if (args.context.effectFlags.includes(this.effect.id)) return;
  	let isUpgraded = this.item.system.role.upgraded;
	let value = 1 + Math.floor(args.result.SL/2);
	
	let content = "";
	if (this.actor.system.fatigue.value == 0)
	{
		if (isUpgraded)
		{
			content += \`The ship's next test receives +\${value} SL bonus\`;
			
            let bonuses = this.actor.system.bonuses;
            bonuses.push({
                SL : value,
                modifier : 0,
                advantage : false,
                disadvantage : false,
                removeAfterTurns : -1,
                removeOnStartTurn : false,
                removeOnEndTurn : false,
                removeOnNextEndTurn : false,
                removeOnNextTest : true,
                type : ["all"],
                comment : "Chief Chirurgeon Boost"
            })
            await this.actor.update({"system.bonuses": bonuses});
		}
		else
		{
			content += "No Fatigue to remove";
		}
	}
	else
	{
		content += \`The ship's Fatigue \${this.actor.system.fatigue.value} is lowered by \${value}\`;
       await this.actor.update({"system.fatigue.value": Math.max(this.actor.system.fatigue.value-value,0)});
	}	
	

	ChatMessage.create({
			speaker : ChatMessage.getSpeaker({actor : this.actor}),
			content : 
			\`<h5>Chief Chirurgeon Test</h5>
			<span>\${content}</span>
			\`
		});  

args.context.effectFlags.push(this.effect.id); 
    
  }
}`,
	// Commander Bonus, Voice of Compliance Bonus - Dialog
	"9rY6yXK3iz4KY6fr": `let value = this.item.system.role.upgraded ? 2 : 1;
args.SL += value;`,
	// Commander Bonus, Voice of Compliance Bonus - Dialog Hide
	"beBSOTpsSzl2NLGF": `return this.item.getFlag("impmal-rtim", "value")`,
	// Commander Bonus, Voice of Compliance Bonus - Dialog Submission
	"4oMe2sbco7PtC8lj": `this.item.setFlag("impmal-rtim", "value", true)`,
	// Commander Bonus, Voice of Compliance Bonus - Reset
	"I3I2Tp8f7MoGxqmp": `this.item.setFlag("impmal-rtim", "value", false)`,
	// Commander Bonus, Voice of Compliance Bonus - Reset HIde
	"6lqJRDnehQYnUUs8": `return !this.item.getFlag("impmal-rtim", "value")`,
	// Commander - Check for Value - Roll Skill Test
	"uq5hh6s1e0CHaoGA": `if (this.item?.id === args.context?.itemId)
{
  if (args.result?.outcome === "success")
  {
if (!args.context.effectFlags) args.context.effectFlags = [];
if (args.context.effectFlags.includes(this.effect.id)) return;
  	let isUpgraded = this.item.system.role.upgraded;
	let value = args.result.SL >= 3 ? 2 : 1;
	
	let weaponItems = this.actor.items
		.filter(item => item.type === "impmal-rtim.voidshipPart")
		.filter(item => item.system?.partType === "weapon");
	if (!weaponItems.length)
	{
		ui.notifications.warn(game.i18n.localize("IMPMAL_RTIM.VoidCombat.NoWeapons"));
		return;
	}
	
	let content = "";
	let bonuses = this.actor.system.bonuses;
	let advantage = false;
	let items = [];
	if (isUpgraded && args.result.SL >= 5)
	{
        let confirm = await foundry.applications.api.DialogV2.confirm({
             window : {title : "Commander"},
			 content : "Test scored over 5SL! Do you want to add +1 SL bonus to all weapons? Click no if you want +1 SL bonus and Advantage to one chosen weapon."
        });
		
		if (confirm === null) return;
		
		if (confirm)
		{
			items = weaponItems;
			content += "All ship's weapons gained +1 SL bonus";
		}
		else
		{
			items = (await ItemDialog.create(weaponItems, 1, 
			{title : "List of Weapons", text: "Choose 1"}));
			
			if (!items) return;
			
			content += \`\${items[0].name} gained +1 SL bonus and Advantage to its next test.\`;
			advantage = true;
		}
	}
	else
	{
		items = (await ItemDialog.create(weaponItems, value, 
			{title : "List of Weapons", text: \`Choose \${value}\`}));
			
		if (!items) return;
		
		let itemsStr = items.map(i => i.name).join(", ");
		content += \`\${itemsStr} gained +1 SL bonus to the next test.\`;
	}
	
		
	items.forEach((item) => {
		bonuses.push({
			SL: 1,
			modifier: 0,
			advantage: advantage,
			disadvantage: false,
			removeAfterTurns: -1,
			removeOnNextTest: true,
			removeOnStartTurn: false,
			removeOnEndTurn: false,
			removeOnNextEndTurn: false,
			items: [item.id],
			type: [],
			comment: "Commander"
		});
	}); 
	
	this.actor.update({"system.bonuses": bonuses});

	ChatMessage.create({
			speaker : ChatMessage.getSpeaker({actor : this.actor}),
			content : 
			\`<h5>Commander Test</h5>
			<span>\${content}</span>
			\`
		});   
args.context.effectFlags.push(this.effect.id);
    
  }
}`,
	// Drivesmaster Bonus - Pre-Prepare Derived
	"I4BSpgxaay19WmZo": `let value = this.item.system.role.upgraded ? 2 : 1;
this.actor.system.turnRating.modifier -= value;`,
	// Drivesmaster - Check for Value - Roll Skill Test
	"yWtOQZneh9WbrVNj": `if (this.item?.id === args.context?.itemId)
{
  if (args.result?.outcome === "success")
  {
if (!args.context.effectFlags) args.context.effectFlags = [];
if (args.context.effectFlags.includes(this.effect.id)) return;

  	let isUpgraded = this.item.system.role.upgraded ? 1 : 2;
	let value = 1 + Math.floor(args.result.SL/isUpgraded);
		
	this.actor.update({"system.movementPoints.value": this.actor.system.movementPoints.value + value});

	ChatMessage.create({
			speaker : ChatMessage.getSpeaker({actor : this.actor}),
			content : 
			\`<h5>Drivesmaster Test</h5>
			<span>The ship gained \${value} Movement Points</span>
			\`
		});   


args.context.effectFlags.push(this.effect.id);
    
  }
}`,
	// Engagement Censor Bonus - Post-Prepare Derived
	"KnGH608wRUIhH66y": `let value = this.item.system.role.upgraded ? 10 : 5;
this.actor.system.combat.initiative += value;`,
	// Engagement Censor - Use Upgraded - Manual
	"tNOMEEdfAqvIWXaD": `if (!game.combat.active) return;

let token = this.actor.token;
if (!token) //we got the unlinked token otherwise
{
	token = this.actor.getActiveTokens()[0];
	if (!token)
	{
		return;
	}
}

let isFirst = game.combat.setupTurns()[0].id === token.combatant.id;
if (!isFirst)
{
	ui.notifications.warn("You aren't first!");
	return;
}

if (token.combatant?.initiative !== null && token.combatant?.initiative !== undefined)
{
	token.combatant.initiative -= 10;	
	game.combat.updateEmbeddedDocuments("Combatant", [{ _id: token.combatant.id, initiative: token.combatant.initiative}]);

	let bonuses = this.actor.system.bonuses;
	bonuses.push({
		SL: 0,
		modifier: 0,
		advantage: true,
		disadvantage: false,
		removeAfterTurns: 1,
		removeOnNextTest: false,
		removeOnStartTurn: false,
		removeOnEndTurn: false,
		removeOnNextEndTurn: false,
		items: [],
		type: ["all"],
		comment: "Engagement Censor"
	});
	this.actor.update({ "system.bonuses": bonuses });
	ui.notifications.info("All tests at advantage!");
}`,
	// Engagement Censor - Use Upgraded
	"375KlePSvYFSggVr": `return this.item.system.role.upgraded;`,
	// Engagement Censor - Add Initiative at End Round - End Round
	"ZVRAmConhLO9fMnt": `let value = this.item.getFlag("impmal-rtim", "init");
if (!value) return;

let token = this.actor.token;
if (!token) //we got the unlinked token otherwise
{
	token = this.actor.getActiveTokens()[0];
	if (!token)
	{
		return;
	}
}

if (token.combatant?.initiative !== null && token.combatant?.initiative !== undefined)
{
	token.combatant.initiative += value;	
	game.combat.updateEmbeddedDocuments("Combatant", [{ _id: token.combatant.id, initiative: token.combatant.initiative}]);
	this.item.setFlag("impmal-rtim", "init", false)
}`,
	// Engagement Censor - Check for Value - Roll Skill Test
	"QwMkdYQTlKfK28xY": `if (this.item?.id === args.context?.itemId)
{
  if (args.result?.outcome === "success")
  {
if (!args.context.effectFlags) args.context.effectFlags = [];
if (args.context.effectFlags.includes(this.effect.id)) return;
  	let isUpgraded = this.item.system.role.upgraded;
	let value = 1 + Math.floor(args.result.SL/2);
	
	this.item.setFlag("impmal-rtim", "init", value)
	
	ChatMessage.create({
			speaker : ChatMessage.getSpeaker({actor : this.actor}),
			content : 
			\`<h5>Engagement Censor Test</h5>
			<span>The ship will gain \${value} to initiative next round.\${isUpgraded ? " If the ship will be at the top of the next round, it can sacrifice 10 Initiative to gain Advantage on all tests for a round!" : ""}</span>
			\`
		});   
args.context.effectFlags.push(this.effect.id);
    
  }
}`,
	// Fighter Ace Bonus - Dialog
	"7EDFK8ecLGo7OeZ5": `args.fields.SL += this.item.system.role.upgraded ? 2 : 1;`,
	// Fighter Ace Bonus - Dialog Hide
	"gZvtnkiv7HKtLFUr": `return args.context?.type !== "dogfight";`,
	// Fighter Ace Bonus - Dialog Activate
	"DAW78ztk5uBqxPh5": `return args.context?.type === "dogfight";`,
	// Fighter Ace - Check for Value - Roll Skill Test
	"2ShkeaVy81u0FFRf": `if (this.item?.id === args.context?.itemId)
{
  if (args.result?.outcome === "success")
  {
if (!args.context.effectFlags) args.context.effectFlags = [];
if (args.context.effectFlags.includes(this.effect.id)) return;
  	let isUpgraded = this.item.system.role.upgraded;
	
	let content = "You can move a Squadron.";
	
	if (args.result.SL >= 3)
	{
		content = "You can move two Squadrons.";
	}
	if (args.result.SL >= 5 && isUpgraded)
	{
		content += " You can also make another attack with a Fighter Squadron.";
	}
	
	ChatMessage.create({
			speaker : ChatMessage.getSpeaker({actor : this.actor}),
			content : 
			\`<h5>Fighter Ace Test</h5>
			<span>\${content}</span>
			\`
		});   

args.context.effectFlags.push(this.effect.id);
    
  }
}`,
	// Flesh-Hull Binder Bonus - Pre-Prepare Derived
	"QdgiWsAvpEE2CoOR": `let value = this.item.system.role.upgraded ? 4 : 2;
this.actor.system.options.rammingDamage += value;`,
	// Flesh-Hull Binder (Target) - Flesh-Hull Binder Penalty - Post-Prepare Derived
	"vyLSxOxHaCdxBb7B": `let SL = this.effect.sourceTest?.result?.SL || 0;
let armour = 1 + Math.floor(SL/2);

let locations = ["fore","aft","port","starboard"];
if (this.actor.system.options.takeAvgArmour) locations = ["average"];

locations.forEach((key) => {
	this.actor.system.armour[key].value -= armour;
	if (this.actor.system.armour[key].value < 0)
	{
		this.actor.system.armour[key].value = 0;
	}
});`,
	// Flesh-Hull Binder (Target) - Deal Hull Damage - Immediate
	"tf5MXMsM74jWKwOh": `let SL = this.effect.sourceTest?.result?.SL || 0;
let isUpgraded = this.effect.sourceItem?.system.role.upgraded || false;
let armour = 1 + Math.floor(SL/2);

let locations = ["fore","aft","port","starboard"];
if (this.actor.system.options.takeAvgArmour) locations = ["average"];

let hullDamage = 0;
locations.forEach((key) => {
	let current = this.actor.system.armour[key].value;
	if ((current - armour) < 0 && hullDamage < -(current - armour))
	{
		hullDamage = -(current - armour);
	}
});

if (isUpgraded && hullDamage > 0)
{
    this.actor.applyDamage(hullDamage, {type: "selfDamage", ignoreShields: true, ignoreArmour: true, createCriticalMessage : true})
	ui.notifications.info(\`Flesh-Hull Binder deals \${hullDamage} Hull damage!\`);
}`,
	// Ghost-Warden Bonus - Dialog
	"5QLQYVGfvyydnh7q": `args.fields.SL += this.item.system.role.upgraded ? 2 : 1;`,
	// Ghost-Warden Bonus - Dialog Hide
	"dY9QOWWFNNgufU1U": `return args.context?.type !== "silentRunning";`,
	// Ghost-Warden Bonus - Dialog Activate
	"ZB9TCK4UWzzqGmoa": `return args.context?.type === "silentRunning";`,
	// Ghost-Warden - Check for Value - Roll Skill Test
	"YDyznUBMIHpga3po": `if (this.item?.id === args.context?.itemId)
{
  if (args.result?.outcome === "success")
  {
if (!args.context.effectFlags) args.context.effectFlags = [];
if (args.context.effectFlags.includes(this.effect.id)) return;
  	let isUpgraded = this.item.system.role.upgraded;
	
	let content = "If there are no enemy units in range, the ship enters Silent Running state.";
	
	if (args.result.SL >= 5 && isUpgraded)
	{
		content += " Also, for one whole turn, the ship’s Shooting will not reveal the ship.";
	}
	
	ChatMessage.create({
			speaker : ChatMessage.getSpeaker({actor : this.actor}),
			content : 
			\`<h5>Ghost-Warden Test</h5>
			<span>\${content}</span>
			\`
		});   
args.context.effectFlags.push(this.effect.id);
    
  }
}`,
	// Grav-Drift Cantor Bonus - Dialog
	"qURHecxhUBcAcT4T": `args.fields.SL += this.item.system.role.upgraded ? 2 : 1;`,
	// Grav-Drift Cantor Bonus - Dialog Hide
	"qeElBWTpred9glWM": `return args.context?.type !== "evasiveManeuvers";`,
	// Grav-Drift Cantor Bonus - Dialog Activate
	"AN4lT9RgeLzyik4O": `return args.context?.type === "evasiveManeuvers";`,
	// Grav-Drift Cantor - Negate Evasive Man - Dialog
	"wUYyTAmVZDXGjkNO": `args.disCount--;`,
	// Grav-Drift Cantor - Negate Evasive Man - Dialog Hide
	"OiCN9cQAPM62iGAP": `let flag = this.item.getFlag("impmal-rtim", "value");
if (!flag) return true;
let isUpgraded = this.item.system.role.upgraded;
if (isUpgraded) return false;
return args.context.type === "shooting";`,
	// Grav-Drift Cantor - Negate Evasive Man - Dialog Activate
	"5pa0fO3uqUQGzCDj": `let flag = this.item.getFlag("impmal-rtim", "value");
if (!flag) return false;
return true;`,
	// Grav-Drift Cantor - Reset
	"cgZ0gO9kKTXP2NPk": `this.item.setFlag("impmal-rtim", "value", false)`,
	// Grav-Drift Cantor - Reset Hide
	"GbBFQrHZ6zm2vJdt": `return !this.item.getFlag("impmal-rtim", "value");`,
	// Grav-Drift Cantor - Check for Value - Roll Skill Test
	"KuSwjOH0ERj7gxqp": `if (this.item?.id === args.context?.itemId)
{
  if (args.result?.outcome === "success")
  {
if (!args.context.effectFlags) args.context.effectFlags = [];
if (args.context.effectFlags.includes(this.effect.id)) return;
  	let isUpgraded = this.item.system.role.upgraded;
	
	let content = "Now in Evasive Maneuvers, the ship doesn't have disadvantage on non-Shooting tests.";
	
	if (isUpgraded)
	{
		content = "Now in Evasive Maneuvers, the ship doesn't have disadvantage on all tests.";
	}
	
	this.item.setFlag("impmal-rtim", "value", true)
	
	ChatMessage.create({
			speaker : ChatMessage.getSpeaker({actor : this.actor}),
			content : 
			\`<h5>Grav-Drift Cantor Test</h5>
			<span>\${content}</span>
			\`
		});
args.context.effectFlags.push(this.effect.id);  
    
  }
}`,
	// Grav-Seer Bonus - Pre-Take Damage
	"9Grkbdvn3L1ffmeI": `let reduce = this.item.system.role.upgraded ? 2 : 1;
if (args.type !== "selfDamage")
{
  args.value -= reduce;
}`,
	// Grav-Seer - Set Target - Manual
	"ooWk2EmznV7w9Ckr": `let flag = this.item.getFlag("impmal-rtim", "target")

let targetToken = game?.user?.targets?.first();
if (targetToken?.actor?.type !== "impmal-rtim.voidshipSheet"){
    ui.notifications.warn(game.i18n.localize("IMPMAL_RTIM.VoidCombat.NeedTarget"));
    return;
}

this.item.setFlag("impmal-rtim", "target", targetToken.actor.uuid)
    ui.notifications.info(\`Target is set to: \${targetToken.name}\`);
        canvas.tokens.setTargets(game.user.targets.ids, {mode: "release"});`,
	// Grav-Seer - Set Target - Manual Hide
	"ly15hCNuhXKeu1na": `return this.item.getFlag("impmal-rtim", "value")`,
	// Grav-Seer - Check for Value - Roll Skill Test
	"BOpkard9aWlBDc5b": `if (this.item?.id === args.context?.itemId)
{
  if (args.result?.outcome === "success")
  {
if (!args.context.effectFlags) args.context.effectFlags = [];
if (args.context.effectFlags.includes(this.effect.id)) return;

	let flag = this.item.getFlag("impmal-rtim", "target");
	if (!flag)
	{
		ui.notifications.info("You needed to set target before making the test!");
	}
  	let isUpgraded = this.item.system.role.upgraded;
	
	let content = "You can turn the target.";
	
	if (args.result.SL >= 3)
	{
		content = "You can turn the target twice.";
	}
	
	
	ChatMessage.create({
			speaker : ChatMessage.getSpeaker({actor : this.actor}),
			content : 
			\`<h5>Grav-Seer Cantor Test</h5>
			<span>\${content}</span>
			\`
		});   
    this.item.setFlag("impmal-rtim", "value", args.result.SL >= 3 ? 2 : 1);
args.context.effectFlags.push(this.effect.id);
  }
}`,
	// Grav-Seer - Dialog
	"AFoJdgOVlxXcoyFQ": `
	let flag = this.item.getFlag("impmal-rtim", "target");
	if (!flag)
	{
		ui.notifications.info("You needed to set target before making the test!");
		return;
	}
let target = fromUuidSync(flag);
if (target)
{
  args.fields.SL -= Math.ceil(target.system.size.value/2);
}
else
	{
		ui.notifications.info("Target no longer exists!");
	}`,
	// Grav-Seer - Dialog Hide
	"qVRPRvfY0CH2uQBN": `return this.item.id !== args.context.itemId;`,
	// Grav-Seer - Dialog Activate
	"b7F5WAJNv7j9NJj6": `return this.item.id === args.context.itemId;`,
	// Grav-Seer - Reset
	"gRqsQMs8nfrU8Ej1": `this.item.setFlag("impmal-rtim", "value", false);
	this.item.setFlag("impmal-rtim", "target", false)`,
	// Grav-Seer - Reset Hide
	"y9yJAU9b7IdJX2pU": `return !this.item.getFlag("impmal-rtim", "value") 
	&& !this.item.getFlag("impmal-rtim", "target")`,
	// Grav-Seer - Rotate Target - Manual Hide
	"bYbCjkehMvmsEy0X": `return !this.item.getFlag("impmal-rtim", "value") 
	|| !this.item.getFlag("impmal-rtim", "target")`,
	// Grav-Seer - Rotate Target - Manual
	"mggT7PHPfyuxfJi4": `
	let targetId = this.item.getFlag("impmal-rtim", "target");
	if (!targetId)
	{
		ui.notifications.info("You needed to set target before making the test!");
		return;
	}	

let target = fromUuidSync(targetId);
if (!target)
{
	ui.notifications.info("Target no longer exists!");
	return;
}

let flag = this.item.getFlag("impmal-rtim", "value");

let btns = [
{
	label : "Left",
	action : "left",
},
{
	label : "Right",
	action : "right",
}];

let side = await foundry.applications.api.Dialog.wait({
	 window : {title : "Rotate target to what side?"},
    buttons : btns
});

if (side === null || side === undefined) return;

let token = target.token;
if (!token) //we got the unlinked token otherwise
{
	token = target.getActiveTokens()[0];
	if (!token)
	{
		ui.notifications.warn(game.i18n.localize("IMPMAL_RTIM.VoidCombat.NoToken"));
		return;
	}
}

let rotation = side === "right" ? 60 : -60;
await target.system.rotateToken(token, rotation);

if (flag === 2)
{
	let confirm = await foundry.applications.api.DialogV2.confirm({
		 window : {title : "Do you want to rotate it again?"}
	});
	if (confirm)
	{
		target.system.rotateToken(token, rotation);
	}
}

this.item.setFlag("impmal-rtim", "target", false);
this.item.setFlag("impmal-rtim", "value", false);`,
	// Helm Prefect Bonus
	"olU0tciWTlu57ykU": `let value = this.item.system.role.upgraded ? 2 : 1;
this.actor.system.speedRating.modifier += value;`,
	// Helm Prefect - Check for Value - Roll Skill Test
	"iTSvB9cSBnGEeRor": `if (this.item?.id === args.context?.itemId)
{
  if (args.result?.outcome === "success")
  {
if (!args.context.effectFlags) args.context.effectFlags = [];
if (args.context.effectFlags.includes(this.effect.id)) return;
    
	let token = this.actor.token;
	if (!token) //we got the unlinked token otherwise
	{
		token = this.actor.getActiveTokens()[0];
		if (!token)
		{
			ui.notifications.warn(game.i18n.localize("IMPMAL_RTIM.VoidCombat.NoToken"));
			return;
		}
	}
	
	if (this.actor.system.movementPoints.value < 4)
	{
        ui.notifications.warn(game.i18n.localize("IMPMAL_RTIM.VoidCombat.NotEnoughMovementPoints"));
		return;
	}
	
  	let isUpgraded = this.item.system.role.upgraded;
	let SL = isUpgraded ? Math.floor(args.result.SL/2) : 0;
	
	let cost = Math.max(4-SL,1);
	let content = \`The ship uses \${cost} Movement Points.\`;
	
	await this.actor.system.rotateToken(token, 180);
	await this.actor.system.moveTokenFoward(token, 4, false);	
	this.actor.update({"system.movementPoints.value": this.actor.system.movementPoints.value-cost})
	
	ChatMessage.create({
			speaker : ChatMessage.getSpeaker({actor : this.actor}),
			content : 
			\`<h5>Helm Prefect Test</h5>
			<span>\${content}</span>
			\`
		});   
args.context.effectFlags.push(this.effect.id);
    
  }
}`,
	// Huntsmaster Bonus - Dialog
	"Mwyqlfz8ZHgJFkCz": `args.fields.damage -= this.item.system.role.upgraded ? 4 : 2;`,
	// Huntsmaster Bonus - Dialog Hide
	"GRKa19I7M5i9VHKW": `return args.context.type !== "shooting" || args.fields.useHalfRange;`,
	// Huntsmaster Bonus - Dialog Activate
	"DeFJQjxIKy7ThU6h": `return args.context.type === "shooting" && !args.fields.useHalfRange;`,
	// Huntsmaster - Turn on Movement Reduction - Manual
	"1VPkPfcGY6CyYZJy": `await this.actor.update({"system.movementMult": 0.5})
this.item.setFlag("impmal-rtim", "movement", true);`,
	// Huntsmaster - Turn on Movement Reduction - Manual Hide
	"SERq7NOGGebWz1UH": `return this.item.getFlag("impmal-rtim", "movement");`,
	// Huntsmaster - Turn off Movement Reduction - Manual
	"mGPhxR9jNJajfE4h": `await this.actor.update({"system.movementMult": 1})
this.item.setFlag("impmal-rtim", "movement", false);`,
	// Huntsmaster - Turn off Movement Reduction - Manual Hide
	"1tUO121eu6i3cN2F": `return !this.item.getFlag("impmal-rtim", "movement");`,
	// Huntsmaster - Check for Value - Roll Skill Test
	"f0rE001anbzDT8KM": `if (this.item?.id === args.context?.itemId)
{
  if (args.result?.outcome === "success")
  {
    	
if (!args.context.effectFlags) args.context.effectFlags = [];
if (args.context.effectFlags.includes(this.effect.id)) return;
  	let isUpgraded = this.item.system.role.upgraded;
	
	let content = "The ship is hunting its target. Remember to turn on Movement Reduce when moving towards target.";
	
	if (this.item.system.role.upgraded && args.result.SL >= 5)
	{
		content += " The ship can instantly turn towards the target (60 Degree Arc from Prow).";
	}
	
	ChatMessage.create({
			speaker : ChatMessage.getSpeaker({actor : this.actor}),
			content : 
			\`<h5>Huntsmaster Test</h5>
			<span>\${content}</span>
			\`
		}); 
args.context.effectFlags.push(this.effect.id);  
    
  }
}`,
	// Master of the Intercept Bonus - Pre-Prepare Derived
	"kH2BRYfdlR7pFrY3": `this.actor.system.turretRating.modifier += this.item.system.role.upgraded ? 20 : 10;`,
	// Master of the Intercept - Check for Value - Roll Skill Test
	"WWfXre2HNntOFF2V": `if (this.item?.id === args.context?.itemId)
{
  if (args.result?.outcome === "success")
  {
if (!args.context.effectFlags) args.context.effectFlags = [];
if (args.context.effectFlags.includes(this.effect.id)) return;
    	
  	let isUpgraded = this.item.system.role.upgraded;
	
	let content = "You can remove one Squadron or Torpedo Salvo in range. Squadrons are defeated (they retreat to their voidship), while Torpedoes are destroyed.";
	
	if (this.item.system.role.upgraded && args.result.SL >= 2)
	{
		let value = 1 + Math.floor(args.result.SL/2);
		content = \`You can remove \${value} Squadrons or Torpedo Salvos in range. Squadrons are defeated (they retreat to their voidship), while Torpedoes are destroyed.\`;
	}
	
	ChatMessage.create({
			speaker : ChatMessage.getSpeaker({actor : this.actor}),
			content : 
			\`<h5>Master of the Intercept Test</h5>
			<span>\${content}</span>
			\`
		});   
args.context.effectFlags.push(this.effect.id);
    
  }
}`,
	// Master of War Bonus - Dialog
	"i0yoEDWV0YI1fzTn": `args.fields.damage += this.item.system.role.upgraded ? 2 : 1;`,
	// Master of War Bonus - Dialog Hide
	"XNzSBUUO8Ho8kWpR": `return args.context.weaponId !== this.item.getFlag("impmal-rtim", "weaponId")`,
	// Master of War Bonus - Dialog Activate
	"ZLOdKVryunWVpRfT": `return args.context.weaponId === this.item.getFlag("impmal-rtim", "weaponId")`,
	// Master of War - Check for Value - Roll Skill Test
	"i3fw1of72NaMwGjA": `if (this.item?.id === args.context?.itemId)
{
  if (args.result?.outcome === "success")
  {
if (!args.context.effectFlags) args.context.effectFlags = [];
if (args.context.effectFlags.includes(this.effect.id)) return;
    	
  	let isUpgraded = this.item.system.role.upgraded;
	
	let content = "When this voidship damages the hull of the target, damage one random Component (Role) on the target.";
	
	if (this.item.system.role.upgraded)
	{
		content = "When this voidship damages the hull of the target, damage one chosen Component (Role) or Weapon on the target.";
	}
	
	ChatMessage.create({
			speaker : ChatMessage.getSpeaker({actor : this.actor}),
			content : 
			\`<h5>Master of War Test</h5>
			<span>\${content}</span>
			\`
		});   
args.context.effectFlags.push(this.effect.id);
  }
}`,
	// Psycho-Dominus Bonus - Dialog
	"gLcEGFQs2BQTsP26": `args.fields.SL += this.item.system.role.upgraded ? 2 : 1;`,
	// Psycho-Dominus Bonus - Dialog Hide
	"x2CV2P9tXN4HZAkR": `return args.context.type !== "rally"`,
	// Psycho-Dominus Bonus - Dialog Activate
	"4j9h6sN1jj5OS0sT": `return args.context.type === "rally"`,
	// Psycho-Dominus - Check for Value - Roll Skill Test
	"Guo5BTck3cuC3rJz": `if (this.item?.id === args.context?.itemId)
{
  if (args.result?.outcome === "success")
  {
if (!args.context.effectFlags) args.context.effectFlags = [];
if (args.context.effectFlags.includes(this.effect.id)) return;
    	
  	let isUpgraded = this.item.system.role.upgraded;
	
	let content = "The target, on their turn, is forced to shoot a chosen hex (or another target) with a chosen weapon.";
	
	if (this.item.system.role.upgraded && args.result.SL >= 5)
	{
		content += " Also, the target is forced to shoot another chosen weapon at another hex (can be different than before).";
	}
	
	ChatMessage.create({
			speaker : ChatMessage.getSpeaker({actor : this.actor}),
			content : 
			\`<h5>Psycho-Dominus Test</h5>
			<span>\${content}</span>
			\`
		});   
args.context.effectFlags.push(this.effect.id);
  }
}`,
	// Psykana Prognosticator Bonus - Dialog
	"imUTmJ06OUnKe7qy": `args.fields.SL += this.item.system.role.upgraded ? 2 : 1;`,
	// Psykana Prognosticator Bonus - Dialog Hide
	"27Rak3ZrIKFug7Mw": `return this.item.getFlag("impmal-rtim", "value")`,
	// Psykana Prognosticator Bonus - Dialog Submit
	"oTEa7C5njTS6lR9g": `this.item.setFlag("impmal-rtim", "value", true);`,
	// Psykana Prognosticator Bonus - Reset
	"rRQuiPGL8nso4bqW": `this.item.setFlag("impmal-rtim", "value", false);`,
	// Psykana Prognosticator Bonus - Reset Hide
	"XYAk5IjZhjWCAPmB": `return !this.item.getFlag("impmal-rtim", "value")`,
	// Psykana Prognosticator - Check for Value - Roll Skill Test
	"JB3bfGg4mJBdKkmb": `if (this.item?.id === args.context?.itemId)
{
  if (args.result?.outcome === "success")
  {
    	
if (!args.context.effectFlags) args.context.effectFlags = [];
if (args.context.effectFlags.includes(this.effect.id)) return;
  	let isUpgraded = this.item.system.role.upgraded;
	
	let content = "The ship gains one free reroll, this is lost on usage or the start of the next turn.";
	
	if (this.item.system.role.upgraded && args.result.SL >= 3)
	{
		let value = 1 + Math.floor(args.result.SL/3);
		content = \`The ship gains \${value} free rerolls, these are lost on usage or the start of the next turn.\`;
	}
	
	ChatMessage.create({
			speaker : ChatMessage.getSpeaker({actor : this.actor}),
			content : 
			\`<h5>Psykana Prognosticator Test</h5>
			<span>\${content}</span>
			\`
		});   
args.context.effectFlags.push(this.effect.id);
  }
}`,
	// Pyrolex Master Bonus - Pre-Prepare Derived
	"2kn2HaFtRKwB5Hxd": `this.actor.system.options.fireResistance += this.item.system.role.upgraded ? 2 : 1;`,
	// Pyrolex Master Bonus - Deal Fire Damage to Target
	"DWtaejuaPF8aldOe": `let value = this.item.getFlag("impmal-rtim", "value")

let targetToken = game?.user?.targets?.first();
if (targetToken?.actor?.type !== "impmal-rtim.voidshipSheet"){
    ui.notifications.warn(game.i18n.localize("IMPMAL_RTIM.VoidCombat.NeedTarget"));
    return;
}
let isUpgraded = this.item.system.role.upgraded;
let fire = Math.min(value, isUpgraded ? 3 : 2);
let content = targetToken.name + " has received " + fire + " stacks of On Fire!";

await targetToken.actor.system.applyDamage(fire, {type: "fire"});


if (isUpgraded && fire >= 3)
{
	content += " The ship also received equal Hull damage!";
	await targetToken.actor.system.applyDamage(fire, {type: "selfDamage", createCriticalMessage : true});
}


ChatMessage.create({
		speaker : ChatMessage.getSpeaker({actor : this.actor}),
		content : 
		\`<h5>Pyrolex Master Test</h5>
		<span>\${content}</span>
		\`
	});

this.item.setFlag("impmal-rtim", "value", false);`,
	// Pyrolex Master Bonus - Deal Fire Damage to Target Hide
	"68kZCSGC4Mi2oXkz": `return !this.item.getFlag("impmal-rtim", "value");`,
	// Pyrolex Master Bonus - Check for Value - Roll Skill Test
	"NzwhIGdlT9XB4WFg": `if (this.item?.id === args.context?.itemId)
{
  if (args.result?.outcome === "success")
  {
if (!args.context.effectFlags) args.context.effectFlags = [];
if (args.context.effectFlags.includes(this.effect.id)) return;
    	
  	let isUpgraded = this.item.system.role.upgraded;
	let value = 1 + Math.floor(args.result.SL/3);
	let fire = value;
	fire = Math.min(fire, isUpgraded ? 3 : 2);
	
	let content = "The target can receive On Fire stacks: " + fire;
	
	if (fire > 2)
	{
		content += ". Also, the new fire will instantly deal damage!";
	}
	
	this.item.setFlag("impmal-rtim", "value", value);
	
	ChatMessage.create({
			speaker : ChatMessage.getSpeaker({actor : this.actor}),
			content : 
			\`<h5>Pyrolex Master Test</h5>
			<span>\${content}</span>
			\`
		});   
args.context.effectFlags.push(this.effect.id);
  }
}`,
	// Servitor Dominus Bonus - Dialog
	"rXgVOBWqu4oiLAHi": `args.fields.SL -= this.item.system.role.upgraded ? 2 : 1;`,
	// Servitor Dominus Bonus - Dialog Hide
	"bNlCwL3UbgffYyET": `return args.context.type !== "boarding" && args.context.type !== "assaultBoarding";`,
	// Servitor Dominus Bonus - Dialog Activate
	"WKyOHrLhaPGrh5bt": `return args.context.type === "boarding" || args.context.type === "assaultBoarding";`,
	// Servitor Dominus - Check for Value - Roll Skill Test
	"UR3U12Kci2G78NES": `if (this.item?.id === args.context?.itemId)
{
  if (args.result?.outcome === "success")
  {
if (!args.context.effectFlags) args.context.effectFlags = [];
if (args.context.effectFlags.includes(this.effect.id)) return;
    	
  	let isUpgraded = this.item.system.role.upgraded;
	let value = 1 + Math.floor(args.result.SL/2);
	
	let roleItems = this.actor.items
		.filter(item => item.type === "impmal-rtim.voidshipPart")
		.filter(item => item.system?.partType === "role")
		.filter(item => item.system.status === "damaged");
		
	let destroyedStr = "";
	if (isUpgraded)
	{
		let destroyedItems = this.actor.items
		.filter(item => item.type === "impmal-rtim.voidshipPart")
		.filter(item => item.system?.partType === "role")
		.filter(item => item.system.status === "destroyed");
		if (destroyedItems?.length > 0)
		{
			let items = (await ItemDialog.create(destroyedItems, 1, 
			{title : "List of Destroyed Components (Roles)", text: "Choose 1"}));
			
			if (items)
			{
				await items[0].update({"system.status":"damaged"});
				destroyedStr = "These Components were brought back to life (damaged): " + items[0].name;
				value -= 1;
			}			
		}
	}
	
	if (!roleItems.length)
	{	
		if (destroyedStr !== "") 
			ChatMessage.create({
				speaker : ChatMessage.getSpeaker({actor : this.actor}),
				content : 
				\`<h5>Servitor Dominus Test</h5>
				<span>\${destroyedStr}</span>
				\`
			});   
		else 
			ui.notifications.warn(game.i18n.localize("IMPMAL_RTIM.VoidCombat.NoComponents"));
			
		return;
	}
	

	let items = (await ItemDialog.create(roleItems, value, 
	{title : "List of Components (Roles)", text: "Choose " + value}));
	
	if (!items) return;
	let wasDestroyed = false;
	
	items.forEach((item) => item.update({"system.status":"default"}));
	
	
	let content = "These Components were fixed: ";
	content += items.map(i => i.name).join(", ");
	
	if (destroyedStr !== "")
	{
		content += ". " + destroyedStr;
	}
	
	ChatMessage.create({
			speaker : ChatMessage.getSpeaker({actor : this.actor}),
			content : 
			\`<h5>Servitor Dominus Test</h5>
			<span>\${content}</span>
			\`
		});   
args.context.effectFlags.push(this.effect.id);
  }
}`,
	// Sleeper-Cell Warden Bonus - Roll Skill Test
	"kgJcj9o5vwEu8i36": `if (args.context.type === "rally")
{
  if (args.result?.outcome === "success")
  {
if (!args.context.effectFlags) args.context.effectFlags = [];
if (args.context.effectFlags.includes(this.effect.id)) return;
    	
  	let isUpgraded = this.item.system.role.upgraded;
	let value = Math.floor(args.result.SL/2);
	if (isUpgraded) value = args.result.SL;
	if (value <= 0) return;
	
	let content = \`Reduced Fatigue by \${value}\`;
	
	let newFatigue = Math.max(this.actor.system.fatigue.value - value, 0);
	
	await this.actor.update({"system.fatigue.value": newFatigue});
	
	ChatMessage.create({
			speaker : ChatMessage.getSpeaker({actor : this.actor}),
			content : 
			\`<h5>Sleeper-Cell Warden Test</h5>
			<span>\${content}</span>
			\`
		}); 
args.context.effectFlags.push(this.effect.id);
		
  }
}`,
	// Sleeper-Cell Warden - Check for Value - Roll Skill Test
	"nsmdChFRDYx6pQQV": `if (this.item?.id === args.context?.itemId)
{
  if (args.result?.outcome === "success")
  {
    	
	if (!args.context.effectFlags) args.context.effectFlags = [];
	if (args.context.effectFlags.includes(this.effect.id)) return;
	
  	let isUpgraded = this.item.system.role.upgraded;
	let value = 1 + Math.floor(args.result.SL/2);
	
	let content = \`The boarding enemy can receive \${value} Morale Damage.\`
	
	if (args.result.SL >= 5 && isUpgraded)
	{
		content += " The target will receive equal number of Hull damage."
	}	
	
	ChatMessage.create({
			speaker : ChatMessage.getSpeaker({actor : this.actor}),
			content : 
			\`<h5>Sleeper-Cell Warden Test</h5>
			<span>\${content}</span>
			\`
		});  
	args.context.effectFlags.push(this.effect.id); 
	this.item.setFlag("impmal-rtim", "value", args.result.SL);
  }
}`,
	// Sleeper-Cell Warden - Deal Value to Target - Manual
	"IU5IKDYNJhS6lP3F": `let value = this.item.getFlag("impmal-rtim", "value")

let targetToken = game?.user?.targets?.first();
if (targetToken?.actor?.type !== "impmal-rtim.voidshipSheet"){
    ui.notifications.warn(game.i18n.localize("IMPMAL_RTIM.VoidCombat.NeedTarget"));
    return;
}
let isUpgraded = this.item.system.role.upgraded;
let onlyHull = targetToken.actor.system.options.noFatigue;
let damage = 1 + Math.floor(value/2);
let additionalHull = (isUpgraded && value >= 5) ? damage : 0;

let content = "";
if (onlyHull)
{
	await targetToken.actor.system.applyDamage((damage*2) + additionalHull, {type: "selfDamage", createCriticalMessage : true});
	ui.notifications.info(\`Target doesn't use Fatigue. Dealt \${(damage*2) + additionalHull} Hull damage.\`);
}
else 
{
	let content = \`Target receives: \${damage} Morale Damage\`;	
	if (additionalHull > 0)
	{
		await targetToken.actor.system.applyDamage(additionalHull, {type: "selfDamage", createCriticalMessage : true});
		content += "and Hull Damage";
	}
	await targetToken.actor.system.applyDamage(damage, {type: "fatigue"});	
	ui.notifications.info(content);	
}

this.item.setFlag("impmal-rtim", "value", false);`,
	// Sleeper-Cell Warden - Deal Value to Target - Manual Hide
	"18CCQvo4KL4STRpT": `return !this.item.getFlag("impmal-rtim", "value");`,
	// Sleeper-Cell Warden - Deal Value to Target - Reset
	"vMRmjskZosSVVfdd": `this.item.setFlag("impmal-rtim", "value", false);`,
	// Sleeper-Cell Warden - Deal Value to Target - Reset Hide
	"5TY8rfQm3Xxat1jL": `return !this.item.getFlag("impmal-rtim", "value");`,
	// Spoils Pursuer Bonus - Set Weapon - Manual
	"iZERGMTk8fiANx7y": `let weaponItems = this.actor.items
	.filter(item => item.type === "impmal-rtim.voidshipPart")
	.filter(item => item.system?.partType === "weapon")
	.filter(item => item.system.weapon.type === "torpedo" || item.system.weapon.type === "landing");
if (!weaponItems.length)
{
	ui.notifications.warn(game.i18n.localize("IMPMAL_RTIM.VoidCombat.NoWeapons"));
	return;
}
	
let items = (await ItemDialog.create(weaponItems, 1, {title : "Set to", text: "Choose 1"}));
if (!items || items.length == 0) return;  
ui.notifications.info(\`\${items[0].name} was chosen.\`);

this.item.setFlag("impmal-rtim", "value", items[0].id);`,
	// Spoils Pursuer Bonus (Torpedo) - Pre-Prepare Derived
	"LuMgHMhkmIwpW067": `
	if (!this.item.getFlag("impmal-rtim", "value")) return;
	let item = this.actor.items.get(this.item.getFlag("impmal-rtim", "value"))
if (item.system.weapon.type == "torpedo")
{
  item.system.weapon.torpedo.salvos.total += this.item.system.role.upgraded ? 2 : 1;
}`,
	// Spoils Pursuer Bonus (Fighters) - Pre-Prepare Derived
	"7WzHw3w6eNbGLb6e": `
	if (!this.item.getFlag("impmal-rtim", "value")) return;
	let item = this.actor.items.get(this.item.getFlag("impmal-rtim", "value"))
if (item.system.weapon.type == "landing")
{
  item.system.weapon.landing.housing.fighters.total += this.item.system.role.upgraded ? 2 : 1;
}`,
	// Spoils Pursuer Bonus (Bombers) - Pre-Prepare Derived
	"KLXqqaDS6kidI5wx": `
	if (!this.item.getFlag("impmal-rtim", "value")) return;
	let item = this.actor.items.get(this.item.getFlag("impmal-rtim", "value"))
if (item.system.weapon.type == "landing")
{
  item.system.weapon.landing.housing.bombers.total += this.item.system.role.upgraded ? 2 : 1;
}`,
	// Spoils Pursuer Bonus (Assault) - Pre-Prepare Derived
	"jMr6yNs8o3PkLMHc": `
	if (!this.item.getFlag("impmal-rtim", "value")) return;
	let item = this.actor.items.get(this.item.getFlag("impmal-rtim", "value"))
if (item.system.weapon.type == "landing")
{
  item.system.weapon.landing.housing.assault.total += this.item.system.role.upgraded ? 2 : 1;
}`,
	// Spoils Pursuer Bonus (Other) - Pre-Prepare Derived
	"6pCr8KyX9l501CaF": `
	if (!this.item.getFlag("impmal-rtim", "value")) return;
	let item = this.actor.items.get(this.item.getFlag("impmal-rtim", "value"))
if (item.system.weapon.type == "landing")
{
  item.system.weapon.landing.housing.other.total += this.item.system.role.upgraded ? 2 : 1;
}`,
	// Spoils Pursuer - Check for Value - Roll Skill Test
	"8LYZp4nRjxSKmWFR": `if (this.item?.id === args.context?.itemId)
{
  if (args.result?.outcome === "success")
  {
    	
	if (!args.context.effectFlags) args.context.effectFlags = [];
	if (args.context.effectFlags.includes(this.effect.id)) return;
	
  	let isUpgraded = this.item.system.role.upgraded;
	let value = 1 + Math.floor(args.result.SL/2);
	
	let content = \`Reduce the target's Torpedo Salvos or available Squadrons by \${value}. 
	If the target doesn't have either, damage \${Math.max(value,2)} Components.\`
	
	if (isUpgraded)
	{
		content += " If the target removed Torpedo Salvos, this voidship can regain one. If the target removed Squadrons, regain one destroyed Squadron."
	}	
	
	ChatMessage.create({
			speaker : ChatMessage.getSpeaker({actor : this.actor}),
			content : 
			\`<h5>Spoils Pursuer Test</h5>
			<span>\${content}</span>
			\`
		});  
		
	args.context.effectFlags.push(this.effect.id); 
  }
}`,
	// Voice of Compliance - Dialog
	"gIrPaeiryUqUSMk6": `args.disCount++;`,
	// Voice of Compliance - Dialog Hide
	"56vfYqFEklHNCgp4": `return args.context.type !== "shooting"`,
	// Voice of Compliance - Dialog Activate
	"uVtTmheAPYbXm2Ah": `return args.context.type === "shooting"`,
	// Void Master Bonus - Pre-Prepare Derived
	"69KnqyKhIkt8tOCL": `this.actor.system.evasionRating.modifier += this.item.system.role.upgraded ? 10 : 5;`,
	// Void Master - Check for Value - Roll Skill Test
	"cOofzKA4tsZiJaYX": `if (this.item?.id === args.context?.itemId)
{
  if (args.result?.outcome === "success")
  {
    	
	if (!args.context.effectFlags) args.context.effectFlags = [];
	if (args.context.effectFlags.includes(this.effect.id)) return;	
	
	let token = this.actor.token;
	if (!token) //we got the unlinked token otherwise
	{
		token = this.actor.getActiveTokens()[0];
		if (!token)
		{
			ui.notifications.warn(game.i18n.localize("IMPMAL_RTIM.VoidCombat.NoToken"));
			return;
		}
	}
	
  	let isUpgraded = this.item.system.role.upgraded;
	let value = 2;
	if (isUpgraded) value = 4; 
	value += Math.floor(args.result.SL/2);
	
	let btns = [
	{
		action : "leftUp",
		label : "Left (Upper)"
	},
	{
		action : "leftDown",
		label : "Left (Lower)"
	},
	{
		action : "rightUp",
		label : "Right (Upper)"
	},
	{
		action : "rightDown",
		label : "Right (Lower)"
	}];
	
	let side  = await foundry.applications.api.Dialog.wait({
		window : {title : "Which side you move?"},
		content : "<p>The ship will move to the side and end on chosen hex. Side is based where the ship Fore is located, while Upper/Lower is based on the your view.</p>",
		buttons : btns
	});
	
	let direction = (side === "leftUp" || side === "leftDown") ? "left" : "right";
	let end = (side === "leftUp" || side === "rightUp") ? "up" : "down";
	let distance = value;
	
	if (isUpgraded)
	{
		let data = await foundry.applications.api.DialogV2.input({
		  window: { title: \`Choose distance, up to \${distance}\` },
		  content: \`<input type="number" name="distance" min="0" value="\${distance}">\`,
		  ok: {
			label: "Save",
			icon: "fa-solid fa-floppy-disk",
		  }
		});
		
		if (data && data.distance)
		{
			data.distance = Number(data.distance);
			if (data.distance < 1) data.distance = 1;
			if (data.distance > distance) data.distance = distance;
			distance = data.distance;
		}
	}
	
	this.actor.system.moveTokenSide(token, direction, end, distance);
	
	let content = \`The voidship moved \${distance} to the \${direction}\`;
	
	ChatMessage.create({
			speaker : ChatMessage.getSpeaker({actor : this.actor}),
			content : 
			\`<h5>Void Master Test</h5>
			<span>\${content}</span>
			\`
		});  
		
	args.context.effectFlags.push(this.effect.id); 
  }
}`,
	// Void-Seer Bonus - Pre-Prepare Derived
	"KLhYw6qfE8sRX4Fn": `this.actor.system.detectionRating.modifier += this.item.system.role.upgraded ? 10 : 5;`,
	// Void-Seer - Check for Value - Roll Skill Test
	"peZTtaTnt3Kdrjug": `if (this.item?.id === args.context?.itemId)
{
  if (args.result?.outcome === "success")
  {
    	
	if (!args.context.effectFlags) args.context.effectFlags = [];
	if (args.context.effectFlags.includes(this.effect.id)) return;	
	
  	let isUpgraded = this.item.system.role.upgraded;
	let value = Math.max(args.result.SL,1);

	let content = \`The voidship decreases penalties or damage due to Phenomena by \${value} 
	until the start of the next turn.\`
	if (isUpgraded)
	{
		let upgradedValue = Math.floor(args.result.SL/2);
		if (upgradedValue > 0)
		{
			content += \` If the Phenomena grants bonuses, increase them by \${upgradedValue}.\`;
		}
	}
	
	ChatMessage.create({
			speaker : ChatMessage.getSpeaker({actor : this.actor}),
			content : 
			\`<h5>Void-Seer Test</h5>
			<span>\${content}</span>
			\`
		});  
		
	args.context.effectFlags.push(this.effect.id); 
  }
}`,
	// Voidframe Custodian Bonus - Dialog
	"QcHQTIZ0jj9CL79O": `args.fields.damage -= this.item.system.role.upgraded ? 4 : 2;`,
	// Voidframe Custodian Bonus - Dialog Hide
	"NEItqBjRxIM6yozO": `return args.context?.type !== "ramming";`,
	// Voidframe Custodian Bonus - Dialog Activate
	"aBhdP4FFubXtEWsf": `return args.context?.type === "ramming";`,
	// Voidframe Custodian - Check for Value - Roll Skill Test
	"NJFJ6z95Sd8EmkRv": `if (this.item?.id === args.context?.itemId)
{
  if (args.result?.outcome === "success")
  {    	
	if (!args.context.effectFlags) args.context.effectFlags = [];
	if (args.context.effectFlags.includes(this.effect.id)) return;	
	
  	let isUpgraded = this.item.system.role.upgraded;
	let value = 1 + Math.floor(args.result.SL/3);
	let armour = 2;
	
	let sides = ["fore", "aft", "starboard", "port"]
	if (this.actor.system.options.takeAvgArmour) sides = ["average"];
	
	let checks = [];
	let contentDialog = "";
    contentDialog += "<div class=\`flexrow\`>"
	sides.map((key) => {

		checks.push({
			action : key,
			label : game.impmal.config.RTIM.voidship.hitLocations[key].display
		});
		contentDialog += \`<input type="checkbox" name="\${key}"><label style="margin-right:10px">\${game.impmal.config.RTIM.voidship.hitLocations[key].display}</label>\`;
	}); 
    contentDialog += "</div>"
	
	
	if (isUpgraded && args.result.SL >= 5)
	{
        let confirm = await foundry.applications.api.DialogV2.confirm({
             window : {title : "Do you want to add 2 Armour to all locations?"},
			 content : "<p>If you don't take all locations, you increase gained Armour by 2 for chosen sides.</p>"
        });
        if (confirm) {
			this.item.setFlag("impmal-rtim", "sides", {
				sides : sides,
				armour : armour
			});
			ChatMessage.create({
					speaker : ChatMessage.getSpeaker({actor : this.actor}),
					content : 
					\`<h5>Voidframe Custodian Test</h5>
					<span>Increased armour by 2 on all locations.</span>
					\`
				});  
			return;
        }
		armour = 4;
		
	}
	const data = await foundry.applications.api.DialogV2.input({
	  window: { title: \`Choose \${value} sides\` },
	  content: contentDialog,
	  ok: {
		label: "Save",
		icon: "fa-solid fa-floppy-disk",
	  }
	})
	
	if (!data) return;
	
	let chosenSides = [];
	let amount = value;
	if (data.fore && amount > 0) {
		amount--;
		chosenSides.push("fore");
	}
	if (data.starboard && amount > 0) {
		amount--;
		chosenSides.push("starboard");
	}
	if (data.port && amount > 0) {
		amount--;
		chosenSides.push("port");
	}
	if (data.aft && amount > 0) {
		amount--;
		chosenSides.push("aft");
	}
	
	let chosenSidesStr = chosenSides.map((key) => game.impmal.config.RTIM.voidship.hitLocations[key].display).join(", ");
	let content = \`The ship's armour was increased by \${armour} on sides: \${chosenSidesStr}\`;
	
	this.item.setFlag("impmal-rtim", "sides", {
		sides : chosenSides,
		armour : armour
	});
			
	ChatMessage.create({
			speaker : ChatMessage.getSpeaker({actor : this.actor}),
			content : 
			\`<h5>Voidframe Custodian Test</h5>
			<span>\${content}</span>
			\`
		});  
		
	args.context.effectFlags.push(this.effect.id); 
  }
}`,
	//
	"iH8bGsrhYfHeivww": `let flag = this.item.getFlag("impmal-rtim", "sides");
if (flag)
{
  flag.sides.forEach((key) => {
    this.actor.system.armour[key].modifier += flag.armour;
  })
}`,
	// Voidframe Custodian - Reset
	"T4sf6v0Bn4uWNyzS": `this.item.setFlag("impmal-rtim", "sides", false)`,
	// Voidframe Custodian - Reset Hide
	"P7sQxM78F4btNGx3": `return this.item.getFlag("impmal-rtim", "sides");`,
	// Vox Interdiction Officer Bonus - Dialog
	"i8VzqvV6MRDaPba2": `args.fields.SL += this.item.system.role.upgraded ? 2 : 1;`,
	// Vox Interdiction Officer Bonus - Dialog Hide
	"XssINmEZEpHB0CI0": `return args.context.type !== "seek"`,
	// Vox Interdiction Officer Bonus - Dialog Activate
	"cH8V8EWazBke0KAV": `return args.context.type === "seek"`,
	// Vox Interdiction Officer (Target) - Create Penalties - Immediate
	"L8IqPh9NB2PUgloI": `let isUpgraded = this.effect.sourceItem.system.role.upgraded;
let SL = this.effect.sourceTest.result.SL;

let bonuses = this.actor.system.bonuses;

bonuses.push({
	SL : -1,
	modifier : 0,
	advantage : false,
	disadvantage : false,
	removeAfterTurns : -1,
	removeOnStartTurn : false,
	removeOnEndTurn : false,
	removeOnNextEndTurn : true,
	type : ["all"],
	comment : "Vox Interdiction Officer Penalty"
})

if (isUpgraded && SL >= 5)
{
	bonuses.push({
		SL : 0,
		modifier : 0,
		advantage : false,
		disadvantage : true,
		removeAfterTurns : -1,
		removeOnStartTurn : false,
		removeOnEndTurn : false,
		removeOnNextEndTurn : false,
		removeOnNextTest : true,
		type : ["all"],
		comment : "Vox Interdiction Officer Penalty"
	})	
}

this.actor.update({"system.bonuses": bonuses});`,
	// War-Savant Bonus - Set Action
	"u6OSJBxGCiFEO3Wr": `let btns = [
{
	action : "boarding",
	label : game.i18n.localize("IMPMAL_RTIM.VoidCombat.Boarding")
},
{
	action : "seek",
	label : game.i18n.localize("IMPMAL_RTIM.VoidCombat.Seek")
},
{
	action : "ramming",
	label : game.i18n.localize("IMPMAL_RTIM.VoidCombat.Ramming")
},
{
	action : "assaultBoarding",
	label : game.i18n.localize("IMPMAL_RTIM.VoidCombat.AssaultBoarding")
},
{
	action : "bomberRun",
	label : game.i18n.localize("IMPMAL_RTIM.VoidCombat.BomberRun")
},
];


let action  = await foundry.applications.api.Dialog.wait({
    window : {title : "Choose 1 Action"},
    buttons : btns
});

if (!action) return;

this.item.setFlag("impmal-rtim", "action", action);`,
	// War-Savant Bonus - Dialog
	"SR1bK8iiuCOwO6FT": `args.fields.SL -= this.item.system.role.upgraded ? 2 : 1;`,
	// War-Savant Bonus - Dialog Hide
	"6gsM0rME2cQgsz8x": `return args.context.type !== this.item.getFlag("impmal-rtim","action")`,
	// War-Savant Bonus - Dialog Activate
	"IlPoSR6UBeghVoOb": `return args.context.type === this.item.getFlag("impmal-rtim","action")`,
	// War-Savant Bonus - Dialog Submit
	"HjAcXBJqqxqe2qZ1": `this.item.setFlag("impmal-rtim", "action", false);`,
	// War-Savant - Set Target
	"FDC8YP2RlcjYWpvX": `let flag = this.item.getFlag("impmal-rtim", "value")
	if (!flag)
{
    ui.notifications.warn("You need to make a test first!");
	return;
	}

let targetToken = game?.user?.targets?.first();
if (targetToken?.actor?.type !== "impmal-rtim.voidshipSheet"){
    ui.notifications.warn(game.i18n.localize("IMPMAL_RTIM.VoidCombat.NeedTarget"));
    return;
}
let damage = Math.max(flag-1,1);
if (this.item.system.role.upgraded && flag-1 >= 5)
{	
	let upgradedDamage = 3 + Math.max(flag-1-5,0);
	let confirm = await foundry.applications.api.DialogV2.confirm({
		 window : {title : \`Do you want to deal \${upgradedDamage} additional damage to similiar targets?\`},
		 content : \`<p>Otherwise, you will deal \${damage} additional damage to chosen target.</p>\`
	});
	if (confirm)
	{
		this.item.setFlag("impmal-rtim", "damage", upgradedDamage);
		this.item.setFlag("impmal-rtim", "similiar", true);		
		ui.notifications.info("You will now deal additional damage against similiar targets!");
		return;
	}
}
this.item.setFlag("impmal-rtim", "specific", targetToken.actor.uuid)
this.item.setFlag("impmal-rtim", "damage", damage);
 ui.notifications.info(\`Target is set to: \${targetToken.name}. You will deal \${damage} additional damage against them!\`);
	
        canvas.tokens.setTargets(game.user.targets.ids, {mode: "release"});`,
	// War-Savant - Set Target Hide
	"VUyP9jYXbViZVVuo": `return this.item.getFlag("impmal-rtim", "similiar") || this.item.getFlag("impmal-rtim", "specific") || !this.item.getFlag("impmal-rtim", "value")`,
	// War-Savant - Additional Damage Specific - Dialog
	"UPPLWorw8RnYTt8Q": `args.fields.damage += this.item.getFlag("impmal-rtim", "damage")`,
	// War-Savant - Additional Damage Specific - Dialog Hide
	"QZfSAdKYwIwf5uCA": `return !args.context.hasDamage || this.item.getFlag("impmal-rtim", "specific") !== args.data.targets?.[0]?.actor?.uuid;`,
	// War-Savant - Additional Damage Specific - Dialog Activate
	"xyaiMbAHjbpRMpo3": `return args.context.hasDamage && this.item.getFlag("impmal-rtim", "specific") === args.data.targets?.[0]?.actor?.uuid;`,
	// War-Savant - Additional Damage Similiar - Dialog
	"WtqzkTam3b6BMz2A": `args.fields.damage += this.item.getFlag("impmal-rtim", "damage")`,
	// War-Savant - Additional Damage Similiar - Dialog Hide
	"zENjdyOHDlsUjqnE": `return !args.context.hasDamage || !this.item.getFlag("impmal-rtim", "similiar")`,
	// War-Savant - Check for Value
	"SHaPhnZVV6z7WvBx": `if (this.item?.id === args.context?.itemId)
{
  if (args.result?.outcome === "success")
  {    	
	if (!args.context.effectFlags) args.context.effectFlags = [];
	if (args.context.effectFlags.includes(this.effect.id)) return;	
	
  	let isUpgraded = this.item.system.role.upgraded;
	let damage = Math.max(args.result.SL,1);
	
	let content = \`Now you can choose a target that you will deal additional \${damage} damage.\`;
	
	if (isUpgraded && args.result.SL >= 5)
	{
		let upgradedDamage = 3 + Math.max(args.result.SL-5,0);
		content += \` Or, you can choose to deal \${upgradedDamage} additional damage against similiar targets!\`;
	}
	
	this.item.setFlag("impmal-rtim", "value", args.result.SL+1);
	this.item.setFlag("impmal-rtim", "damage", false);
	this.item.setFlag("impmal-rtim", "specific", false);
	this.item.setFlag("impmal-rtim", "similiar", false);
	
	ChatMessage.create({
			speaker : ChatMessage.getSpeaker({actor : this.actor}),
			content : 
			\`<h5>War-Savant Test</h5>
			<span>\${content}</span>
			\`
		});  
		
	args.context.effectFlags.push(this.effect.id); 
  }
}`,
	// War-Savant - Damage Reset
	"onBqDC61ZRU9syst": `this.item.setFlag("impmal-rtim", "value", false);
	this.item.setFlag("impmal-rtim", "damage", false);
	this.item.setFlag("impmal-rtim", "specific", false);
	this.item.setFlag("impmal-rtim", "similiar", false);`,
	// War-Savant - Damage Reset Hide
	"MfD4E2JgynfioHnu": `return !this.item.getFlag("impmal-rtim", "value")`,	
	// Warden of Sacred Flame Bonus - Reduce Fatigue - Manual
	"fQc1vsGEiVyhcVr1": `flag = this.item.getFlag("impmal-rtim", "fatigue");
	if (!flag)
	{
		this.actor.update({"system.fatigue.value": Math.max(this.actor.system.fatigue.value-(this.item.system.role.upgraded ? 2 : 1),0) });
		this.item.setFlag("impmal-rtim", "fatigue", true)
	} `,
	// Warden of Sacred Flame Bonus - Reduce Fatigue - Manual Hide
	"jEZYEN2eZSWPmGPf": `return this.item.getFlag("impmal-rtim", "fatigue")`,
	// Warden of Sacred Flame Bonus - Reset
	"tTzIfyiJJQGnuZH3": `this.item.setFlag("impmal-rtim", "fatigue", false)`,
	// Warden of Sacred Flame Bonus - Reset Hide
	"jbfUNdxXC2nOhzb8": `return !this.item.getFlag("impmal-rtim", "fatigue")`,
	// Warden of Sacred Flame - Check for Value
	"IRwIcMMoxDHbNQmQ": `if (this.item?.id === args.context?.itemId)
{
  if (args.result?.outcome === "success")
  {    	
	if (!args.context.effectFlags) args.context.effectFlags = [];
	if (args.context.effectFlags.includes(this.effect.id)) return;	
	
  	let isUpgraded = this.item.system.role.upgraded;
	
	let content = "You gain Advantage to oppose any Psychic Power or similiar.";
	
	if (isUpgraded)
	{
		content += " If you succeed with +5 SL on the Opposed test, the power is redirected at the enemy (as if won with +1 SL).";
	}
	
	this.item.setFlag("impmal-rtim", "psychic", true);
	
	ChatMessage.create({
			speaker : ChatMessage.getSpeaker({actor : this.actor}),
			content : 
			\`<h5>Warden of Sacred Flame Test</h5>
			<span>\${content}</span>
			\`
		});  
		
	args.context.effectFlags.push(this.effect.id); 
  }
}`,
	// Warden of Sacred Flame - Dialog
	"LuaCeEXJYoGfabdT": `args.advCount++`,
	// Warden of Sacred Flame - Dialog Hide
	"Q4EGFNlw4eg7bHJ0": `return !this.item.getFlag("impmal-rtim", "psychic")`,
	// Warden of Sacred Flame - Dialog Activate
	"il4Tu9uc2CuF6E2z": `//nothing`,
	// Warden of Sacred Flame - Reset
	"v1JIGETjNxxk8Ulb": `this.item.setFlag("impmal-rtim", "psychic", false)`,
	// Warden of Sacred Flame - Reset Hide
	"EWRcrNMiGkWcCh6D": `return !this.item.getFlag("impmal-rtim", "psychic")`,
	// Warhead Marshal Bonus - Dialog
	"3A7KXHZOqMmrl0bJ": `args.fields.damage += this.item.system.role.upgraded ? 5 : 2;`,
	// Warhead Marshal Bonus - Dialog
	"29Vb3pncG0Kn9u70": `return args.context.type !== "torpedoSalvo";`,
	// Warhead Marshal Bonus - Dialog
	"iXVXAszaFN3dQ8HF": `return args.context.type === "torpedoSalvo";`,
	// Warhead Marshal - Check for Value
	"Zsc0LpIlmQXGe9Uv": `if (this.item?.id === args.context?.itemId)
{
  if (args.result?.outcome === "success")
  {    	
	if (!args.context.effectFlags) args.context.effectFlags = [];
	if (args.context.effectFlags.includes(this.effect.id)) return;	
	
  	let isUpgraded = this.item.system.role.upgraded;
	
	let content = "Choose a torpedo bay for one of its salvos to receive: +10 rating";
	
	let speed = args.result.SL >= 3;
	let thermal = (isUpgraded && args.result.SL >= 5);
	
	if (speed)
	{
		content += ", +2 speed";
	}
	if (thermal)
	{
		content += " and Thermal Penetration becomes 0";
	}
	content += "."
	
	this.item.setFlag("impmal-rtim", "torpedo", {
		rating : true,
		speed : speed,
		thermal : thermal
	});
	
	ChatMessage.create({
			speaker : ChatMessage.getSpeaker({actor : this.actor}),
			content : 
			\`<h5>Warhead Marshal Test</h5>
			<span>\${content}</span>
			\`
		});  
		
	args.context.effectFlags.push(this.effect.id); 
  }
}`,
	// Warhead Marshal - Post-Prepare Derived
	"evSZSmvwX5mIWCA9": `let values = this.item.getFlag("impmal-rtim", "torpedo");
	let weapon = this.item.getFlag("impmal-rtim", "weapon");
	if (values && weapon)
	{
		let item = this.actor.items.get(weapon);
		if (item)
		{
			item.system.weapon.rating += values.rating ? 10 : 0;
			if (values.thermal) item.system.weapon.torpedo.thermal = 0;
			if (values.speed) item.system.weapon.torpedo.speedRating += 2;
		}
	}`,
	// Warhead Marshal - Set Weapon
	"tHozVIn27uCPwMwV": `let weaponItems = this.actor.items
	.filter(item => item.type === "impmal-rtim.voidshipPart")
	.filter(item => item.system?.partType === "weapon")
	.filter(item => item.system.weapon.type === "torpedo");
if (!weaponItems.length)
{
	ui.notifications.warn(game.i18n.localize("IMPMAL_RTIM.VoidCombat.NoWeapons"));
	return;
}
	
let items = (await ItemDialog.create(weaponItems, 1, {title : "Set to", text: "Choose 1"}));
if (!items || items.length == 0) return;  
ui.notifications.info(\`\${items[0].name} was chosen.\`);

this.item.setFlag("impmal-rtim", "weapon", items[0].id);`,
	// Warhead Marshal - Set Weapon Hide
	"LmC1wdDasL9SpDAQ": `return !this.item.getFlag("impmal-rtim","torpedo");`,
	// Warhead Marshal - Reset
	"CWkG2sHRSwvQWtpG": `this.item.setFlag("impmal-rtim", "torpedo", false);
	this.item.setFlag("impmal-rtim", "weapon", false);`,
	// Warhead Marshal - Reset Hide
	"9CuhzoRfSGWgkL5y": `return !this.item.getFlag("impmal-rtim","torpedo");`,
	// Warp Guide Bonus - Dialog
	"dnCUjjjF41PpJo8l": `args.fields.SL += this.item.system.role.upgraded ? 2 : 1;`,
	// Warp Guide Bonus - Dialog Hide
	"d4Ns4hdYlt5qzQfj": `return args.data?.skill !== "navigation" && args.data?.skill !== "piloting"`,
	// Warp Guide - Check for Value
	"92UkOYdt7wzBDcfs": `if (this.item?.id === args.context?.itemId)
{
  if (args.result?.outcome === "success")
  {
if (!args.context.effectFlags) args.context.effectFlags = [];
if (args.context.effectFlags.includes(this.effect.id)) return;
    
	let token = this.actor.token;
	if (!token) //we got the unlinked token otherwise
	{
		token = this.actor.getActiveTokens()[0];
		if (!token)
		{
			ui.notifications.warn(game.i18n.localize("IMPMAL_RTIM.VoidCombat.NoToken"));
			return;
		}
	}
	
  	let isUpgraded = this.item.system.role.upgraded;
	
	let diceResult = Math.max(Math.ceil(Math.ceil(CONFIG.Dice.randomUniform() * 10)/2) + args.result.SL,3);
	
	if (isUpgraded)
	{
		let diceResultTwo = Math.max(Math.ceil(Math.ceil(CONFIG.Dice.randomUniform() * 10)/2) + args.result.SL,3);
		console.log(diceResultTwo)
		let btns = [
		{
			action : diceResult,
			label : \`Jump \${diceResult}\`
		},
		{
			action : diceResultTwo,
			label : \`Jump \${diceResultTwo}\`
		},
		];
		
		let chosen = await foundry.applications.api.Dialog.wait({
			 window : {title : "Choose number of hexes to jump"},
			buttons : btns
		});
		
		if (!chosen) return;
		diceResult = chosen;
	}
	
	let content = \`The ship jumps throught the warp \${diceResult} hexes forward.\`;
	
	await this.actor.system.moveTokenFoward(token, diceResult, false);	
	
	ChatMessage.create({
			speaker : ChatMessage.getSpeaker({actor : this.actor}),
			content : 
			\`<h5>Warp Guide Test</h5>
			<span>\${content}</span>
			\`
		});   
args.context.effectFlags.push(this.effect.id);
    
  }
}`,
	//// VOIDCOMBAT CRITICALS
	// Augur Shot - Postpare Derived
	"kb6HxFLdFIsvIvcY": `if (this.actor.system.detectionRating.value > 0) this.actor.system.detectionRating.value = 0;`,
	// Burning Compartment - Immediate
	"wMPH84PoNSd6XjTW": `if (this.actor.system.options.fireResistance > 100)
{
	let roleItems = this.actor.items
	.filter(item => item.type === "impmal-rtim.voidshipPart")
	.filter(item => item.system?.partType === "role")
	.filter(item => item.system.status !== "destroyed");
	if (!roleItems.length)
	{
		ui.notifications.warn("No Components (Roles) to destroy, increase Critical Damage by 2");
		return;
	}
	
	let random = Math.floor(CONFIG.Dice.randomUniform() * roleItems.length);
	let chosenItems = roleItems[random];

	if (!game.settings.get("impmal-rtim", "voidcombatSettings").randomDamaged)
	{
		let resultItems = (await ItemDialog.create(roleItems, 1, 
			{title : "Destroy Component", text: "Choose 1"}));
		if (resultItems && resultItems.length > 0) chosenItems = resultItems;
	}
	
	if (!chosenItems || chosenItems.length == 0) return;

	chosenItems[0].update({"system.status":"destroyed"})
	ui.notifications.info(\`\${chosenItems[0].name} was destroyed.\`);
}
else
{  
	this.actor.update({"system.fire":this.actor.system.fire+1});
}`,
	// Catastrophic Damage - Immediate
	"XRfb3niGRAN8PcLn": `let critString = \`<a class="table-roll" data-table="catastrophicvoidship" data-formula="2d10dh1"><i class="fa-solid fa-dice-d10">
	</i>Catastrophic Damage</a>\`
ChatMessage.create({
                    speaker : ChatMessage.getSpeaker({actor : this.actor}),
                    content : critString
                });`,
	// Crippling Hope - Immediate
	"1c6AI1LkbalFDZCO": `if (this.actor.system.options.noFatigue)
{
  ui.notifications.warn("This ship doesn't use Fatigue, increase Critical Damagey by 2.")
  return;
}
this.actor.applyDamage(2, { type: "fatigue" });`,
	// Dead in Void - Start Turn
	"9IYfJzoTkLivR2m0": `
	let token = this.actor.token;
	if (!token) //we got the unlinked token otherwise
	{
		token = this.actor.getActiveTokens()[0];
		if (!token)
		{
			ui.notifications.warn(game.i18n.localize("IMPMAL_RTIM.VoidCombat.NoToken"));
			return;
		}
	}
this.actor.system.moveTokenFoward(token, 3, false);`,
	// Dead in Void - Post Prepare Derived
	"Rc7o0PbHt1M7wyW7": `this.actor.system.movementPoints.max = 0;
	this.actor.system.movementPoints.value = 0;
this.actor.system.speedRating.value = 0;`,
	// Dead Vox - Dialog
	"vEaJ9oiMe9SJOU36": `args.disAdv++;`,
	// Dead Vox - Dialog Hide
	"cwmp6qyLUOc87kGl": `return !Object.values(game.impmal.config.RTIM.voidship.actions).map(i => i.key).includes(args.context.type)`,
	// Dead Vox - Dialog Activate
	"CEgKOKlYEzwWzAbS": `return true;`,
	// Devastated Bridge - Immediate
	"wYbafh5tMHI59FJr": `let roleItems = this.actor.items
		.filter(item => item.type === "impmal-rtim.voidshipPart")
		.filter(item => item.system?.partType === "role")
		.filter(item => item.system.active);

	
if (!roleItems.length)
{	
	ui.notifications.warn("No roles to deactivate, increase Critical Damage by 2");		
	return;
}		
	
let items = (await ItemDialog.create(roleItems, 1, 
{title : "List of Roles", text: "Choose 1"}));	

if (!items || items.length == 0) return;  
await items[0].update({"system.active": false});
ui.notifications.info(\`\${items[0].name} was deactivated.\`);
`,
	// Devastating Cut - Immediate
	"nfM59QoHjpsy1z3D": `let roleItems = this.actor.items
		.filter(item => item.type === "impmal-rtim.voidshipPart")
		.filter(item => item.system?.partType === "role")
		.filter(item => item.system.active);

	
if (!roleItems.length)
{	
	ui.notifications.warn("No roles to deactivate, increase Critical Damage by 2");		
	return;
}		
	
roleItems.forEach((item) => 
{
	item.update({"system.active": false});
});	
ui.notifications.info("All roles deactivated");`,
	// Just a Scratch - Immediate
	"MXckA37FNjtnT0HK": `let roleItems = this.actor.items
		.filter(item => item.type === "impmal-rtim.voidshipPart")
		.filter(item => item.system?.partType === "role")
		.filter(item => item.system.status !== "destroyed");

	
if (!roleItems.length)
{	
	ui.notifications.warn("No roles to damage, increase Critical Damage by 2");		
	return;
}		

let random = Math.floor(CONFIG.Dice.randomUniform() * roleItems.length);
let chosenItems = roleItems[random];

if (!game.settings.get("impmal-rtim", "voidcombatSettings").randomDamaged)
{
	let resultItems = (await ItemDialog.create(roleItems, 1, 
		{title : "List of Roles", text: "Choose 1"}));
	if (resultItems && resultItems.length > 0) chosenItems = resultItems;
}

if (!chosenItems || chosenItems.length == 0) return;

let newStatus = chosenItems[0].system.status === "default" ? "damaged" : "destroyed";
await chosenItems[0].update({"system.status": newStatus });
ui.notifications.info(\`\${chosenItems[0].name} was \${newStatus}.\`);`,
	// Life Leak - Immediate
	"zRZMu6AYlFMMt5eB": `let timer = Math.ceil(Math.ceil(CONFIG.Dice.randomUniform() * 10)/2);
	this.actor.setFlag("impmal-rtim", "lifelessTimer", timer);
		ChatMessage.create({
				speaker : ChatMessage.getSpeaker({actor : this.actor}),
				content : 
				\`The ship is dying, it will become lifeless in \${timer} turns!\`
			});  `,
	// Life Leak - End Turn
	"cCf2JURDyitgntWj": `
	let value = this.actor.getFlag("impmal-rtim","lifelessTimer");
	if (value > 0)
	{		
		ChatMessage.create({
				speaker : ChatMessage.getSpeaker({actor : this.actor}),
				content : 
				\`The ship is dying, it will become lifeless in \${value} turns!\`
			});  
		this.actor.setFlag("impmal-rtim", "lifelessTimer", value-1)
	}
	else
	{
		ChatMessage.create({
				speaker : ChatMessage.getSpeaker({actor : this.actor}),
				content : 
				\`The ship becomes lifeless.\`
			});  
		this.effect.update({"disabled": true});
	}`,
	// Major Self-Destruct - Immediate
	"UOPtJP8nwNEGh2B3": `let critString = \`Roll five times: <a class="table-roll" data-table="catastrophicvoidship" data-formula="1d10"><i class="fa-solid fa-dice-d10">
	</i>Critical Damage</a>\`
ChatMessage.create({
                    speaker : ChatMessage.getSpeaker({actor : this.actor}),
                    content : critString
                });`,
	// Not Listening - PostPrepare Derived
	"9YIiAxa3z7cnv2eg": `this.actor.system.options.autoTest = true;
	this.actor.system.options.autoTestSL = -2;`,
	// Reticles Shattered - Dialog
	"IYUPIj6bWFUB73Jj": `args.disAdv++;`,
	// Reticles Shattered - Dialog Hide
	"vKTC5nUarnxBj0Am": `return !["shooting"].includes(args.context.type)`,
	// Reticles Shattered - Dialog Activate
	"U55ZwrLBWebTbloV": `return true;`,
	// Self-Destruct - Immediate
	"ne2WfJLr6FBos8rp": `let weaponItems = this.actor.items
	.filter(item => item.type === "impmal-rtim.voidshipPart")
	.filter(item => item.system?.partType === "weapon")
	.filter(item => item.system?.status !== "destroyed");
if (!weaponItems.length)
{
	ui.notifications.warn("No weapon to destroy, increase Critical Damage by 2.");
	return;
}
	
let random = Math.floor(CONFIG.Dice.randomUniform() * weaponItems.length);
let chosenItems = weaponItems[random];

if (!game.settings.get("impmal-rtim", "voidcombatSettings").randomDamaged)
{
	let resultItems = (await ItemDialog.create(weaponItems, 1, 
		{title : "Damaged Weapons", text: "Choose 1"}));
	if (resultItems && resultItems.length > 0) chosenItems = resultItems;
}

if (!chosenItems || chosenItems.length == 0) return;

chosenItems[0].update({"system.status": "destroyed"});
ui.notifications.info(\`\${chosenItems[0].name} was destroyed!\`);

if (chosenItems[0].system.weapon.type === "torpedo")
{
	let critString = \`Torpedo Bay explodes: <a class="table-roll" data-table="catastrophicvoidship" data-formula="1d10"><i class="fa-solid fa-dice-d10">
	</i>Critical Damage</a>\`
ChatMessage.create({
                    speaker : ChatMessage.getSpeaker({actor : this.actor}),
                    content : critString
                });
}
`,
	// Shield Flicker - Immediate
	"f0KHccbwhaJ0xUrA": `let updates = {}
	let sides = ["fore","aft","starboard","port","average"];
	sides.forEach((key) => 
	{
		updates[\`system.shields.\${key}.value\`] = Math.max(this.actor.system.shields[key].value - Math.ceil(this.actor.system.shields[key].max/2),0);
	})
	this.actor.update(updates)`,
	// Silent Limping - Dialog
	"0eGHnU88PAAr5yZg": `args.disCount++;`,
	// Silent Limping - Dialog Acivate
	"j2LF2RjT1ynwBwzs": `return true;`,
	// Thrusters Shot - PostPrepare Derived
	"N44NOeQphNuvmES3": `this.actor.system.turnRating.value = 999;`,
	// Visions of Horror - Immediate
	"DQgYupXwEwWCz9ov": `if (this.actor.system.options.noFatigue)
{
  ui.notifications.warn("This ship doesn't use Fatigue, increase Critical Damagey by 2.")
  return;
}
this.actor.applyDamage(3, { type: "fatigue" });`,
	// What Devastation - Immediate
	"8zTPOjKNRNWAWAYi": `if (this.actor.system.options.noFatigue)
{
  ui.notifications.warn("This ship doesn't use Fatigue, increase Critical Damagey by 2.")
  return;
}
this.actor.applyDamage(1, { type: "fatigue" });`,
	// Plasma Drive Cascade - Request Squadron Test - Manual
	"kYoCZg7sqKFA2Cqm": `if (!game.user?.isGM) return;
	
let targetToken = game?.user?.targets?.first();
if (targetToken?.actor?.type !== "impmal-rtim.voidshipSheet"){
    ui.notifications.warn(game.i18n.localize("IMPMAL_RTIM.VoidCombat.NeedTarget"));
    return;
}
	let actor = targetToken.actor;
	let key = "piloting";
    let itemId = actor.system.skills.piloting.specialisations.find(i => i.name.slugify() == game.i18n.localize("IMPMAL_RTIM.VoidCombat.MinorVoidship")?.slugify()); 
	let context = { 
		voidshipTest: true, 
		type: "plasmaCascadeSquadron", 
		appendTitle: " - " + this.effect.name, 
		itemId: this.item.id,
		difficulty: "difficult"
	};
	actor.system.setupVoidshipTest({itemId, key, actor}, context).then( test =>
		{
		
			let content = test.result.outcome === "success" ? "Squadron is saved!" : "Squadron was destroyed!";

			ChatMessage.create({
                    speaker : ChatMessage.getSpeaker({actor : actor}),
                    content : content
           });
		}
	);`,
	// Plasma Drive Cascade - Request Voidship Test - Manual
	"UENPMSMmLynwPthd": `if (!game.user?.isGM) return;
let targetToken = game?.user?.targets?.first();
if (targetToken?.actor?.type !== "impmal-rtim.voidshipSheet"){
    ui.notifications.warn(game.i18n.localize("IMPMAL_RTIM.VoidCombat.NeedTarget"));
    return;
}
	let actor = targetToken.actor;
	let key = "piloting";
    let itemId = actor.system.skills.piloting.specialisations.find(i => i.name.slugify() == game.i18n.localize("IMPMAL_RTIM.VoidCombat.MajorVoidship")?.slugify()); 
	let context = { 
		voidshipTest: true, 
		type: "plasmaCascadeVoidship", 
		appendTitle: " - " + this.effect.name, 
		itemId: this.item.id,
		difficulty: "difficult"
	};
	actor.system.setupVoidshipTest({itemId, key, actor}, context).then( test =>
		{
			let content = test.result.outcome === "success" ? "Voidship goes unscathed!" 
				: \`Voidship is hit, it receives \${Math.max(-test.result.SL,1)} seperate hits worth 10 Damage each to the side nearest epicenter (Shields and Armour protect normally).\`;

			ChatMessage.create({
                    speaker : ChatMessage.getSpeaker({actor : actor}),
                    content : content
           });
		}
	);`,
	// Plasma Drive Cascade - Deal 10 Damage - Manual
	"m9IRK6jyonwnfx5E": `if (!game.user?.isGM) return;
let targetToken = game?.user?.targets?.first();
if (targetToken?.actor?.type !== "impmal-rtim.voidshipSheet"){
    ui.notifications.warn(game.i18n.localize("IMPMAL_RTIM.VoidCombat.NeedTarget"));
    return;
}

let sides = ["fore", "aft", "starboard", "port"]
if (this.actor.system.options.takeAvgShield) sides = ["average"];

let btns = [];
sides.map((key) => {
	btns.push({action : key,
	label : game.impmal.config.RTIM.voidship.hitLocations[key].display});
}); 
       

let location  = await foundry.applications.api.Dialog.wait({
    window : {title : "Deal 10 Damge to side"},
    content : \`<p>\${game.i18n.localize("IMPMAL_RTIM.VoidCombat.ChooseLocation")}</p>\`,
    buttons : btns
});

if (!location) return;
targetToken.actor.applyDamage(10, {location, createCriticalMessage:true});`,
	// Warp Engine Cascade - Request Squadron Test - Manual
	"uwpPNlOeqv7QT4lO": `if (!game.user?.isGM) return;
	
let targetToken = game?.user?.targets?.first();
if (targetToken?.actor?.type !== "impmal-rtim.voidshipSheet"){
    ui.notifications.warn(game.i18n.localize("IMPMAL_RTIM.VoidCombat.NeedTarget"));
    return;
}
	let actor = targetToken.actor;
	let key = "piloting";
    let itemId = actor.system.skills.piloting.specialisations.find(i => i.name.slugify() == game.i18n.localize("IMPMAL_RTIM.VoidCombat.MinorVoidship")?.slugify()); 
	let context = { 
		voidshipTest: true, 
		type: "warpCascadeSquadron", 
		appendTitle: " - " + this.effect.name, 
		itemId: this.item.id,
		difficulty: "difficult"
	};
	actor.system.setupVoidshipTest({itemId, key, actor}, context).then( test =>
		{
		
			let content = test.result.outcome === "success" ? "Squadron is saved!" : "Squadron was destroyed!";

			ChatMessage.create({
                    speaker : ChatMessage.getSpeaker({actor : actor}),
                    content : content
           });
		}
	);`,
	// Warp Engine Cascade - Request Voidship Test - Manual
	"UXY8w7seMxwoa29F": `if (!game.user?.isGM) return;
let targetToken = game?.user?.targets?.first();
if (targetToken?.actor?.type !== "impmal-rtim.voidshipSheet"){
    ui.notifications.warn(game.i18n.localize("IMPMAL_RTIM.VoidCombat.NeedTarget"));
    return;
}
	let actor = targetToken.actor;
	let key = "piloting";
    let itemId = actor.system.skills.piloting.specialisations.find(i => i.name.slugify() == game.i18n.localize("IMPMAL_RTIM.VoidCombat.MajorVoidship")?.slugify()); 
	let context = { 
		voidshipTest: true, 
		type: "plasmaCascadeVoidship", 
		appendTitle: " - " + this.effect.name, 
		itemId: this.item.id,
		difficulty: "difficult"
	};
	actor.system.setupVoidshipTest({itemId, key, actor}, context).then( test =>
		{
			let content = test.result.outcome === "success" ? "Voidship goes unscathed!" 
				: \`Voidship is pulled \${Math.max(-test.result.SL,1)} towards the epicenter, if it falls into the warp rift - who knows what happens.\`;

			ChatMessage.create({
                    speaker : ChatMessage.getSpeaker({actor : actor}),
                    content : content
           });
		}
	);`,
	// Warp Engine Shot - Immediate
	"BVdGQAIIkdRpkWTL": `let timer = Math.ceil(Math.ceil(CONFIG.Dice.randomUniform() * 10)/2);
	this.actor.setFlag("impmal-rtim", "warpTimer", timer);
		ChatMessage.create({
				speaker : ChatMessage.getSpeaker({actor : this.actor}),
				content : 
				\`The ship's Warp Engine is melting down, in \${timer} turns a Warp Engine Cascade will occur!\`
			});  `,
	// Warp Engine Shot - End Turn
	"qs4GLT5ygEc3atcP": `
	let value = this.actor.getFlag("impmal-rtim","warpTimer");
	if (value > 0)
	{		
		ChatMessage.create({
				speaker : ChatMessage.getSpeaker({actor : this.actor}),
				content : 
				\`The ship's Warp Engine is melting down, in \${value} turns a Warp Engine Cascade will occur!\`
			});  
		this.actor.setFlag("impmal-rtim", "warpTimer", value-1)
	}
	else
	{
		ChatMessage.create({
				speaker : ChatMessage.getSpeaker({actor : this.actor}),
				content : 
				\`Warp Engine Cascade happens!\`
			});  
		this.effect.update({"disabled": true});
	}`,
	// Plasma Drive Shot - Immediate
	"zIk0cxGji5vTtXZg": `let timer = Math.ceil(Math.ceil(CONFIG.Dice.randomUniform() * 10)/2);
	this.actor.setFlag("impmal-rtim", "plasmaTimer", timer);
		ChatMessage.create({
				speaker : ChatMessage.getSpeaker({actor : this.actor}),
				content : 
				\`The ship's Plasma Drive is melting down, in \${timer} turns a Plasma Drive Cascade will occur!\`
			});  `,
	// Plasma Drive Shot - End Turn
	"ko7rxxWDx7xMUB0f": `
	let value = this.actor.getFlag("impmal-rtim","plasmaTimer");
	if (value > 0)
	{		
		ChatMessage.create({
				speaker : ChatMessage.getSpeaker({actor : this.actor}),
				content : 
				\`The ship's Plasma Drive is melting down, in \${value} turns a Plasma Drive Cascade will occur!\`
			});  
		this.actor.setFlag("impmal-rtim", "plasmaTimer", value-1)
	}
	else
	{
		ChatMessage.create({
				speaker : ChatMessage.getSpeaker({actor : this.actor}),
				content : 
				\`Plasma Drive Cascade happens!\`
			});  
		this.effect.update({"disabled": true});
	}`,
	//// VOIDCOMBAT SPECIAL ROLES
	// Chaos Captain Bonus - Dialog
	"rQWg9TfBaejYyhin": `args.fields.damage += this.item.system.role.upgraded ? 4 : 2;`,
	// Chaos Captain Bonus - Dialog Hide
	"ILPyhtoTFy8vrf40": `return args.context.type !== "shooting";`,
	// Chaos Captain Bonus - Dialog Activate
	"agQPTWU1EHeEQAQM": `return args.context.type === "shooting";`,
	// Chaos Captain - Check for Value - Roll Skill Test
	"m81Fqdr4nLLx6DDx": `if (this.item?.id === args.context?.itemId)
{
  if (args.result?.outcome === "success")
  {
if (!args.context.effectFlags) args.context.effectFlags = [];
if (args.context.effectFlags.includes(this.effect.id)) return;

  	let isUpgraded = this.item.system.role.upgraded;
	let value = 1 + Math.floor(args.result.SL/2);
	
	let content = \`Removed \${value} Fatigue from the ship.\`;
	let newFatigue = Math.max(this.actor.system.fatigue.value-value,0);
	await this.actor.update({"system.fatigue.value":newFatigue});
	
	let advantage = false;
	if (args.result.SL >= 3)
	{
		content += " All tests are done with +1 SL bonus";
		if (args.result.SL >= 5 && isUpgraded)
		{
			advantage = true;
			content += " and Advantage";
		}
		content += " for one turn.";
		
		let bonuses = this.actor.system.bonuses;
		bonuses.push({
			SL : 1,
			modifier : 0,
			advantage : advantage,
			disadvantage : false,
			removeAfterTurns : -1,
			removeOnStartTurn : true,
			removeOnEndTurn : false,
			removeOnNextEndTurn : false,
			removeOnNextTest : false,
			type : ["all"],
			comment : "Chaos Captain"
		})
		await this.actor.update({"system.bonuses": bonuses});		
	}
	
	

	ChatMessage.create({
			speaker : ChatMessage.getSpeaker({actor : this.actor}),
			content : 
			\`<h5>Chaos Captain Test</h5>
			<span>\${content}</span>
			\`
		});  

args.context.effectFlags.push(this.effect.id); 
    
  }
}`,
	// Chaos Sorcerer Bonus - Voidship Options
	"IQGkXYlubdMKNG4q": `if (args.testType !== "boarding") return;
	if (!args.target) return;
	args.target.system.applyDamage(this.item.system.role.upgraded ? 2 : 1, {type: "fatigue"});
if (!args.options.comment) args.options.comment = ""
args.options.comment += \`Chaos Sorcerer Bonus (dealt \${this.item.system.role.upgraded ? 2 : 1} Morale Damage to Target)\`;`,
	// Chaos Sorcerer - Deal Fire Damage to Target - Manual 
	"meelawyLVlR0mSiK": `let value = this.item.getFlag("impmal-rtim", "fire")

let targetToken = game?.user?.targets?.first();
if (targetToken?.actor?.type !== "impmal-rtim.voidshipSheet"){
    ui.notifications.warn(game.i18n.localize("IMPMAL_RTIM.VoidCombat.NeedTarget"));
    return;
}

targetToken.actor.system.applyDamage(value, {type: "fire"});

ui.notifications.info(\`Dealt \${value} OnFire! Stacks to Target\`);	

this.item.setFlag("impmal-rtim", "fire", false);`,
	// Chaos Sorcerer - Deal Fire Damage to Target - Manual Hide
	"UmRBREIf3eJxh2GD": `return !this.item.getFlag("impmal-rtim","fire")`,
	// Chaos Sorcerer - Check for Value
	"lBU83FFx0AQjVwg9": `if (this.item?.id === args.context?.itemId)
{
  if (args.result?.outcome === "success")
  {
if (!args.context.effectFlags) args.context.effectFlags = [];
if (args.context.effectFlags.includes(this.effect.id)) return;

  	let isUpgraded = this.item.system.role.upgraded;
	let value = 1 + Math.floor(args.result.SL/2);
	
	this.item.setFlag("impmal-rtim", "fire", value);
	let content = \`You can deal \${value} OnFire stacks to target.\`;
	
	let hull = this.actor.system.hull.value;
	let hullMax = this.actor.system.hull.max;
	if (isUpgraded && args.result.SL >= 3 && hull < hullMax)
	{
		content += " This voidship also regains 5 points of Hull!";
		this.actor.update({"system.hull.value": Math.min(hull+5,hullMax)});
	}
	

	ChatMessage.create({
			speaker : ChatMessage.getSpeaker({actor : this.actor}),
			content : 
			\`<h5>Chaos Sorcerer Test</h5>
			<span>\${content}</span>
			\`
		});  

args.context.effectFlags.push(this.effect.id); 
    
  }
}`,	
	// Ork Warboss Bonus - Dialog
	"QmYh54aoA4BkwqpU": `args.fields.SL += this.item.system.role.upgraded ? 2 : 1`,
	// Ork Warboss Bonus - Dialog Hide
	"bAIlgqjEozqkYVzK": `return args.context.type !== "boarding"`,
	// Ork Warboss Bonus - Dialog Activate
	"1GY6CVA48UUShDw1": `return args.context.type === "boarding"`,
	// Ork Warboss - Check for Value
	"qUBCIufzU1d7IVqM": `if (this.item?.id === args.context?.itemId)
{
  if (args.result?.outcome === "success")
  {
if (!args.context.effectFlags) args.context.effectFlags = [];
if (args.context.effectFlags.includes(this.effect.id)) return;

  	let isUpgraded = this.item.system.role.upgraded;
	let value = Math.max(args.result.SL,1);
	
	let content = \`The voidship gains \${value} Movement Points.\`
	
	if (isUpgraded && args.result.SL >= 3)
	{
		let rammingDamage = 2 + Math.floor(args.result.SL/2);
		content += \`Also, it increases Ramming Damage by \${rammingDamage}.\`
		this.item.setFlag("impmal-rtim", "ramming", rammingDamage);
	}
	
	this.actor.update({"system.movementPoints.value":this.actor.system.movementPoints.value+value});

	ChatMessage.create({
			speaker : ChatMessage.getSpeaker({actor : this.actor}),
			content : 
			\`<h5>Ork Warboss Test</h5>
			<span>\${content}</span>
			\`
		});  

args.context.effectFlags.push(this.effect.id); 
    
  }
}`,
	// Ork Warboss - PrePrepare Derived
	"5DJoQzkLoHUNGMRV": `let value = this.item.getFlag("impmal-rtim", "ramming");
	if (value)
	{
		this.actor.system.options.rammingDamage += value;
	}`,
	// Ork Warboss - Reset
	"4txGknatRXf6qqq3": `this.item.setFlag("impmal-rtim", "ramming", false);`,
	// Ork Warboss - Reset Hide
	"ojKhcGJHqMSTXEuf": `return !this.item.getFlag("impmal-rtim", "ramming");`,
	// Ork Weird Boy Bonus - Dialog
	"AbugvZVdI7T1Qf98": `args.fields.SL += this.item.system.role.upgraded ? 2 : 1`,
	// Ork Weird Boy Bonus - Dialog Hide
	"vPbSr0XrQUSipwhI": `return args.context.type !== "scan"`,
	// Ork Weird Boy Bonus - Dialog Activate
	"ii5kANE0fhUh0gyo": `return args.context.type === "scan"`,
	// Ork Weird Boy - Get Value - Take Damage
	"tb84PkzXSw7IvYL7": `this.item.setFlag("impmal-rtim", "damage", args.hullDamageValue+args.excess);
	this.item.setFlag("impmal-rtim", "excess", args.excess);`,
	// Ork Weird Boy - Check for Value - Roll Skill Test
	"7jXodai9ZrpfALvN": `if (this.item?.id === args.context?.itemId)
{
  if (args.result?.outcome === "success")
  {
if (!args.context.effectFlags) args.context.effectFlags = [];
if (args.context.effectFlags.includes(this.effect.id)) return;

	let damage = this.item.getFlag("impmal-rtim", "damage");
	
	if (!damage)
	{
		ui.notifications.warn("The voidship first needs to receive Hull Damage.");
		return;
	}
	
	let sides = ["fore", "aft", "starboard", "port"]
	if (this.actor.system.options.takeAvgShield) sides = ["average"];

	let noShields = true;
	let btns = [];
	let chosenSides = [];
	sides.map((key) => {
		if (this.actor.system.shields[key].value !== 0)
		{
			noShields = false;
			btns.push({action : key,
		   label : game.impmal.config.RTIM.voidship.hitLocations[key].display});
		   chosenSides.push(key);
		}
	}); 
		   
	if (noShields)
	{
		ui.notifications.warn("Nowhere to dissapate the damage!");
		return;
	}

  	let isUpgraded = this.item.system.role.upgraded;
	
	let content = "";
	let random = Math.floor(CONFIG.Dice.randomUniform() * chosenSides.length);
	
	let chosenSide = chosenSides[random];
	console.log(chosenSide);
	
	if (isUpgraded)
	{
		let location  = await foundry.applications.api.Dialog.wait({
			window : {title : \`Choose where to dissapate \${damage} damage\`},
			content : "If damage is higher than chosen Shields, the rest will stay in the hull.",
			buttons : btns
		});
		chosenSide = location;
	}

	let updateObj = {};
	let shieldValue = this.actor.system.shields[chosenSide].value - damage;
	let leftover = 0;
	updateObj[\`system.shields.\${chosenSide}.value\`] = shieldValue;	
	if (shieldValue < 0)
	{
		leftover -= shieldValue;
		shieldValue = 0;
		updateObj[\`system.shields.\${chosenSide}.value\`] = 0;
	}
	content += \`Shields at \${game.impmal.config.RTIM.voidship.hitLocations[chosenSide].display} went from \${this.actor.system.shields[chosenSide].value} to \${shieldValue}.\`
	if (leftover > 0)
	{
		content += \` There was leftover \${leftover} damage.\`;
	}
	let hullHeal = damage - leftover;
	let excess = this.item.getFlag("impmal-rtim", "excess");
	if (excess > 0)
	{
		content += \` There was \${excess} critical damage. Check if calculations are correct.\`;
		let originalHull = damage - excess;
		if (originalHull < hullHeal) hullHeal = originalHull;
	}
	content += \` Hull will regain \${hullHeal} points.\`
	updateObj["system.hull.value"] = hullHeal;	

	this.actor.update(updateObj);

	ChatMessage.create({
			speaker : ChatMessage.getSpeaker({actor : this.actor}),
			content : 
			\`<h5>Ork Weird Boy Test</h5>
			<span>\${content}</span>
			\`
		});  
		
	this.item.setFlag("impmal-rtim", "damage", false);
	
args.context.effectFlags.push(this.effect.id); 
    
  }
}`,
	// Station Commander Bonus - Dialog
	"kA83Y8k92wE4Rs2i": `args.fields.SL -= this.item.system.role.upgraded ? 2 : 1`,
	// Station Commander Bonus - Dialog Hide
	"3E98nq3XM9K2U1jK": `return args.context.type !== "boarding" && args.context.type !== "assaultBoarding"`,
	// Station Commander Bonus - Dialog Activate
	"FSYjOBELgUiudNDW": `return args.context.type === "boarding" || args.context.type === "assaultBoarding"`,
	// Station Commander - Check for Value
	"AZ8lgSzmltZ2iLSZ": `if (this.item?.id === args.context?.itemId)
{
  if (args.result?.outcome === "success")
  {
if (!args.context.effectFlags) args.context.effectFlags = [];
if (args.context.effectFlags.includes(this.effect.id)) return;


	let isUpgraded = this.item.system.role.upgraded;
	
	let content = "All weapons receive +1 SL bonus to Shooting";
	
	let damage = false;
	if (isUpgraded && args.result.SL >= 3)
	{
		content += " and +2 damage";
		damage = true;
	}
	content += ".";
	
	
	let bonuses = this.actor.system.bonuses;
	bonuses.push({
		SL : 1,
		modifier : 0,
		damage : damage ? 2 : 0,
		advantage : false,
		disadvantage : false,
		removeAfterTurns : -1,
		removeOnStartTurn : true,
		removeOnEndTurn : false,
		removeOnNextEndTurn : false,
		removeOnNextTest : false,
		type : ["shooting"],
		comment : "Station Commander Boost"
	})
	this.actor.update({"system.bonuses": bonuses});

	ChatMessage.create({
			speaker : ChatMessage.getSpeaker({actor : this.actor}),
			content : 
			\`<h5>Station Commander Test</h5>
			<span>\${content}</span>
			\`
		});  
		
	
args.context.effectFlags.push(this.effect.id); 
    
  }
}`,
	// Astropathic Choir Master Bonus - Dialog
	"UE2hqGJn6KN11Ugr": `args.fields.SL += this.item.system.role.upgraded ? 2 : 1`,
	// Astropathic Choir Master Bonus - Dialog Hide
	"jVHLWN0J54oDktVp": `return args.context.type !== "scan"`,
	// Astropathic Choir Master Bonus - Dialog Activate
	"fTDtq5GxZQMFbKqI": `return args.context.type === "scan"`,
	// Astropathic Choir Master - Check for Value
	"M8sXTcQfRDewJov7": `if (this.item?.id === args.context?.itemId)
{
  if (args.result?.outcome === "success")
  {
if (!args.context.effectFlags) args.context.effectFlags = [];
if (args.context.effectFlags.includes(this.effect.id)) return;


	let isUpgraded = this.item.system.role.upgraded;
	
	let content = "Chosen target loses its positive Detection Rating";
	
	if (isUpgraded && args.result.SL >= 5)
	{
		content += ", Turret Rating and Evasion Rating";
		this.item.setFlag("impmal-rtim", "turret", true);
		this.item.setFlag("impmal-rtim", "evasion", true);
	}
	else if (isUpgraded && args.result.SL >= 3)
	{
		content += "and Turret Rating";
		this.item.setFlag("impmal-rtim", "turret", true);
		this.item.setFlag("impmal-rtim", "evasion", false);
	}
	content += ".";

	ChatMessage.create({
			speaker : ChatMessage.getSpeaker({actor : this.actor}),
			content : 
			\`<h5>Astropathic Choir Master Test</h5>
			<span>\${content}</span>
			\`
		});  
		
	
	
args.context.effectFlags.push(this.effect.id); 
    
  }
}`,
	// Astropathic Choir Master (Target) - PostPrepare Derived
	"hTsnSctCKNKrJu6s": `if (this.actor.system.detectionRating.value > 0)
	{
		this.actor.system.detectionRating.value = 0;
	}
	if (this.actor.system.turretRating.value > 0 && this.effect.sourceItem.getFlag("impmal-rtim","turret"))
	{
		this.actor.system.turretRating.value = 0;
	}
	if (this.actor.system.evasionRating.value > 0 && this.effect.sourceItem.getFlag("impmal-rtim","evasion"))
	{
		this.actor.system.evasionRating.value = 0;
	}`,
	// Arbites Judge Bonus - Dialog
	"Cp34PFbKCmBtE2JB": `args.fields.SL += this.item.system.role.upgraded ? 2 : 1`,
	// Arbites Judge Bonus - Dialog Hide
	"BSxSjwJIxExutqob": `return args.context.type !== "rally"`,
	// Arbites Judge Bonus - Dialog Activate
	"VOgMg8Dxo0O75tz1": `return args.context.type === "rally"`,
	// Arbites Judge - Check for Value - Roll Skill Test
	"tyt1uAdBic8VBTGP": `if (this.item?.id === args.context?.itemId)
{
  if (args.result?.outcome === "success")
  {
if (!args.context.effectFlags) args.context.effectFlags = [];
if (args.context.effectFlags.includes(this.effect.id)) return;


	let isUpgraded = this.item.system.role.upgraded;
	let value = 1 + Math.floor(args.result.SL/2);
	let fatigue = this.actor.system.fatigue.value;
	
	let content = \`Removing \${value} of Fatigue.\`;
	if (isUpgraded && fatigue === 0)
	{
		content = \`There is no Fatigue. Next test receives +\${Math.max(args.result.SL,1)} SL bonus.\`;		
		let bonuses = this.actor.system.bonuses;
		bonuses.push({
			SL : Math.max(args.result.SL,1),
			modifier : 0,
			damage : 0,
			advantage : false,
			disadvantage : false,
			removeAfterTurns : -1,
			removeOnStartTurn : false,
			removeOnEndTurn : false,
			removeOnNextEndTurn : false,
			removeOnNextTest : true,
			type : ["all"],
			comment : "Arbites Judge Boost"
		})
		this.actor.update({"system.bonuses": bonuses});
	}
	else
	{
		fatigue = Math.max(fatigue-value,0);
		this.actor.update({"system.fatigue.value":fatigue});
	}

	ChatMessage.create({
			speaker : ChatMessage.getSpeaker({actor : this.actor}),
			content : 
			\`<h5>Arbites Judge Test</h5>
			<span>\${content}</span>
			\`
		});  
		
	
	
args.context.effectFlags.push(this.effect.id); 
    
  }
}`,
	// Engiseer Bonus - Dialog
	"a2zxpKd7imh8nJuG": `args.fields.SL += this.item.system.role.upgraded ? 2 : 1`,
	// Engiseer Bonus - Dialog Hide
	"Jg5s2lvcV9Lty5L6": `return args.context.type !== "restartShields"`,
	// Engiseer Bonus - Dialog Activate
	"45NMrWVdsFREeMvx": `return args.context.type === "restartShields"`,
	// Engiseer - Check for Value - Roll Skill Test
	"smH8zeOGPOMbMn9Y": `if (this.item?.id === args.context?.itemId)
{
  if (args.result?.outcome === "success")
  {
if (!args.context.effectFlags) args.context.effectFlags = [];
if (args.context.effectFlags.includes(this.effect.id)) return;


	let isUpgraded = this.item.system.role.upgraded;
	let value = 2+args.result.SL;
	
	let content = \`Increasing all weapons' range by \${value}.\`;
	if (isUpgraded)
	{
		content = "Doubling all weapons' ranges.";		
		this.item.setFlag("impmal-rtim", "value", "double")
	}
	else
	{
		this.item.setFlag("impmal-rtim", "value", value)
	}

	ChatMessage.create({
			speaker : ChatMessage.getSpeaker({actor : this.actor}),
			content : 
			\`<h5>Engiseer Test</h5>
			<span>\${content}</span>
			\`
		});  
		
	
	
args.context.effectFlags.push(this.effect.id); 
    
  }
}`,
	// Engiseer - PostPrepare Derived Data
	"i3fAnzoJkNQbV5g0": `if (this.item.getFlag("impmal-rtim","value"))
	{
		let weaponItems = this.actor.items
			.filter(item => item.type === "impmal-rtim.voidshipPart")
			.filter(item => item.system?.partType === "weapon");
		let flag = this.item.getFlag("impmal-rtim","value");
		weaponItems.forEach((item) =>
		{
			item.system.weapon.range += flag === "double" ? item.system.weapon.range : flag;
		})
	}`,
	// Engiseer - Reset
	"jAg3GNj9vRRANrI6": `this.item.setFlag("impmal-rtim", "value", false)`,
	// Engiseer - Reset Hide
	"lbbAFzph4qre7V3k": `return !this.item.getFlag("impmal-rtim","value")`,
	// Archon of the Stretched Flesh Cabal - Dialog
	"yMHfKDvl2evgqoYz": `let value = this.item.system.role.upgraded ? 2 : 1;
args.SL += value;`,
	// Archon of the Stretched Flesh Cabal - Dialog Hide
	"XOTIkhACEWo9tUFE": `return this.item.getFlag("impmal-rtim", "value")`,
	// Archon of the Stretched Flesh Cabal - Dialog Submission
	"Sohl0ITTkQAQ8x30": `this.item.setFlag("impmal-rtim", "value", true)`,
	// Archon of the Stretched Flesh Cabal - Reset
	"JVeBE7s0zOmtz47E": `this.item.setFlag("impmal-rtim", "value", false)`,
	// Archon of the Stretched Flesh Cabal - Reset Hide
	"bilzQBUXM3a5ZZl1": `return !this.item.getFlag("impmal-rtim", "value")`,
	// Archon of the Stretched Flesh Cabal - Target - Steal Something
	"JIOtqeJNa295PSjP": `let items = this.actor.items
	.filter(item => item.type === "impmal-rtim.voidshipPart");

	if (this.effect.sourceItem.system.role.upgraded)
	{
		items = items.filter(item => item.system?.partType === "weapon" || item.system?.partType === "component" || item.system?.partType === "role");	
	}
	else
	{
		items = items.filter(item => item.system?.partType === "weapon");	
	}
if (!items.length)
{
	ui.notifications.warn("Nothing to steal!");
	return;
}
	
let stolenItems = (await ItemDialog.create(items, 1, {title : "Steal one", text: "Choose 1"}));
if (!stolenItems || stolenItems.length == 0) return;  
ui.notifications.info(\`\${stolenItems[0].name} was stolen.\`);

this.effect.setFlag("impmal-rtim", "stolen", stolenItems[0].id);
	`,
	// Archon of the Stretched Flesh Cabal - Target - Stolen
	"guZEYtvbVbjR3z9F": `let flag = this.effect.getFlag("impmal-rtim", "stolen");
	if (flag)
	{
		let item = this.actor.items.get(flag);
		if (item)
		{
			item.system.active = false;
          	item.name += " (Stolen)";
		}
	}`,
	// Hierarch of the Stretched Flesh Cabal - PrePrepare Derived
	"vF7EM774wVItx5Ox": `this.actor.system.options.boardingRange += this.item.system.role.upgraded ? 4 : 2;`,
	// Hierarch of the Stretched Flesh Cabal - Check for Value - Roll Skill Test
	"3Nr0iAN6cUglVLnn": `if (this.item?.id === args.context?.itemId)
{
  if (args.result?.outcome === "success")
  {
if (!args.context.effectFlags) args.context.effectFlags = [];
if (args.context.effectFlags.includes(this.effect.id)) return;


	let isUpgraded = this.item.system.role.upgraded;
	
	let content = "You send a Torpedo Salvo, even if the Torpedo Bay requires a reload.";
	if (isUpgraded)
	{
		content += " This salvo can be a mix of two different types of Torpedoes.";		
	}

	ChatMessage.create({
			speaker : ChatMessage.getSpeaker({actor : this.actor}),
			content : 
			\`<h5>Hierarch of the Stretched Flesh Cabal Test</h5>
			<span>\${content}</span>
			\`
		});  
		
	
	
args.context.effectFlags.push(this.effect.id); 
    
  }
}`,
	// Incubus of the Naked Hatred Bonus - Voidship Options
	"z1UFkoA5ucJToQIl": `if (args.testType !== "boarding") return;
	if (!args.target) return;
	args.target.system.applyDamage(this.item.system.role.upgraded ? 2 : 1, {type: "fatigue"});
if (!args.options.comment) args.options.comment = ""
args.options.comment += \`Incubus of the Naked Hatred Bonus (dealt \${this.item.system.role.upgraded ? 2 : 1} Morale Damage to Target)\`;`,
	// Incubus of the Naked Hatred - Check for Value - Roll Skill Test
	"JtwzBQwQWUky03NE": `if (this.item?.id === args.context?.itemId)
{
  if (args.result?.outcome === "success")
  {
if (!args.context.effectFlags) args.context.effectFlags = [];
if (args.context.effectFlags.includes(this.effect.id)) return;


	let value = 1 + Math.floor(args.result.SL/2);
	if (this.item.system.role.upgraded) value = 1 + args.result.SL;
	
	let content = \`The voidship regains \${value} Hull Integrity.\`;

	let hull = Math.min(this.actor.system.hull.value+value,this.actor.system.hull.max);
	this.actor.update({"system.hull.value": hull});

	ChatMessage.create({
			speaker : ChatMessage.getSpeaker({actor : this.actor}),
			content : 
			\`<h5>Incubus of the Naked Hatred Test</h5>
			<span>\${content}</span>
			\`
		});  
		
	
	
args.context.effectFlags.push(this.effect.id); 
    
  }
}`,
	// Succubi of the Thirteenth Night Bonus - Dialog
	"iA5evoqhorIPZ3qW": `args.fields.damage += 2;`,
	// Succubi of the Thirteenth Night Bonus - Dialog Hide
	"vaoiZQvklCv3l4F7": `return !args.context.distanceToTarget || args.context.distanceToTarget > (this.item.system.role.upgraded ? 6 : 2);`,
	// Succubi of the Thirteenth Night Bonus - Dialog Activate
	"q7EkdzgtdmXYtRuP": `return args.context.distanceToTarget && args.context.distanceToTarget <= (this.item.system.role.upgraded ? 6 : 2);`,
	// Succubi of the Thirteenth Night - Check for Value - Roll Skill Test
	"mMYESO67xLEcgVpJ": `if (this.item?.id === args.context?.itemId)
{
  if (args.result?.outcome === "success")
  {
if (!args.context.effectFlags) args.context.effectFlags = [];
if (args.context.effectFlags.includes(this.effect.id)) return;
  	let isUpgraded = this.item.system.role.upgraded;
	
	let content = "If there are no enemy units in range, the ship enters Silent Running state.";
	
	ChatMessage.create({
			speaker : ChatMessage.getSpeaker({actor : this.actor}),
			content : 
			\`<h5>Succubi of the Thirteenth Night Test</h5>
			<span>\${content}</span>
			\`
		});   
args.context.effectFlags.push(this.effect.id);
    
  }
}`,
	// Haemonoculi of the Hex Bonus - Start Turn
	"oGhc3JaW7l8HnJqb": `if (this.actor.system.hull.value < this.actor.system.hull.max)
	{
		let hull = this.actor.system.hull.value + (this.item.system.role.upgraded ? 4 : 2);
		let newHull = Math.min(hull, this.actor.system.hull.max);
		this.actor.update({"system.hull.value": newHull});
	}`,
	// Haemonoculi of the Hex - Check for Value - Roll Skill Test
	"Txm2ezRIhwI4oQ7h": `if (this.item?.id === args.context?.itemId)
{
  if (args.result?.outcome === "success")
  {
if (!args.context.effectFlags) args.context.effectFlags = [];
if (args.context.effectFlags.includes(this.effect.id)) return;

	let value = 1;
	let isUpgraded = this.item.system.role.upgraded;
	
	if (args.result.SL >= 5) value = 2;
	if (isUpgraded && args.result.SL >= 3) value = 2;
	
	let content = \`The boarder will receive \${value} Morale Damage.\`;
	let hull = 0;
	if (isUpgraded)
	{
		hull = Math.floor(args.result.SL/2);
		if (hull > 0)
		{
			content += \` Additionally will deal \${hull} Hull Damage.\`;
			this.item.setFlag("impmal-rtim", "hull", hull);
		}
	}	
	this.item.setFlag("impmal-rtim", "fatigue", value);
	

	ChatMessage.create({
			speaker : ChatMessage.getSpeaker({actor : this.actor}),
			content : 
			\`<h5>Haemonoculi of the Hex Test</h5>
			<span>\${content}</span>
			\`
		});  
		
	
	
args.context.effectFlags.push(this.effect.id); 
    
  }
}`,
	// Haemonoculi of the Hex - Deal Damage to Target
	"jWXeF5QeokzqgMY2": `let fatigue = this.item.getFlag("impmal-rtim", "fatigue");

let targetToken = game?.user?.targets?.first();
if (targetToken?.actor?.type !== "impmal-rtim.voidshipSheet"){
    ui.notifications.warn(game.i18n.localize("IMPMAL_RTIM.VoidCombat.NeedTarget"));
    return;
}

let content = \`Target received \${fatigue} Morale Damage\`

let hull = this.item.getFlag("impmal-rtim", "hull");

await targetToken.actor.system.applyDamage(fatigue, {type: "fatigue"});	
if (hull > 0) {
	content += \` and \${hull} Hull Damage.\`
	await targetToken.actor.system.applyDamage(hull, {type: "selfDamage"});
}
content += "."

ui.notifications.info(content);

this.item.setFlag("impmal-rtim", "fatigue", false);
this.item.setFlag("impmal-rtim", "hull", false);`,
	// Haemonoculi of the Hex - Reset
	"C2yQ2iJFmj06ebhj": `this.item.setFlag("impmal-rtim", "fatigue", false);
	this.item.setFlag("impmal-rtim", "hull", false);`,
	// Haemonoculi of the Hex - Reset Hide
	"iU0LKEhSk1iO4YOD": `return !this.item.getFlag("impmal-rtim","fatigue");`,
	// Sslyth Mercenary Commander Bonus - Dialog
	"HV7ZhGYVH3x6BupD": `args.fields.SL += this.item.system.role.upgraded ? 2 : 1`,
	// Sslyth Mercenary Commander Bonus - Dialog Hide
	"7IypXxsdmC4IrQxx": `return args.context.type !== "boarding" && args.context.type !== "assaultBoarding"`,
	// Sslyth Mercenary Commander Bonus - Dialog Activate
	"5eeWmJ63Z7lzBgN5": `return args.context.type === "boarding" || args.context.type === "assaultBoarding"`,
	// Sslyth Mercenary Commander - Check for Value - Roll Skil Test
	"owNdxQ6qq9Rl4QCO": `if (this.item?.id === args.context?.itemId)
{
  if (args.result?.outcome === "success")
  {
if (!args.context.effectFlags) args.context.effectFlags = [];
if (args.context.effectFlags.includes(this.effect.id)) return;

	let isUpgraded = this.item.system.role.upgraded;
	
	let content = "";
	if (isUpgraded)
	{
		content = "The boarders can now damage a Component (Role) or Weapon.";
	}
	else
	{
		content = "The boarders can now damage a Component (Role).";
	}
	
	this.item.setFlag("impmal-rtim", "value", true);
	

	ChatMessage.create({
			speaker : ChatMessage.getSpeaker({actor : this.actor}),
			content : 
			\`<h5>Sslyth Mercenary Commander Test</h5>
			<span>\${content}</span>
			\`
		});  
		
	
	
args.context.effectFlags.push(this.effect.id); 
    
  }
}`,
	// Sslyth Mercenary Commander - Damage Stuff
	"R9J6gmeZah7oUgK1": `if (!game.user.isGM) {
	ui.notifications.info("Only for GM");
	return;
}

let targetToken = game?.user?.targets?.first();
if (targetToken?.actor?.type !== "impmal-rtim.voidshipSheet"){
    ui.notifications.warn(game.i18n.localize("IMPMAL_RTIM.VoidCombat.NeedTarget"));
    return;
}

let items = targetToken.actor.items
	.filter(item => item.type === "impmal-rtim.voidshipPart")
	.filter(item => item.system.status !== "destroyed");
	
	if (this.item.system.role.upgraded)
	{
		items = items.filter(item => item.system?.partType === "role" || item.system?.partType === "weapon");
	}
	else
	{
		items = items.filter(item => item.system?.partType === "role");
	}
	
	if (!items.length)
	{
		ui.notifications.warn("No Components or Weapons, dealing 2 Hull Damage.");
		targetToken.actor.applyDamage(2, {type: "selfDamage"});
		return;
	}

	let random = Math.floor(CONFIG.Dice.randomUniform() * items.length);
	let chosenItems = items[random];

	if (!game.settings.get("impmal-rtim", "voidcombatSettings").randomDamaged)
	{
		let resultItems = (await ItemDialog.create(items, 1, 
			{title : "Destroy Component", text: "Choose 1"}));
		if (resultItems && resultItems.length > 0) chosenItems = resultItems;
	}

	if (!chosenItems || chosenItems.length == 0) return;
	
	let status = chosenItems[0].system.status === "default" ? "damaged" : "destroyed";
	
	chosenItems[0].update({"system.status":status})
	ui.notifications.info(\`\${damaged[0].name} was \${status}.\`);
	this.item.setFlag("impmal-rtim", "value", false);`,
	// Sslyth Mercenary Commander - Reset
	"T6Px8c59sQxrMFeL": `this.item.setFlag("impmal-rtim", "value", false);`,
	// Sslyth Mercenary Commander - Reset Hide
	"qMchTo7jHwgvh9Qj": `return !this.item.getFlag("impmal-rtim","value");`,
	//// VOIDCOMBAT SPECIAL WEAPONS
	// Disintegrator Macrocannon Cluster - Dialog
	"Xbq82TzyUjBTXTYX": `args.fields.SL++;`,
	// Disintegrator Macrocannon Cluster - Dialog Hide
	"SXluRjV2r3jp5Bsa": `return args.context.weaponId !== this.item.id`,
	// Disintegrator Macrocannon Cluster - Dialog Activate
	"mQ20I6HpoJBdWiTD": `return args.context.weaponId === this.item.id`,
	// Phantom Lance - Roll Skill Test
	"gA7i0BmID4d3xaIq": `if (this.item?.id !== args.context?.weaponId) return;
if (args.result.SL >= 3) {
  args.result.additionalDamage += 8;
}`,
	// Murder Tubes - Leech Torpedoes - PrePrepare Derived
	"Bp8y7celLOX3mxqK": `this.actor.system.speedRating.modifier -= 2;`,
	// Murder Tubes - Leech Torpedoes - Dialog
	"pNQQLFqyllgx4pxW": `args.disCount++;`,
	// Murder Tubes - Leech Torpedoes - Dialog Hide
	"ljQxXDiQSmiygzTb": `return args.context.type !== "evasiveManeuvers" && args.context.type !== "ramming" && args.context.type !== "silentRunning"`,
	// Murder Tubes - Leech Torpedoes - Dialog Activate
	"QMNFz4qwouhBSFqQ": `return args.context.type === "evasiveManeuvers" || args.context.type === "ramming" || args.context.type === "silentRunning"`,
	// Murder Tubes - Leech Torpedoes - VoidshipOptions
	"b9bFQZ49Ttj56AkH": `if (args.testType !== "repair") return;
	if (args.result.SL < 4) return;
	if (!args.options.comment) args.options.comment = "";
args.options.comment += "Leech Torpedoes can be removed ";`,
	//// VOIDCOMBAT SPECIAL TRAITS
	// Extensive Repairs - VoidshipOptions
	"2LemOUipJhIibpq2": `if (args.testType !== "repairMinion") return;
	if (!args.options.comment) args.options.comment = "";
args.options.comment += "Extensive Repairs (+5 Shields) ";
await this.actor.update({"system.shields.average.value": Math.min(this.actor.system.shields.average.value+5,this.actor.system.shields.average.max)})`,
	// Wolfpack - Dialog
	"8Uw8IIuKfQEOP2WZ": `args.fields.SL += 1;`,
	// Wolfpack - Dialog Hide
	"AqsrBLOsiKxNow6M": `return args.context.type !== "shooting";`,
	// Jury Rigged - PrePrepare Derived
	"I4bZDC6PEOjptr05": `this.actor.system.armour.aft.modifier += 2;
this.actor.system.armour.fore.modifier += 2;
this.actor.system.armour.starboard.modifier += 2;
this.actor.system.armour.port.modifier += 2;
this.actor.system.armour.average.modifier += 2;
this.actor.system.speedRating.modifier += 2;`,
	// Many Hands on Deck - PrePrepare Derived
	"tOeFuMnyRBt2wle9": `this.actor.system.fatigue.modifier += 2;`,
	// Massive Structure - Dialog
	"3JYlBaSHFkw4bv3K": `args.fields.selfDamage += 5;`,
	// Massive Structure - Dialog Hide
	"7q20Uf59qQu10o3S": `return args.context.type !== "ramming"`,
	// Massive Structure - Dialog Activate
	"9iisdsqG8XIME7QD": `return args.context.type === "ramming"`,
	// Drukhari Ghost Field - Weapon SL Penalty - Dialog
	"pvW6SHAd7PT0oyuE": `args.fields.SL -= 2;`,
	// Drukhari Ghost Field - Weapon SL Penalty - Dialog Hide
	"QRJGceveVJG8VxCz": `console.log(args.context.type !== "shooting");console.log((args.context.type === "shooting" && args.context.weaponType !== "macro"));
	return args.context.type !== "shooting" || (args.context.type === "shooting" && args.context.weaponType === "macro")`,
	// Drukhari Ghost Field - Weapon SL Penalty - Dialog Activate
	"SOmOCSmqazDMtpIJ": `return args.context.type === "shooting" && args.context.weaponType !== "macro"`,
	// Drukhari Ghost Field - Disadvantage - Dialog
	"It6MHxowo8WeRKmG": `args.disCount++;`,
	// Drukhari Ghost Field - Disadvantage - Dialog Hide
	"4BNXRAQK8BW1NuJs": `let actions = ["boarding", "shooting"];
return !actions.includes(args.context?.type);`,
	// Drukhari Ghost Field - Disadvantage - Dialog Activate
	"66pPhQqsnfQOoI3D": `let actions = ["boarding", "shooting"];
return actions.includes(args.context?.type);`,
	// Rows of Slaves - PrePrepare Derived
	"JQJsNETeBDVAOZNG": `this.actor.system.fatigue.modifier -= 1;`,
	// Pleasure in Torture - On Create
	"H36koarqPlCmon06": `this.item.setFlag("impmal-rtim", "fatigue", this.actor.system.fatigue.value)`,
	// Pleasure in Torture - Take Damage
	"mRkDUuDI2kyfsx9G": `if (args.hullDamageValue > 0) this.item.setFlag("impmal-rtim", "pleasure", true);`,
	// Pleasure in Torture - Update Document
	"TI7835PGhpSCajoI": `if (args.type !== "data") return;
	if (args.data?.system?.fatigue && args.data.system.fatigue.value !== undefined)
	{
		let pleasure = false;
		let fatigue = args.data.system.fatigue.value;
		let check = this.item.getFlag("impmal-rtim","fatigue");
		if (check < fatigue)
		{
			pleasure = true;
		}
		this.item.setFlag("impmal-rtim", "fatigue", fatigue);
		if (pleasure) this.item.setFlag("impmal-rtim", "pleasure", true);
	}`,
	// Pleasure in Torture - End Turn
	"gAlq4E6a29wfP8fr": `if (this.item.getFlag("impmal-rtim","pleasure"))
	{
		let fatigue = this.actor.system.fatigue.value;
		if (fatigue > 0)
		{
			this.actor.update({"system.fatigue.value":fatigue-1});
			ui.notifications.info(this.item.name);
		}
		this.item.setFlag("impmal-rtim", "pleasure", false);
	}`,
	// Pleasure in Torture - Reset
	"gyN2S1ePPKfvICt9": `this.item.setFlag("impmal-rtim", "pleasure", false);
	this.item.setFlag("impmal-rtim", "fatigue", this.actor.system.fatigue.value);`,
	// Pleasure in Torture - Reset Hide
	"SynszrLyArjiDYlK": `return !this.item.getFlag("impmal-rtim","pleasure");`,
	//// OTHER 
	//// Basic flag (item flag of name value, on off)
	// Use
	"DinViX2CQeRyWkwJ": `//Basic flag
	this.item.setFlag("impmal-rtim", "value", true)`,
	// Use Hide
	"tZ0bE5Nm672TPWVq": `//Basic flag
	return this.item.getFlag("impmal-rtim","value")`,
	// Reset
	"iy92uN1B6kqgS8Q5": `//Basic flag
	this.item.setFlag("impmal-rtim", "value", false)`,
	// Reset Hide
	"YZVO4wxvm3RlQNds": `//Basic flag
	return !this.item.getFlag("impmal-rtim","value")`,
}