import { CultureCard } from 'src/enums/cultureCard';

type CultureTrackStep = {
	reward: 'firstLevelCard' | 'secondLevelCard' | 'thirdLevelCard' | 'greatPerson' | 'win';
	culturePrice: number;
	tradePrice: number;
};

export const CultureTrack: CultureTrackStep[] = Array.from({ length: 21 }, (_, index) => {
	if (index === 20) {
		return {
			reward: 'win',
			culturePrice: 7,
			tradePrice: 6,
		};
	}

	if ([2, 6, 11, 17].includes(index)) {
		let culturePrice = 3;
		let tradePrice = 0;
		if (index >= 7 && index <= 13) {
			culturePrice = 5;
			tradePrice = 3;
		} else if (index >= 14) {
			culturePrice = 7;
			tradePrice = 6;
		}
		return {
			reward: 'greatPerson',
			culturePrice,
			tradePrice,
		};
	}

	if (index <= 6) {
		return {
			reward: 'firstLevelCard',
			culturePrice: 3,
			tradePrice: 0,
		};
	}

	if (index <= 13) {
		return {
			reward: 'secondLevelCard',
			culturePrice: 5,
			tradePrice: 3,
		};
	}

	return {
		reward: 'thirdLevelCard',
		culturePrice: 7,
		tradePrice: 6,
	};
});

export const CultureCardLevels: Record<CultureCard, number> = {
	[CultureCard.GloryToTheDespot]: 1,
	[CultureCard.Uprising]: 1,
	[CultureCard.BarbarianCamp]: 1,
	[CultureCard.Migrants]: 1,
	[CultureCard.BreadAndCircuses]: 1,
	[CultureCard.GiftFromAfar]: 1,
	[CultureCard.Drought]: 1,
	[CultureCard.Defectors]: 1,
	[CultureCard.DutyAndHonor]: 1,
	[CultureCard.ExchangeOfIdeas]: 1,
	[CultureCard.BlindedWanderings]: 1,
	[CultureCard.Counterfeiters]: 1,
	[CultureCard.Sabotage]: 1,
	[CultureCard.OffCourse]: 2,
	[CultureCard.Catastrophe]: 2,
	[CultureCard.Deforestation]: 2,
	[CultureCard.Nationalism]: 2,
	[CultureCard.FinancialCrisis]: 2,
	[CultureCard.GodSaveTheQueen]: 2,
	[CultureCard.Rebellion]: 2,
	[CultureCard.AccessToKnowledge]: 2,
	[CultureCard.MassDesertion]: 2,
	[CultureCard.Colonists]: 2,
	[CultureCard.NomadHorde]: 2,
	[CultureCard.Joust]: 2,
	[CultureCard.GenerousGift]: 2,
	[CultureCard.Flood]: 2,
	[CultureCard.EpidemicOfRenegades]: 3,
	[CultureCard.Immigrants]: 3,
	[CultureCard.RoyalGift]: 3,
	[CultureCard.HumanitarianAid]: 3,
	[CultureCard.BankingScandal]: 3,
	[CultureCard.ElementalRampage]: 3,
	[CultureCard.PrimeTime]: 3,
	[CultureCard.JointResearch]: 3,
	[CultureCard.PresidentDay]: 3,
	[CultureCard.RedeploymentIssues]: 3,
	[CultureCard.Patriotism]: 3,
};

export const CultureCardCounts: Record<CultureCard, number> = {
	[CultureCard.GloryToTheDespot]: 2,
	[CultureCard.Rebellion]: 1,
	[CultureCard.BarbarianCamp]: 2,
	[CultureCard.Migrants]: 2,
	[CultureCard.BreadAndCircuses]: 2,
	[CultureCard.GiftFromAfar]: 3,
	[CultureCard.Drought]: 2,
	[CultureCard.DutyAndHonor]: 2,
	[CultureCard.ExchangeOfIdeas]: 2,
	[CultureCard.Defectors]: 2,
	[CultureCard.HumanitarianAid]: 2,
	[CultureCard.Immigrants]: 2,
	[CultureCard.OffCourse]: 1,
	[CultureCard.Catastrophe]: 1,
	[CultureCard.Deforestation]: 1,
	[CultureCard.EpidemicOfRenegades]: 2,
	[CultureCard.Nationalism]: 2,
	[CultureCard.FinancialCrisis]: 1,
	[CultureCard.GodSaveTheQueen]: 2,
	[CultureCard.JointResearch]: 2,
	[CultureCard.ElementalRampage]: 1,
	[CultureCard.PrimeTime]: 2,
	[CultureCard.BankingScandal]: 1,
	[CultureCard.RoyalGift]: 2,
	[CultureCard.RedeploymentIssues]: 1,
	[CultureCard.Patriotism]: 1,
	[CultureCard.PresidentDay]: 1,
	[CultureCard.Uprising]: 1,
	[CultureCard.BlindedWanderings]: 1,
	[CultureCard.Counterfeiters]: 2,
	[CultureCard.Sabotage]: 2,
	[CultureCard.AccessToKnowledge]: 3,
	[CultureCard.MassDesertion]: 2,
	[CultureCard.Colonists]: 2,
	[CultureCard.NomadHorde]: 2,
	[CultureCard.Joust]: 2,
	[CultureCard.GenerousGift]: 3,
	[CultureCard.Flood]: 1,
};
