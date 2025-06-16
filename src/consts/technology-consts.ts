import { Technology } from 'src/enums/technology';

export const TechnologyLevelMap: Record<Technology, number> = {
	// Level I
	[Technology.AnimalHusbandry]: 1,
	[Technology.Agriculture]: 1,
	[Technology.CodeOfLaws]: 1,
	[Technology.Currency]: 1,
	[Technology.HorsebackRiding]: 1,
	[Technology.Masonry]: 1,
	[Technology.MetalWorking]: 1,
	[Technology.Navigation]: 1,
	[Technology.Navy]: 1,
	[Technology.Philosophy]: 1,
	[Technology.Pottery]: 1,
	[Technology.Writing]: 1,

	// Level II
	[Technology.Bureaucracy]: 2,
	[Technology.CivilService]: 2,
	[Technology.Chivalry]: 2,
	[Technology.Construction]: 2,
	[Technology.Democracy]: 2,
	[Technology.Engineering]: 2,
	[Technology.Irrigation]: 2,
	[Technology.Logistics]: 2,
	[Technology.Mathematics]: 2,
	[Technology.Monarchy]: 2,
	[Technology.Mysticism]: 2,
	[Technology.PrintingPress]: 2,
	[Technology.Sailing]: 2,

	// Level III
	[Technology.Banking]: 3,
	[Technology.Biology]: 3,
	[Technology.Communism]: 3,
	[Technology.Ecology]: 3,
	[Technology.Education]: 3,
	[Technology.Gunpowder]: 3,
	[Technology.Metallurgy]: 3,
	[Technology.MilitaryScience]: 3,
	[Technology.Railroad]: 3,
	[Technology.SteamPower]: 3,
	[Technology.Theology]: 3,

	// Level IV
	[Technology.AtomicTheory]: 4,
	[Technology.Ballistics]: 4,
	[Technology.Combustion]: 4,
	[Technology.Computers]: 4,
	[Technology.Flight]: 4,
	[Technology.MassMedia]: 4,
	[Technology.Plastics]: 4,
	[Technology.ReplaceableParts]: 4,

	// Level V
	[Technology.SpaceFlight]: 5,
};
export const technologiesWithCoins = [Technology.Bureaucracy, Technology.CivilService, Technology.Railroad, Technology.Computers];
